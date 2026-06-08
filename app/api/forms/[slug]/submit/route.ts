import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { deliverEmail, deliverWebhook } from "@/lib/forms/delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;

  const supabase = getAdminSupabase();

  const { data: form } = await supabase
    .from("forms")
    .select(
      "id, slug, name, webhook_url, webhook_secret, webhook_meta, notify_email, email_subject, is_active",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!form || !form.is_active) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const { data: questions } = await supabase
    .from("form_questions")
    .select("key, label, type, is_optional, choices, sort_order")
    .eq("form_id", form.id)
    .order("sort_order", { ascending: true });

  const qs = questions ?? [];

  const cleaned: Record<string, string> = {};
  const rows: [string, string][] = [];
  let replyTo: string | null = null;

  for (const q of qs) {
    const v = String(body[q.key] ?? "").trim();

    if (!v) {
      if (!q.is_optional) {
        return NextResponse.json(
          { error: `${q.label} is required.` },
          { status: 400 },
        );
      }
    } else {
      if (q.type === "email" && !EMAIL_RE.test(v)) {
        return NextResponse.json(
          { error: `${q.label} doesn't look like an email.` },
          { status: 400 },
        );
      }
      if (q.type === "choice") {
        const choices = Array.isArray(q.choices) ? (q.choices as unknown[]) : [];
        if (choices.length && !choices.includes(v)) {
          return NextResponse.json(
            { error: `${q.label}: pick one of the listed options.` },
            { status: 400 },
          );
        }
      }
      if (q.type === "email" && !replyTo) replyTo = v;
    }

    cleaned[q.key] = v;
    rows.push([q.label, v || "—"]);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const ua = req.headers.get("user-agent");

  const meta =
    form.webhook_meta && typeof form.webhook_meta === "object" && !Array.isArray(form.webhook_meta)
      ? (form.webhook_meta as Record<string, unknown>)
      : {};
  const webhookPayload: Record<string, unknown> = { ...cleaned, ...meta };

  const { data: submission, error: insertErr } = await supabase
    .from("form_submissions")
    .insert({
      form_id: form.id,
      payload: cleaned,
      ip_address: ip,
      user_agent: ua,
      webhook_status: form.webhook_url ? "pending" : "skipped",
      email_status: form.notify_email ? "pending" : "skipped",
    })
    .select("id")
    .single();

  if (insertErr || !submission) {
    return NextResponse.json(
      { error: "Could not record submission." },
      { status: 500 },
    );
  }

  const [webhook, email] = await Promise.all([
    deliverWebhook({
      url: form.webhook_url,
      secret: form.webhook_secret,
      formSlug: form.slug,
      submissionId: submission.id,
      payload: webhookPayload,
    }),
    deliverEmail({
      to: form.notify_email,
      subject: form.email_subject,
      formName: form.name,
      rows,
      replyTo,
    }),
  ]);

  await supabase
    .from("form_submissions")
    .update({
      webhook_status: webhook.status,
      webhook_status_code: webhook.statusCode,
      webhook_response: webhook.response,
      webhook_attempted_at:
        webhook.status === "skipped" ? null : new Date().toISOString(),
      email_status: email.status,
      email_response: email.response,
    })
    .eq("id", submission.id);

  if (webhook.status === "failed" && email.status !== "sent") {
    return NextResponse.json(
      { error: "We saved your details but couldn't notify the team. Please email us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
