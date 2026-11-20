import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export function uploadDir() {
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.UPLOAD_DIR || "data/uploads");
}

/**
 * Stores an uploaded image and returns its public URL.
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise the local disk
 * (served by the /uploads/[...path] route).
 */
export async function storeImage(file: File): Promise<string> {
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error("Only JPG, PNG, WebP, GIF or AVIF images are allowed.");
  if (file.size > MAX_BYTES) throw new Error("Images must be 8 MB or smaller.");

  const base = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 40) || "image";
  const name = `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  const dir = uploadDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
