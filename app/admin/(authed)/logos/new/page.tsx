import PageHeader from "../../_components/PageHeader";
import LogoForm from "../_components/LogoForm";
import { createLogo } from "../actions";

export default function NewLogoPage() {
  return (
    <div>
      <PageHeader
        title="Add a trust logo"
        back={{ href: "/admin/logos", label: "Back to logos" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <LogoForm action={createLogo} submitLabel="Create logo" />
      </div>
    </div>
  );
}
