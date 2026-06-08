"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { deliverWebhook } from "@/lib/forms/delivery";

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const KEY_RE = /^[a-zA-Z][a-zA-Z0-9_]*$/;

const META_KEY_RE = /^[a-zA-Z][a-zA-Z0-9_]*$/;

const FormSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(2)
      .max(60)
      .regex(SLUG_RE, "Slug: lowercase letters, digits, hyphens only"),
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(500).default(""),
    success_title: z.string().trim().min(1).max(120),
    success_message: z.string().trim().min(1).max(500),
    webhook_url: z
      .string()
      .trim()
      .url("Webhook URL must be a valid URL")
      .or(z.literal(""))
      .transform((v) => (v === "" ? null : v))
      .nullable(),
    webhook_secret: z
      .string()
      .trim()
      .max(200)
      .or(z.literal(""))
      .transform((v) => (v === "" ? null : v))
      .nullable(),
    webhook_meta_key: z.string().trim().max(60).default(""),
    webhook_meta_value: z.string().trim().max(200).default(""),
    notify_email: z
      .string()
      .trim()
      .email("Notify email must be a valid email")
      .or(z.literal(""))
      .transform((v) => (v === "" ? null : v))
      .nullable(),
    email_subject: z
      .string()
      .trim()
      .max(200)
      .or(z.literal(""))
      .transform((v) => (v === "" ? null : v))
      .nullable(),
    is_active: z.coerce.boolean().default(true),
  })
  .transform((v) => {
    const k = v.webhook_meta_key;
    const val = v.webhook_meta_value;
    let webhook_meta: Record<string, string> = {};
    if (k || val) {
      if (!k) throw new Error("Hidden field key is required when value is set.");
      if (!META_KEY_RE.test(k)) {
        throw new Error(
          "Hidden field key: starts with a letter, only letters/digits/underscore.",
        );
      }
      if (!val) throw new Error("Hidden field value is required when key is set.");
      webhook_meta = { [k]: val };
    }
    return {
      slug: v.slug,
      name: v.name,
      description: v.description,
      success_title: v.success_title,
      success_message: v.success_message,
      webhook_url: v.webhook_url,
      webhook_secret: v.webhook_secret,
      webhook_meta,
      notify_email: v.notify_email,
      email_subject: v.email_subject,
      is_active: v.is_active,
    };
  });

function parseForm(fd: FormData) {
  return FormSchema.parse({
    slug: fd.get("slug") ?? "",
    name: fd.get("name") ?? "",
    description: fd.get("description") ?? "",
    success_title: fd.get("success_title") ?? "Got it — thanks!",
    success_message:
      fd.get("success_message") ?? "We'll be in touch shortly.",
    webhook_url: fd.get("webhook_url") ?? "",
    webhook_secret: fd.get("webhook_secret") ?? "",
    webhook_meta_key: fd.get("webhook_meta_key") ?? "",
    webhook_meta_value: fd.get("webhook_meta_value") ?? "",
    notify_email: fd.get("notify_email") ?? "",
    email_subject: fd.get("email_subject") ?? "",
    is_active:
      fd.get("is_active") === "on" || fd.get("is_active") === "true",
  });
}

export async function createForm(formData: FormData) {
  const data = parseForm(formData);
  const supabase = getAdminSupabase();
  const { data: row, error } = await supabase
    .from("forms")
    .insert(data)
    .select("id")
    .single();
  if (error || !row) throw new Error(error?.message ?? "Could not create form");
  revalidatePath("/admin/forms");
  redirect(`/admin/forms/${row.id}/edit`);
}

export async function updateForm(id: string, formData: FormData) {
  const data = parseForm(formData);
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("forms").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/forms");
  revalidatePath(`/admin/forms/${id}/edit`);
}

export async function deleteForm(id: string) {
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("forms").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/forms");
  redirect("/admin/forms");
}

// ----- questions ----------------------------------------------------------

const QuestionSchema = z
  .object({
    key: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .regex(KEY_RE, "Key: starts with a letter, only letters/digits/underscore"),
    label: z.string().trim().min(1).max(300),
    eyebrow: z.string().trim().max(120).default(""),
    hint: z.string().trim().max(300).default(""),
    type: z.enum(["text", "email", "textarea", "choice"]),
    placeholder: z.string().trim().max(200).default(""),
    choices_text: z.string().default(""),
    is_optional: z.coerce.boolean().default(false),
    sort_order: z.coerce.number().int().min(0).max(100000).default(0),
  })
  .transform((v) => {
    const choices = v.choices_text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (v.type === "choice" && choices.length === 0) {
      throw new Error("Choice questions need at least one option.");
    }
    return {
      key: v.key,
      label: v.label,
      eyebrow: v.eyebrow,
      hint: v.hint,
      type: v.type,
      placeholder: v.placeholder,
      choices,
      is_optional: v.is_optional,
      sort_order: v.sort_order,
    };
  });

