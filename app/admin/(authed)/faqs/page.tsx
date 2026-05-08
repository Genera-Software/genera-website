import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../_components/PageHeader";
import { deleteFaq, moveFaq } from "./actions";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const supabase = getAdminSupabase();
  const { data: faqs } = await supabase
    .from("faqs")
    .select("id, question, sort_order, is_visible")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Questions and answers shown on the public /faqs page."
        action={
          <Link
            href="/admin/faqs/new"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
          >
            + New FAQ
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Question</th>
              <th className="px-5 py-3">Visibility</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(faqs ?? []).map((f) => (
              <tr key={f.id} className="hover:bg-cream">
                <td className="px-5 py-3 align-middle">
                  <div className="flex items-center gap-1">
                    <form
                      action={async () => {
                        "use server";
                        await moveFaq(f.id, "up");
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                        title="Move up"
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
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await moveFaq(f.id, "down");
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded p-1 text-ink-soft/70 hover:bg-cream-dark hover:text-ink"
                        title="Move down"
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
                      </button>
                    </form>
                    <span className="ml-2 text-xs text-ink-soft/70">
                      {f.sort_order}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 align-middle">
                  <Link
                    href={`/admin/faqs/${f.id}/edit`}
                    className="font-medium text-ink hover:text-forest"
                  >
                    {f.question}
                  </Link>
                </td>
                <td className="px-5 py-3 align-middle">
                  {f.is_visible ? (
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
                      href={`/admin/faqs/${f.id}/edit`}
                      className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteFaq(f.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(faqs ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-ink-soft">
                  No FAQs yet. Click &ldquo;New FAQ&rdquo; to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
