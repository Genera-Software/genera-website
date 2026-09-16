import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { ticketRef } from "@/lib/support/ref";

/**
 * Unread customer replies, for the banner in the admin shell. Polled, so it
 * stays a small JSON payload rather than a full page refresh.
 *
 * Admin-only: /api is outside the middleware's /admin matcher, so the session
 * is checked here.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type UnreadReply = {
  id: string;
  ref: string;
  subject: string;
  who: string;
  at: string;
};

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminSupabase();
  const { data: messages, error } = await supabase
    .from("support_ticket_messages")
    .select("ticket_id, created_at")
    .eq("direction", "inbound")
    .is("read_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
  if (!messages || messages.length === 0) {
    return NextResponse.json({ tickets: [] });
  }

  // Newest unread reply per ticket — rows are already newest-first.
  const latest = new Map<string, string>();
  for (const m of messages) {
    if (!latest.has(m.ticket_id)) latest.set(m.ticket_id, m.created_at);
  }
  const ids = [...latest.keys()];

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, subject, account_name, account_email")
    .in("id", ids);

  const byId = new Map((tickets ?? []).map((t) => [t.id, t]));
  const rows: UnreadReply[] = ids.flatMap((id) => {
    const t = byId.get(id);
    if (!t) return [];
    return [
      {
        id: t.id,
        ref: ticketRef(t.id),
        subject: t.subject,
        who: t.account_name ?? t.account_email ?? "Customer",
        at: latest.get(id)!,
      },
    ];
  });

  return NextResponse.json({ tickets: rows });
}
