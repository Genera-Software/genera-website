import "server-only";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { sendPostmarkEmail } from "@/lib/forms/delivery";

/** Address customers see and reply to. Must be a verified Postmark sender. */
export const SUPPORT_FROM_EMAIL =
  process.env.SUPPORT_FROM_EMAIL ?? "help@generasoftware.com";

export const SUPPORT_FROM_NAME =
  process.env.SUPPORT_FROM_NAME ?? "Genera Support";

/**
 * Short public reference for a ticket, derived from the first 8 hex characters
 * of its UUID. Stateless — no extra column, and reversible via a prefix match.
 */
export function ticketRef(ticketId: string): string {
  return ticketId.replace(/-/g, "").slice(0, 8).toUpperCase();
}

const REF_IN_SUBJECT = /\[#([0-9A-F]{8})\]/i;

/** Pull a ticket ref out of an email subject line, if one is tagged there. */
export function parseTicketRef(subject: string | null | undefined) {
  const match = subject?.match(REF_IN_SUBJECT);
  return match ? match[1].toLowerCase() : null;
}

/** Subject line for outbound replies — the ref tag is what threads the reply back. */
export function replySubject(ticketSubject: string, ticketId: string) {
  const base = ticketSubject.replace(REF_IN_SUBJECT, "").trim();
  const withPrefix = /^re:/i.test(base) ? base : `Re: ${base}`;
  return `${withPrefix} [#${ticketRef(ticketId)}]`;
}

/**
 * Marker the customer's mail client keeps above their quoted reply. Postmark's
 * inbound parser uses it (plus its own heuristics) to produce StrippedTextReply.
 */
const REPLY_DELIMITER = "##- Please type your reply above this line -##";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function replyHtml(body: string, ref: string) {
  const paragraphs = body
    .trim()
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;line-height:1.6;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#F8FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
  <div style="max-width:560px;margin:0 auto;">
    <p style="margin:0 0 12px;color:#9CA3AF;font-size:12px;text-align:center;">${REPLY_DELIMITER}</p>
    <div style="background:#fff;border-radius:16px;padding:28px;box-shadow:0 6px 24px rgba(0,62,69,0.08);font-size:15px;">
      ${paragraphs}
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #EEF4F5;color:#4B5563;font-size:13px;">
        — ${escapeHtml(SUPPORT_FROM_NAME)}
      </p>
    </div>
    <p style="margin:16px 0 0;color:#9CA3AF;font-size:12px;text-align:center;">
      Reply to this email to continue the conversation. Reference [#${ref}]
    </p>
  </div>
</body></html>`;
}

function replyText(body: string, ref: string) {
  return `${REPLY_DELIMITER}\n\n${body.trim()}\n\n— ${SUPPORT_FROM_NAME}\n\nReply to this email to continue the conversation. Reference [#${ref}]`;
}

/**
 * Send an admin reply to the customer and record it on the ticket thread.
 * The message row is written either way, so failed sends stay visible in the UI.
 */
export async function sendTicketReply(opts: {
  ticketId: string;
  ticketSubject: string;
  to: string;
  body: string;
  authorName?: string | null;
}) {
  const supabase = getAdminSupabase();
  const ref = ticketRef(opts.ticketId);
  const subject = replySubject(opts.ticketSubject, opts.ticketId);

  const result = await sendPostmarkEmail({
    to: opts.to,
    subject,
    from: `${SUPPORT_FROM_NAME} <${SUPPORT_FROM_EMAIL}>`,
    replyTo: SUPPORT_FROM_EMAIL,
    htmlBody: replyHtml(opts.body, ref),
    textBody: replyText(opts.body, ref),
    headers: { "X-Genera-Ticket": opts.ticketId },
  });

  await supabase.from("support_ticket_messages").insert({
    ticket_id: opts.ticketId,
    direction: "outbound",
    author_name: opts.authorName ?? SUPPORT_FROM_NAME,
    from_email: SUPPORT_FROM_EMAIL,
    to_email: opts.to,
    subject,
    body: opts.body.trim(),
    provider_message_id: result.messageId,
    delivery_status: result.ok ? "sent" : "failed",
    delivery_error: result.error,
  });

  await supabase
    .from("support_tickets")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", opts.ticketId);

  return result;
}

/**
 * Resolve an inbound email to a ticket: subject ref tag first, then the most
 * recent open ticket from that sender.
 */
export async function findTicketForInbound(opts: {
  subject: string | null;
  fromEmail: string | null;
}) {
  const supabase = getAdminSupabase();
  const ref = parseTicketRef(opts.subject);

  if (ref) {
    // Refs are a UUID prefix with the dashes removed; restore the dash at 8.
    const { data } = await supabase
      .from("support_tickets")
      .select("id, subject, status, account_email")
      .like("id", `${ref}-%`)
      .order("created_at", { ascending: false })
      .limit(1);
    if (data?.[0]) return data[0];
  }

  if (opts.fromEmail) {
    const { data } = await supabase
      .from("support_tickets")
      .select("id, subject, status, account_email")
      .ilike("account_email", opts.fromEmail)
      .neq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1);
    if (data?.[0]) return data[0];
  }

  return null;
}
