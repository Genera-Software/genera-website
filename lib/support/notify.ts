import "server-only";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { escapeHtml, sendPostmarkEmail } from "@/lib/forms/delivery";
import { ticketRef } from "./ref";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.generasoftware.com";

/** Admin page where a ticket is read and answered. */
export function ticketAdminUrl(ticketId: string) {
  return `${SITE_URL.replace(/\/$/, "")}/admin/support/${ticketId}`;
}

export function categoryLabel(c: string) {
  return (
    {
      technical: "Technical",
      billing: "Billing",
      feature_request: "Feature request",
      account: "Account",
      other: "Other",
    }[c] ?? c
  );
}

/** DB-managed recipients, plus any leftover SUPPORT_NOTIFY_EMAIL env value(s). */
export async function getSupportNotifyEmails(): Promise<string[]> {
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from("support_notify_emails")
    .select("email")
    .order("created_at", { ascending: true });

  const fromDb = (data ?? [])
    .map((r) => r.email.trim().toLowerCase())
    .filter(Boolean);

  const fromEnv = (process.env.SUPPORT_NOTIFY_EMAIL ?? "")
    .split(/[,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set([...fromDb, ...fromEnv])];
}

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
// Long URLs, stack traces and unbroken strings must wrap, or they force a
// phone-width email to scroll sideways.
const WRAP = "word-break:break-word;overflow-wrap:anywhere;";

/** Escaped, with line breaks kept — Outlook ignores `white-space:pre-wrap`. */
const multiline = (s: string) => escapeHtml(s).replace(/\r?\n/g, "<br>");

/**
 * Single-column layout so it reads on a phone without media queries (which
 * several mail apps strip): labels sit above values, the button is
 * full-width, and the card is fluid up to 560px.
 */
function ticketEmailHtml(opts: {
  ref: string;
  url: string;
  subject: string;
  category: string;
  description: string;
  from: string | null;
  details: [string, string][];
  errors: string[];
}) {
  const details = opts.details
    .map(
      ([k, v]) => `
              <tr><td style="padding:10px 0;border-top:1px solid #EEF4F5;">
                <div style="margin:0 0 2px;font-size:12px;color:#6B7280;">${escapeHtml(k)}</div>
                <div style="font-size:14px;line-height:1.5;color:#111827;${WRAP}">${multiline(v)}</div>
              </td></tr>`,
    )
    .join("");

  const errors = opts.errors.length
    ? `
          <p style="margin:24px 0 8px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#6B7280;">Recent errors</p>
          <div style="padding:12px;background:#F8FAFB;border:1px solid #EEF4F5;border-radius:10px;font-family:${MONO};font-size:12px;line-height:1.5;color:#B91C1C;${WRAP}">
            ${opts.errors.map(multiline).join('<div style="height:8px;line-height:8px;">&nbsp;</div>')}
          </div>`
    : "";

  const byline = [categoryLabel(opts.category), opts.from].filter(Boolean).join(" · ");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(opts.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFB;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.description.slice(0, 140))}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8FAFB;">
    <tr><td style="padding:16px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;">
        <tr><td style="padding:24px 20px;font-family:${FONT};color:#111827;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#6B7280;">New support ticket · #${opts.ref}</p>
          <h1 style="margin:0 0 6px;font-size:20px;line-height:1.3;font-weight:700;color:#003E45;${WRAP}">${escapeHtml(opts.subject)}</h1>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:#4B5563;${WRAP}">${escapeHtml(byline)}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
            <tr><td align="center" bgcolor="#003E45" style="border-radius:10px;">
              <a href="${escapeHtml(opts.url)}" target="_blank" style="display:block;padding:14px 20px;font-family:${FONT};font-size:16px;font-weight:600;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:10px;">Open ticket</a>
            </td></tr>
          </table>

          <div style="padding:14px 16px;background:#F8FAFB;border-left:3px solid #003E45;border-radius:8px;font-size:15px;line-height:1.6;color:#111827;${WRAP}">${multiline(opts.description)}</div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">${details}
          </table>
${errors}
          <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6B7280;${WRAP}">
            Button not working? <a href="${escapeHtml(opts.url)}" style="color:#003E45;">${escapeHtml(opts.url)}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function notifySupportTicket(opts: {
  ticket_id: string;
  category: string;
  subject: string;
  description: string;
  account_email?: string | null;
  account_name?: string | null;
  account_id?: string | null;
  page_url?: string | null;
  app_version?: string | null;
  browser?: string | null;
  os?: string | null;
  viewport?: string | null;
  source?: string | null;
  console_errors?: Array<{ message: string }> | null;
}) {
  const recipients = await getSupportNotifyEmails();
  if (recipients.length === 0) return;

  const ref = ticketRef(opts.ticket_id);
  const url = ticketAdminUrl(opts.ticket_id);
  const category = categoryLabel(opts.category);

  const details: [string, string][] = [];
  if (opts.account_name) details.push(["Name", opts.account_name]);
  if (opts.account_email) details.push(["Email", opts.account_email]);
  if (opts.account_id) details.push(["Account ID", opts.account_id]);
  // Left as text, not a link: on docs tickets it comes from an unauthenticated form.
  if (opts.page_url) details.push(["Page", opts.page_url]);
  if (opts.app_version) details.push(["App version", opts.app_version]);
  if (opts.browser || opts.os) {
    details.push(["Browser / OS", `${opts.browser ?? "?"} on ${opts.os ?? "?"}`]);
  }
  if (opts.viewport) details.push(["Viewport", opts.viewport]);
  if (opts.source) details.push(["Source", opts.source]);

  const errors = (opts.console_errors ?? []).slice(0, 5).map((e) => e.message);

  const subject = `New support ticket — ${category}: ${opts.subject}`;

  const htmlBody = ticketEmailHtml({
    ref,
    url,
    subject: opts.subject,
    category: opts.category,
    description: opts.description,
    from: opts.account_name || opts.account_email || null,
    details,
    errors,
  });

  const textBody = [
    `New support ticket #${ref}`,
    `Open ticket: ${url}`,
    "",
    `Category: ${category}`,
    `Subject: ${opts.subject}`,
    "",
    opts.description,
    "",
    ...details.map(([k, v]) => `${k}: ${v}`),
    ...(errors.length ? ["", "Recent errors:", ...errors.map((m) => `• ${m}`)] : []),
  ].join("\n");

  await Promise.all(
    recipients.map(async (to) => {
      const result = await sendPostmarkEmail({
        to,
        subject,
        htmlBody,
        textBody,
        replyTo: opts.account_email ?? null,
      });
      if (!result.ok) {
        console.error("[support/notify] email failed", to, result.error);
      }
    }),
  );
}
