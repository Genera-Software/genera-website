import { NextRequest, NextResponse } from "next/server";
import { getDocSearchIndex } from "@/app/docs/_data/load";
import { suggestDocs } from "@/lib/support/suggest";

/**
 * Docs suggestions for the support widget — "before you write in, this page
 * might answer it".
 *
 * Public and unauthenticated on purpose: it only ever returns links to pages
 * that are already public at /docs, and the widget runs on a different origin
 * (app.generasoftware.com), so it is CORS-open. Nothing here reads or writes
 * ticket data.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 2000;

// A plain GET with no custom headers is a CORS "simple request", so no
// preflight is needed — OPTIONS is here only for clients that send one anyway.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
} as const;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("q") ?? "";
  const query = raw.slice(0, MAX_QUERY_LENGTH);
  const limitParam = Number(req.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), 5)
    : 3;

  // Too little to go on — return empty rather than guessing from one word.
  if (query.trim().length < 8) {
    return NextResponse.json({ suggestions: [] }, { headers: CORS_HEADERS });
  }

  try {
    const index = await getDocSearchIndex();
    const suggestions = suggestDocs(index, query, { limit }).map((s) => ({
      title: s.title,
      section: s.section,
      href: s.href,
      snippet: s.snippet,
    }));

    // No cache headers: netlify.toml forces no-store site-wide so CMS edits go
    // live immediately, and setting them here would only be decoration. The
    // docs index is cached in-process instead (see getDocSections + suggest).
    return NextResponse.json({ suggestions }, { headers: CORS_HEADERS });
  } catch {
    // Never let a docs lookup stop someone reaching support.
    return NextResponse.json({ suggestions: [] }, { headers: CORS_HEADERS });
  }
}
