"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ticketRef } from "@/lib/support/ref";
import {
  PRIORITIES,
  PRIORITY_BADGE,
  PRIORITY_LABEL,
  PRIORITY_RANK,
} from "@/lib/support/priority";
import { STATUS_DOT, STATUS_LABEL } from "@/lib/support/status";
import { assigneeName } from "@/lib/support/assignee";
import AssigneeAvatar, { AssigneeStack } from "../../_components/AssigneeAvatar";
import type {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/lib/supabase/types";

type BoardTicket = {
  id: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: SupportTicketCategory;
  subject: string;
  account_email: string | null;
  assignees: string[];
  created_at: string;
};

const COLUMNS: SupportTicketStatus[] = ["new", "in_progress", "completed"];

const CATEGORY_LABEL: Record<SupportTicketCategory, string> = {
  technical: "Technical",
  billing: "Billing",
  feature_request: "Feature",
  account: "Account",
  app_testing: "App testing",
  other: "Other",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}

export default function KanbanBoard({
  tickets,
  archivedCount = 0,
  unreadIds,
  admins,
  onMove,
  onPriority,
  onAssign,
}: {
  tickets: BoardTicket[];
  /** Completed tickets hidden from the board; linked from the Completed column. */
  archivedCount?: number;
  unreadIds: string[];
  admins: string[];
  onMove: (id: string, status: string) => Promise<void>;
  onPriority: (id: string, priority: string) => Promise<void>;
  onAssign: (id: string, emails: string[]) => Promise<void>;
}) {
  // Local copy so drags apply instantly; the server action revalidates and the
  // fresh props re-sync it afterwards.
  const [items, setItems] = useState(tickets);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<SupportTicketStatus | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => setItems(tickets), [tickets]);

  const unread = new Set(unreadIds);

  function moveTicket(id: string, status: SupportTicketStatus) {
    const ticket = items.find((t) => t.id === id);
    if (!ticket || ticket.status === status) return;
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );
    startTransition(() => {
      onMove(id, status).catch(() => setItems(tickets));
    });
  }

  function changePriority(id: string, priority: SupportTicketPriority) {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t)),
    );
    startTransition(() => {
      onPriority(id, priority).catch(() => setItems(tickets));
    });
  }

  function toggleAssignee(id: string, email: string) {
    const ticket = items.find((t) => t.id === id);
    if (!ticket) return;
    const next = ticket.assignees.includes(email)
      ? ticket.assignees.filter((e) => e !== email)
      : [...ticket.assignees, email];
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, assignees: next } : t)),
    );
    startTransition(() => {
      onAssign(id, next).catch(() => setItems(tickets));
    });
  }

  // One assignee picker open at a time; a click anywhere else closes it.
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  useEffect(() => {
    if (!pickerFor) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-assignee-picker]")) {
        setPickerFor(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [pickerFor]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const colTickets = items
          .filter((t) => t.status === col)
          .sort(
            (a, b) =>
              PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
              b.created_at.localeCompare(a.created_at),
          );
        const highlighted = overColumn === col && dragId !== null;
        return (
          <div
            key={col}
            onDragOver={(e) => {
              e.preventDefault();
              setOverColumn(col);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget === e.target) setOverColumn(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain") || dragId;
              if (id) moveTicket(id, col);
              setDragId(null);
              setOverColumn(null);
            }}
            className={`flex min-h-[24rem] flex-col rounded-2xl border bg-cream/40 p-3 transition-colors ${
              highlighted ? "border-forest bg-forest/5" : "border-teal-mid"
            }`}
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[col]}`} />
              <h2 className="text-sm font-semibold text-ink">
                {STATUS_LABEL[col]}
              </h2>
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-ink-soft">
                {colTickets.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2.5">
              {colTickets.map((t) => {
                const hasUnread = unread.has(t.id);
                return (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", t.id);
                      e.dataTransfer.effectAllowed = "move";
                      setDragId(t.id);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverColumn(null);
                    }}
                    className={`cursor-grab rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
                      dragId === t.id
                        ? "border-forest opacity-60"
                        : hasUnread
                          ? "border-gold"
                          : "border-cream-dark"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-ink-soft">
                        #{ticketRef(t.id)}
                      </span>
                      {hasUnread && (
                        <span className="rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink">
                          New reply
                        </span>
                      )}
                      <span className="ml-auto text-[10px] text-ink-soft">
                        {formatDate(t.created_at)}
                      </span>
                    </div>

                    <Link
                      href={`/admin/support/${t.id}`}
                      className="block text-sm font-semibold leading-snug text-ink hover:text-forest"
                    >
                      {t.subject}
                    </Link>

                    {t.account_email && (
                      <p className="mt-1 truncate text-xs text-ink-soft">
                        {t.account_email}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center gap-1.5">
                      {/* Native select dressed as the priority badge. */}
                      <select
                        value={t.priority}
                        onChange={(e) =>
                          changePriority(
                            t.id,
                            e.target.value as SupportTicketPriority,
                          )
                        }
                        aria-label="Priority"
                        className={`cursor-pointer appearance-none rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-forest ${PRIORITY_BADGE[t.priority]}`}
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {PRIORITY_LABEL[p]}
                          </option>
                        ))}
                      </select>
                      <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
                        {CATEGORY_LABEL[t.category]}
                      </span>

                      {/* Assignees: the avatar stack opens a small checklist,
                          so the card stays compact. */}
                      <span
                        data-assignee-picker
                        className="relative ml-auto inline-flex items-center"
                      >
                        <button
                          type="button"
                          aria-label="Assignees"
                          aria-expanded={pickerFor === t.id}
                          onClick={() =>
                            setPickerFor((cur) => (cur === t.id ? null : t.id))
                          }
                          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                        >
                          <AssigneeStack emails={t.assignees} />
                        </button>
                        {pickerFor === t.id && (
                          <div className="absolute right-0 top-full z-20 mt-1.5 w-52 rounded-xl border border-teal-mid bg-white p-1.5 shadow-lg">
                            {admins.map((email) => {
                              const on = t.assignees.includes(email);
                              return (
                                <button
                                  key={email}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => toggleAssignee(t.id, email)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-ink hover:bg-cream"
                                >
                                  <AssigneeAvatar email={email} />
                                  <span className="truncate">
                                    {assigneeName(email)}
                                  </span>
                                  {on && (
                                    <span className="ml-auto text-forest">✓</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}

              {colTickets.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-cream-dark p-6 text-xs text-ink-soft">
                  {highlighted
                    ? col === "completed"
                      ? "Drop to complete and archive"
                      : "Drop here"
                    : "No tickets"}
                </div>
              )}
            </div>

            {col === "completed" && archivedCount > 0 && (
              <Link
                href="/admin/support?view=archive"
                className="mt-3 px-1 text-xs font-semibold text-ink-soft hover:text-forest"
              >
                {archivedCount} archived →
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
