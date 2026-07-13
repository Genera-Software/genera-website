"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { notifySupportTicket } from "@/lib/support/notify";

const STATUSES = ["new", "in_progress", "completed"] as const;
const CATEGORIES = [
  "technical",
  "billing",
  "feature_request",
  "account",
  "other",
] as const;
const StatusSchema = z.enum(STATUSES);

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
  page_url: z
    .string()
    .trim()
    .max(2000)
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  status: z.enum(STATUSES).default("new"),
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
  const data = NewTicketSchema.parse({
    category: formData.get("category") ?? "other",
    subject: formData.get("subject") ?? "",
    description: formData.get("description") ?? "",
    account_email: formData.get("account_email") ?? "",
    account_name: formData.get("account_name") ?? "",
    page_url: formData.get("page_url") ?? "",
    status: formData.get("status") ?? "new",
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
      source: "manual",
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

export async function setTicketStatus(id: string, status: string) {
  const parsed = StatusSchema.parse(status);
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: parsed })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
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
