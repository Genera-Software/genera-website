import "server-only";
import { getAdminSupabase } from "@/lib/supabase/admin";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}

function randomId(): string {
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function uploadToBucket(
  file: File,
  bucket: "logos" | "blog-images" | "story-images",
): Promise<string> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error(
      `Unsupported file type: ${file.type}. Use PNG, JPG, WebP, or SVG.`,
    );
  }
  if (file.size > MAX_BYTES) {
    throw new Error(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`,
    );
  }

  const supabase = getAdminSupabase();
  const ext = extFromMime(file.type);
  const path = `${Date.now()}-${randomId()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function pathFromPublicUrl(
  url: string,
  bucket: "logos" | "blog-images" | "story-images",
): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function deleteFromBucket(
  url: string,
  bucket: "logos" | "blog-images" | "story-images",
): Promise<void> {
  const path = pathFromPublicUrl(url, bucket);
  if (!path) return;
  const supabase = getAdminSupabase();
  await supabase.storage.from(bucket).remove([path]);
}
