import { NextResponse } from "next/server";

/**
 * Stub submit endpoint for the widget preview at /admin/support/preview.
 *
 * The real widget posts to a proxy in the app.generasoftware.com repo. Here we
 * just acknowledge, so the whole flow — including the "sent" screen — is
 * clickable without filling the ticket list with test rows.
 *
 * Behind the admin middleware like everything else under /admin.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  console.log("[widget-preview] would have submitted:", body);
  return NextResponse.json({ ok: true, preview: true });
}
