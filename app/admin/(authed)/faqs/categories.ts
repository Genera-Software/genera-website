import { getAdminSupabase } from "@/lib/supabase/admin";

/**
 * Distinct categories currently in use, for the datalist on the FAQ form.
 * Free text by design — adding a new section is just typing a new name.
 */
export async function listFaqCategories(): Promise<string[]> {
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from("faqs")
    .select("category")
    .not("category", "is", null)
    .order("sort_order", { ascending: true });

  const seen = new Set<string>();
  for (const row of data ?? []) {
    const value = row.category?.trim();
    if (value) seen.add(value);
  }
  return [...seen];
}
