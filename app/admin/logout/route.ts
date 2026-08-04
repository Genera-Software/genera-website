import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });

  const cookieStore = await cookies();
  // Cookie writes go straight onto the redirect response — anything written via
  // `cookies()` would be dropped when we return a response we built ourselves.
  const supabase = createSupabaseAuthClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet, headers) => {
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }
      for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value);
      }
    },
  });

  await supabase.auth.signOut();
  return response;
}
