import PageHeader from "../../_components/PageHeader";
import FormSettingsForm from "../_components/FormSettingsForm";
import { createForm } from "../actions";

export default function NewFormPage() {
  return (
    <div>
      <PageHeader
        title="New form"
        description="Set up the basics. You'll add questions on the next page."
        back={{ href: "/admin/forms", label: "Back to forms" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <FormSettingsForm action={createForm} submitLabel="Create form" />
      </div>
    </div>
  );
}
