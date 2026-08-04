import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import PageHeader from "../_components/PageHeader";
import { ticketRef } from "@/lib/support/thread";
import NewTicketModalButton from "./_components/NewTicketModalButton";
import NotifyEmailsSection from "./_components/NotifyEmailsSection";
import {
  addNotifyEmail,
  createTicket,
  removeNotifyEmail,
} from "./actions";
import type {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/lib/supabase/types";
import { PRIORITY_BADGE, PRIORITY_LABEL } from "@/lib/support/priority";
import { STATUS_BADGE, STATUS_LABEL } from "@/lib/support/status";
import ViewToggle from "./_components/ViewToggle";
import AssigneeAvatar from "./_components/AssigneeAvatar";
import { listAdminUsers } from "@/lib/admin/allowlist";
import { requireAdminUser } from "@/lib/admin/auth";
import { assigneeName } from "@/lib/support/assignee";

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

const PRIORITY_FILTERS: Array<{
  value: SupportTicketPriority | "all";
  label: string;
}> = [
  { value: "all", label: "All priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const CATEGORY_LABEL: Record<SupportTicketCategory, string> = {
  technical: "Technical",
  billing: "Billing",
  feature_request: "Feature",
  account: "Account",
  other: "Other",
};

/** Hover text for the notes icon — first line or so, not the whole note. */
function notePreview(notes: string) {
  const flat = notes.trim().replace(/\s+/g, " ");
  return flat.length > 140 ? `${flat.slice(0, 140)}…` : flat;
}

function NoteIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3h9L20 8.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5z" />
      <path d="M14 3v6h6" />
      <path d="M8.5 13h7M8.5 16.5h4.5" />
    </svg>
  );
}

/** Compact enough to stay on one line: "20 Jul 2026, 4:24 pm". */
function formatDate(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}

