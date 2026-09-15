import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { notifySupportTicket } from "@/lib/support/notify";
import {
  TEST_PLATFORMS,
  TEST_PLATFORM_LABEL,
  appTestingTicket,
} from "@/lib/support/app-testing";
import type { Json } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = [
  "technical",
  "billing",
  "feature_request",
  "account",
  "other",
  "app_testing",
] as const;

const PublicTicketSchema = z
  .object({
    category: z.enum(CATEGORIES),
    // A tester request doesn't ask for these; the route files its own.
    subject: z.string().trim().max(200).optional(),
    description: z.string().trim().max(5000).optional(),
    test_platform: z.enum(TEST_PLATFORMS).optional(),
    account_email: z.string().trim().email().max(200),
    account_name: z.string().trim().min(1).max(200),
    page_url: z.string().trim().max(2000).optional().nullable(),
    user_agent: z.string().trim().max(500).optional().nullable(),
    browser: z.string().trim().max(120).optional().nullable(),
    os: z.string().trim().max(120).optional().nullable(),
    viewport: z.string().trim().max(40).optional().nullable(),
  })
  .superRefine((t, ctx) => {
    if (t.category === "app_testing") {
      if (!t.test_platform) {
        ctx.addIssue({
          code: "custom",
          path: ["test_platform"],
          message: "Choose which app to test.",
        });
      }
      return;
    }
    if (!t.subject) {
      ctx.addIssue({ code: "custom", path: ["subject"], message: "Required." });
    }
    if (!t.description) {
      ctx.addIssue({
        code: "custom",
        path: ["description"],
        message: "Required.",
      });
    }
  });

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PublicTicketSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const t = parsed.data;

  const testing =
    t.category === "app_testing" && t.test_platform
      ? appTestingTicket(t.test_platform, t.account_name, t.account_email)
      : null;
  const subject = testing?.subject ?? t.subject ?? "";
  const description = testing?.description ?? t.description ?? "";
  const metadata =
    testing && t.test_platform
      ? { "Test platform": TEST_PLATFORM_LABEL[t.test_platform] }
      : {};

  const supabase = getAdminSupabase();
  const { data: row, error } = await supabase
    .from("support_tickets")
    .insert({
      category: t.category,
      subject,
      description,
      account_email: t.account_email,
      account_name: t.account_name,
      account_metadata: metadata as Json,
      page_url: t.page_url ?? null,
      user_agent: t.user_agent ?? null,
      browser: t.browser ?? null,
      os: t.os ?? null,
      viewport: t.viewport ?? null,
      console_errors: [],
      source: "docs",
    })
    .select("id")
    .single();

  if (error || !row) {
    return NextResponse.json(
      { error: error?.message ?? "Could not create ticket" },
      { status: 500 },
    );
  }

  await notifySupportTicket({
    ticket_id: row.id,
    category: t.category,
    subject,
    description,
    account_email: t.account_email,
    account_name: t.account_name,
    page_url: t.page_url,
    browser: t.browser,
    os: t.os,
    viewport: t.viewport,
    source: "docs",
  });

  return NextResponse.json({ ok: true, id: row.id });
}
