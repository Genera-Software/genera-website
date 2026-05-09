import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { deliverEmail } from "@/lib/forms/delivery";
import type { Json } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = [
  "technical",
  "billing",
  "feature_request",
  "account",
  "other",
] as const;

const TicketSchema = z.object({
  category: z.enum(CATEGORIES).default("other"),
  subject: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),

  account_id: z.string().trim().max(120).optional().nullable(),
  account_email: z
    .string()
    .trim()
    .email()
    .max(200)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  account_name: z.string().trim().max(200).optional().nullable(),
  account_metadata: z.record(z.string(), z.unknown()).optional(),

  page_url: z.string().trim().max(2000).optional().nullable(),
  app_version: z.string().trim().max(120).optional().nullable(),
  user_agent: z.string().trim().max(500).optional().nullable(),
  browser: z.string().trim().max(120).optional().nullable(),
  os: z.string().trim().max(120).optional().nullable(),
  viewport: z.string().trim().max(40).optional().nullable(),
  console_errors: z
    .array(
      z.object({
        message: z.string().max(2000),
        source: z.string().max(500).optional(),
        line: z.number().optional(),
        column: z.number().optional(),
        stack: z.string().max(4000).optional(),
        timestamp: z.string().optional(),
      }),
    )
    .max(20)
    .optional(),

  source: z.string().trim().max(40).optional(),
});

function categoryLabel(c: string) {
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

export async function POST(req: NextRequest) {
  // Auth: shared secret bearer token
  const expected = process.env.SUPPORT_INGEST_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 },
    );
  }
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = TicketSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const t = parsed.data;

  const supabase = getAdminSupabase();
  const { data: row, error } = await supabase
    .from("support_tickets")
    .insert({
      category: t.category,
      subject: t.subject,
      description: t.description,
      account_id: t.account_id ?? null,
      account_email: t.account_email ?? null,
      account_name: t.account_name ?? null,
      account_metadata: (t.account_metadata ?? {}) as Json,
      page_url: t.page_url ?? null,
      app_version: t.app_version ?? null,
      user_agent: t.user_agent ?? null,
      browser: t.browser ?? null,
      os: t.os ?? null,
      viewport: t.viewport ?? null,
      console_errors: t.console_errors ?? [],
      source: t.source ?? "app",
    })
    .select("id")
    .single();

  if (error || !row) {
    return NextResponse.json(
      { error: error?.message ?? "Could not create ticket" },
      { status: 500 },
    );
  }

  const notifyTo = process.env.SUPPORT_NOTIFY_EMAIL;
  if (notifyTo) {
    const rows: [string, string][] = [
      ["Category", categoryLabel(t.category)],
      ["Subject", t.subject],
      ["Description", t.description],
    ];
    if (t.account_email) rows.push(["Account email", t.account_email]);
    if (t.account_name) rows.push(["Account name", t.account_name]);
    if (t.account_id) rows.push(["Account ID", t.account_id]);
    if (t.page_url) rows.push(["Page", t.page_url]);
    if (t.app_version) rows.push(["App version", t.app_version]);
    if (t.browser || t.os) {
      rows.push(["Browser / OS", `${t.browser ?? "?"} on ${t.os ?? "?"}`]);
    }
    if (t.viewport) rows.push(["Viewport", t.viewport]);
    if (t.console_errors?.length) {
      rows.push([
        "Recent errors",
        t.console_errors
          .slice(0, 5)
          .map((e) => `• ${e.message}`)
          .join("\n"),
      ]);
    }

    await deliverEmail({
      to: notifyTo,
      subject: `New support ticket — ${categoryLabel(t.category)}: ${t.subject}`,
      formName: "Support",
      rows,
      replyTo: t.account_email ?? null,
    });
  }

  return NextResponse.json({ ok: true, id: row.id });
}
