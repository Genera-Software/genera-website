"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import { deleteFromBucket, uploadToBucket } from "@/lib/admin/upload";

type StoryUpdate = Database["public"]["Tables"]["story_timeline"]["Update"];

const FormSchema = z.object({
  year: z.string().trim().min(1, "Year is required").max(40),
  body: z.string().trim().min(1, "Description is required").max(600),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_visible: z.coerce.boolean().default(true),
  remove_image: z.coerce.boolean().default(false),
});

function parseFormData(fd: FormData) {
  return FormSchema.parse({
    year: fd.get("year") ?? "",
    body: fd.get("body") ?? "",
    sort_order: fd.get("sort_order") ?? 0,
    is_visible: fd.get("is_visible") === "on" || fd.get("is_visible") === "true",
    remove_image:
      fd.get("remove_image") === "on" || fd.get("remove_image") === "true",
  });
}

function revalidatePublic() {
  revalidatePath("/our-story");
}

export async function createStoryEntry(formData: FormData) {
  const data = parseFormData(formData);
  const file = formData.get("image_file");
  let image_url: string | null = null;
  if (file instanceof File && file.size > 0) {
    image_url = await uploadToBucket(file, "story-images");
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase.from("story_timeline").insert({
    year: data.year,
    body: data.body,
    sort_order: data.sort_order,
    is_visible: data.is_visible,
    image_url,
  });
  if (error) throw new Error(error.message);

  revalidatePublic();
  redirect("/admin/our-story");
}

export async function updateStoryEntry(id: string, formData: FormData) {
  const data = parseFormData(formData);
  const supabase = getAdminSupabase();

  const { data: existing } = await supabase
    .from("story_timeline")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const file = formData.get("image_file");
  let image_url: string | null | undefined = undefined;
  if (file instanceof File && file.size > 0) {
    image_url = await uploadToBucket(file, "story-images");
    if (existing?.image_url) {
      await deleteFromBucket(existing.image_url, "story-images");
    }
  } else if (data.remove_image && existing?.image_url) {
    await deleteFromBucket(existing.image_url, "story-images");
    image_url = null;
  }

  const update: StoryUpdate = {
    year: data.year,
    body: data.body,
    sort_order: data.sort_order,
    is_visible: data.is_visible,
  };
  if (image_url !== undefined) update.image_url = image_url;

  const { error } = await supabase
    .from("story_timeline")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePublic();
  redirect("/admin/our-story");
}

export async function deleteStoryEntry(id: string) {
  const supabase = getAdminSupabase();
  const { data: existing } = await supabase
    .from("story_timeline")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("story_timeline").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (existing?.image_url) {
    await deleteFromBucket(existing.image_url, "story-images");
  }

  revalidatePublic();
  revalidatePath("/admin/our-story");
}

export async function moveStoryEntry(id: string, direction: "up" | "down") {
  const supabase = getAdminSupabase();
  const { data: row } = await supabase
    .from("story_timeline")
    .select("id, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!row) return;

  const neighborQuery = supabase
    .from("story_timeline")
    .select("id, sort_order");
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
    .from("story_timeline")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", row.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await supabase
    .from("story_timeline")
    .update({ sort_order: row.sort_order })
    .eq("id", neighbor.id);
  if (e2) throw new Error(e2.message);

  revalidatePublic();
  revalidatePath("/admin/our-story");
}