function parseQuestion(fd: FormData) {
  return QuestionSchema.parse({
    key: fd.get("key") ?? "",
    label: fd.get("label") ?? "",
    eyebrow: fd.get("eyebrow") ?? "",
    hint: fd.get("hint") ?? "",
    type: (fd.get("type") as string) ?? "text",
    placeholder: fd.get("placeholder") ?? "",
    choices_text: fd.get("choices_text") ?? "",
    is_optional:
      fd.get("is_optional") === "on" || fd.get("is_optional") === "true",
    sort_order: fd.get("sort_order") ?? 0,
  });
}

export async function createQuestion(formId: string, formData: FormData) {
  const data = parseQuestion(formData);
  const supabase = getAdminSupabase();

  let order = data.sort_order;
  if (!order) {
    const { data: last } = await supabase
      .from("form_questions")
      .select("sort_order")
      .eq("form_id", formId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    order = (last?.sort_order ?? 0) + 10;
  }

  const { error } = await supabase.from("form_questions").insert({
    form_id: formId,
    key: data.key,
    label: data.label,
    eyebrow: data.eyebrow,
    hint: data.hint,
    type: data.type,
    placeholder: data.placeholder,
    choices: data.choices,
    is_optional: data.is_optional,
    sort_order: order,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/forms/${formId}/edit`);
}

export async function updateQuestion(
  formId: string,
  questionId: string,
  formData: FormData,
) {
  const data = parseQuestion(formData);
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("form_questions")
    .update({
      key: data.key,
      label: data.label,
      eyebrow: data.eyebrow,
      hint: data.hint,
      type: data.type,
      placeholder: data.placeholder,
      choices: data.choices,
      is_optional: data.is_optional,
      sort_order: data.sort_order,
    })
    .eq("id", questionId)
    .eq("form_id", formId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/forms/${formId}/edit`);
  redirect(`/admin/forms/${formId}/edit`);
}

export async function deleteQuestion(formId: string, questionId: string) {
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("form_questions")
    .delete()
    .eq("id", questionId)
    .eq("form_id", formId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/forms/${formId}/edit`);
}

export async function moveQuestion(
  formId: string,
  questionId: string,
  direction: "up" | "down",
) {
  const supabase = getAdminSupabase();
  const { data: row } = await supabase
    .from("form_questions")
    .select("id, sort_order")
    .eq("id", questionId)
    .eq("form_id", formId)
    .maybeSingle();
  if (!row) return;

  const q = supabase
    .from("form_questions")
    .select("id, sort_order")
    .eq("form_id", formId);

  const { data: neighbor } =
    direction === "up"
      ? await q
          .lt("sort_order", row.sort_order)
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle()
      : await q
          .gt("sort_order", row.sort_order)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle();

  if (!neighbor) return;

  const tmp = row.sort_order + 1_000_000; // avoid unique-collision style issues if added later
  await supabase
    .from("form_questions")
    .update({ sort_order: tmp })
    .eq("id", row.id);
  await supabase
    .from("form_questions")
    .update({ sort_order: row.sort_order })
    .eq("id", neighbor.id);
  await supabase
    .from("form_questions")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", row.id);

  revalidatePath(`/admin/forms/${formId}/edit`);
}

// ----- submissions --------------------------------------------------------

export async function markSubmissionRead(
  formId: string,
  submissionId: string,
  read: boolean,
) {
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("form_submissions")
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq("id", submissionId)
    .eq("form_id", formId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/forms/${formId}/edit`);
  revalidatePath(`/admin/forms`);
}

export async function markAllSubmissionsRead(formId: string) {
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("form_submissions")
    .update({ read_at: new Date().toISOString() })
    .eq("form_id", formId)
    .is("read_at", null);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/forms/${formId}/edit`);
  revalidatePath(`/admin/forms`);
}

export async function deleteSubmission(formId: string, submissionId: string) {
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("form_submissions")
    .delete()
    .eq("id", submissionId)
    .eq("form_id", formId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/forms/${formId}/edit`);
}

// ----- webhook test -------------------------------------------------------

export async function testWebhook(
  formId: string,
): Promise<{ ok: boolean; message: string }> {
  const supabase = getAdminSupabase();
  const { data: form } = await supabase
    .from("forms")
    .select("slug, webhook_url, webhook_secret")
    .eq("id", formId)
    .maybeSingle();

  if (!form) return { ok: false, message: "Form not found" };
  if (!form.webhook_url) {
    return { ok: false, message: "No webhook URL configured." };
  }

  const result = await deliverWebhook({
    url: form.webhook_url,
    secret: form.webhook_secret,
    formSlug: form.slug,
    submissionId: `test-${Date.now()}`,
    payload: { test: true, message: "Test ping from Genera CMS." },
    test: true,
  });

  if (result.status === "sent") {
    return {
      ok: true,
      message: `OK — ${result.statusCode ?? ""} ${(result.response ?? "").slice(0, 200)}`.trim(),
    };
  }
  return {
    ok: false,
    message: `Failed${result.statusCode ? ` (${result.statusCode})` : ""}: ${
      result.response ?? "no response"
    }`.slice(0, 400),
  };
}