export default async function SupportTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    category?: string;
    priority?: string;
    assignee?: string;
  }>;
}) {
  const sp = await searchParams;
  const status = (sp.status ?? "all") as SupportTicketStatus | "all";
  const category = (sp.category ?? "all") as SupportTicketCategory | "all";
  const priority = (sp.priority ?? "all") as SupportTicketPriority | "all";
  // "all" | "me" | "unassigned" | a specific admin email
  const assignee = sp.assignee ?? "all";

  const [currentUser, admins] = await Promise.all([
    requireAdminUser(),
    listAdminUsers(),
  ]);
  const adminEmails = new Set(admins.map((a) => a.email));

  const supabase = getAdminSupabase();
  let q = supabase
    .from("support_tickets")
    .select(
      "id, status, priority, category, subject, account_email, page_url, internal_notes, assigned_to, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (status !== "all") q = q.eq("status", status);
  if (category !== "all") q = q.eq("category", category);
  if (priority !== "all") q = q.eq("priority", priority);
  if (assignee === "me") q = q.eq("assigned_to", currentUser.email);
  else if (assignee === "unassigned") q = q.is("assigned_to", null);
  else if (assignee !== "all") q = q.eq("assigned_to", assignee);

  const { data: tickets } = await q;

  const { count: newCount } = await supabase
    .from("support_tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  // Tickets where the customer has replied since we last opened them. Same
  // source of truth as the sidebar badge.
  const { data: unreadRows } = await supabase
    .from("support_ticket_messages")
    .select("ticket_id")
    .eq("direction", "inbound")
    .is("read_at", null);
  const unreadTickets = new Set((unreadRows ?? []).map((r) => r.ticket_id));

  const { data: notifyEmails } = await supabase
    .from("support_notify_emails")
    .select("id, email, label")
    .order("created_at", { ascending: true });

  const envFallback = (process.env.SUPPORT_NOTIFY_EMAIL ?? "")
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  function hrefFor(next: {
    status?: string;
    category?: string;
    priority?: string;
    assignee?: string;
  }) {
    const params = new URLSearchParams();
    const s = next.status ?? status;
    const c = next.category ?? category;
    const p = next.priority ?? priority;
    const a = next.assignee ?? assignee;
    if (s !== "all") params.set("status", s);
    if (c !== "all") params.set("category", c);
    if (p !== "all") params.set("priority", p);
    if (a !== "all") params.set("assignee", a);
    const qs = params.toString();
    return qs ? `/admin/support?${qs}` : "/admin/support";
  }

  return (
    <div data-full-width>
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

      <div className="mb-5 flex flex-wrap items-center gap-4">
        <ViewToggle active="list" />
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
          {PRIORITY_FILTERS.map((f) => {
            const active = priority === f.value;
            return (
              <Link
                key={f.value}
                href={hrefFor({ priority: f.value })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-ink text-white"
                    : "bg-cream text-ink-soft hover:bg-cream-dark"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { value: "all", label: "Anyone" },
            { value: "me", label: "My tickets" },
            { value: "unassigned", label: "Unassigned" },
          ].map((f) => {
            const active = assignee === f.value;
            return (
              <Link
                key={f.value}
                href={hrefFor({ assignee: f.value })}
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
          {admins
            .filter((a) => a.email !== currentUser.email)
            .map((a) => {
              const active = assignee === a.email;
              return (
                <Link
                  key={a.id}
                  href={hrefFor({ assignee: a.email })}
                  title={a.email}
                  className={`inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-forest text-white"
                      : "bg-cream text-ink-soft hover:bg-cream-dark"
                  }`}
                >
                  <AssigneeAvatar email={a.email} />
                  {assigneeName(a.email)}
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

      {/* overflow-x-auto, not overflow-hidden — narrow windows must scroll the
          table rather than silently clipping the Status column. */}
      <div className="overflow-x-auto rounded-2xl border border-teal-mid bg-white">
        <table className="w-full min-w-[72rem] text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Ref</th>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Assignee</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Account</th>
              <th className="px-5 py-3">Page</th>
              <th className="px-5 py-3">Notes</th>
              <th className="px-5 py-3">Submitted</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {(tickets ?? []).map((t) => {
              const hasUnread = unreadTickets.has(t.id);
              return (
              <tr
                key={t.id}
                className={
                  hasUnread ? "bg-gold/10 hover:bg-gold/20" : "hover:bg-cream"
                }
              >
                <td
                  className="whitespace-nowrap px-5 py-3 align-middle font-mono text-xs text-ink-soft"
                  title={t.id}
                >
                  #{ticketRef(t.id)}
                </td>
                <td className="px-5 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    {hasUnread && (
                      <span
                        aria-hidden
                        className="h-2 w-2 shrink-0 rounded-full bg-gold"
                      />
                    )}
                    <Link
                      href={`/admin/support/${t.id}`}
                      className="font-semibold text-ink hover:text-forest"
                    >
                      {t.subject}
                    </Link>
                    {hasUnread && (
                      <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                        New reply
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3 align-middle">
                  <AssigneeAvatar
                    email={t.assigned_to}
                    showName
                    stale={Boolean(
                      t.assigned_to && !adminEmails.has(t.assigned_to),
                    )}
                  />
                </td>
                <td className="px-5 py-3 align-middle">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_BADGE[t.priority]}`}
                  >
                    {PRIORITY_LABEL[t.priority]}
                  </span>
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
                <td className="px-5 py-3 align-middle text-ink-soft">
                  {t.internal_notes?.trim() ? (
                    <span
                      className="inline-flex items-center text-forest"
                      title={notePreview(t.internal_notes)}
                    >
                      <NoteIcon />
                      <span className="sr-only">Has internal notes</span>
                    </span>
                  ) : (
                    <span aria-hidden>—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-3 align-middle text-ink-soft">
                  {formatDate(t.created_at)}
                </td>
                <td className="px-5 py-3 align-middle">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[t.status]}`}
                  >
                    {STATUS_LABEL[t.status]}
                  </span>
                </td>
              </tr>
              );
            })}
            {(tickets ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={10}
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
