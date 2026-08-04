"use server";

import { redirect } from "next/navigation";
import {
  getAdminAuthClient,
  MUST_CHANGE_PASSWORD_CLAIM,
} from "@/lib/admin/auth";
import { isAllowedAdminEmail } from "@/lib/admin/allowlist";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const fromRaw = (formData.get("from") as string | null) ?? "/admin";
  const from = fromRaw.startsWith("/admin") ? fromRaw : "/admin";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await getAdminAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Incorrect email or password" };
  }

  // Valid Supabase credentials are not enough — the address has to be in the
  // admin_users table. Drop the session we just created if it isn't.
  if (!(await isAllowedAdminEmail(data.user.email))) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access" };
  }

  // Still on the temporary password we emailed them — send them to replace it.
  if (data.user.app_metadata?.[MUST_CHANGE_PASSWORD_CLAIM] === true) {
    redirect("/admin/account");
  }

  redirect(from);
}
