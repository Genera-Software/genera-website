import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;

  const supabase = getAdminSupabase();
  const { data: form } = await supabase
    .from("forms")
    .select(
      "id, slug, name, description, success_title, success_message, is_active",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!form || !form.is_active) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const { data: questions } = await supabase
    .from("form_questions")
    .select(
      "key, eyebrow, label, hint, type, placeholder, choices, is_optional, sort_order",
    )
    .eq("form_id", form.id)
    .order("sort_order", { ascending: true });

  return NextResponse.json({
    slug: form.slug,
    name: form.name,
    description: form.description,
    success: {
      title: form.success_title,
      message: form.success_message,
    },
    questions: (questions ?? []).map((q) => ({
      key: q.key,
      eyebrow: q.eyebrow,
      label: q.label,
      hint: q.hint,
      type: q.type,
      placeholder: q.placeholder,
      choices: Array.isArray(q.choices) ? q.choices : [],
      optional: q.is_optional,
    })),
  });
}
