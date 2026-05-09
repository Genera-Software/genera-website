/**
 * Server proxy that forwards browser ticket submissions to the Genera admin.
 *
 * Drop into app.generasoftware.com at:
 *   app/api/support/proxy/route.ts
 *
 * Holds SUPPORT_INGEST_TOKEN server-side so it never ships to the browser.
 *
 * Required env vars (on app.generasoftware.com):
 *   SUPPORT_INGEST_URL    e.g. https://generasoftware.com/api/support/tickets
 *   SUPPORT_INGEST_TOKEN  same value as on the admin app
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = process.env.SUPPORT_INGEST_URL;
  const token = process.env.SUPPORT_INGEST_TOKEN;
  if (!url || !token) {
    return NextResponse.json(
      { error: "Support is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Basic per-IP rate limit hook — replace with your platform's solution
  // (Upstash, Vercel KV, etc.) if you expect high traffic.

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Network error" },
      { status: 502 },
    );
  }
}
