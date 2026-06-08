import PageHeader from "../../_components/PageHeader";
import StoryForm from "../_components/StoryForm";
import { createStoryEntry } from "../actions";

export default function NewStoryEntryPage() {
  return (
    <div>
      <PageHeader
        title="Add timeline entry"
        back={{ href: "/admin/our-story", label: "Back to timeline" }}
      />
      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <StoryForm action={createStoryEntry} submitLabel="Create entry" />
      </div>
    </div>
  );
}
