"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import { deleteFromBucket, uploadToBucket } from "@/lib/admin/upload";

type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"];

const BUCKET = "website-images";
const FOLDER = "testimonials";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const FormSchema = z.object({
  quote: z.string().trim().min(1, "Quote is required").max(800, "Keep the quote under 800 characters"),
  name: z.string().trim().min(1, "Name is required").max(80),
  role: optionalText(80),
  business: z.string().trim().min(1, "Business is required").max(120),
  // Accept links pasted without the scheme (instagram.com/reel/…).
  video_url: z
    .string()
    .trim()
    .max(500)
    .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
    .refine((v) => {
      if (!v) return true;
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, "That video link doesn't look like a valid URL.")
    .transform((v) => v || null),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_visible: z.boolean(),
  remove_image: z.boolean(),
});

function parseFormData(fd: FormData) {
  const checked = (key: string) => fd.get(key) === "on" || fd.get(key) === "true";
  const result = FormSchema.safeParse({
    quote: fd.get("quote") ?? "",
    name: fd.get("name") ?? "",
    role: fd.get("role") ?? "",
    business: fd.get("business") ?? "",
    video_url: fd.get("video_url") ?? "",
    sort_order: fd.get("sort_order") ?? 0,
    is_visible: checked("is_visible"),
    remove_image: checked("remove_image"),
  });
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Please check the form.");
  }
  return result.data;
}

function revalidatePublic() {
  revalidatePath("/", "layout");
}

export async function createTestimonial(formData: FormData) {
  const data = parseFormData(formData);
  const file = formData.get("image_file");
  let image_url: string | null = null;
  if (file instanceof File && file.size > 0) {
    image_url = await uploadToBucket(file, BUCKET, FOLDER);
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase.from("testimonials").insert({
    quote: data.quote,
    name: data.name,
    role: data.role,
    business: data.business,
    video_url: data.video_url,
    sort_order: data.sort_order,
    is_visible: data.is_visible,
    image_url,
  });
  if (error) throw new Error(error.message);

  revalidatePublic();
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const data = parseFormData(formData);
  const supabase = getAdminSupabase();

  const { data: existing } = await supabase
    .from("testimonials")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  // deleteFromBucket ignores URLs outside the bucket (e.g. /images/… in
  // /public), so a seeded photo is never touched.
  const file = formData.get("image_file");
  let image_url: string | null | undefined = undefined;
  if (file instanceof File && file.size > 0) {
    image_url = await uploadToBucket(file, BUCKET, FOLDER);
    if (existing?.image_url) {
      await deleteFromBucket(existing.image_url, BUCKET);
    }
  } else if (data.remove_image && existing?.image_url) {
    await deleteFromBucket(existing.image_url, BUCKET);
    image_url = null;
  }

  const update: TestimonialUpdate = {
    quote: data.quote,
    name: data.name,
    role: data.role,
    business: data.business,
    video_url: data.video_url,
    sort_order: data.sort_order,
    is_visible: data.is_visible,
  };
  if (image_url !== undefined) update.image_url = image_url;

  const { error } = await supabase.from("testimonials").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePublic();
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = getAdminSupabase();
  const { data: existing } = await supabase
    .from("testimonials")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (existing?.image_url) {
    await deleteFromBucket(existing.image_url, BUCKET);
  }

  revalidatePublic();
  revalidatePath("/admin/testimonials");
}

export async function moveTestimonial(id: string, direction: "up" | "down") {
  const supabase = getAdminSupabase();
  const { data: row } = await supabase
    .from("testimonials")
    .select("id, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!row) return;

  const neighborQuery = supabase.from("testimonials").select("id, sort_order");
  const { data: neighbor } =
    direction === "up"
      ? await neighborQuery
          .lt("sort_order", row.sort_order)
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle()
      : await neighborQuery
          .gt("sort_order", row.sort_order)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle();

  if (!neighbor) return;

  const { error: e1 } = await supabase
    .from("testimonials")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", row.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await supabase
    .from("testimonials")
    .update({ sort_order: row.sort_order })
    .eq("id", neighbor.id);
  if (e2) throw new Error(e2.message);

  revalidatePublic();
  revalidatePath("/admin/testimonials");
}
