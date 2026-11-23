import { NextResponse } from "next/server";

import { clientIp, getCurrentUser, isSameOrigin } from "@/lib/auth";
import { newId, queryOne } from "@/lib/db";
import { validateUpload } from "@/lib/images";
import { rateLimit } from "@/lib/rate-limit";
import { storeImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { artworkSubmissionSchema, firstError } from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 30;

function bool(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

function uniqueSlug(title: string): string {
  const base = slugify(title) || "artwork";
  let candidate = base;
  let i = 2;
  while (queryOne("SELECT 1 FROM artworks WHERE slug = ?", candidate)) {
    candidate = `${base}-${i++}`;
  }
  return candidate;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  }
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Sign in to submit an artwork." },
      { status: 401 },
    );
  }
  if (user.is_blocked) {
    return NextResponse.json(
      { ok: false, error: "This account is suspended." },
      { status: 403 },
    );
  }
  const limited = rateLimit(`upload:${user.id}:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many uploads. Try again later." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Could not read the upload." }, { status: 400 });
  }

  const file = form.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Choose an image to upload." }, { status: 400 });
  }

  const parsed = artworkSubmissionSchema.safeParse({
    title: String(form.get("title") ?? ""),
    description: String(form.get("description") ?? ""),
    category: String(form.get("category") ?? ""),
    artistName: String(form.get("artistName") ?? ""),
    creationYear: String(form.get("creationYear") ?? ""),
    country: String(form.get("country") ?? ""),
    location: String(form.get("location") ?? ""),
    isAiGenerated: bool(form.get("isAiGenerated")),
    isOriginal: bool(form.get("isOriginal")),
    isAnonymous: bool(form.get("isAnonymous")),
    agree: bool(form.get("agree")),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: firstError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const image = await validateUpload(file);
    const stored = await storeImage(image);
    const id = newId("art_");
    const slug = uniqueSlug(parsed.data.title);
    const now = new Date().toISOString();
    const { getDb } = await import("@/lib/db");
    getDb()
      .prepare(
        `INSERT INTO artworks
         (id, slug, title, description, history, image_url, image_width, image_height,
          image_credit, image_license, image_source_url, category, artist_name, creation_year,
          country, location, fun_fact, is_ai_generated, is_verified, is_anonymous, is_demo,
          submitted_by, status, rejection_reason, created_at)
         VALUES (?, ?, ?, ?, NULL, ?, ?, ?, NULL, NULL, NULL, ?, ?, ?, ?, ?, NULL, ?, 0, ?, 0, ?, 'pending', NULL, ?)`,
      )
      .run(
        id,
        slug,
        parsed.data.title,
        parsed.data.description,
        stored.url,
        image.width,
        image.height,
        parsed.data.category,
        parsed.data.artistName,
        parsed.data.creationYear || null,
        parsed.data.country || null,
        parsed.data.location || null,
        parsed.data.isAiGenerated ? 1 : 0,
        parsed.data.isAnonymous ? 1 : 0,
        user.id,
        now,
      );

    return NextResponse.json({
      ok: true,
      id,
      slug,
      status: "pending",
      message: "Submitted for review. It will appear publicly once approved.",
    });
  } catch (error) {
    console.error("[upload]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Upload failed. Try again.",
      },
      { status: 400 },
    );
  }
}
