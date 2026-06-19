import PageHeader from "../../_components/PageHeader";
import SectionMetaForm from "../_components/SectionMetaForm";
import { createSection } from "../actions";

export const dynamic = "force-dynamic";

export default function NewSectionPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Add section"
        back={{ href: "/admin/help-centre", label: "Back to Help Centre" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <SectionMetaForm action={createSection} submitLabel="Create section" />
      </div>
    </div>
  );
}
