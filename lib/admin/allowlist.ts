import "server-only";
import { getAdminSupabase } from "@/lib/supabase/admin";

// The /admin allowlist lives in the `admin_users` table (see
// supabase/migrations/20260804120000_admin_users.sql) so it can be managed from
// the CMS without a redeploy. Membership is what grants access — a Supabase
// Auth account on its own is not enough.

export type AdminUserRow = {
  id: string;
  email: string;
  invited_by: string | null;
  created_at: string;
  last_invited_at: string | null;
};

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Server-side allowlist check using the service-role key. Fails closed: any
 * error reading the table denies access rather than granting it.
 */
export async function isAllowedAdminEmail(
  email: string | null | undefined,
): Promise<boolean> {
  if (!email) return false;
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", normaliseEmail(email))
      .maybeSingle();
    if (error) return false;
    return Boolean(data);
  } catch {
    return false;
  }
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, invited_by, created_at, last_invited_at")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminUserRow[];
}

export async function countAdminUsers(): Promise<number> {
  const supabase = getAdminSupabase();
  const { count, error } = await supabase
    .from("admin_users")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}
