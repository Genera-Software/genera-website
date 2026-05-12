"use client";

import { useState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";
import RichTextEditor from "../../_components/RichTextEditor";

type Initial = {
  question?: string;
  answer_html?: string;
  sort_order?: number;
  is_visible?: boolean;
};

export default function FaqForm({
  initial,
  action,
  submitLabel,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
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
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Question
        </label>
        <input
          type="text"
          name="question"
          required
          maxLength={300}
          defaultValue={initial?.question ?? ""}
          className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-base font-semibold shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Answer
        </label>
        <RichTextEditor
          name="answer_html"
          initialHtml={initial?.answer_html ?? ""}
          uploadEndpoint="/admin/api/upload-image"
          placeholder="Write the answer…"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Sort order
          </label>
          <input
            type="number"
            name="sort_order"
            min={0}
            step={10}
            defaultValue={initial?.sort_order ?? 0}
            className="w-full rounded-lg border border-teal-mid bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Visibility
          </label>
          <label className="flex h-[42px] items-center gap-2 rounded-lg border border-teal-mid bg-white px-3">
            <input
              type="checkbox"
              name="is_visible"
              defaultChecked={initial?.is_visible ?? true}
              className="h-4 w-4 rounded border-teal-mid text-gold focus:ring-gold-soft"
            />
            <span className="text-sm text-ink">Show on FAQs page</span>
          </label>
        </div>
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
