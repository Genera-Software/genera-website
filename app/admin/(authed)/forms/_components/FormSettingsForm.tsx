"use client";

import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

type Initial = {
  slug?: string;
  name?: string;
  description?: string;
  success_title?: string;
  success_message?: string;
  webhook_url?: string | null;
  webhook_secret?: string | null;
  webhook_meta?: Record<string, unknown> | null;
  notify_email?: string | null;
  email_subject?: string | null;
  is_active?: boolean;
};

export default function FormSettingsForm({
  initial,
  action,
  submitLabel,
  slugLocked,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  slugLocked?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        setError(null);
        try {
          await action(fd);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Save failed");
          setPending(false);
        }
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" hint="Shown in the admin and email subject.">
          <input
            type="text"
            name="name"
            required
            maxLength={120}
            defaultValue={initial?.name ?? ""}
            className={inputCls}
          />
        </Field>
        <Field label="Slug" hint="URL-safe identifier — used by the modal.">
          <input
            type="text"
            name="slug"
            required
            readOnly={slugLocked}
            pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            maxLength={60}
            defaultValue={initial?.slug ?? ""}
            className={`${inputCls} ${slugLocked ? "bg-cream-dark/40 text-ink-soft" : ""}`}
          />
        </Field>
      </div>

      <Field label="Description (admin-only)">
        <textarea
          name="description"
          rows={2}
          maxLength={500}
          defaultValue={initial?.description ?? ""}
          className={inputCls}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Success title">
          <input
            type="text"
            name="success_title"
            required
            maxLength={120}
            defaultValue={initial?.success_title ?? "Got it — thanks!"}
            className={inputCls}
          />
        </Field>
        <Field label="Active">
          <label className="flex h-[42px] items-center gap-2 rounded-lg border border-teal-mid bg-white px-3">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={initial?.is_active ?? true}
              className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
            />
            <span className="text-sm text-ink">
              Form is open for submissions
            </span>
          </label>
        </Field>
      </div>

      <Field label="Success message" hint="Shown after submission.">
        <textarea
          name="success_message"
          rows={3}
          maxLength={500}
          required
          defaultValue={
            initial?.success_message ??
            "We'll be in touch within one working day."
          }
          className={inputCls}
        />
      </Field>

      <fieldset className="rounded-xl border border-teal-mid bg-cream/30 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
          Webhook
        </legend>
        <div className="grid gap-4">
          <Field
            label="Webhook URL"
            hint="Submissions are POSTed here as JSON. Leave blank to disable."
          >
            <input
              type="url"
              name="webhook_url"
              placeholder="https://hooks.example.com/…"
              defaultValue={initial?.webhook_url ?? ""}
              className={inputCls}
            />
          </Field>
          <Field
            label="Webhook secret"
            hint="If set, requests include X-Genera-Signature: sha256=<hmac>."
          >
            <input
              type="text"
              name="webhook_secret"
              maxLength={200}
              placeholder="optional shared secret"
              defaultValue={initial?.webhook_secret ?? ""}
              className={inputCls}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Hidden field key"
              hint='e.g. "source" — added to the webhook payload data so you can route on it in Make.'
            >
              <input
                type="text"
                name="webhook_meta_key"
                pattern="[a-zA-Z][a-zA-Z0-9_]*"
                maxLength={60}
                placeholder="source"
                defaultValue={firstKey(initial?.webhook_meta) ?? ""}
                className={inputCls}
              />
            </Field>
            <Field label="Hidden field value">
              <input
                type="text"
                name="webhook_meta_value"
                maxLength={200}
                placeholder="demo"
                defaultValue={firstValue(initial?.webhook_meta) ?? ""}
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-teal-mid bg-cream/30 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
          Email notification (optional)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Notify email">
            <input
              type="email"
              name="notify_email"
              placeholder="info@example.com"
              defaultValue={initial?.notify_email ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Email subject">
            <input
              type="text"
              name="email_subject"
              maxLength={200}
              placeholder={`New ${initial?.name ?? "form"} submission`}
              defaultValue={initial?.email_subject ?? ""}
              className={inputCls}
            />
          </Field>
        </div>
      </fieldset>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <AdminBusyButton
          type="submit"
          variant="gold"
          pending={pending}
          pendingLabel="Saving…"
        >
          {submitLabel}
        </AdminBusyButton>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60";

function firstKey(meta: Record<string, unknown> | null | undefined): string | null {
  if (!meta || typeof meta !== "object") return null;
  const keys = Object.keys(meta);
  return keys.length > 0 ? keys[0] : null;
}

function firstValue(
  meta: Record<string, unknown> | null | undefined,
): string | null {
  if (!meta || typeof meta !== "object") return null;
  const keys = Object.keys(meta);
  if (keys.length === 0) return null;
  const v = meta[keys[0]];
  return typeof v === "string" ? v : v == null ? null : String(v);
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
