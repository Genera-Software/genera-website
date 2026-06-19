import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { AdminFormStatusButton } from "../../../_components/AdminBusyButton";
import PageHeader from "../../../_components/PageHeader";
import SectionMetaForm from "../../_components/SectionMetaForm";
import {
  deleteSubsection,
  moveSubsection,
  updateSection,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const supabase = getAdminSupabase();

  const { data: section } = await supabase
    .from("help_centre_sections")
    .select(
      "id, slug, num, title, tagline, intro, image_url, image_alt, is_published, sort_order",
    )
    .eq("id", sectionId)
    .maybeSingle();

  if (!section) notFound();

  const { data: subs } = await supabase
    .from("help_centre_subsections")
    .select("id, title, route, is_published, sort_order, images")
    .eq("section_id", sectionId)
    .order("sort_order", { ascending: true });

  const subsections = subs ?? [];

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={`Edit: ${section.title}`}
        description="Section text and hero image. Subsections (each What's New update is one) are managed below."
        back={{ href: "/admin/help-centre", label: "Back to Help Centre" }}
      />

      <div className="rounded-2xl border border-teal-mid bg-white p-6">
        <SectionMetaForm
          initial={section}
          action={updateSection.bind(null, section.id)}
          submitLabel="Save section"
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-massilia text-xl font-bold text-ink">
          Subsections
        </h2>
        <Link
          href={`/admin/help-centre/${section.id}/subsections/new`}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
        >
          + Add subsection
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Images</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {subsections.map((sub) => {
              const imgCount = Array.isArray(sub.images)
                ? sub.images.length
                : 0;
              return (
                <tr key={sub.id} className="hover:bg-cream">
                  <td className="px-5 py-3 align-middle">
                    <div className="flex items-center gap-1">
                      <form
                        action={async () => {
                          "use server";
                          await moveSubsection(sub.id, "up");
                        }}
                      >
                        <AdminFormStatusButton
                          type="submit"
                          variant="icon"
                          title="Move up"
                          pendingLabel="…"
                          className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </AdminFormStatusButton>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await moveSubsection(sub.id, "down");
                        }}
                      >
                        <AdminFormStatusButton
                          type="submit"
                          variant="icon"
                          title="Move down"
                          pendingLabel="…"
                          className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </AdminFormStatusButton>
                      </form>
                    </div>
                  </td>
                  <td className="max-w-md px-5 py-3 align-middle">
                    <p className="font-semibold text-forest">{sub.title}</p>
                    {sub.route && (
                      <code className="text-xs text-ink-soft">{sub.route}</code>
                    )}
                  </td>
                  <td className="px-5 py-3 align-middle text-ink-soft">
                    {imgCount}
                  </td>
                  <td className="px-5 py-3 align-middle">
                    {sub.is_published ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        Visible
                      </span>
                    ) : (
                      <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right align-middle">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/help-centre/${section.id}/subsections/${sub.id}/edit`}
                        className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteSubsection(sub.id);
                        }}
                      >
                        <AdminFormStatusButton
                          type="submit"
                          variant="outlineDanger"
                          pendingLabel="Deleting…"
                        >
                          Delete
                        </AdminFormStatusButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {subsections.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-ink-soft"
                >
                  No subsections yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
