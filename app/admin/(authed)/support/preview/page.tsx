import PageHeader from "../../_components/PageHeader";
import WidgetPreview from "./_components/WidgetPreview";

export const dynamic = "force-dynamic";

/**
 * Harness for the support widget's docs suggestions. Deliberately not in the
 * sidebar — it is a testing tool, not a CMS page — but it sits inside (authed)
 * so it is behind the same admin gate as everything else.
 */
export default function WidgetPreviewPage() {
  return (
    <div>
      <PageHeader
        title="Widget preview"
        description="Test the docs suggestions the support widget shows customers before they raise a ticket."
        back={{ href: "/admin/support", label: "All tickets" }}
      />
      <WidgetPreview />
    </div>
  );
}
