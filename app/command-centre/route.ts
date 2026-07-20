import { readFile } from "node:fs/promises";
import path from "node:path";

// Serves the Content Command Centre single-file dashboard. Access is already
// gated by middleware.ts (genera_ccc_session cookie) before any request
// reaches here — this handler just returns the file, unmodified except for
// the cross-device sync shim baked into content/command-centre/dashboard.html.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "content/command-centre/dashboard.html",
  );
  const html = await readFile(filePath, "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
