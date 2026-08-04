import { getAdminSupabase } from "@/lib/supabase/admin";

/** Whether a public form is live. Forms have RLS with no anon policy, so this
    goes through the admin client — server components only. */
export async function isFormActive(slug: string): Promise<boolean> {
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from("forms")
    .select("is_active")
    .eq("slug", slug)
    .maybeSingle();
  return Boolean(data?.is_active);
}
