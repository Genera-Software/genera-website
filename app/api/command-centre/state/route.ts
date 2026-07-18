import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cross-device sync for the Content Command Centre dashboard (see
// app/command-centre/route.ts). One row, whole-state JSON blob, last write
// wins — this is a two-person tool (Jess/Duncan), not a multi-user app, so
// that's an intentional simplification, not an oversight.
//
// Untyped Supabase client on purpose: command_centre_state was added by hand
// to lib/supabase/types.ts rather than via `supabase gen types`, so keeping
// this route's client separate avoids drift risk with the generated type.
export const runtime = "nodejs";

const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5MB, generous headroom over real usage
const ROW_ID = "default";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("command_centre_state")
    .select("data, updated_at")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ data: null, updatedAt: null });
  }
  return NextResponse.json({ data: data.data, updatedAt: data.updated_at });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("data" in (body as Record<string, unknown>))
  ) {
    return NextResponse.json({ error: "Missing data field" }, { status: 400 });
  }

  const supabase = getSupabase();
  const updatedAt = new Date().toISOString();
  const { error } = await supabase.from("command_centre_state").upsert({
    id: ROW_ID,
    data: (body as { data: unknown }).data,
    updated_at: updatedAt,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, updatedAt });
}
