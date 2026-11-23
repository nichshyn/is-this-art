import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { newId } from "./db";
import type { ValidatedImage } from "./images";

function uploadsDir(): string {
  const configured = process.env.DATA_DIR;
  const base = configured
    ? path.resolve(/* turbopackIgnore: true */ process.cwd(), configured)
    : path.join(process.cwd(), "data");
  return path.join(base, "uploads");
}

export interface StoredImage {
  url: string;
  storage: "local" | "supabase";
}

export async function storeImage(image: ValidatedImage): Promise<StoredImage> {
  const filename = `${newId("img_")}.${image.ext}`;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "artworks";

  if (supabaseUrl && serviceKey) {
    const endpoint = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${encodeURIComponent(bucket)}/${filename}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": image.mime,
        "x-upsert": "false",
      },
      body: new Uint8Array(image.buffer),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Не удалось загрузить файл в хранилище (${response.status}). ${detail.slice(0, 200)}`);
    }
    return {
      url: `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${encodeURIComponent(bucket)}/${filename}`,
      storage: "supabase",
    };
  }

  const dir = uploadsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), image.buffer);
  return { url: `/api/uploads/${filename}`, storage: "local" };
}

export async function readLocalUpload(name: string): Promise<{
  buffer: Buffer;
  contentType: string;
} | null> {
  if (!/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(name)) return null;
  const filePath = path.join(uploadsDir(), name);
  try {
    const buffer = await fs.readFile(filePath);
    const ext = path.extname(name).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    return { buffer, contentType };
  } catch {
    return null;
  }
}
