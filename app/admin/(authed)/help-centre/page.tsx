import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { AdminFormStatusButton } from "../_components/AdminBusyButton";
import PageHeader from "../_components/PageHeader";
import { deleteSection, moveSection } from "./actions";

export const dynamic = "force-dynamic";

export default async function HelpCentreAdminPage() {
  const supabase = getAdminSupabase();
  const { data: sections } = await supabase
    .from("help_centre_sections")
    .select(
      "id, slug, num, title, tagline, is_published, sort_order, help_centre_subsections(count)",
    )
    .order("sort_order", { ascending: true });

  const rows = sections ?? [];

  return (
    <div>
      <PageHeader
        title="Help Centre"
        description="The /docs guide. Edit section text and hero images, and manage every subsection — including each What's New update — with their screenshots."
        action={
          <Link
            href="/admin/help-centre/new"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
          >
            + Add section
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Section</th>
              <th className="px-5 py-3">Subsections</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {rows.map((s) => {
              const subCount =
                (s.help_centre_subsections as { count: number }[] | null)?.[0]
                  ?.count ?? 0;
              return (
                <tr key={s.id} className="hover:bg-cream">
                  <td className="px-5 py-3 align-middle">
                    <div className="flex items-center gap-1">
                      <form
                        action={async () => {
                          "use server";
                          await moveSection(s.id, "up");
                        }}
                      >
                        <AdminFormStatusButton
                          type="submit"
                          variant="icon"
                          title="Move up"
                          pendingLabel="Moving…"
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
                          await moveSection(s.id, "down");
                        }}
                      >
                        <AdminFormStatusButton
                          type="submit"
                          variant="icon"
                          title="Move down"
                          pendingLabel="Moving…"
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
                  <td className="px-5 py-3 align-middle font-semibold text-gold">
                    {String(s.num).padStart(2, "0")}
                  </td>
                  <td className="max-w-md px-5 py-3 align-middle">
                    <p className="font-semibold text-forest">{s.title}</p>
                    <p className="text-xs text-ink-soft">
                      <code className="rounded bg-cream-dark px-1.5 py-0.5">
                        /docs/{s.slug}
                      </code>{" "}
                      · {s.tagline}
                    </p>
                  </td>
                  <td className="px-5 py-3 align-middle text-ink-soft">
                    {subCount}
                  </td>
                  <td className="px-5 py-3 align-middle">
                    {s.is_published ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        Published
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
                        href={`/admin/help-centre/${s.id}/edit`}
                        className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteSection(s.id);
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
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-ink-soft"
                >
                  No sections yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
