"use client";

import { useState, useTransition } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

type NotifyEmail = {
  id: string;
  email: string;
  label: string;
};

export default function NotifyEmailsSection({
  emails,
  envFallback,
  addAction,
  removeAction,
}: {
  emails: NotifyEmail[];
  envFallback: string[];
  addAction: (formData: FormData) => Promise<void>;
  removeAction: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const totalRecipients = emails.length + envFallback.length;
  const summary =
    totalRecipients === 0
      ? "No recipients configured"
      : `${totalRecipients} recipient${totalRecipients === 1 ? "" : "s"}`;

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
            Notification emails
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
            These addresses get an email whenever a support ticket is submitted
            (docs, app widget, or manual).
          </p>

          {emails.length > 0 ? (
            <ul className="mb-4 divide-y divide-cream-dark overflow-hidden rounded-xl border border-teal-mid/70">
              {emails.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-3 bg-white px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-ink">
                      {e.email}
                    </div>
                    {e.label ? (
                      <div className="truncate text-xs text-ink-soft">
                        {e.label}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      setError(null);
                      startTransition(async () => {
                        try {
                          await removeAction(e.id);
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : "Could not remove email",
                          );
                        }
                      });
                    }}
                    className="rounded-lg border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 rounded-xl border border-dashed border-teal-mid bg-cream/40 px-4 py-3 text-sm text-ink-soft">
              No notification emails yet. Add at least one so the team is
              notified of new tickets.
            </p>
          )}

          {envFallback.length > 0 && (
            <p className="mb-4 text-xs text-ink-soft">
              Also notifying via env:{" "}
              <span className="font-mono text-ink">
                {envFallback.join(", ")}
              </span>
            </p>
          )}

          <form
            action={(fd) => {
              setError(null);
              startTransition(async () => {
                try {
                  await addAction(fd);
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "Could not add email",
                  );
                }
              });
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Email
              <input
                type="email"
                name="email"
                required
                maxLength={200}
                placeholder="you@generasoftware.com"
                className="mt-1 w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink focus:border-forest focus:outline-none"
              />
            </label>
            <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Label <span className="font-normal normal-case">(optional)</span>
              <input
                type="text"
                name="label"
                maxLength={120}
                placeholder="e.g. Support lead"
                className="mt-1 w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink focus:border-forest focus:outline-none"
              />
            </label>
            <AdminBusyButton
              type="submit"
              variant="forest"
              pending={pending}
              pendingLabel="Adding…"
            >
              Add email
            </AdminBusyButton>
          </form>

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
