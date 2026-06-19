import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../../_components/PageHeader";
import SubsectionForm from "../../../_components/SubsectionForm";
import { createSubsection } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function NewSubsectionPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const supabase = getAdminSupabase();
  const { data: section } = await supabase
    .from("help_centre_sections")
    .select("id, title")
    .eq("id", sectionId)
    .maybeSingle();

  if (!section) notFound();

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Add subsection"
        description={`In “${section.title}”.`}
        back={{
          href: `/admin/help-centre/${section.id}/edit`,
          label: `Back to ${section.title}`,
        }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <SubsectionForm
          action={createSubsection.bind(null, section.id)}
          submitLabel="Create subsection"
        />
      </div>
    </div>
  );
}
