import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../_components/PageHeader";
import NewTicketModalButton from "./_components/NewTicketModalButton";
import { createTicket } from "./actions";
import type {
  SupportTicketCategory,
  SupportTicketStatus,
} from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: Array<{ value: SupportTicketStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

const CATEGORY_FILTERS: Array<{
  value: SupportTicketCategory | "all";
  label: string;
}> = [
  { value: "all", label: "All categories" },
  { value: "technical", label: "Technical" },
  { value: "billing", label: "Billing" },
  { value: "feature_request", label: "Feature request" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

const STATUS_BADGE: Record<SupportTicketStatus, string> = {
  new: "bg-amber-50 text-amber-700",
  in_progress: "bg-sky-50 text-sky-700",
  completed: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABEL: Record<SupportTicketStatus, string> = {
  new: "New",
  in_progress: "In progress",
  completed: "Completed",
};

const CATEGORY_LABEL: Record<SupportTicketCategory, string> = {
  technical: "Technical",
  billing: "Billing",
  feature_request: "Feature",
  account: "Account",
  other: "Other",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function SupportTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const status = (sp.status ?? "all") as SupportTicketStatus | "all";
  const category = (sp.category ?? "all") as SupportTicketCategory | "all";

  const supabase = getAdminSupabase();
  let q = supabase
    .from("support_tickets")
    .select(
      "id, status, category, subject, account_email, page_url, app_version, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (status !== "all") q = q.eq("status", status);
  if (category !== "all") q = q.eq("category", category);

  const { data: tickets } = await q;

  const { count: newCount } = await supabase
    .from("support_tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  function hrefFor(next: { status?: string; category?: string }) {
    const params = new URLSearchParams();
    const s = next.status ?? status;
    const c = next.category ?? category;
    if (s !== "all") params.set("status", s);
    if (c !== "all") params.set("category", c);
    const qs = params.toString();
    return qs ? `/admin/support?${qs}` : "/admin/support";
  }

  return (
    <div>
      <PageHeader
        title="Support tickets"
        description={
          newCount
            ? `${newCount} new ticket${newCount === 1 ? "" : "s"} awaiting triage.`
            : "Tickets submitted from app.generasoftware.com via the support widget."
        }
        action={
          <NewTicketModalButton
            action={async (fd) => {
              "use server";
              await createTicket(fd);
            }}
          />
        }
      />

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
        <div className="ml-auto flex flex-wrap gap-1.5">
          {CATEGORY_FILTERS.map((f) => {
            const active = category === f.value;
            return (
              <Link
                key={f.value}
                href={hrefFor({ category: f.value })}
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
      </div>

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Account</th>
              <th className="px-5 py-3">Page</th>
              <th className="px-5 py-3">Version</th>
              <th className="px-5 py-3">Submitted</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(tickets ?? []).map((t) => (
              <tr key={t.id} className="hover:bg-cream">
                <td className="px-5 py-3 align-middle">
                  <Link
                    href={`/admin/support/${t.id}`}
                    className="font-semibold text-ink hover:text-forest"
                  >
                    {t.subject}
                  </Link>
                </td>
                <td className="px-5 py-3 align-middle text-ink-soft">
                  {CATEGORY_LABEL[t.category]}
                </td>
                <td className="px-5 py-3 align-middle text-ink-soft">
                  {t.account_email ?? "—"}
                </td>
                <td className="px-5 py-3 align-middle font-mono text-xs text-ink-soft">
                  {t.page_url ? (
                    <span title={t.page_url}>
                      {(() => {
                        try {
                          return new URL(t.page_url).pathname;
                        } catch {
                          return t.page_url.slice(0, 40);
                        }
                      })()}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-3 align-middle font-mono text-xs text-ink-soft">
                  {t.app_version ?? "—"}
                </td>
                <td className="px-5 py-3 align-middle text-ink-soft">
                  {formatDate(t.created_at)}
                </td>
                <td className="px-5 py-3 align-middle">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[t.status]}`}
                  >
                    {STATUS_LABEL[t.status]}
                  </span>
                </td>
              </tr>
            ))}
            {(tickets ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-ink-soft"
                >
                  No tickets match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
