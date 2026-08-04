import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";

export type MiddlewareSession = {
  email: string | null;
  /** On the `admin_users` allowlist. */
  allowed: boolean;
  /** Still on an emailed temporary password. */
  mustChangePassword: boolean;
  response: NextResponse;
};

/**
 * Reads (and refreshes, if needed) the Supabase session for an incoming
 * request. Returns the response the refreshed auth cookies were written to —
 * callers MUST either return it or copy its cookies onto whatever response they
 * return instead, otherwise refreshed tokens are dropped and the user is logged
 * out at random.
 *
 * The allowlist check goes through the `is_current_user_admin()` RPC rather
 * than reading `admin_users` directly: the Edge runtime has no business holding
 * the service-role key, and the function only ever answers for the calling
 * JWT — it cannot be used to probe other addresses or read the list.
 */
export async function readAdminSession(
  request: NextRequest,
): Promise<MiddlewareSession> {
  let response = NextResponse.next({ request });

  const supabase = createSupabaseAuthClient({
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet, headers) => {
      for (const { name, value } of cookiesToSet) {
        request.cookies.set(name, value);
      }
      response = NextResponse.next({ request });
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }
      // Responses that set auth cookies must never be cached by a CDN.
      for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value);
      }
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      email: null,
      allowed: false,
      mustChangePassword: false,
      response,
    };
  }

  const { data: isAdmin, error } = await supabase.rpc("is_current_user_admin");

  return {
    email: user.email,
    allowed: !error && isAdmin === true,
    mustChangePassword: user.app_metadata?.must_change_password === true,
    response,
  };
}

/** Carries auth cookies from `source` onto a redirect/error response. */
export function withAuthCookies(
  target: NextResponse,
  source: NextResponse,
): NextResponse {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  return target;
}
