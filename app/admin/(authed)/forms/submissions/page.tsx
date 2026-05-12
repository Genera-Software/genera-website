import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { AdminFormStatusButton } from "../../_components/AdminBusyButton";
import PageHeader from "../../_components/PageHeader";
import { markAllSubmissionsRead, markSubmissionRead } from "../actions";

export const dynamic = "force-dynamic";

type StatusFilter = "all" | "unread" | "read";
type RangeFilter = "all" | "7d" | "30d";

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const RANGE_FILTERS: Array<{ value: RangeFilter; label: string }> = [
  { value: "all", label: "All time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

function isStatus(v: string | undefined): v is StatusFilter {
  return v === "all" || v === "unread" || v === "read";
}
function isRange(v: string | undefined): v is RangeFilter {
  return v === "all" || v === "7d" || v === "30d";
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AllSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; range?: string; form?: string }>;
}) {
  const sp = await searchParams;
  const status: StatusFilter = isStatus(sp.status) ? sp.status : "all";
  const range: RangeFilter = isRange(sp.range) ? sp.range : "all";
  const formFilter = sp.form && sp.form !== "all" ? sp.form : null;

  const supabase = getAdminSupabase();

  const { data: forms } = await supabase
    .from("forms")
    .select("id, name, slug");
  const formsById = new Map((forms ?? []).map((f) => [f.id, f]));

  // Question summaries (first 2 per form)
  const summaryKeysByForm = new Map<string, { key: string; label: string }[]>();
  if ((forms ?? []).length) {
    const { data: qs } = await supabase
      .from("form_questions")
      .select("form_id, key, label, sort_order")
      .order("sort_order", { ascending: true });
    for (const r of qs ?? []) {
      const arr = summaryKeysByForm.get(r.form_id) ?? [];
      if (arr.length < 2) {
        arr.push({ key: r.key, label: r.label });
        summaryKeysByForm.set(r.form_id, arr);
      }
    }
  }

  let q = supabase
    .from("form_submissions")
    .select("id, form_id, payload, created_at, read_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (status === "unread") q = q.is("read_at", null);
  if (status === "read") q = q.not("read_at", "is", null);
  if (formFilter) q = q.eq("form_id", formFilter);
  if (range !== "all") {
    const days = range === "7d" ? 7 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    q = q.gte("created_at", since);
  }

  const { data: submissions } = await q;
  const rows = submissions ?? [];

  function summaryFor(formId: string, payload: unknown) {
    const obj =
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? (payload as Record<string, unknown>)
        : {};
    const keys = summaryKeysByForm.get(formId) ?? [];
    const parts: string[] = [];
    for (const k of keys) {
      const v = String(obj[k.key] ?? "").trim();
      if (v) parts.push(v);
    }
    if (parts.length === 0) {
      for (const v of Object.values(obj)) {
        if (typeof v === "string" && v.trim()) {
          parts.push(v.trim());
          break;
        }
      }
    }
    return parts.join(" · ") || "—";
  }

  function hrefFor(next: {
    status?: StatusFilter;
    range?: RangeFilter;
    form?: string | null;
  }) {
    const params = new URLSearchParams();
    const s = next.status ?? status;
    const r = next.range ?? range;
    const f = next.form === undefined ? formFilter : next.form;
    if (s !== "all") params.set("status", s);
    if (r !== "all") params.set("range", r);
    if (f) params.set("form", f);
    const qs = params.toString();
    return qs ? `/admin/forms/submissions?${qs}` : "/admin/forms/submissions";
  }

  const unreadVisible = rows.filter((r) => !r.read_at).length;

  return (
    <div>
      <PageHeader
        title="All submissions"
        description={`${rows.length} result${rows.length === 1 ? "" : "s"} · ${unreadVisible} unread`}
        back={{ href: "/admin/forms", label: "Back to forms" }}
        action={
          unreadVisible > 0 && formFilter ? (
            <form
              action={async () => {
                "use server";
                await markAllSubmissionsRead(formFilter);
              }}
            >
              <AdminFormStatusButton
                type="submit"
                variant="outlineMarkAll"
                pendingLabel="Updating…"
              >
                Mark all as read
              </AdminFormStatusButton>
            </form>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => {
            const active = status === f.value;
            return (
              <Link
                key={f.value}
                href={hrefFor({ status: f.value })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-forest text-white"
                    : "bg-cream text-ink-soft hover:bg-cream-dark"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {RANGE_FILTERS.map((f) => {
            const active = range === f.value;
            return (
              <Link
                key={f.value}
                href={hrefFor({ range: f.value })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-gold text-ink"
                    : "bg-cream text-ink-soft hover:bg-cream-dark"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex flex-wrap gap-1.5">
          <Link
            href={hrefFor({ form: null })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              !formFilter
                ? "bg-forest text-white"
                : "bg-cream text-ink-soft hover:bg-cream-dark"
            }`}
          >
            All forms
          </Link>
          {(forms ?? []).map((f) => {
            const active = formFilter === f.id;
            return (
              <Link
                key={f.id}
                href={hrefFor({ form: f.id })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-forest text-white"
                    : "bg-cream text-ink-soft hover:bg-cream-dark"
                }`}
              >
                {f.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">When</th>
              <th className="px-5 py-3">Form</th>
              <th className="px-5 py-3">Summary</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {rows.map((s) => {
              const form = formsById.get(s.form_id);
              const unread = !s.read_at;
              return (
                <tr
                  key={s.id}
                  className={
                    unread
                      ? "bg-amber-50/40 hover:bg-amber-50"
                      : "hover:bg-cream"
                  }
                >
                  <td className="px-5 py-3 align-middle text-ink-soft">
                    <div className="flex items-center gap-2">
                      {unread && (
                        <span
                          className="inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500"
                          title="Unread"
                        />
                      )}
                      <span title={formatDate(s.created_at)}>
                        {timeAgo(s.created_at)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <Link
                      href={`/admin/forms/${s.form_id}/edit`}
                      className="text-sm font-semibold text-ink hover:text-forest"
                    >
                      {form?.name ?? "Unknown form"}
                    </Link>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <span
                      className={`text-sm ${
                        unread ? "font-semibold text-ink" : "text-ink"
                      }`}
                    >
                      {summaryFor(s.form_id, s.payload)}
                    </span>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    {unread ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        New
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        Read
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right align-middle">
                    <div className="inline-flex items-center gap-2">
                      <form
                        action={async () => {
                          "use server";
                          await markSubmissionRead(s.form_id, s.id, unread);
                        }}
                      >
                        <AdminFormStatusButton
                          type="submit"
                          variant="outlineSm"
                          pendingLabel="Updating…"
                        >
                          {unread ? "Mark read" : "Mark unread"}
                        </AdminFormStatusButton>
                      </form>
                      <Link
                        href={`/admin/forms/${s.form_id}/edit`}
                        className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-ink-soft"
                >
                  No submissions match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
