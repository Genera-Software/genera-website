import {
  createServerClient,
  type CookieMethodsServer,
} from "@supabase/ssr";
import type { Database } from "./types";

// Shared Supabase Auth client factory. Deliberately free of `server-only` and
// `next/headers` imports so the Edge middleware can use it too — the caller
// supplies the cookie adapter for its own runtime.
export function createSupabaseAuthClient(cookies: CookieMethodsServer) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars",
    );
  }
  return createServerClient<Database>(url, key, { cookies });
}
