import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { AdminFormStatusButton } from "../../_components/AdminBusyButton";
import PageHeader from "../../_components/PageHeader";
import {
  deleteTicket,
  replyToTicket,
  setTicketStatus,
  updateInternalNotes,
} from "../actions";
import { ticketRef } from "@/lib/support/thread";
import type { SupportTicketStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<SupportTicketStatus, string> = {
  new: "New",
  in_progress: "In progress",
  completed: "Completed",
};

const STATUS_BADGE: Record<SupportTicketStatus, string> = {
  new: "bg-amber-50 text-amber-700",
  in_progress: "bg-sky-50 text-sky-700",
  completed: "bg-emerald-50 text-emerald-700",
};

const CATEGORY_LABEL: Record<string, string> = {
  technical: "Technical",
  billing: "Billing",
  feature_request: "Feature request",
  account: "Account",
  other: "Other",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </dt>
      <dd
        className={`mt-1 break-words text-sm text-ink ${mono ? "font-mono" : ""}`}
      >
        {value || <span className="text-ink-soft">—</span>}
      </dd>
    </div>
  );
}

type ConsoleError = {
  message: string;
  source?: string;
  line?: number;
  column?: number;
  stack?: string;
  timestamp?: string;
};

export default async function SupportTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!ticket) notFound();

  const { data: messages } = await supabase
    .from("support_ticket_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const thread = messages ?? [];

  const errors: ConsoleError[] = Array.isArray(ticket.console_errors)
    ? (ticket.console_errors as ConsoleError[])
    : [];

  const meta =
    ticket.account_metadata &&
    typeof ticket.account_metadata === "object" &&
    !Array.isArray(ticket.account_metadata)
      ? (ticket.account_metadata as Record<string, unknown>)
      : {};
  const metaEntries = Object.entries(meta);

  return (
    <div>
      <PageHeader
        title={ticket.subject}
        description={`Submitted ${formatDate(ticket.created_at)}`}
        back={{ href: "/admin/support", label: "All tickets" }}
        action={
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[ticket.status]}`}
          >
            {STATUS_LABEL[ticket.status]}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <section className="rounded-2xl border border-teal-mid bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              {CATEGORY_LABEL[ticket.category] ?? ticket.category}
            </h2>
            <p className="whitespace-pre-wrap text-sm text-ink">
              {ticket.description}
            </p>
          </section>

          {/* Console errors */}
          {errors.length > 0 && (
            <section className="rounded-2xl border border-teal-mid bg-white p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
                Recent console errors ({errors.length})
              </h2>
              <ul className="space-y-3">
                {errors.map((e, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-cream-dark bg-cream/50 p-3 font-mono text-xs text-ink"
                  >
                    <div className="font-semibold text-red-700">
                      {e.message}
                    </div>
                    {(e.source || e.line) && (
                      <div className="mt-1 text-ink-soft">
                        {e.source}
                        {e.line ? `:${e.line}` : ""}
                        {e.column ? `:${e.column}` : ""}
                      </div>
                    )}
                    {e.stack && (
                      <pre className="mt-2 whitespace-pre-wrap break-words text-ink-soft">
                        {e.stack}
                      </pre>
                    )}
                    {e.timestamp && (
                      <div className="mt-1 text-ink-soft">
                        {formatDate(e.timestamp)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Email conversation */}
          <section className="rounded-2xl border border-teal-mid bg-white p-6">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                Conversation
              </h2>
              <span className="font-mono text-xs text-ink-soft">
                #{ticketRef(ticket.id)}
              </span>
            </div>

            {thread.length > 0 && (
              <ul className="mb-6 space-y-4">
                {thread.map((m) => {
                  const outbound = m.direction === "outbound";
                  return (
                    <li
                      key={m.id}
                      className={`rounded-xl border p-4 ${
                        outbound
                          ? "ml-6 border-forest/20 bg-forest/5"
                          : "mr-6 border-cream-dark bg-cream/40"
                      }`}
                    >
                      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-xs">
                        <span className="font-semibold text-ink">
                          {outbound
                            ? `${m.author_name ?? "Support"} → ${m.to_email ?? "customer"}`
                            : (m.author_name ?? m.from_email ?? "Customer")}
                        </span>
                        <span className="text-ink-soft">
                          {formatDate(m.created_at)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-ink">
                        {m.body}
                      </p>
                      {m.delivery_status === "failed" && (
                        <p className="mt-2 text-xs font-semibold text-red-700">
                          Failed to send{m.delivery_error ? `: ${m.delivery_error}` : ""}
                        </p>
                      )}
                      {Array.isArray(m.attachments) &&
                        m.attachments.length > 0 && (
                          <p className="mt-2 text-xs text-ink-soft">
                            {m.attachments.length} attachment
                            {m.attachments.length === 1 ? "" : "s"} (not stored)
                          </p>
                        )}
                    </li>
                  );
                })}
              </ul>
            )}

            {ticket.account_email ? (
              <form
                action={async (fd: FormData) => {
                  "use server";
                  await replyToTicket(ticket.id, fd);
                }}
              >
                <textarea
                  name="body"
                  rows={5}
                  required
                  placeholder={`Reply to ${ticket.account_email}…`}
                  className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-ink-soft">
                    Sent from help@generasoftware.com — their reply lands back
                    here.
                  </p>
                  <AdminFormStatusButton
                    type="submit"
                    variant="forestSm"
                    pendingLabel="Sending…"
                  >
                    Send reply
                  </AdminFormStatusButton>
                </div>
              </form>
            ) : (
              <p className="text-sm text-ink-soft">
                No customer email on this ticket, so there is nobody to reply to.
              </p>
            )}
          </section>

          {/* Internal notes */}
          <section className="rounded-2xl border border-teal-mid bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              Internal notes
            </h2>
            <form
              action={async (fd: FormData) => {
                "use server";
                await updateInternalNotes(ticket.id, fd);
              }}
            >
              <textarea
                name="internal_notes"
                defaultValue={ticket.internal_notes ?? ""}
                rows={4}
                placeholder="Notes visible only to admins…"
                className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              />
              <div className="mt-3 flex justify-end">
                <AdminFormStatusButton
                  type="submit"
                  variant="forestSm"
                  pendingLabel="Saving…"
                >
                  Save notes
                </AdminFormStatusButton>
              </div>
            </form>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Status actions */}
          <section className="rounded-2xl border border-teal-mid bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              Status
            </h2>
            <div className="flex flex-col gap-2">
              {(["new", "in_progress", "completed"] as const).map((s) => {
                const active = ticket.status === s;
                return (
                  <form
                    key={s}
                    action={async () => {
                      "use server";
                      await setTicketStatus(ticket.id, s);
                    }}
                  >
                    <AdminFormStatusButton
                      type="submit"
                      variant={active ? "ticketStatusActive" : "ticketStatus"}
                      disabled={active}
                      pendingLabel="Updating…"
                    >
                      {active ? "✓ " : ""}
                      {STATUS_LABEL[s]}
                    </AdminFormStatusButton>
                  </form>
                );
              })}
            </div>
            {ticket.resolved_at && (
              <p className="mt-3 text-xs text-ink-soft">
                Resolved {formatDate(ticket.resolved_at)}
              </p>
            )}
          </section>

          {/* Account */}
          <section className="rounded-2xl border border-teal-mid bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              Account
            </h2>
            <dl className="space-y-3">
              <Field label="Email" value={ticket.account_email} />
              <Field label="Name" value={ticket.account_name} />
              <Field label="ID" value={ticket.account_id} mono />
              {metaEntries.map(([k, v]) => (
                <Field
                  key={k}
                  label={k}
                  value={typeof v === "string" ? v : JSON.stringify(v)}
                />
              ))}
            </dl>
          </section>

          {/* Diagnostics */}
          <section className="rounded-2xl border border-teal-mid bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              Diagnostics
            </h2>
            <dl className="space-y-3">
              <Field label="Page URL" value={ticket.page_url} mono />
              <Field label="App version" value={ticket.app_version} mono />
              <Field
                label="Browser / OS"
                value={
                  ticket.browser || ticket.os
                    ? `${ticket.browser ?? "?"} on ${ticket.os ?? "?"}`
                    : null
                }
              />
              <Field label="Viewport" value={ticket.viewport} />
              <Field label="User agent" value={ticket.user_agent} mono />
              <Field label="Source" value={ticket.source} />
            </dl>
          </section>

          {/* Danger zone */}
          <section className="rounded-2xl border border-red-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-700">
              Danger zone
            </h2>
            <form
              action={async () => {
                "use server";
                await deleteTicket(ticket.id);
              }}
            >
              <AdminFormStatusButton
                type="submit"
                variant="outlineDanger"
                className="w-full"
                pendingLabel="Deleting…"
              >
                Delete ticket
              </AdminFormStatusButton>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
