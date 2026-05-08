"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";

const Schema = z.object({
  question: z.string().trim().min(1, "Question is required").max(300),
  answer_html: z.string().default(""),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
  is_visible: z.coerce.boolean().default(true),
});

function parse(fd: FormData) {
  return Schema.parse({
    question: fd.get("question") ?? "",
    answer_html: fd.get("answer_html") ?? "",
    sort_order: fd.get("sort_order") ?? 0,
    is_visible:
      fd.get("is_visible") === "on" || fd.get("is_visible") === "true",
  });
}

function revalidatePublic() {
  revalidatePath("/faqs");
  revalidatePath("/admin/faqs");
}

export async function createFaq(formData: FormData) {
  const data = parse(formData);
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("faqs").insert(data);
  if (error) throw new Error(error.message);
  revalidatePublic();
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, formData: FormData) {
  const data = parse(formData);
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("faqs").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic();
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic();
}

export async function moveFaq(id: string, direction: "up" | "down") {
  const supabase = getAdminSupabase();
  const { data: row } = await supabase
    .from("faqs")
    .select("id, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!row) return;

  const q = supabase.from("faqs").select("id, sort_order");
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

  const { error: e1 } = await supabase
    .from("faqs")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", row.id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await supabase
    .from("faqs")
    .update({ sort_order: row.sort_order })
    .eq("id", neighbor.id);
  if (e2) throw new Error(e2.message);

  revalidatePublic();
}
