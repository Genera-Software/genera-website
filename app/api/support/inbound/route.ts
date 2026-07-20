import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { findTicketForInbound } from "@/lib/support/thread";
import { notifySupportTicket } from "@/lib/support/notify";

export const dynamic = "force-dynamic";

/** Postmark inbound webhook payload (only the fields we consume). */
type InboundPayload = {
  MessageID?: string;
  Subject?: string;
  TextBody?: string;
  HtmlBody?: string;
  StrippedTextReply?: string;
  FromFull?: { Email?: string; Name?: string };
  ToFull?: Array<{ Email?: string }>;
  Attachments?: Array<{
    Name?: string;
    ContentType?: string;
    ContentLength?: number;
  }>;
};

function ok() {
  // Always 200 so Postmark does not retry or deactivate the webhook.
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const secret = process.env.SUPPORT_INBOUND_SECRET;
  if (!secret) {
    console.error("[support/inbound] SUPPORT_INBOUND_SECRET not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  if (new URL(req.url).searchParams.get("token") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: InboundPayload;
  try {
    payload = (await req.json()) as InboundPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fromEmail = payload.FromFull?.Email?.trim().toLowerCase() ?? null;
  const fromName = payload.FromFull?.Name?.trim() || null;
  const subject = payload.Subject?.trim() || "(no subject)";

  // StrippedTextReply drops the quoted history; fall back to the full body.
  const body = (payload.StrippedTextReply || payload.TextBody || "").trim();

  const attachments = (payload.Attachments ?? []).map((a) => ({
    name: a.Name ?? "attachment",
    type: a.ContentType ?? "application/octet-stream",
    size: a.ContentLength ?? 0,
  }));

  const supabase = getAdminSupabase();
  const ticket = await findTicketForInbound({ subject, fromEmail });

  if (ticket) {
    const { error } = await supabase.from("support_ticket_messages").insert({
      ticket_id: ticket.id,
      direction: "inbound",
      author_name: fromName,
      from_email: fromEmail,
      to_email: payload.ToFull?.[0]?.Email ?? null,
      subject,
      body,
      body_html: payload.HtmlBody ?? null,
      attachments,
      provider_message_id: payload.MessageID ?? null,
      delivery_status: "received",
    });

    // Duplicate MessageID means Postmark retried a delivery we already stored.
    if (error && error.code !== "23505") {
      console.error("[support/inbound] insert failed", error.message);
    }

    await supabase
      .from("support_tickets")
      .update({
        updated_at: new Date().toISOString(),
        // A customer reply reopens a ticket we had already closed out.
        ...(ticket.status === "completed" ? { status: "in_progress" } : {}),
      })
      .eq("id", ticket.id);

    return ok();
  }

  // No match — treat it as a brand new ticket so help@ works as a real inbox.
  const { data: created, error } = await supabase
    .from("support_tickets")
    .insert({
      subject,
      description: body || "(empty message)",
      category: "other",
      account_email: fromEmail,
      account_name: fromName,
      source: "email",
    })
    .select("id")
    .single();

  if (error || !created) {
    console.error("[support/inbound] ticket create failed", error?.message);
    return ok();
  }

  await supabase.from("support_ticket_messages").insert({
    ticket_id: created.id,
    direction: "inbound",
    author_name: fromName,
    from_email: fromEmail,
    to_email: payload.ToFull?.[0]?.Email ?? null,
    subject,
    body,
    body_html: payload.HtmlBody ?? null,
    attachments,
    provider_message_id: payload.MessageID ?? null,
    delivery_status: "received",
  });

  await notifySupportTicket({
    category: "other",
    subject,
    description: body,
    account_email: fromEmail,
    account_name: fromName,
    source: "email",
  });

  return ok();
}
