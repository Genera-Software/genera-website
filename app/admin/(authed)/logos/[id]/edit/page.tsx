import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../_components/PageHeader";
import LogoForm from "../../_components/LogoForm";
import { updateLogo } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditLogoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  const { data: logo } = await supabase
    .from("trust_logos")
    .select("id, name, logo_url, sort_order, is_visible")
    .eq("id", id)
    .maybeSingle();

  if (!logo) notFound();

  const updateAction = async (formData: FormData) => {
    "use server";
    await updateLogo(logo.id, formData);
  };

  return (
    <div>
      <PageHeader
        title="Edit logo"
        back={{ href: "/admin/logos", label: "Back to logos" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <LogoForm
          initial={{
            name: logo.name,
            sort_order: logo.sort_order,
            is_visible: logo.is_visible,
            logo_url: logo.logo_url,
          }}
          action={updateAction}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
