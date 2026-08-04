"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminAuthClient, requireAdminUser } from "@/lib/admin/auth";
import { clearMustChangePassword } from "@/lib/admin/users";

const Schema = z
  .object({
    password: z
      .string()
      .min(12, "Use at least 12 characters")
      .max(200, "That's too long"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "The two passwords don't match",
    path: ["confirm"],
  });

export type ChangePasswordState = { error?: string };

export async function changePasswordAction(
  _prev: ChangePasswordState | null,
  formData: FormData,
): Promise<ChangePasswordState> {
  const user = await requireAdminUser();

  const parsed = Schema.safeParse({
    password: String(formData.get("password") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid password" };
  }

  const supabase = await getAdminAuthClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: error.message };
  }

  // Only now is the emailed temporary password out of play.
  await clearMustChangePassword(user.id);

  redirect("/admin");
}
