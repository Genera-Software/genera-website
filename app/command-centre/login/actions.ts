"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CCC_COOKIE_NAME,
  createSessionToken,
  verifyPassword,
} from "@/lib/command-centre/session";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = (formData.get("password") as string | null)?.trim() ?? "";
  const fromRaw = (formData.get("from") as string | null) ?? "/command-centre";
  const from = fromRaw.startsWith("/command-centre")
    ? fromRaw
    : "/command-centre";

  if (!password) {
    return { error: "Password is required" };
  }

  if (!verifyPassword(password)) {
    return { error: "Incorrect password" };
  }

  const { value, maxAge } = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(CCC_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  redirect(from);
}
