"use client";

import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";

type Initial = {
  key?: string;
  label?: string;
  eyebrow?: string;
  hint?: string;
  type?: "text" | "email" | "tel" | "textarea" | "choice" | "multi";
  placeholder?: string;
  choices?: string[];
  is_optional?: boolean;
  sort_order?: number;
};

export default function QuestionForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [type, setType] = useState<Initial["type"]>(initial?.type ?? "text");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChoices = type === "choice" || type === "multi";

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
        <Field
          label="Key"
          hint="Property name in the webhook payload — no spaces."
        >
          <input
            type="text"
            name="key"
            required
            pattern="[a-zA-Z][a-zA-Z0-9_]*"
            maxLength={60}
            defaultValue={initial?.key ?? ""}
            className={inputCls}
          />
        </Field>
        <Field label="Type">
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as Initial["type"])}
            className={inputCls}
          >
            <option value="text">Short text</option>
            <option value="email">Email</option>
            <option value="tel">Phone number</option>
            <option value="textarea">Long text</option>
            <option value="choice">Multiple choice — pick one</option>
            <option value="multi">Multiple choice — pick several</option>
          </select>
        </Field>
      </div>

      <Field
        label="Eyebrow"
        hint='Small caption above the question, e.g. "1 → First things first".'
      >
        <input
          type="text"
          name="eyebrow"
          maxLength={120}
          defaultValue={initial?.eyebrow ?? ""}
          className={inputCls}
        />
      </Field>

      <Field label="Question / label" hint="The main question shown to the user.">
        <input
          type="text"
          name="label"
          required
          maxLength={300}
          defaultValue={initial?.label ?? ""}
          className={inputCls}
        />
      </Field>

      <Field label="Hint" hint="Optional smaller text under the question.">
        <input
          type="text"
          name="hint"
          maxLength={300}
          defaultValue={initial?.hint ?? ""}
          className={inputCls}
        />
      </Field>

      {!hasChoices && (
        <Field label="Placeholder">
          <input
            type="text"
            name="placeholder"
            maxLength={200}
            defaultValue={initial?.placeholder ?? ""}
            className={inputCls}
          />
        </Field>
      )}

      {hasChoices && (
        <Field
          label="Choices (one per line)"
          hint={
            type === "multi"
              ? "People can tick as many as they like. Answers arrive comma-separated, so options can't contain commas."
              : undefined
          }
        >
          <textarea
            name="choices_text"
            rows={5}
            defaultValue={(initial?.choices ?? []).join("\n")}
            className={inputCls}
            placeholder={
              type === "multi"
                ? "Dog daycare\nDog walking\nBoarding\nGrooming\nOther"
                : "1–10\n11–25\n26–50\n51–100\n100+"
            }
          />
        </Field>
      )}

      {/* Always include placeholder + choices_text fields so server schema doesn't NPE */}
      {hasChoices && <input type="hidden" name="placeholder" value="" />}
      {!hasChoices && <input type="hidden" name="choices_text" value="" />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Sort order" hint="0 = auto-place at the end.">
          <input
            type="number"
            name="sort_order"
            min={0}
            step={10}
            defaultValue={initial?.sort_order ?? 0}
            className={inputCls}
          />
        </Field>
        <Field label="Required?">
          <label className="flex h-[42px] items-center gap-2 rounded-lg border border-teal-mid bg-white px-3">
            <input
              type="checkbox"
              name="is_optional"
              defaultChecked={initial?.is_optional ?? false}
              className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
            />
            <span className="text-sm text-ink">
              Mark this question as optional
            </span>
          </label>
        </Field>
      </div>

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
