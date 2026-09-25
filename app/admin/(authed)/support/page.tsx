import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../_components/PageHeader";
import { ticketRef } from "@/lib/support/thread";
import NewTicketModalButton from "./_components/NewTicketModalButton";
import NotifyEmailsSection from "./_components/NotifyEmailsSection";
import CategoryAssigneesSection from "./_components/CategoryAssigneesSection";
import {
  addNotifyEmail,
  createTicket,
  removeNotifyEmail,
  setCategoryAssignee,
} from "./actions";
import type {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/lib/supabase/types";
import {
  PRIORITY_BADGE,
  PRIORITY_DOT,
  PRIORITY_LABEL,
  PRIORITY_OPTION_ACTIVE,
  PRIORITY_RANK,
} from "@/lib/support/priority";
import {
  STATUS_BADGE,
  STATUS_DOT,
  STATUS_LABEL,
  STATUS_OPTION_ACTIVE,
  isArchived,
} from "@/lib/support/status";
import ViewToggle from "./_components/ViewToggle";
import AssigneeAvatar, { AssigneeStack } from "./_components/AssigneeAvatar";
import { listAdminUsers, normaliseEmail } from "@/lib/admin/allowlist";
import { requireAdminUser } from "@/lib/admin/auth";
import { assigneeName } from "@/lib/support/assignee";

export const dynamic = "force-dynamic";

type View = "inbox" | "mine" | "unassigned" | "archive";

const VIEWS: Array<{ value: View; label: string }> = [
  { value: "inbox", label: "Inbox" },
  { value: "mine", label: "Mine" },
  { value: "unassigned", label: "Unassigned" },
  { value: "archive", label: "Archive" },
];

/** "replied" narrows to tickets with an unread customer reply, whatever their
    status — it is what the "Customer replies" tile links to. */
type StatusFilter = "all" | "new" | "in_progress" | "replied";

const STATUS_FILTERS: Array<{ value: Exclude<StatusFilter, "all">; label: string }> = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "replied", label: "Customer replied" },
];

const CATEGORY_FILTERS: Array<{ value: SupportTicketCategory; label: string }> = [
  { value: "technical", label: "Technical" },
  { value: "billing", label: "Billing" },
  { value: "feature_request", label: "Feature request" },
  { value: "account", label: "Account" },
  { value: "app_testing", label: "App testing" },
  { value: "other", label: "Other" },
];

const PRIORITY_FILTERS: SupportTicketPriority[] = ["urgent", "high", "medium", "low"];

const CATEGORY_LABEL: Record<SupportTicketCategory, string> = {
  technical: "Technical",
  billing: "Billing",
  feature_request: "Feature",
  account: "Account",
  app_testing: "App testing",
  other: "Other",
};

/** Cap on the rows rendered for one view. Counts are computed over everything. */
const ROW_LIMIT = 200;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Short relative age for the table: "12m", "5h", "3d", "7w". */
function ago(iso: string, now: number) {
  const mins = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 14) return `${days}d`;
  return `${Math.round(days / 7)}w`;
}

/** A duration in ms as "40m", "6h", "2.5d". */
function duration(ms: number) {
  const hours = ms / 3_600_000;
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = hours / 24;
  return `${days < 10 ? Math.round(days * 10) / 10 : Math.round(days)}d`;
}

function median(values: number[]) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** One number on the dashboard strip. The whole tile links to the view that
    number describes, so the dashboard doubles as navigation. */
