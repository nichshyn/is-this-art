"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { newId, queryOne } from "@/lib/db";
import { validateUpload } from "@/lib/images";
import { storeImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { awardUploadAchievements } from "@/lib/voting";
import {
  adminArtworkSchema,
  firstError,
} from "@/lib/validation";
import type { FormState } from "./auth";

function bool(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

function uniqueSlug(base: string, exceptId?: string): string {
  const clean = slugify(base) || "artwork";
  let candidate = clean;
  let i = 2;
  while (
    queryOne(
      "SELECT 1 FROM artworks WHERE slug = ? AND id <> ?",
      candidate,
      exceptId ?? "",
    )
  ) {
    candidate = `${clean}-${i++}`;
  }
  return candidate;
}

async function resolveImage(
  formData: FormData,
  existingUrl?: string,
): Promise<{
  imageUrl: string;
  width: number;
  height: number;
  imageCredit: string;
  imageLicense: string;
  imageSourceUrl: string;
} | null> {
  const file = formData.get("image");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const imageCredit = String(formData.get("imageCredit") ?? "").trim();
  const imageLicense = String(formData.get("imageLicense") ?? "").trim();
  const imageSourceUrl = String(formData.get("imageSourceUrl") ?? "").trim();

  if (file instanceof File && file.size > 0) {
    const image = await validateUpload(file);
    const stored = await storeImage(image);
    return {
      imageUrl: stored.url,
      width: image.width,
      height: image.height,
      imageCredit,
      imageLicense,
      imageSourceUrl,
    };
  }
  if (imageUrl) {
    if (!/^https:\/\//i.test(imageUrl) && !imageUrl.startsWith("/artworks/")) {
      throw new Error("Image URL must start with https:// or be a local artwork path.");
    }
    const width = Number(formData.get("imageWidth")) || 1200;
    const height = Number(formData.get("imageHeight")) || 1200;
    return { imageUrl, width, height, imageCredit, imageLicense, imageSourceUrl };
  }
  if (existingUrl) {
    const current = queryOne<{ image_url: string; image_width: number; image_height: number }>(
      "SELECT image_url, image_width, image_height FROM artworks WHERE image_url = ? LIMIT 1",
      existingUrl,
    );
    return {
      imageUrl: existingUrl,
      width: current?.image_width ?? 1200,
      height: current?.image_height ?? 1200,
      imageCredit,
      imageLicense,
      imageSourceUrl,
    };
  }
  throw new Error("Add an image file or an image URL.");
}

export async function adminCreateArtworkAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = adminArtworkSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    history: String(formData.get("history") ?? ""),
    category: String(formData.get("category") ?? ""),
    artistName: String(formData.get("artistName") ?? ""),
    creationYear: String(formData.get("creationYear") ?? ""),
    country: String(formData.get("country") ?? ""),
    location: String(formData.get("location") ?? ""),
    funFact: String(formData.get("funFact") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageCredit: String(formData.get("imageCredit") ?? ""),
    imageLicense: String(formData.get("imageLicense") ?? ""),
    imageSourceUrl: String(formData.get("imageSourceUrl") ?? ""),
    isAiGenerated: bool(formData.get("isAiGenerated")),
    isVerified: bool(formData.get("isVerified")),
    isDemo: bool(formData.get("isDemo")),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  try {
    const image = await resolveImage(formData);
    if (!image) return { error: "Could not resolve the image." };
    const id = newId("art_");
    const slug = uniqueSlug(parsed.data.slug || parsed.data.title);
    const { getDb } = await import("@/lib/db");
    getDb()
      .prepare(
        `INSERT INTO artworks
         (id, slug, title, description, history, image_url, image_width, image_height,
          image_credit, image_license, image_source_url, category, artist_name, creation_year,
          country, location, fun_fact, is_ai_generated, is_verified, is_anonymous, is_demo,
          submitted_by, status, rejection_reason, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NULL, 'approved', NULL, ?)`,
      )
      .run(
        id,
        slug,
        parsed.data.title,
        parsed.data.description,
        parsed.data.history || null,
        image.imageUrl,
        image.width,
        image.height,
        image.imageCredit || null,
        image.imageLicense || null,
        image.imageSourceUrl || null,
        parsed.data.category,
        parsed.data.artistName,
        parsed.data.creationYear || null,
        parsed.data.country || null,
        parsed.data.location || null,
        parsed.data.funFact || null,
        parsed.data.isAiGenerated ? 1 : 0,
        parsed.data.isVerified ? 1 : 0,
        parsed.data.isDemo ? 1 : 0,
        new Date().toISOString(),
      );
    revalidatePath("/discover");
    revalidatePath("/admin/artworks");
    console.info(`[admin] ${admin.username} created artwork ${slug}`);
    return { success: `Artwork "${parsed.data.title}" created.` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not create artwork." };
  }
}

export async function adminUpdateArtworkAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing artwork id." };
  const current = queryOne<{ image_url: string }>(
    "SELECT image_url FROM artworks WHERE id = ?",
    id,
  );
  if (!current) return { error: "Artwork not found." };

  const parsed = adminArtworkSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    history: String(formData.get("history") ?? ""),
    category: String(formData.get("category") ?? ""),
    artistName: String(formData.get("artistName") ?? ""),
    creationYear: String(formData.get("creationYear") ?? ""),
    country: String(formData.get("country") ?? ""),
    location: String(formData.get("location") ?? ""),
    funFact: String(formData.get("funFact") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageCredit: String(formData.get("imageCredit") ?? ""),
    imageLicense: String(formData.get("imageLicense") ?? ""),
    imageSourceUrl: String(formData.get("imageSourceUrl") ?? ""),
    isAiGenerated: bool(formData.get("isAiGenerated")),
    isVerified: bool(formData.get("isVerified")),
    isDemo: bool(formData.get("isDemo")),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  try {
    const image = await resolveImage(formData, current.image_url);
    if (!image) return { error: "Could not resolve the image." };
    const slug = uniqueSlug(parsed.data.slug || parsed.data.title, id);
    const { getDb } = await import("@/lib/db");
    getDb()
      .prepare(
        `UPDATE artworks SET
          slug = ?, title = ?, description = ?, history = ?, image_url = ?, image_width = ?,
          image_height = ?, image_credit = ?, image_license = ?, image_source_url = ?,
          category = ?, artist_name = ?, creation_year = ?, country = ?, location = ?,
          fun_fact = ?, is_ai_generated = ?, is_verified = ?, is_demo = ?
         WHERE id = ?`,
      )
      .run(
        slug,
        parsed.data.title,
        parsed.data.description,
        parsed.data.history || null,
        image.imageUrl,
        image.width,
        image.height,
        image.imageCredit || null,
        image.imageLicense || null,
        image.imageSourceUrl || null,
        parsed.data.category,
        parsed.data.artistName,
        parsed.data.creationYear || null,
        parsed.data.country || null,
        parsed.data.location || null,
        parsed.data.funFact || null,
        parsed.data.isAiGenerated ? 1 : 0,
        parsed.data.isVerified ? 1 : 0,
        parsed.data.isDemo ? 1 : 0,
        id,
      );
    revalidatePath("/discover");
    revalidatePath(`/artwork/${slug}`);
    revalidatePath("/admin/artworks");
    return { success: "Artwork updated." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not update artwork." };
  }
}

export async function adminModerateArtworkAction(
  artworkId: string,
  decision: "approved" | "rejected",
  reason?: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const artwork = queryOne<{ id: string; submitted_by: string | null; slug: string; title: string }>(
    "SELECT id, submitted_by, slug, title FROM artworks WHERE id = ?",
    artworkId,
  );
  if (!artwork) return { ok: false, error: "Artwork not found." };
  const { getDb } = await import("@/lib/db");
  getDb()
    .prepare("UPDATE artworks SET status = ?, rejection_reason = ? WHERE id = ?")
    .run(decision, decision === "rejected" ? reason?.slice(0, 500) ?? "Not approved." : null, artworkId);
  if (decision === "approved" && artwork.submitted_by) {
    awardUploadAchievements(artwork.submitted_by);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/moderation");
  revalidatePath("/admin/artworks");
  revalidatePath("/discover");
  revalidatePath("/community");
  revalidatePath(`/artwork/${artwork.slug}`);
  return { ok: true };
}

export async function adminDeleteArtworkAction(
  artworkId: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const { getDb } = await import("@/lib/db");
  getDb().prepare("DELETE FROM artworks WHERE id = ?").run(artworkId);
  revalidatePath("/admin");
  revalidatePath("/admin/artworks");
  revalidatePath("/discover");
  revalidatePath("/community");
  return { ok: true };
}

export async function adminResolveReportAction(
  reportId: string,
  status: "resolved" | "dismissed",
): Promise<{ ok: boolean }> {
  await requireAdmin();
  const { getDb } = await import("@/lib/db");
  getDb().prepare("UPDATE reports SET status = ? WHERE id = ?").run(status, reportId);
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminToggleBlockAction(
  userId: string,
): Promise<{ ok: boolean; blocked?: boolean; error?: string }> {
  const admin = await requireAdmin();
  if (admin.id === userId) return { ok: false, error: "You cannot block yourself." };
  const target = queryOne<{ id: string; is_blocked: number; role: string }>(
    "SELECT id, is_blocked, role FROM users WHERE id = ?",
    userId,
  );
  if (!target) return { ok: false, error: "User not found." };
  if (target.role === "admin") return { ok: false, error: "Admins cannot be blocked here." };
  const next = target.is_blocked ? 0 : 1;
  const { getDb } = await import("@/lib/db");
  getDb().prepare("UPDATE users SET is_blocked = ? WHERE id = ?").run(next, userId);
  revalidatePath("/admin/users");
  return { ok: true, blocked: Boolean(next) };
}

export async function adminAddCategoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (name.length < 2) return { error: "Category name is too short." };
  const slug = slugify(name);
  if (!slug) return { error: "Enter a valid category name." };
  if (queryOne("SELECT 1 FROM categories WHERE slug = ?", slug)) {
    return { error: "That category already exists." };
  }
  const { getDb } = await import("@/lib/db");
  getDb()
    .prepare(
      "INSERT INTO categories (slug, name, description, sort_order, is_active) VALUES (?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM categories), 1)",
    )
    .run(slug, name, description || null);
  revalidatePath("/admin/categories");
  revalidatePath("/discover");
  return { success: `Category "${name}" added.` };
}

export async function adminToggleCategoryAction(
  slug: string,
): Promise<{ ok: boolean }> {
  await requireAdmin();
  const category = queryOne<{ is_active: number }>(
    "SELECT is_active FROM categories WHERE slug = ?",
    slug,
  );
  if (!category) return { ok: false };
  const { getDb } = await import("@/lib/db");
  getDb()
    .prepare("UPDATE categories SET is_active = ? WHERE slug = ?")
    .run(category.is_active ? 0 : 1, slug);
  revalidatePath("/admin/categories");
  revalidatePath("/discover");
  return { ok: true };
}
