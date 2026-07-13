import "server-only";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { deliverEmail } from "@/lib/forms/delivery";

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

export async function notifySupportTicket(opts: {
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

  const rows: [string, string][] = [
    ["Category", categoryLabel(opts.category)],
    ["Subject", opts.subject],
    ["Description", opts.description],
  ];
  if (opts.account_name) rows.push(["Name", opts.account_name]);
  if (opts.account_email) rows.push(["Email", opts.account_email]);
  if (opts.account_id) rows.push(["Account ID", opts.account_id]);
  if (opts.page_url) rows.push(["Page", opts.page_url]);
  if (opts.app_version) rows.push(["App version", opts.app_version]);
  if (opts.browser || opts.os) {
    rows.push(["Browser / OS", `${opts.browser ?? "?"} on ${opts.os ?? "?"}`]);
  }
  if (opts.viewport) rows.push(["Viewport", opts.viewport]);
  if (opts.source) rows.push(["Source", opts.source]);
  if (opts.console_errors?.length) {
    rows.push([
      "Recent errors",
      opts.console_errors
        .slice(0, 5)
        .map((e) => `• ${e.message}`)
        .join("\n"),
    ]);
  }

  await Promise.all(
    recipients.map((to) =>
      deliverEmail({
        to,
        subject: `New support ticket — ${categoryLabel(opts.category)}: ${opts.subject}`,
        formName: "Support",
        rows,
        replyTo: opts.account_email ?? null,
      }),
    ),
  );
}
