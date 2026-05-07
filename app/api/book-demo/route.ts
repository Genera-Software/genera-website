import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  daycareName?: string;
  daycareSize?: string;
  currentSoftware?: string;
  bestTime?: string;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim();
  const email = (body.email ?? "").toString().trim();
  const daycareName = (body.daycareName ?? "").toString().trim();
  const daycareSize = (body.daycareSize ?? "").toString().trim();
  const currentSoftware = (body.currentSoftware ?? "").toString().trim();
  const bestTime = (body.bestTime ?? "").toString().trim();

  if (!name || !email || !daycareName) {
    return NextResponse.json(
      { error: "Name, email and daycare name are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email looks off." }, { status: 400 });
  }

  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured." },
      { status: 500 },
    );
  }

  const fromEmail = process.env.POSTMARK_FROM_EMAIL ?? "info@generasoftware.com";
  const toEmail = process.env.POSTMARK_TO_EMAIL ?? "info@generasoftware.com";
  const messageStream = process.env.POSTMARK_MESSAGE_STREAM ?? "outbound";

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Daycare name", daycareName],
    ["Dogs per day", daycareSize || "—"],
    ["Current software", currentSoftware || "—"],
    ["Best time to demo", bestTime || "—"],
  ];

  const htmlBody = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#F8FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 6px 24px rgba(0,62,69,0.08);">
    <h2 style="margin:0 0 6px;color:#003E45;font-family:Poppins,sans-serif;">New demo request</h2>
    <p style="margin:0 0 20px;color:#4B5563;font-size:14px;">From generasoftware.com</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows
        .map(
          ([k, v]) => `
        <tr>
          <td style="padding:10px 12px;background:#F8FAFB;border:1px solid #EEF4F5;font-weight:600;width:180px;vertical-align:top;color:#003E45;">${escapeHtml(k)}</td>
          <td style="padding:10px 12px;border:1px solid #EEF4F5;color:#111827;">${escapeHtml(v)}</td>
        </tr>`,
        )
        .join("")}
    </table>
    <p style="margin:22px 0 0;color:#4B5563;font-size:13px;">Reply directly to reach <strong>${escapeHtml(name)}</strong> at ${escapeHtml(email)}.</p>
  </div>
</body></html>`;

  const textBody = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": apiKey,
    },
    body: JSON.stringify({
      From: fromEmail,
      To: toEmail,
      ReplyTo: email,
      Subject: `New demo request — ${daycareName}`,
      HtmlBody: htmlBody,
      TextBody: textBody,
      MessageStream: messageStream,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("Postmark error", res.status, errText);
    return NextResponse.json(
      { error: "Could not send email. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
