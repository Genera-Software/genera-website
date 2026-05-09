"use client";

import { useState } from "react";
import { testWebhook } from "../actions";

export default function TestWebhookButton({ formId }: { formId: string }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  async function onClick() {
    setPending(true);
    setResult(null);
    try {
      const r = await testWebhook(formId);
      setResult(r);
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Failed",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="self-start rounded-lg border border-teal-mid bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-forest disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send test webhook"}
      </button>
      {result && (
        <p
          className={`rounded-md px-3 py-2 text-xs ${
            result.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {result.message || (result.ok ? "Sent." : "Failed.")}
        </p>
      )}
    </div>
  );
}
