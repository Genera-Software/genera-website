import PageHeader from "../../_components/PageHeader";
import FaqForm from "../_components/FaqForm";
import { createFaq } from "../actions";
import { listFaqCategories } from "../categories";

export const dynamic = "force-dynamic";

export default async function NewFaqPage() {
  const categories = await listFaqCategories();

  return (
    <div>
      <PageHeader
        title="New FAQ"
        back={{ href: "/admin/faqs", label: "Back to FAQs" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <FaqForm
          action={createFaq}
          submitLabel="Create FAQ"
          categories={categories}
        />
      </div>
    </div>
  );
}
