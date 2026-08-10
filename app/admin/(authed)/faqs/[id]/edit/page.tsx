import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../_components/PageHeader";
import FaqForm from "../../_components/FaqForm";
import { updateFaq } from "../../actions";
import { listFaqCategories } from "../../categories";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  const { data: faq } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!faq) notFound();

  const categories = await listFaqCategories();

  const updateAction = async (formData: FormData) => {
    "use server";
    await updateFaq(faq.id, formData);
  };

  return (
    <div>
      <PageHeader
        title="Edit FAQ"
        back={{ href: "/admin/faqs", label: "Back to FAQs" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <FaqForm
          initial={{
            question: faq.question,
            answer_html: faq.answer_html,
            category: faq.category,
            sort_order: faq.sort_order,
            is_visible: faq.is_visible,
          }}
          action={updateAction}
          submitLabel="Save changes"
          categories={categories}
        />
      </div>
    </div>
  );
}
