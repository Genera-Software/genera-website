import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../_components/PageHeader";
import TestimonialForm from "../../_components/TestimonialForm";
import { updateTestimonial } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("id, quote, name, role, business, image_url, video_url, sort_order, is_visible")
    .eq("id", id)
    .maybeSingle();

  if (!testimonial) notFound();

  const updateAction = async (formData: FormData) => {
    "use server";
    await updateTestimonial(testimonial.id, formData);
  };

  return (
    <div>
      <PageHeader
        title="Edit testimonial"
        back={{ href: "/admin/testimonials", label: "Back to testimonials" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <TestimonialForm
          initial={testimonial}
          action={updateAction}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
