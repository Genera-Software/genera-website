import { after, NextResponse, type NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { BADGES_BY_ID } from "@/lib/badges";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tracked badge image. Customers embed
//   <img src="https://www.generasoftware.com/api/badge/<id>.png">
// This logs a minimal, cookie-free impression (badge id + the embedding site's
// host) and redirects to the cached static PNG at /badges/<id>.png. Logging runs
// via after() so it never delays image delivery, and is best-effort.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: raw } = await params;
  const id = raw.replace(/\.png$/i, "");
  const target = new URL(`/badges/${id}.png`, req.url);
  const badge = BADGES_BY_ID[id];

  if (badge) {
    const referer = req.headers.get("referer");
    let host: string | null = null;
    if (referer) {
      try {
        host = new URL(referer).hostname;
      } catch {
        host = null;
      }
    }

    after(async () => {
      try {
        const supabase = getAdminSupabase();
        await supabase.from("badge_events").insert({
          badge_id: id,
          kind: badge.kind,
          shape: badge.shape,
          referer_host: host,
        });
      } catch {
        // Tracking is best-effort — never affect image delivery.
      }
    });
  }

  const res = NextResponse.redirect(target, 302);
  // Re-hit the function on every view so impressions are counted; the static
  // PNG behind the redirect is what actually gets cached.
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
