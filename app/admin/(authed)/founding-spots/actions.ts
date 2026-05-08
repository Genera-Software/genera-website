"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";

const Schema = z
  .object({
    total_spots: z.coerce.number().int().min(1).max(10000),
    claimed_spots: z.coerce.number().int().min(0).max(10000),
  })
  .refine((d) => d.claimed_spots <= d.total_spots, {
    message: "Claimed spots cannot exceed total spots",
    path: ["claimed_spots"],
  });

export async function updateFoundingSpots(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const parsed = Schema.safeParse({
    total_spots: formData.get("total_spots"),
    claimed_spots: formData.get("claimed_spots"),
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue?.message ?? "Invalid input" };
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("founding_spots")
    .upsert(
      {
        id: 1,
        total_spots: parsed.data.total_spots,
        claimed_spots: parsed.data.claimed_spots,
      },
      { onConflict: "id" },
    );

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/founding-spots");
  return { success: true };
}
