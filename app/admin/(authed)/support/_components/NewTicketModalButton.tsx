"use client";

import { useEffect, useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: "technical", label: "Technical" },
  { value: "billing", label: "Billing" },
  { value: "feature_request", label: "Feature request" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

const STATUSES: Array<{ value: string; label: string }> = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export default function NewTicketModalButton({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
      >
        + New ticket
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="New ticket"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm"
        >
          <div className="relative my-10 w-full max-w-2xl rounded-2xl border border-teal-mid bg-white p-6 shadow-[0_24px_60px_rgba(0,62,69,0.25)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-cream hover:text-ink"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>

            <h2 className="font-massilia text-lg font-bold text-ink">
              New ticket
            </h2>
            <p className="mb-5 text-sm text-ink-soft">
              Log a ticket that came in through phone, email, or any other
              channel. Marked as source &ldquo;manual&rdquo;.
            </p>

            <form
              action={async (fd) => {
                setSubmitting(true);
                try {
                  await action(fd);
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category" htmlFor="category">
                  <select
                    id="category"
                    name="category"
                    defaultValue="other"
                    className={selectStyle}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Status" htmlFor="status">
                  <select
                    id="status"
                    name="status"
                    defaultValue="new"
                    className={selectStyle}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Subject" htmlFor="subject" required>
                <input
                  id="subject"
                  name="subject"
                  required
                  maxLength={200}
                  className={inputStyle}
                />
              </Field>

              <Field label="Description" htmlFor="description" required>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  maxLength={5000}
                  className={inputStyle}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Account email" htmlFor="account_email">
                  <input
                    id="account_email"
                    name="account_email"
                    type="email"
                    maxLength={200}
                    placeholder="optional"
                    className={inputStyle}
                  />
                </Field>
                <Field label="Account name" htmlFor="account_name">
                  <input
                    id="account_name"
                    name="account_name"
                    maxLength={200}
                    placeholder="optional"
                    className={inputStyle}
                  />
                </Field>
              </div>

              <Field label="Page URL" htmlFor="page_url">
                <input
                  id="page_url"
                  name="page_url"
                  maxLength={2000}
                  placeholder="optional, e.g. https://app.generasoftware.com/dashboard"
                  className={inputStyle}
                />
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-teal-mid bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-forest"
                >
                  Cancel
                </button>
                <AdminBusyButton
                  type="submit"
                  variant="forest"
                  pending={submitting}
                  pendingLabel="Creating…"
                >
                  Create ticket
                </AdminBusyButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle =
  "w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none";
const selectStyle =
  "w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none";
