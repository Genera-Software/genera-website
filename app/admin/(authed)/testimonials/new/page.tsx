import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../_components/PageHeader";
import TestimonialForm from "../_components/TestimonialForm";
import { createTestimonial } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  // Default new entries to the end of the list so the up/down arrows have
  // distinct values to swap.
  const supabase = getAdminSupabase();
  const { data: last } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <PageHeader
        title="Add a testimonial"
        back={{ href: "/admin/testimonials", label: "Back to testimonials" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <TestimonialForm
          initial={{ sort_order: (last?.sort_order ?? 0) + 10 }}
          action={createTestimonial}
          submitLabel="Create testimonial"
        />
      </div>
    </div>
  );
}