function StatTile({
  href,
  label,
  value,
  hint,
  dot,
  active,
}: {
  href: string;
  label: string;
  value: number;
  hint: string;
  dot?: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border bg-white px-5 py-4 transition-colors ${
        active ? "border-forest" : "border-teal-mid hover:border-forest/60"
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
        {dot && <span aria-hidden className={`h-2 w-2 rounded-full ${dot}`} />}
        {label}
      </div>
      <div className="mt-1.5 text-3xl font-bold tabular-nums leading-none text-ink">
        {value}
      </div>
      <div className="mt-2 truncate text-xs text-ink-soft">{hint}</div>
    </Link>
  );
}

/** Filter pill; clicking an active pill clears that filter. */
function FilterPill({
  href,
  active,
  activeClass,
  children,
}: {
  href: string;
  active: boolean;
  activeClass: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={active ? "Clear this filter" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? activeClass
          : "border-transparent bg-cream text-ink-soft hover:bg-cream-dark hover:text-ink"
      }`}
    >
      {children}
      {active && (
        <span aria-hidden className="text-[10px] leading-none opacity-60">
          ✕
        </span>
      )}
    </Link>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

export default async function SupportTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    status?: string;
    category?: string;
    priority?: string;
    assignee?: string;
  }>;
}) {
  const sp = await searchParams;

  // Older links used ?status=completed and ?assignee=me|unassigned — map them
  // onto the views that replaced them.
  let view: View = VIEWS.some((v) => v.value === sp.view)
    ? (sp.view as View)
    : "inbox";
  if (!sp.view && sp.status === "completed") view = "archive";
  if (!sp.view && sp.assignee === "me") view = "mine";
  if (!sp.view && sp.assignee === "unassigned") view = "unassigned";

  const status: StatusFilter =
    view !== "archive" && STATUS_FILTERS.some((f) => f.value === sp.status)
      ? (sp.status as StatusFilter)
      : "all";
  const category = (sp.category ?? "all") as SupportTicketCategory | "all";
  const priority = (sp.priority ?? "all") as SupportTicketPriority | "all";
  // A specific admin's email; "me"/"unassigned" are views now.
  const assignee =
    sp.assignee && sp.assignee !== "me" && sp.assignee !== "unassigned"
      ? sp.assignee
      : "all";

  const [currentUser, admins] = await Promise.all([
    requireAdminUser(),
    listAdminUsers(),
  ]);
  const adminEmails = new Set(admins.map((a) => a.email));
  const me = normaliseEmail(currentUser.email);

  const supabase = getAdminSupabase();

  // One read of every ticket: the dashboard counts, the view tabs and the
  // table are all derived from it, so they can never disagree.
  const [
    { data: allTickets },
    { data: unreadRows },
    { data: notifyEmails },
    { data: categoryRules },
  ] = await Promise.all([
      supabase
        .from("support_tickets")
        .select(
          "id, status, priority, category, subject, account_email, account_name, assignees, created_by, created_at, resolved_at",
        )
        .order("created_at", { ascending: false })
        .limit(2000),
      // Same source of truth as the sidebar badge.
      supabase
        .from("support_ticket_messages")
        .select("ticket_id")
        .eq("direction", "inbound")
        .is("read_at", null),
      supabase
        .from("support_notify_emails")
        .select("id, email, label")
        .order("created_at", { ascending: true }),
      supabase
        .from("support_category_assignees")
        .select("category, email")
        .order("created_at", { ascending: true }),
    ]);

  const rulesByCategory: Record<string, string[]> = {};
  for (const r of categoryRules ?? []) {
    (rulesByCategory[r.category] ??= []).push(r.email);
  }

  const tickets = allTickets ?? [];
  const unreadTickets = new Set((unreadRows ?? []).map((r) => r.ticket_id));
  const now = Date.now();

  const active = tickets.filter(
    (t) => !isArchived(t.status, unreadTickets.has(t.id)),
  );
  const archived = tickets.filter((t) =>
    isArchived(t.status, unreadTickets.has(t.id)),
  );

  // ---- Dashboard numbers -------------------------------------------------
  const newTickets = active.filter((t) => t.status === "new");
  const oldestNew = newTickets.at(-1);
  const repliesWaiting = active.filter((t) => unreadTickets.has(t.id)).length;
  const unassignedCount = active.filter((t) => t.assignees.length === 0).length;
  const urgentCount = active.filter(
    (t) => t.priority === "urgent" || t.priority === "high",
  ).length;
  const resolvedThisWeek = archived.filter(
    (t) => t.resolved_at && now - new Date(t.resolved_at).getTime() < 7 * DAY_MS,
  );
  const medianResolve = median(
    resolvedThisWeek.map(
      (t) =>
        new Date(t.resolved_at!).getTime() - new Date(t.created_at).getTime(),
    ),
  );

  const viewCounts: Record<View, number> = {
    inbox: active.length,
    mine: active.filter((t) => t.assignees.includes(me)).length,
    unassigned: unassignedCount,
    archive: archived.length,
  };

  // ---- Rows for the current view -----------------------------------------
  let rows = view === "archive" ? archived : active;
  if (view === "mine") rows = rows.filter((t) => t.assignees.includes(me));
  if (view === "unassigned") rows = rows.filter((t) => t.assignees.length === 0);
  if (status === "replied") rows = rows.filter((t) => unreadTickets.has(t.id));
  else if (status !== "all") rows = rows.filter((t) => t.status === status);
  if (priority !== "all") rows = rows.filter((t) => t.priority === priority);
  if (category !== "all") rows = rows.filter((t) => t.category === category);
  if (assignee !== "all") rows = rows.filter((t) => t.assignees.includes(assignee));

  // Working views: anything the customer is waiting on first, then by
  // priority, then newest. The archive reads most-recently-resolved first.
  rows =
    view === "archive"
      ? [...rows].sort((a, b) =>
          (b.resolved_at ?? b.created_at).localeCompare(
            a.resolved_at ?? a.created_at,
          ),
        )
      : [...rows].sort(
          (a, b) =>
            Number(unreadTickets.has(b.id)) - Number(unreadTickets.has(a.id)) ||
            PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
            b.created_at.localeCompare(a.created_at),
        );
  const matching = rows.length;
  rows = rows.slice(0, ROW_LIMIT);

  const filtersActive = [
    status !== "all",
    priority !== "all",
    category !== "all",
    assignee !== "all",
  ].filter(Boolean).length;

  const envFallback = (process.env.SUPPORT_NOTIFY_EMAIL ?? "")
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  function hrefFor(next: {
    view?: View;
    status?: string;
    category?: string;
    priority?: string;
    assignee?: string;
  }) {
    const params = new URLSearchParams();
    const v = next.view ?? view;
    const s = next.status ?? status;
    const c = next.category ?? category;
    const p = next.priority ?? priority;
    const a = next.assignee ?? assignee;
    if (v !== "inbox") params.set("view", v);
    if (s !== "all" && v !== "archive") params.set("status", s);
    if (c !== "all") params.set("category", c);
    if (p !== "all") params.set("priority", p);
    if (a !== "all") params.set("assignee", a);
    const qs = params.toString();
    return qs ? `/admin/support?${qs}` : "/admin/support";
  }

  const isArchive = view === "archive";

  return (
    <div data-full-width>
      <PageHeader
        title="Support"
        description={
          repliesWaiting
            ? `${repliesWaiting} customer repl${repliesWaiting === 1 ? "y" : "ies"} waiting on you.`
            : newTickets.length
              ? `${newTickets.length} new ticket${newTickets.length === 1 ? "" : "s"} awaiting triage.`
              : "All caught up."
        }
        action={
          <div className="flex items-center gap-3">
            <ViewToggle active="list" />
            <NewTicketModalButton
              action={async (fd) => {
                "use server";
                await createTicket(fd);
              }}
            />
          </div>
        }
      />

      {/* Dashboard — four numbers, each a shortcut to the tickets behind it. */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          href="/admin/support"
          label="Open"
          value={active.length}
          hint={
            unassignedCount
              ? `${unassignedCount} unassigned · ${urgentCount} high or urgent`
              : `${urgentCount} high or urgent`
          }
          active={view === "inbox" && filtersActive === 0}
        />
        <StatTile
          href="/admin/support?status=new"
          label="New"
          dot={STATUS_DOT.new}
          value={newTickets.length}
          hint={
            oldestNew
              ? `Oldest waiting ${ago(oldestNew.created_at, now)}`
              : "Nothing to triage"
          }
          active={view === "inbox" && status === "new" && filtersActive === 1}
        />
        <StatTile
          href="/admin/support?status=replied"
          label="Customer replies"
          dot="bg-gold"
          value={repliesWaiting}
          hint={repliesWaiting ? "Waiting on us" : "All read"}
          active={view === "inbox" && status === "replied" && filtersActive === 1}
        />
        <StatTile
          href="/admin/support?view=archive"
          label="Resolved · 7 days"
          dot={STATUS_DOT.completed}
          value={resolvedThisWeek.length}
          hint={
            medianResolve !== null
              ? `Median ${duration(medianResolve)} to resolve`
              : "None this week"
          }
          active={isArchive && filtersActive === 0}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        {/* View tabs */}
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-cream-dark px-3 pt-2">
          {VIEWS.map((v) => {
            const on = view === v.value;
            return (
              <Link
                key={v.value}
                href={hrefFor({ view: v.value, status: "all" })}
                className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                  on
                    ? "border-forest text-ink"
                    : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {v.label}
                <span
                  className={`rounded-full px-1.5 text-[11px] tabular-nums ${
                    on ? "bg-forest text-white" : "bg-cream text-ink-soft"
                  }`}
                >
                  {viewCounts[v.value]}
                </span>
              </Link>
            );
          })}

          <div className="ml-auto flex items-center gap-2 pb-2 pr-2">
            {filtersActive > 0 && (
              <Link
                href={hrefFor({
                  status: "all",
                  category: "all",
                  priority: "all",
                  assignee: "all",
                })}
                className="text-xs font-semibold text-ink-soft hover:text-forest"
              >
                Clear filters
              </Link>
            )}
          </div>
        </div>

        {/* Filters stay folded away until wanted; open whenever one is set so
            the active pill is visible. */}
        <details
          open={filtersActive > 0}
          className="group border-b border-cream-dark"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-2.5 text-xs font-semibold text-ink-soft hover:text-ink [&::-webkit-details-marker]:hidden">
            <svg
              aria-hidden
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-transform group-open:rotate-90"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
            Filters
            {filtersActive > 0 && (
              <span className="rounded-full bg-forest px-1.5 text-[10px] text-white">
                {filtersActive}
              </span>
            )}
            <span className="ml-auto font-normal">
              {matching} ticket{matching === 1 ? "" : "s"}
            </span>
          </summary>

          <div className="flex flex-col gap-3 px-5 pb-4 pt-1">
            {!isArchive && (
              <FilterRow label="Status">
                {STATUS_FILTERS.map((f) => {
                  const on = status === f.value;
                  return (
                    <FilterPill
                      key={f.value}
                      href={hrefFor({ status: on ? "all" : f.value })}
                      active={on}
                      activeClass={
                        f.value === "replied"
                          ? "border-gold bg-gold text-ink"
                          : STATUS_OPTION_ACTIVE[f.value]
                      }
                    >
                      <span
                        aria-hidden
                        className={`h-2 w-2 rounded-full ${
                          f.value === "replied" ? "bg-gold" : STATUS_DOT[f.value]
                        }`}
                      />
                      {f.label}
                    </FilterPill>
                  );
                })}
              </FilterRow>
            )}

            <FilterRow label="Priority">
              {PRIORITY_FILTERS.map((p) => {
                const on = priority === p;
                return (
                  <FilterPill
                    key={p}
                    href={hrefFor({ priority: on ? "all" : p })}
                    active={on}
                    activeClass={PRIORITY_OPTION_ACTIVE[p]}
                  >
                    <span
                      aria-hidden
                      className={`h-2 w-2 rounded-full ${PRIORITY_DOT[p]}`}
                    />
                    {PRIORITY_LABEL[p]}
                  </FilterPill>
                );
              })}
            </FilterRow>

            <FilterRow label="Category">
              {CATEGORY_FILTERS.map((f) => {
                const on = category === f.value;
                return (
                  <FilterPill
                    key={f.value}
                    href={hrefFor({ category: on ? "all" : f.value })}
                    active={on}
                    activeClass="border-gold bg-gold text-ink"
                  >
                    {f.label}
                  </FilterPill>
                );
              })}
            </FilterRow>

            {view !== "mine" && view !== "unassigned" && admins.length > 1 && (
              <FilterRow label="Assignee">
                {admins
                  .filter((a) => a.email !== currentUser.email)
                  .map((a) => {
                    const on = assignee === a.email;
                    return (
                      <Link
                        key={a.id}
                        href={hrefFor({ assignee: on ? "all" : a.email })}
                        title={on ? "Clear this filter" : a.email}
                        className={`inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-3 text-xs font-semibold transition-colors ${
                          on
                            ? "border-forest bg-forest text-white"
                            : "border-transparent bg-cream text-ink-soft hover:bg-cream-dark hover:text-ink"
                        }`}
                      >
                        <AssigneeAvatar email={a.email} />
                        {assigneeName(a.email)}
                        {on && (
                          <span
                            aria-hidden
                            className="text-[10px] leading-none opacity-60"
                          >
                            ✕
                          </span>
                        )}
                      </Link>
                    );
                  })}
              </FilterRow>
            )}
          </div>
        </details>

        {/* overflow-x-auto so narrow windows scroll rather than clip. */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-5 py-2.5 font-semibold">Ticket</th>
                <th className="px-5 py-2.5 font-semibold">Assignee</th>
                <th className="px-5 py-2.5 font-semibold">Priority</th>
                <th className="px-5 py-2.5 font-semibold">
                  {isArchive ? "Resolved" : "Status"}
                </th>
                <th className="px-5 py-2.5 text-right font-semibold">
                  {isArchive ? "Took" : "Age"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark border-t border-cream-dark">
              {rows.map((t) => {
                const hasUnread = unreadTickets.has(t.id);
                const who =
                  t.account_email ??
                  t.account_name ??
                  (t.created_by ? `Logged by ${assigneeName(t.created_by)}` : null);
                return (
                  <tr
                    key={t.id}
                    className={
                      hasUnread ? "bg-gold/10 hover:bg-gold/20" : "hover:bg-cream/60"
                    }
                  >
                    <td className="max-w-0 px-5 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        {hasUnread && (
                          <span
                            aria-hidden
                            className="h-2 w-2 shrink-0 rounded-full bg-gold"
                          />
                        )}
                        <Link
                          href={`/admin/support/${t.id}`}
                          className="truncate font-semibold text-ink hover:text-forest"
                        >
                          {t.subject}
                        </Link>
                        {hasUnread && (
                          <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                            Customer replied
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-ink-soft">
                        <span className="font-mono" title={t.id}>
                          #{ticketRef(t.id)}
                        </span>
                        {" · "}
                        {CATEGORY_LABEL[t.category]}
                        {who && <> · {who}</>}
                      </div>
                    </td>
                    <td className="w-44 whitespace-nowrap px-5 py-3 align-middle">
                      <AssigneeStack
                        emails={t.assignees}
                        showName
                        staleEmails={t.assignees.filter(
                          (e) => !adminEmails.has(e),
                        )}
                      />
                    </td>
                    <td className="w-28 px-5 py-3 align-middle">
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_BADGE[t.priority]}`}
                      >
                        {PRIORITY_LABEL[t.priority]}
                      </span>
                    </td>
                    <td className="w-32 whitespace-nowrap px-5 py-3 align-middle">
                      {isArchive ? (
                        <span className="text-ink-soft">
                          {formatDate(t.resolved_at ?? t.created_at)}
                        </span>
                      ) : (
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[t.status]}`}
                        >
                          {STATUS_LABEL[t.status]}
                        </span>
                      )}
                    </td>
                    <td
                      className="w-20 whitespace-nowrap px-5 py-3 text-right align-middle tabular-nums text-ink-soft"
                      title={new Date(t.created_at).toLocaleString("en-AU")}
                    >
                      {isArchive
                        ? t.resolved_at
                          ? duration(
                              new Date(t.resolved_at).getTime() -
                                new Date(t.created_at).getTime(),
                            )
                          : "—"
                        : ago(t.created_at, now)}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-ink-soft"
                  >
                    {filtersActive > 0
                      ? "No tickets match these filters."
                      : isArchive
                        ? "Nothing archived yet."
                        : "Inbox zero — nothing open here."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {matching > rows.length && (
          <p className="border-t border-cream-dark px-5 py-3 text-xs text-ink-soft">
            Showing the first {rows.length} of {matching}. Narrow it down with
            the filters.
          </p>
        )}
        {!isArchive && archived.length > 0 && (
          <p className="border-t border-cream-dark bg-cream/40 px-5 py-3 text-xs text-ink-soft">
            Completed tickets move to the{" "}
            <Link
              href="/admin/support?view=archive"
              className="font-semibold text-forest hover:underline"
            >
              archive ({archived.length})
            </Link>
            . A customer reply brings them back here.
          </p>
        )}
      </div>

      <div className="mt-8">
        <CategoryAssigneesSection
          categories={CATEGORY_FILTERS}
          admins={admins.map((a) => a.email)}
          rules={rulesByCategory}
          toggleAction={async (category, email, on) => {
            "use server";
            await setCategoryAssignee(category, email, on);
          }}
        />
        <NotifyEmailsSection
          emails={notifyEmails ?? []}
          envFallback={envFallback}
          addAction={async (fd) => {
            "use server";
            await addNotifyEmail(fd);
          }}
          removeAction={async (id) => {
            "use server";
            await removeNotifyEmail(id);
          }}
        />
      </div>
    </div>
  );
}
