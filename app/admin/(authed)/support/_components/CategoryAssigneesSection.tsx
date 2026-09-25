"use client";

import { useEffect, useState, useTransition } from "react";
import { assigneeName } from "@/lib/support/assignee";
import AssigneeAvatar from "./AssigneeAvatar";

/**
 * Settings: which staff each ticket category is handed to automatically. One
 * row per category, one toggle chip per admin — click to add or remove. Takes
 * effect for tickets created from then on.
 */
export default function CategoryAssigneesSection({
  categories,
  admins,
  rules,
  toggleAction,
}: {
  categories: Array<{ value: string; label: string }>;
  admins: string[];
  /** category → emails auto-assigned to it */
  rules: Record<string, string[]>;
  toggleAction: (category: string, email: string, on: boolean) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(rules);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => setLocal(rules), [rules]);

  const configured = categories.filter((c) => (local[c.value] ?? []).length > 0);
  const summary =
    configured.length === 0
      ? "Off — new tickets arrive unassigned"
      : `${configured.length} of ${categories.length} categories auto-assign`;

  function toggle(category: string, email: string) {
    const current = local[category] ?? [];
    const on = !current.includes(email);
    setError(null);
    setLocal((prev) => ({
      ...prev,
      [category]: on
        ? [...current, email]
        : current.filter((e) => e !== email),
    }));
    startTransition(async () => {
      try {
        await toggleAction(category, email, on);
      } catch (err) {
        setLocal(rules);
        setError(err instanceof Error ? err.message : "Could not save");
      }
    });
  }

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-teal-mid bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-cream/60"
      >
        <div className="min-w-0 flex-1">
          <h2 className="font-massilia text-lg font-bold text-ink">
            Auto-assign
          </h2>
          <p className="mt-0.5 text-sm text-ink-soft">{summary}</p>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-ink-soft transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-teal-mid/70 px-5 py-4">
          <p className="mb-4 text-sm text-ink-soft">
            New tickets in a category are assigned to everyone picked here, and
            each of them gets an email with a link to the ticket. Existing
            tickets aren&apos;t changed.
          </p>

          <ul className="divide-y divide-cream-dark overflow-hidden rounded-xl border border-teal-mid/70">
            {categories.map((c) => {
              const picked = local[c.value] ?? [];
              return (
                <li
                  key={c.value}
                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="w-36 shrink-0 text-sm font-semibold text-ink">
                    {c.label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {admins.map((email) => {
                      const on = picked.includes(email);
                      return (
                        <button
                          key={email}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(c.value, email)}
                          title={email}
                          className={`inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-3 text-xs font-semibold transition-colors ${
                            on
                              ? "border-forest bg-forest text-white"
                              : "border-transparent bg-cream text-ink-soft hover:bg-cream-dark hover:text-ink"
                          }`}
                        >
                          <AssigneeAvatar email={email} />
                          {assigneeName(email).split(" ")[0]}
                          {on && (
                            <span aria-hidden className="text-[10px]">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>

          {error && (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
