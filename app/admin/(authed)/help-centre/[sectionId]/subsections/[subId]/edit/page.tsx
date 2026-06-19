import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../../../_components/PageHeader";
import SubsectionForm from "../../../../_components/SubsectionForm";
import { updateSubsection } from "../../../../actions";

export const dynamic = "force-dynamic";

type DocItem = { label: string; desc: string };
type DocImage = {
  src: string;
  alt: string;
  caption?: string;
  placeholder?: boolean;
};

export default async function EditSubsectionPage({
  params,
}: {
  params: Promise<{ sectionId: string; subId: string }>;
}) {
  const { sectionId, subId } = await params;
  const supabase = getAdminSupabase();

  const { data: section } = await supabase
    .from("help_centre_sections")
    .select("id, title")
    .eq("id", sectionId)
    .maybeSingle();

  const { data: sub } = await supabase
    .from("help_centre_subsections")
    .select(
      "id, title, route, what_it_does, how_to_use, items, images, is_published, sort_order",
    )
    .eq("id", subId)
    .maybeSingle();

  if (!section || !sub) notFound();

  const initial = {
    title: sub.title,
    route: sub.route,
    what_it_does: sub.what_it_does,
    how_to_use: Array.isArray(sub.how_to_use) ? sub.how_to_use : [],
    items: Array.isArray(sub.items) ? (sub.items as DocItem[]) : [],
    images: Array.isArray(sub.images) ? (sub.images as DocImage[]) : [],
    is_published: sub.is_published,
    sort_order: sub.sort_order,
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={`Edit: ${sub.title}`}
        description={`In “${section.title}”.`}
        back={{
          href: `/admin/help-centre/${section.id}/edit`,
          label: `Back to ${section.title}`,
        }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <SubsectionForm
          initial={initial}
          action={updateSubsection.bind(null, sub.id)}
          submitLabel="Save subsection"
        />
      </div>
    </div>
  );
}
