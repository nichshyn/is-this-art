"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { newId, queryOne } from "@/lib/db";
import { awardCommentAchievement } from "@/lib/voting";
import { rateLimit } from "@/lib/rate-limit";
import { getUserByUsername } from "@/lib/queries";
import { commentSchema, firstError, reportSchema } from "@/lib/validation";
import type { FormState } from "./auth";

export interface ToggleResult {
  ok: boolean;
  error?: string;
  liked?: boolean;
  count?: number;
  following?: boolean;
  requireAuth?: boolean;
}

export async function addCommentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Войдите, чтобы участвовать в обсуждении." };
  if (user.is_blocked) return { error: "Эта учётная запись заблокирована." };

  const limited = rateLimit(`comment:${user.id}`, 12, 10 * 60_000);
  if (!limited.ok) return { error: "Вы слишком быстро оставляете комментарии. Попробуйте чуть позже." };

  const parsed = commentSchema.safeParse({
    artworkId: String(formData.get("artworkId") ?? ""),
    content: String(formData.get("content") ?? ""),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const artwork = queryOne<{ slug: string; status: string }>(
    "SELECT slug, status FROM artworks WHERE id = ?",
    parsed.data.artworkId,
  );
  if (!artwork || artwork.status !== "approved") {
    return { error: "Эту работу нельзя комментировать." };
  }

  const { getDb } = await import("@/lib/db");
  getDb()
    .prepare(
      "INSERT INTO comments (id, user_id, artwork_id, content, is_hidden, created_at) VALUES (?, ?, ?, ?, 0, ?)",
    )
    .run(
      newId("cmt_"),
      user.id,
      parsed.data.artworkId,
      parsed.data.content,
      new Date().toISOString(),
    );
  awardCommentAchievement(user.id);
  revalidatePath(`/artwork/${artwork.slug}`);
  revalidatePath("/community");
  return { success: "Комментарий опубликован." };
}

export async function deleteCommentAction(commentId: string): Promise<ToggleResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Сначала войдите.", requireAuth: true };
  const comment = queryOne<{ user_id: string; artwork_id: string; slug: string }>(
    `SELECT c.user_id, c.artwork_id, a.slug
     FROM comments c JOIN artworks a ON a.id = c.artwork_id
     WHERE c.id = ?`,
    commentId,
  );
  if (!comment) return { ok: false, error: "Комментарий не найден." };
  if (comment.user_id !== user.id && user.role !== "admin") {
    return { ok: false, error: "Вы можете удалять только свои комментарии." };
  }
  const { getDb } = await import("@/lib/db");
  getDb().prepare("DELETE FROM comments WHERE id = ?").run(commentId);
  revalidatePath(`/artwork/${comment.slug}`);
  revalidatePath("/community");
  return { ok: true };
}

export async function toggleLikeAction(artworkId: string): Promise<ToggleResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, requireAuth: true, error: "Войдите, чтобы поставить отметку «Нравится»." };
  if (user.is_blocked) return { ok: false, error: "Эта учётная запись заблокирована." };

  const artwork = queryOne<{ slug: string }>(
    "SELECT slug FROM artworks WHERE id = ? AND status = 'approved'",
    artworkId,
  );
  if (!artwork) return { ok: false, error: "Работа не найдена." };

  const { getDb } = await import("@/lib/db");
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM likes WHERE user_id = ? AND artwork_id = ?")
    .get(user.id, artworkId) as { id: string } | undefined;
  if (existing) {
    db.prepare("DELETE FROM likes WHERE id = ?").run(existing.id);
  } else {
    db.prepare(
      "INSERT INTO likes (id, user_id, artwork_id, created_at) VALUES (?, ?, ?, ?)",
    ).run(newId("like_"), user.id, artworkId, new Date().toISOString());
  }
  const count = (
    db
      .prepare("SELECT COUNT(*) AS count FROM likes WHERE artwork_id = ?")
      .get(artworkId) as { count: number }
  ).count;
  revalidatePath(`/artwork/${artwork.slug}`);
  return { ok: true, liked: !existing, count };
}

export async function toggleFollowAction(username: string): Promise<ToggleResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, requireAuth: true, error: "Войдите, чтобы подписываться на художников." };
  const target = getUserByUsername(username);
  if (!target) return { ok: false, error: "Художник не найден." };
  if (target.id === user.id) return { ok: false, error: "Нельзя подписаться на самого себя." };

  const { getDb } = await import("@/lib/db");
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?")
    .get(user.id, target.id) as { id: string } | undefined;
  if (existing) {
    db.prepare("DELETE FROM follows WHERE id = ?").run(existing.id);
  } else {
    db.prepare(
      "INSERT INTO follows (id, follower_id, following_id, created_at) VALUES (?, ?, ?, ?)",
    ).run(newId("follow_"), user.id, target.id, new Date().toISOString());
  }
  revalidatePath(`/u/${target.username}`);
  revalidatePath("/community");
  return { ok: true, following: !existing };
}

export async function reportAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Войдите, чтобы пожаловаться на работу." };
  const limited = rateLimit(`report:${user.id}`, 6, 60 * 60_000);
  if (!limited.ok) return { error: "Слишком много жалоб. Попробуйте позже." };

  const parsed = reportSchema.safeParse({
    artworkId: String(formData.get("artworkId") ?? ""),
    reason: String(formData.get("reason") ?? ""),
    details: String(formData.get("details") ?? ""),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const artwork = queryOne<{ slug: string }>(
    "SELECT slug FROM artworks WHERE id = ? AND status = 'approved'",
    parsed.data.artworkId,
  );
  if (!artwork) return { error: "Работа не найдена." };

  const duplicate = queryOne(
    "SELECT 1 FROM reports WHERE user_id = ? AND artwork_id = ? AND status = 'open'",
    user.id,
    parsed.data.artworkId,
  );
  if (duplicate) return { success: "У вас уже есть открытая жалоба на эту работу." };

  const { getDb } = await import("@/lib/db");
  getDb()
    .prepare(
      "INSERT INTO reports (id, user_id, artwork_id, reason, details, status, created_at) VALUES (?, ?, ?, ?, ?, 'open', ?)",
    )
    .run(
      newId("rpt_"),
      user.id,
      parsed.data.artworkId,
      parsed.data.reason,
      parsed.data.details || null,
      new Date().toISOString(),
    );
  return { success: "Спасибо. Модератор рассмотрит вашу жалобу." };
}

export async function deleteOwnSubmissionAction(artworkId: string): Promise<ToggleResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Сначала войдите." };
  const artwork = queryOne<{ submitted_by: string; status: string }>(
    "SELECT submitted_by, status FROM artworks WHERE id = ?",
    artworkId,
  );
  if (!artwork || artwork.submitted_by !== user.id) {
    return { ok: false, error: "Предложенная работа не найдена." };
  }
  if (artwork.status === "approved") {
    return { ok: false, error: "Одобренные работы может удалить только модератор." };
  }
  const { getDb } = await import("@/lib/db");
  getDb().prepare("DELETE FROM artworks WHERE id = ?").run(artworkId);
  revalidatePath("/submit");
  return { ok: true };
}
