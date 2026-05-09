import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../_components/PageHeader";
import { deleteForm } from "./actions";

export const dynamic = "force-dynamic";

export default async function FormsAdminPage() {
  const supabase = getAdminSupabase();
  const { data: forms } = await supabase
    .from("forms")
    .select("id, slug, name, is_active, webhook_url, updated_at")
    .order("updated_at", { ascending: false });

  const ids = (forms ?? []).map((f) => f.id);
  const counts: Record<string, { questions: number; submissions: number }> = {};
  for (const id of ids) counts[id] = { questions: 0, submissions: 0 };

  if (ids.length) {
    const { data: qs } = await supabase
      .from("form_questions")
      .select("form_id")
      .in("form_id", ids);
    for (const r of qs ?? []) {
      if (counts[r.form_id]) counts[r.form_id].questions += 1;
    }
    const { data: ss } = await supabase
      .from("form_submissions")
      .select("form_id")
      .in("form_id", ids);
    for (const r of ss ?? []) {
      if (counts[r.form_id]) counts[r.form_id].submissions += 1;
    }
  }

  return (
    <div>
      <PageHeader
        title="Forms"
        description="Lead-capture flows shown by the BookDemoButton across the site. Each form has its own questions, webhook, and submissions."
        action={
          <Link
            href="/admin/forms/new"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
          >
            + New form
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Questions</th>
              <th className="px-5 py-3">Submissions</th>
              <th className="px-5 py-3">Webhook</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(forms ?? []).map((f) => (
              <tr key={f.id} className="hover:bg-cream">
                <td className="px-5 py-3 align-middle">
                  <Link
                    href={`/admin/forms/${f.id}/edit`}
                    className="font-semibold text-ink hover:text-forest"
                  >
                    {f.name}
                  </Link>
                </td>
                <td className="px-5 py-3 align-middle font-mono text-xs text-ink-soft">
                  {f.slug}
                </td>
                <td className="px-5 py-3 align-middle text-ink-soft">
                  {counts[f.id]?.questions ?? 0}
                </td>
                <td className="px-5 py-3 align-middle text-ink-soft">
                  {counts[f.id]?.submissions ?? 0}
                </td>
                <td className="px-5 py-3 align-middle">
                  {f.webhook_url ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Configured
                    </span>
                  ) : (
                    <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
                      None
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 align-middle">
                  {f.is_active ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right align-middle">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/forms/${f.id}/edit`}
                      className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteForm(f.id);
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
            {(forms ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-ink-soft"
                >
                  No forms yet. Click &ldquo;New form&rdquo; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
