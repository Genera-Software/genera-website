import Image from "next/image";
import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { AdminFormStatusButton } from "../_components/AdminBusyButton";
import PageHeader from "../_components/PageHeader";
import { deleteStoryEntry, moveStoryEntry } from "./actions";

export const dynamic = "force-dynamic";

export default async function OurStoryAdminPage() {
  const supabase = getAdminSupabase();
  const { data: entries } = await supabase
    .from("story_timeline")
    .select("id, year, body, image_url, sort_order, is_visible")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Our story timeline"
        description='Years shown in the "Journey so far" section of the public Our Story page.'
        action={
          <Link
            href="/admin/our-story/new"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
          >
            + Add entry
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Photo</th>
              <th className="px-5 py-3">Year</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Visibility</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(entries ?? []).map((entry) => (
              <tr key={entry.id} className="hover:bg-cream">
                <td className="px-5 py-3 align-middle">
                  <div className="flex items-center gap-1">
                    <form
                      action={async () => {
                        "use server";
                        await moveStoryEntry(entry.id, "up");
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
                        await moveStoryEntry(entry.id, "down");
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
                    <span className="ml-2 text-xs text-ink-soft/70">
                      {entry.sort_order}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 align-middle">
                  {entry.image_url ? (
                    <Image
                      src={entry.image_url}
                      alt={`Photo for ${entry.year}`}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="rounded-full border border-teal-mid bg-cream px-2.5 py-1 text-xs text-ink-soft">
                      No photo
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle font-semibold text-forest">
                  {entry.year}
                </td>
                <td className="max-w-xl px-5 py-3 align-middle text-ink-soft">
                  <p className="line-clamp-2">{entry.body}</p>
                </td>
                <td className="px-5 py-3 align-middle">
                  {entry.is_visible ? (
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
                      href={`/admin/our-story/${entry.id}/edit`}
                      className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteStoryEntry(entry.id);
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
            ))}
            {(entries ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-ink-soft"
                >
                  No timeline entries yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
