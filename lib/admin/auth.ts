import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";
import { isAllowedAdminEmail } from "./allowlist";

export const MUST_CHANGE_PASSWORD_CLAIM = "must_change_password";

export type AdminUser = {
  id: string;
  email: string;
  /** Signed in with an emailed temporary password and hasn't replaced it yet. */
  mustChangePassword: boolean;
};

/**
 * Supabase Auth client bound to the request's cookie jar. Use in Server
 * Components, Server Actions and Route Handlers.
 */
export async function getAdminAuthClient() {
  const cookieStore = await cookies();
  return createSupabaseAuthClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      try {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      } catch {
        // Server Components cannot write cookies. The middleware already
        // refreshed the session on this request, so this is safe to ignore.
      }
    },
  });
}

/**
 * The signed-in admin, or null. Verifies the session against Supabase (not just
 * the cookie) and re-checks the `admin_users` allowlist, so this is the
 * authoritative check even though the middleware runs first.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await getAdminAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) return null;
  if (!(await isAllowedAdminEmail(user.email))) return null;

  return {
    id: user.id,
    email: user.email,
    // app_metadata is service-role-only, so this flag cannot be cleared by the
    // user themselves — only by completing the password change.
    mustChangePassword: user.app_metadata?.[MUST_CHANGE_PASSWORD_CLAIM] === true,
  };
}

export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
