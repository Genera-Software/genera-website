"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { isAllowedAdminEmail, normaliseEmail } from "@/lib/admin/allowlist";
import { requireAdminUser } from "@/lib/admin/auth";
import { notifySupportTicket } from "@/lib/support/notify";
import { startTicketAnalysis } from "@/lib/support/ai-analysis";
import { sendTicketReply } from "@/lib/support/thread";
import { MANUAL_PAGE_URL } from "@/lib/support/manual";

const STATUSES = ["new", "in_progress", "completed"] as const;
const CATEGORIES = [
  "technical",
  "billing",
  "feature_request",
  "account",
  "other",
] as const;
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
const StatusSchema = z.enum(STATUSES);
const PrioritySchema = z.enum(PRIORITIES);

const NewTicketSchema = z.object({
  category: z.enum(CATEGORIES).default("other"),
  subject: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  account_email: z
    .string()
    .trim()
    .max(200)
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine(
      (v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Invalid email",
    ),
  account_name: z
    .string()
    .trim()
    .max(200)
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  // Manual tickets arrive by phone or email, so there is usually no page to
  // record. "Admin" (rather than null) marks them as logged from this console —
  // an empty Page cell used to read as a widget submission that lost its data.
  page_url: z
    .string()
    .trim()
    .max(2000)
    .or(z.literal(""))
    .transform((v) => (v === "" ? MANUAL_PAGE_URL : v)),
  status: z.enum(STATUSES).default("new"),
  priority: z.enum(PRIORITIES).default("medium"),
});

const NotifyEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(200)
    .transform((v) => v.toLowerCase()),
  label: z
    .string()
    .trim()
    .max(120)
    .or(z.literal(""))
    .transform((v) => v),
});

export async function createTicket(formData: FormData) {
  // Who logged it. Every route into this action is already behind the admin
  // layout, so this is a lookup rather than a new gate — it just gives the
  // ticket an owner instead of an anonymous blank row.
  const currentUser = await requireAdminUser();

  const data = NewTicketSchema.parse({
    category: formData.get("category") ?? "other",
    subject: formData.get("subject") ?? "",
    description: formData.get("description") ?? "",
    account_email: formData.get("account_email") ?? "",
    account_name: formData.get("account_name") ?? "",
    page_url: formData.get("page_url") ?? "",
    status: formData.get("status") ?? "new",
    priority: formData.get("priority") ?? "medium",
  });

  const supabase = getAdminSupabase();
  const { data: row, error } = await supabase
    .from("support_tickets")
    .insert({
      category: data.category,
      subject: data.subject,
      description: data.description,
      account_email: data.account_email,
      account_name: data.account_name,
      page_url: data.page_url,
      status: data.status,
      priority: data.priority,
      source: "manual",
      created_by: currentUser.email,
    })
    .select("id")
    .single();
  if (error || !row) throw new Error(error?.message ?? "Could not create ticket");

  await notifySupportTicket({
    category: data.category,
    subject: data.subject,
    description: data.description,
    account_email: data.account_email,
    account_name: data.account_name,
    page_url: data.page_url,
    source: "manual",
  });

  revalidatePath("/admin/support");
  redirect(`/admin/support/${row.id}`);
}

export async function addNotifyEmail(formData: FormData) {
  const data = NotifyEmailSchema.parse({
    email: formData.get("email") ?? "",
    label: formData.get("label") ?? "",
  });

  const supabase = getAdminSupabase();
  const { error } = await supabase.from("support_notify_emails").insert({
    email: data.email,
    label: data.label,
  });
  if (error) {
    if (error.code === "23505") {
      throw new Error("That email is already on the list.");
    }
    throw new Error(error.message);
  }
  revalidatePath("/admin/support");
}

export async function removeNotifyEmail(id: string) {
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("support_notify_emails")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/support");
}

export async function replyToTicket(id: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("Reply cannot be empty.");
  if (body.length > 10_000) throw new Error("Reply is too long.");

  const supabase = getAdminSupabase();
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id, subject, status, account_email")
    .eq("id", id)
    .maybeSingle();
  if (!ticket) throw new Error("Ticket not found.");
  if (!ticket.account_email) {
    throw new Error("This ticket has no customer email to reply to.");
  }

  const result = await sendTicketReply({
    ticketId: ticket.id,
    ticketSubject: ticket.subject,
    to: ticket.account_email,
    body,
  });

  // Replying implies we're on it — but never walk back a completed ticket.
  if (ticket.status === "new") {
    await supabase
      .from("support_tickets")
      .update({ status: "in_progress" })
      .eq("id", id);
  }

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);

  if (!result.ok) {
    throw new Error(`Reply could not be sent: ${result.error ?? "unknown error"}`);
  }
}

export async function setTicketStatus(id: string, status: string) {
  const parsed = StatusSchema.parse(status);
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: parsed })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/support");
  revalidatePath("/admin/support/board");
  revalidatePath(`/admin/support/${id}`);
}

export async function setTicketPriority(id: string, priority: string) {
  const parsed = PrioritySchema.parse(priority);
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("support_tickets")
    .update({ priority: parsed })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/support");
  revalidatePath("/admin/support/board");
  revalidatePath(`/admin/support/${id}`);
}

/**
 * Assign a ticket to an admin, or pass null to unassign. The email is checked
 * against the allowlist so a stale form can't park work on someone who no
 * longer has access.
 */
export async function setTicketAssignee(id: string, email: string | null) {
  const target = email ? normaliseEmail(email) : null;

  if (target && !(await isAllowedAdminEmail(target))) {
    throw new Error(`${target} is not an admin.`);
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("support_tickets")
    .update({ assigned_to: target })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
  revalidatePath("/admin/support/board");
  revalidatePath(`/admin/support/${id}`);
}

/** "Assign to me" — resolves the actor from the session rather than the form. */
export async function claimTicket(id: string) {
  const actor = await requireAdminUser();
  await setTicketAssignee(id, actor.email);
}

export async function updateInternalNotes(id: string, formData: FormData) {
  const notes = String(formData.get("internal_notes") ?? "").slice(0, 5000);
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("support_tickets")
    .update({ internal_notes: notes })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/support/${id}`);
}

/**
 * Ask Claude to diagnose this ticket against the app repo. Starts a Managed
 * Agents session and returns — the result is collected on a later page view.
 * Deliberately admin-triggered per ticket: each run costs real money.
 */
export async function askClaude(id: string) {
  await startTicketAnalysis(id);
  revalidatePath(`/admin/support/${id}`);
}

export async function deleteTicket(id: string) {
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("support_tickets")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/support");
  redirect("/admin/support");
}
