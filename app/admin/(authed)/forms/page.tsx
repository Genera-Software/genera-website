import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { AdminFormStatusButton } from "../_components/AdminBusyButton";
import PageHeader from "../_components/PageHeader";
import { deleteForm } from "./actions";

export const dynamic = "force-dynamic";

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-GB").format(n);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-AU", {
    month: "short",
    day: "numeric",
  });
}

export default async function FormsAdminPage() {
  const supabase = getAdminSupabase();
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: forms } = await supabase
    .from("forms")
    .select("id, slug, name, is_active, webhook_url, updated_at")
    .order("updated_at", { ascending: false });

  const ids = (forms ?? []).map((f) => f.id);
  const counts: Record<
    string,
    { questions: number; submissions: number; unread: number }
  > = {};
  for (const id of ids) counts[id] = { questions: 0, submissions: 0, unread: 0 };

  let totalSubmissions = 0;
  let totalUnread = 0;
  let submissions7d = 0;

  type RecentSubmission = {
    id: string;
    form_id: string;
    payload: Record<string, unknown>;
    created_at: string;
    read_at: string | null;
  };
  const recentByForm = new Map<string, RecentSubmission[]>();
  // First two question labels per form, used to build a row summary.
  const summaryKeysByForm = new Map<string, { key: string; label: string }[]>();

  if (ids.length) {
    const { data: qs } = await supabase
      .from("form_questions")
      .select("form_id, key, label, sort_order")
      .in("form_id", ids)
      .order("sort_order", { ascending: true });
    for (const r of qs ?? []) {
      if (counts[r.form_id]) counts[r.form_id].questions += 1;
      const arr = summaryKeysByForm.get(r.form_id) ?? [];
      if (arr.length < 2) {
        arr.push({ key: r.key, label: r.label });
        summaryKeysByForm.set(r.form_id, arr);
      }
    }

    const { data: ss } = await supabase
      .from("form_submissions")
      .select("id, form_id, payload, read_at, created_at")
      .in("form_id", ids)
      .order("created_at", { ascending: false });
    for (const r of ss ?? []) {
      if (!counts[r.form_id]) continue;
      counts[r.form_id].submissions += 1;
      totalSubmissions += 1;
      if (!r.read_at) {
        counts[r.form_id].unread += 1;
        totalUnread += 1;
      }
      if (r.created_at >= sevenDaysAgo) submissions7d += 1;

      const bucket = recentByForm.get(r.form_id) ?? [];
      if (bucket.length < 5) {
        bucket.push({
          id: r.id,
          form_id: r.form_id,
          payload:
            r.payload && typeof r.payload === "object" && !Array.isArray(r.payload)
              ? (r.payload as Record<string, unknown>)
              : {},
          created_at: r.created_at,
          read_at: r.read_at,
        });
        recentByForm.set(r.form_id, bucket);
      }
    }
  }

  function summaryFor(formId: string, payload: Record<string, unknown>) {
    const keys = summaryKeysByForm.get(formId) ?? [];
    const parts: string[] = [];
    for (const k of keys) {
      const v = String(payload[k.key] ?? "").trim();
      if (v) parts.push(v);
    }
    if (parts.length === 0) {
      // fallback to any string-ish field
      for (const v of Object.values(payload)) {
        if (typeof v === "string" && v.trim()) {
          parts.push(v.trim());
          break;
        }
      }
    }
    return parts.join(" · ") || "—";
  }

  const totalRead = totalSubmissions - totalUnread;

  const stats = [
    {
      label: "Total submissions",
      value: totalSubmissions,
      hint: `${forms?.length ?? 0} form${forms?.length === 1 ? "" : "s"}`,
      color: "text-ink",
      href: "/admin/forms/submissions",
    },
    {
      label: "New (unread)",
      value: totalUnread,
      hint: totalUnread === 1 ? "1 awaiting review" : "Awaiting review",
      color: "text-amber-700",
      href: "/admin/forms/submissions?status=unread",
    },
    {
      label: "Read",
      value: totalRead,
      hint: "Reviewed",
      color: "text-emerald-700",
      href: "/admin/forms/submissions?status=read",
    },
    {
      label: "Last 7 days",
      value: submissions7d,
      hint: "New entries",
      color: "text-ink",
      href: "/admin/forms/submissions?range=7d",
    },
  ];

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

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group block rounded-2xl border border-teal-mid bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {s.label}
            </p>
            <p
              className={`mt-3 font-massilia text-3xl font-bold ${s.color}`}
            >
              {formatNumber(s.value)}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{s.hint}</p>
            <p className="mt-3 text-xs font-semibold text-forest opacity-0 transition-opacity group-hover:opacity-100">
              View →
            </p>
          </Link>
        ))}
      </div>

      {/* Recent submissions per form */}
      {totalSubmissions > 0 && (
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          {(forms ?? [])
            .filter((f) => (recentByForm.get(f.id) ?? []).length > 0)
            .map((f) => {
              const recent = recentByForm.get(f.id) ?? [];
              const c = counts[f.id];
              return (
                <section
                  key={f.id}
                  className="rounded-2xl border border-teal-mid bg-white"
                >
                  <div className="flex items-center justify-between border-b border-cream-dark px-5 py-3">
                    <div>
                      <h3 className="font-massilia text-sm font-bold text-ink">
                        {f.name}
                      </h3>
                      <p className="text-xs text-ink-soft">
                        {c?.submissions ?? 0} total
                        {c && c.unread > 0 ? ` · ${c.unread} new` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/admin/forms/${f.id}/edit`}
                      className="text-xs font-semibold text-forest hover:underline"
                    >
                      View all →
                    </Link>
                  </div>
                  <ul className="divide-y divide-cream-dark">
                    {recent.map((s) => {
                      const unread = !s.read_at;
                      return (
                        <li key={s.id}>
                          <Link
                            href={`/admin/forms/${f.id}/edit`}
                            className={`flex items-start gap-3 px-5 py-3 hover:bg-cream ${
                              unread ? "bg-amber-50/40" : ""
                            }`}
                          >
                            <span
                              className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                                unread ? "bg-amber-500" : "bg-cream-dark"
                              }`}
                              title={unread ? "Unread" : "Read"}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className={`truncate text-sm ${
                                  unread
                                    ? "font-semibold text-ink"
                                    : "font-medium text-ink"
                                }`}
                              >
                                {summaryFor(f.id, s.payload)}
                              </p>
                              <p className="mt-0.5 text-xs text-ink-soft">
                                {timeAgo(s.created_at)}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Questions</th>
              <th className="px-5 py-3">Submissions</th>
              <th className="px-5 py-3">New</th>
              <th className="px-5 py-3">Webhook</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(forms ?? []).map((f) => {
              const c = counts[f.id] ?? {
                questions: 0,
                submissions: 0,
                unread: 0,
              };
              return (
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
                    {c.questions}
                  </td>
                  <td className="px-5 py-3 align-middle text-ink-soft">
                    {c.submissions}
                  </td>
                  <td className="px-5 py-3 align-middle">
                    {c.unread > 0 ? (
                      <Link
                        href={`/admin/forms/${f.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                      >
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {c.unread} new
                      </Link>
                    ) : (
                      <span className="text-xs text-ink-soft/60">—</span>
                    )}
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
            {(forms ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={8}
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
