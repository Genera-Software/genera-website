"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import { deleteFromBucket, uploadToBucket } from "@/lib/admin/upload";

type LogoUpdate = Database["public"]["Tables"]["trust_logos"]["Update"];

const FormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_visible: z.coerce.boolean().default(true),
  remove_logo: z.coerce.boolean().default(false),
});

function parseFormData(fd: FormData) {
  return FormSchema.parse({
    name: fd.get("name") ?? "",
    sort_order: fd.get("sort_order") ?? 0,
    is_visible: fd.get("is_visible") === "on" || fd.get("is_visible") === "true",
    remove_logo: fd.get("remove_logo") === "on" || fd.get("remove_logo") === "true",
  });
}

function revalidatePublic() {
  revalidatePath("/", "layout");
}

export async function createLogo(formData: FormData) {
  const data = parseFormData(formData);
  const file = formData.get("logo_file");
  let logo_url: string | null = null;
  if (file instanceof File && file.size > 0) {
    logo_url = await uploadToBucket(file, "logos");
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase.from("trust_logos").insert({
    name: data.name,
    sort_order: data.sort_order,
    is_visible: data.is_visible,
    logo_url,
  });
  if (error) throw new Error(error.message);

  revalidatePublic();
  redirect("/admin/logos");
}

export async function updateLogo(id: string, formData: FormData) {
  const data = parseFormData(formData);
  const supabase = getAdminSupabase();

  const { data: existing } = await supabase
    .from("trust_logos")
    .select("logo_url")
    .eq("id", id)
    .maybeSingle();

  const file = formData.get("logo_file");
  let logo_url: string | null | undefined = undefined;
  if (file instanceof File && file.size > 0) {
    logo_url = await uploadToBucket(file, "logos");
    if (existing?.logo_url) {
      await deleteFromBucket(existing.logo_url, "logos");
    }
  } else if (data.remove_logo && existing?.logo_url) {
    await deleteFromBucket(existing.logo_url, "logos");
    logo_url = null;
  }

  const update: LogoUpdate = {
    name: data.name,
    sort_order: data.sort_order,
    is_visible: data.is_visible,
  };
  if (logo_url !== undefined) update.logo_url = logo_url;

  const { error } = await supabase.from("trust_logos").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePublic();
  redirect("/admin/logos");
}

export async function deleteLogo(id: string) {
  const supabase = getAdminSupabase();
  const { data: existing } = await supabase
    .from("trust_logos")
    .select("logo_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("trust_logos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (existing?.logo_url) {
    await deleteFromBucket(existing.logo_url, "logos");
  }

  revalidatePublic();
  revalidatePath("/admin/logos");
}

export async function moveLogo(id: string, direction: "up" | "down") {
  const supabase = getAdminSupabase();
  const { data: row } = await supabase
    .from("trust_logos")
    .select("id, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!row) return;

  const neighborQuery = supabase
    .from("trust_logos")
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
    .from("trust_logos")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", row.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await supabase
    .from("trust_logos")
    .update({ sort_order: row.sort_order })
    .eq("id", neighbor.id);
  if (e2) throw new Error(e2.message);

  revalidatePublic();
  revalidatePath("/admin/logos");
}
