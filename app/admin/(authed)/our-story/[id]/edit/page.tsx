import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../../../_components/PageHeader";
import StoryForm from "../../_components/StoryForm";
import { updateStoryEntry } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditStoryEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  const { data: entry } = await supabase
    .from("story_timeline")
    .select("id, year, body, image_url, sort_order, is_visible")
    .eq("id", id)
    .maybeSingle();

  if (!entry) notFound();

  const updateAction = async (formData: FormData) => {
    "use server";
    await updateStoryEntry(entry.id, formData);
  };

  return (
    <div>
      <PageHeader
        title="Edit timeline entry"
        back={{ href: "/admin/our-story", label: "Back to timeline" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <StoryForm
          initial={{
            year: entry.year,
            body: entry.body,
            sort_order: entry.sort_order,
            is_visible: entry.is_visible,
            image_url: entry.image_url,
          }}
          action={updateAction}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
