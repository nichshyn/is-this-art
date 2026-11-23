"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createSession,
  destroySession,
  getCurrentUser,
  requireUser,
} from "@/lib/auth";
import { newId, queryOne, randomToken, sha256 } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getUserByEmail } from "@/lib/queries";
import { rateLimit } from "@/lib/rate-limit";
import { safeNext } from "@/lib/utils";
import {
  firstError,
  forgotSchema,
  loginSchema,
  profileSchema,
  resetSchema,
  signupSchema,
} from "@/lib/validation";

export interface FormState {
  error?: string;
  success?: string;
  devLink?: string;
}

async function ipKey(prefix: string): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `${prefix}:${ip}`;
}

export async function signupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const limited = rateLimit(await ipKey("signup"), 8, 15 * 60_000);
  if (!limited.ok) return { error: "Слишком много попыток. Попробуйте через несколько минут." };

  const parsed = signupSchema.safeParse({
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const existingEmail = queryOne("SELECT 1 FROM users WHERE email = ?", parsed.data.email);
  if (existingEmail) return { error: "Учётная запись с такой электронной почтой уже существует." };
  const existingName = queryOne(
    "SELECT 1 FROM users WHERE username = ?",
    parsed.data.username,
  );
  if (existingName) return { error: "Это имя пользователя уже занято." };

  const id = newId("usr_");
  const { getDb } = await import("@/lib/db");
  getDb()
    .prepare(
      `INSERT INTO users
       (id, username, email, password_hash, avatar_url, bio, role, points, streak, longest_streak, last_vote_date, is_blocked, is_demo, created_at)
       VALUES (?, ?, ?, ?, NULL, NULL, 'user', 0, 0, 0, NULL, 0, 0, ?)`,
    )
    .run(id, parsed.data.username, parsed.data.email, hashPassword(parsed.data.password), new Date().toISOString());

  await createSession(id);
  redirect("/play?welcome=1");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const limited = rateLimit(await ipKey("login"), 12, 15 * 60_000);
  if (!limited.ok) return { error: "Слишком много попыток. Попробуйте через несколько минут." };

  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const user = getUserByEmail(parsed.data.email);
  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
    return { error: "Неверная электронная почта или пароль." };
  }
  if (user.is_blocked) return { error: "Эта учётная запись заблокирована." };

  await createSession(user.id);
  redirect(safeNext(formData.get("next"), "/play"));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function forgotAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const limited = rateLimit(await ipKey("forgot"), 6, 15 * 60_000);
  if (!limited.ok) return { error: "Слишком много попыток. Попробуйте через несколько минут." };

  const parsed = forgotSchema.safeParse({
    email: String(formData.get("email") ?? ""),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const user = getUserByEmail(parsed.data.email);
  const message =
    "Если учётная запись с такой электронной почтой существует, ссылка для сброса пароля создана.";

  if (user) {
    const token = randomToken(32);
    const id = sha256(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const { getDb } = await import("@/lib/db");
    getDb()
      .prepare(
        "INSERT INTO password_resets (id, user_id, expires_at, used_at, created_at) VALUES (?, ?, ?, NULL, ?)",
      )
      .run(id, user.id, expires, new Date().toISOString());
    const path = `/reset-password?token=${token}`;
    if (process.env.NODE_ENV !== "production") {
      return { success: message, devLink: path };
    }
    console.info(`[password-reset] ${user.email}: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${path}`);
  }

  return { success: message };
}

export async function resetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const limited = rateLimit(await ipKey("reset"), 8, 15 * 60_000);
  if (!limited.ok) return { error: "Слишком много попыток. Попробуйте через несколько минут." };

  const parsed = resetSchema.safeParse({
    token: String(formData.get("token") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const id = sha256(parsed.data.token);
  const row = queryOne<{ user_id: string; expires_at: string; used_at: string | null }>(
    "SELECT user_id, expires_at, used_at FROM password_resets WHERE id = ?",
    id,
  );
  if (!row || row.used_at || row.expires_at < new Date().toISOString()) {
    return { error: "Недействительная или устаревшая ссылка для сброса пароля." };
  }

  const { getDb } = await import("@/lib/db");
  const db = getDb();
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    hashPassword(parsed.data.password),
    row.user_id,
  );
  db.prepare("UPDATE password_resets SET used_at = ? WHERE id = ?").run(
    new Date().toISOString(),
    id,
  );
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(row.user_id);
  redirect("/login?reset=1");
}

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    bio: String(formData.get("bio") ?? ""),
    avatarUrl: String(formData.get("avatarUrl") ?? ""),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const { getDb } = await import("@/lib/db");
  getDb()
    .prepare("UPDATE users SET bio = ?, avatar_url = ? WHERE id = ?")
    .run(parsed.data.bio || null, parsed.data.avatarUrl || null, user.id);
  revalidatePath(`/u/${user.username}`);
  revalidatePath("/community");
  return { success: "Профиль обновлён." };
}

export async function changePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  if (!verifyPassword(current, user.password_hash)) {
    return { error: "Неверный текущий пароль." };
  }
  if (next.length < 8) return { error: "Новый пароль должен содержать не менее 8 символов." };
  const { getDb } = await import("@/lib/db");
  getDb()
    .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .run(hashPassword(next), user.id);
  return { success: "Пароль изменён." };
}

export async function deleteAccountAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/settings?error=admin-account");
  const { getDb } = await import("@/lib/db");
  getDb().prepare("DELETE FROM users WHERE id = ?").run(user.id);
  await destroySession();
  redirect("/");
}
