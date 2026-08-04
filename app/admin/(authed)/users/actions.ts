"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { normaliseEmail } from "@/lib/admin/allowlist";
import { inviteAdminUser, removeAdminUser } from "@/lib/admin/users";

const EmailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254)
  .email("That doesn't look like an email address");

export type AdminUserFormState = {
  error?: string;
  success?: string;
  /** Shown only when the invite email failed, so the password isn't lost. */
  tempPassword?: string;
};

export async function inviteAdminAction(
  _prev: AdminUserFormState | null,
  formData: FormData,
): Promise<AdminUserFormState> {
  const actor = await requireAdminUser();

  const parsed = EmailSchema.safeParse(formData.get("email") ?? "");
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }
  const email = normaliseEmail(parsed.data);

  try {
    const result = await inviteAdminUser({ email, invitedBy: actor.email });
    revalidatePath("/admin/users");

    if (!result.emailed) {
      return {
        error: `Added ${email}, but the invite email failed to send${
          result.emailError ? ` (${result.emailError})` : ""
        }. Send them this temporary password yourself:`,
        tempPassword: result.tempPassword ?? undefined,
      };
    }
    return { success: `Invited ${email} — a temporary password is on its way.` };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not add that admin",
    };
  }
}

export async function removeAdminAction(
  _prev: AdminUserFormState | null,
  formData: FormData,
): Promise<AdminUserFormState> {
  const actor = await requireAdminUser();
  const email = normaliseEmail(String(formData.get("email") ?? ""));

  if (!email) return { error: "Email is required" };
  if (email === normaliseEmail(actor.email)) {
    return { error: "You can't remove your own access." };
  }

  try {
    await removeAdminUser(email);
    revalidatePath("/admin/users");
    return { success: `Removed ${email}.` };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not remove that admin",
    };
  }
}
