import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Upload one screenshot for a Help Centre / What's New entry.
//
// Why this exists: help_centre_subsections.images stores absolute URLs into the
// public website-images bucket, so whoever writes those rows also has to put the
// file in the bucket. Doing that from the outside means handing out
// SUPABASE_SERVICE_ROLE_KEY, which grants the whole project. This endpoint keeps
// the service key on the server and exposes one narrow capability instead:
// write a PNG/JPG/WebP into website-images/docs/, nothing else.
//
// DOCS_UPLOAD_TOKEN is a separate shared secret from SUPPORT_INGEST_TOKEN so it
// can be rotated on its own without taking the support widget down with it.
//
//   curl -X POST "$SITE/api/admin/docs-image?filename=1789911000000-region-ie.png" \
//     -H "authorization: Bearer $DOCS_UPLOAD_TOKEN" \
//     -H "content-type: image/png" --data-binary @region-ie.png
//
// Responds { path, url }. The url is what goes in the images jsonb.

const ALLOWED_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB, matching lib/admin/upload.ts

const BUCKET = "website-images";
const FOLDER = "docs";

// Deliberately strict. The filename lands in a public URL and is chosen by the
// caller, so anything that could climb out of the folder, collide with another
// area of the bucket, or confuse a browser about the file type is rejected
// rather than sanitised — a silent rename would leave the docs row pointing at
// a URL that does not exist.
const FILENAME = /^[a-z0-9]+(?:[-_][a-z0-9]+)*\.(png|jpg|webp)$/;

export async function POST(req: NextRequest) {
  const expected = process.env.DOCS_UPLOAD_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = (req.headers.get("content-type") ?? "").split(";")[0].trim();
  const ext = ALLOWED_MIME[contentType];
  if (!ext) {
    return NextResponse.json(
      { error: `Unsupported content-type: ${contentType || "(none)"}. Use PNG, JPG or WebP.` },
      { status: 415 },
    );
  }

  const filename = (req.nextUrl.searchParams.get("filename") ?? "").trim().toLowerCase();
  if (!FILENAME.test(filename)) {
    return NextResponse.json(
      {
        error:
          "filename must be lowercase letters, digits, hyphens or underscores, ending .png/.jpg/.webp",
      },
      { status: 400 },
    );
  }
  if (!filename.endsWith(`.${ext}`)) {
    return NextResponse.json(
      { error: `filename extension does not match content-type ${contentType}` },
      { status: 400 },
    );
  }

  const body = Buffer.from(await req.arrayBuffer());
  if (body.byteLength === 0) {
    return NextResponse.json({ error: "Empty body" }, { status: 400 });
  }
  if (body.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${(body.byteLength / 1024 / 1024).toFixed(1)} MB). Max 5 MB.` },
      { status: 413 },
    );
  }

  // Overwriting is allowed on purpose: re-shooting a screenshot after a UI fix
  // should not orphan the URL already written into a docs row.
  const overwrite = req.nextUrl.searchParams.get("overwrite") !== "false";
  const path = `${FOLDER}/${filename}`;
  const supabase = getAdminSupabase();

  const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
    contentType,
    cacheControl: "31536000",
    upsert: overwrite,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ path, url: data.publicUrl });
}
