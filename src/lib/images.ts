import "server-only";

import { LIMITS } from "./constants";

export interface ValidatedImage {
  buffer: Buffer;
  mime: "image/jpeg" | "image/png" | "image/webp";
  ext: "jpg" | "png" | "webp";
  width: number;
  height: number;
}

function sniff(buffer: Buffer): ValidatedImage["mime"] | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

function jpegSize(buffer: Buffer): { width: number; height: number } | null {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buffer[offset + 1]!;
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = buffer.readUInt16BE(offset + 2);
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
}

function webpSize(buffer: Buffer): { width: number; height: number } | null {
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    const width = 1 + (buffer[24]! | (buffer[25]! << 8) | (buffer[26]! << 16));
    const height = 1 + (buffer[27]! | (buffer[28]! << 8) | (buffer[29]! << 16));
    return { width, height };
  }
  if (chunk === "VP8 ") {
    // Lossy WebP: find the start code, then read 14-bit dimensions.
    for (let i = 20; i < Math.min(buffer.length - 10, 40); i++) {
      if (
        buffer[i] === 0x9d &&
        buffer[i + 1] === 0x01 &&
        buffer[i + 2] === 0x2a
      ) {
        return {
          width: buffer.readUInt16LE(i + 3) & 0x3fff,
          height: buffer.readUInt16LE(i + 5) & 0x3fff,
        };
      }
    }
  }
  if (chunk === "VP8L") {
    const b0 = buffer[21]!;
    const b1 = buffer[22]!;
    const b2 = buffer[23]!;
    const b3 = buffer[24]!;
    return {
      width: 1 + (((b1 & 0x3f) << 8) | b0),
      height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
    };
  }
  return null;
}

export function readImageDimensions(
  buffer: Buffer,
  mime: ValidatedImage["mime"],
): { width: number; height: number } | null {
  if (mime === "image/png") {
    if (buffer.length < 24) return null;
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (mime === "image/jpeg") return jpegSize(buffer);
  if (mime === "image/webp") return webpSize(buffer);
  return null;
}

export async function validateUpload(file: File): Promise<ValidatedImage> {
  if (!file || typeof file === "string") {
    throw new Error("Choose an image to upload.");
  }
  if (file.size === 0) throw new Error("The selected file is empty.");
  if (file.size > LIMITS.uploadBytes) {
    throw new Error(`Images must be smaller than ${Math.round(LIMITS.uploadBytes / 1024 / 1024)} MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniff(buffer);
  if (!mime) {
    throw new Error("Only JPG, PNG and WEBP images are accepted.");
  }
  const dimensions = readImageDimensions(buffer, mime);
  if (!dimensions || !dimensions.width || !dimensions.height) {
    throw new Error("Could not read the image dimensions. Try another file.");
  }
  if (
    Math.min(dimensions.width, dimensions.height) < LIMITS.minImageSide ||
    Math.max(dimensions.width, dimensions.height) > LIMITS.maxImageSide
  ) {
    throw new Error(
      `Images must be between ${LIMITS.minImageSide}px and ${LIMITS.maxImageSide}px on each side.`,
    );
  }
  return {
    buffer,
    mime,
    ext: mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp",
    ...dimensions,
  };
}
