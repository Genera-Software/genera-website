"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  verifyPassword,
} from "@/lib/admin/session";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const fromRaw = (formData.get("from") as string | null) ?? "/admin";
  const from = fromRaw.startsWith("/admin") ? fromRaw : "/admin";

  if (!password) {
    return { error: "Password is required" };
  }

  if (!verifyPassword(password)) {
    return { error: "Incorrect password" };
  }

  const { value, maxAge } = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  redirect(from);
}
