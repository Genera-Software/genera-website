import "server-only";
import crypto from "node:crypto";

export type WebhookResult = {
  status: "sent" | "failed" | "skipped";
  statusCode: number | null;
  response: string | null;
};

export type EmailResult = {
  status: "sent" | "failed" | "skipped";
  response: string | null;
};

export function signPayload(secret: string, body: string): string {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export async function deliverWebhook(opts: {
  url: string | null | undefined;
  secret: string | null | undefined;
  formSlug: string;
  submissionId: string;
  payload: Record<string, unknown>;
  test?: boolean;
}): Promise<WebhookResult> {
  if (!opts.url) {
    return { status: "skipped", statusCode: null, response: null };
  }

  const body = JSON.stringify({
    form: opts.formSlug,
    submission_id: opts.submissionId,
    test: Boolean(opts.test),
    submitted_at: new Date().toISOString(),
    data: opts.payload,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Genera-Webhook/1.0",
    "X-Genera-Form": opts.formSlug,
    "X-Genera-Submission-Id": opts.submissionId,
  };

  if (opts.secret) {
    headers["X-Genera-Signature"] = `sha256=${signPayload(opts.secret, body)}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(opts.url, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });
    const text = await res.text().catch(() => "");
    return {
      status: res.ok ? "sent" : "failed",
      statusCode: res.status,
      response: text.slice(0, 2000),
    };
  } catch (err) {
    return {
      status: "failed",
      statusCode: null,
      response: err instanceof Error ? err.message : "Network error",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type PostmarkSendResult = {
  ok: boolean;
  messageId: string | null;
  error: string | null;
};

/**
 * Low-level Postmark send. Callers own the body markup; `deliverEmail` and the
 * support ticket thread both build on this.
 */
export async function sendPostmarkEmail(opts: {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  from?: string | null;
  replyTo?: string | null;
  headers?: Record<string, string>;
}): Promise<PostmarkSendResult> {
  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    return { ok: false, messageId: null, error: "POSTMARK_API_KEY not set" };
  }

  try {
    const res = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": apiKey,
      },
      body: JSON.stringify({
        From: opts.from || process.env.POSTMARK_FROM_EMAIL || "info@generasoftware.com",
        To: opts.to,
        ReplyTo: opts.replyTo || undefined,
        Subject: opts.subject,
        HtmlBody: opts.htmlBody,
        TextBody: opts.textBody,
        MessageStream: process.env.POSTMARK_MESSAGE_STREAM ?? "outbound",
        Headers: opts.headers
          ? Object.entries(opts.headers).map(([Name, Value]) => ({
              Name,
              Value,
            }))
          : undefined,
      }),
    });
    const json = (await res.json().catch(() => null)) as {
      MessageID?: string;
      Message?: string;
    } | null;
    if (!res.ok) {
      return {
        ok: false,
        messageId: null,
        error: (json?.Message ?? `Postmark returned ${res.status}`).slice(0, 2000),
      };
    }
    return { ok: true, messageId: json?.MessageID ?? null, error: null };
  } catch (err) {
    return {
      ok: false,
      messageId: null,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export async function deliverEmail(opts: {
  to: string | null | undefined;
  subject: string | null | undefined;
  formName: string;
  rows: [string, string][];
  replyTo?: string | null;
}): Promise<EmailResult> {
  if (!opts.to) {
    return { status: "skipped", response: null };
  }

  if (!process.env.POSTMARK_API_KEY) {
    return { status: "skipped", response: "POSTMARK_API_KEY not set" };
  }

  const subject = opts.subject?.trim() || `New ${opts.formName} submission`;

  const htmlBody = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#F8FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 6px 24px rgba(0,62,69,0.08);">
    <h2 style="margin:0 0 6px;color:#003E45;font-family:massilia,sans-serif;">${escapeHtml(subject)}</h2>
    <p style="margin:0 0 20px;color:#4B5563;font-size:14px;">From generasoftware.com — ${escapeHtml(opts.formName)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${opts.rows
        .map(
          ([k, v]) => `
        <tr>
          <td style="padding:10px 12px;background:#F8FAFB;border:1px solid #EEF4F5;font-weight:600;width:180px;vertical-align:top;color:#003E45;">${escapeHtml(k)}</td>
          <td style="padding:10px 12px;border:1px solid #EEF4F5;color:#111827;white-space:pre-wrap;">${escapeHtml(v)}</td>
        </tr>`,
        )
        .join("")}
    </table>
  </div>
</body></html>`;

  const textBody = opts.rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const result = await sendPostmarkEmail({
    to: opts.to,
    subject,
    htmlBody,
    textBody,
    replyTo: opts.replyTo,
  });

  return result.ok
    ? { status: "sent", response: null }
    : { status: "failed", response: result.error };
}
