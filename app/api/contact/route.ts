import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deliverEmail } from "@/lib/forms/delivery";
import {
  CONTACT_TOPICS,
  CONTACT_TOPIC_KEYS,
  DOGS_PER_DAY,
  MESSAGE_MAX,
  MESSAGE_MIN,
} from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* The /contact page's form. Sent through Postmark to the team inbox
   (POSTMARK_TO_EMAIL, else info@) with Reply-To set to the sender, using
   the same message template as the CMS forms. */

const ContactSchema = z.object({
  topic: z.enum(CONTACT_TOPIC_KEYS),
  name: z.string().trim().min(1, "Please tell us your name.").max(120),
  email: z.string().trim().email("That email doesn't look quite right.").max(200),
  business: z.string().trim().max(160).optional(),
  size: z.union([z.enum(DOGS_PER_DAY), z.literal("")]).optional(),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, "Tell us a little more — a sentence or two is plenty.")
    .max(MESSAGE_MAX, "That's a long one — please keep it under 3,000 characters."),
  // Bot traps: a field people never see, and how long the form was open.
  website: z.string().optional(),
  startedAt: z.number().optional(),
});

/* Best-effort per-instance rate limit — enough to blunt a script hammering
   the form, without adding a store. */
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 },
    );
  }
  const c = parsed.data;

  // Filled the hidden field, or submitted faster than a person can type:
  // pretend it worked so the bot learns nothing.
  if (c.website || (c.startedAt && Date.now() - c.startedAt < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "That's a few messages in a row — please try again in a little while." },
      { status: 429 },
    );
  }

  const topic = CONTACT_TOPICS.find((t) => t.key === c.topic)!;
  const business = c.business?.trim() || "";

  const email = await deliverEmail({
    to: process.env.POSTMARK_TO_EMAIL ?? "info@generasoftware.com",
    subject: `${topic.label} — ${c.name}${business ? ` (${business})` : ""}`,
    formName: "Contact page",
    rows: [
      ["Topic", topic.label],
      ["Name", c.name],
      ["Email", c.email],
      ["Business", business || "—"],
      ["Dogs per day", c.size || "—"],
      ["Message", c.message],
    ],
    replyTo: c.email,
  });

  if (email.status !== "sent") {
    console.error("Contact form email not sent", email.status, email.response);
    return NextResponse.json(
      { error: "We couldn't send that just now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
