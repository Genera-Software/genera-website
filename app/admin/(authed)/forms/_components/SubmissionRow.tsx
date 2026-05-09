"use client";

import { useState } from "react";

type Props = {
  id: string;
  createdAt: string;
  payload: Record<string, unknown>;
  webhookStatus: string;
  webhookCode: number | null;
  emailStatus: string;
  questions: { key: string; label: string }[];
};

export default function SubmissionRow({
  id,
  createdAt,
  payload,
  webhookStatus,
  webhookCode,
  emailStatus,
  questions,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const summaryParts: string[] = [];
  for (const q of questions.slice(0, 2)) {
    const v = String(payload[q.key] ?? "").trim();
    if (v) summaryParts.push(v);
  }
  const summary = summaryParts.join(" · ") || "—";

  return (
    <>
      <tr className="hover:bg-cream">
        <td className="px-5 py-3 align-middle text-ink-soft">
          {new Date(createdAt).toLocaleString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="px-5 py-3 align-middle">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-left font-medium text-ink hover:text-forest"
          >
            {summary}
          </button>
        </td>
        <td className="px-5 py-3 align-middle">
          <StatusPill kind="webhook" status={webhookStatus} code={webhookCode} />
        </td>
        <td className="px-5 py-3 align-middle">
          <StatusPill kind="email" status={emailStatus} />
        </td>
        <td className="px-5 py-3 text-right align-middle">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-md border border-teal-mid px-3 py-1.5 text-xs font-semibold text-ink hover:border-forest"
          >
            {expanded ? "Hide" : "View"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-cream/40">
          <td colSpan={5} className="px-5 py-4">
            <dl className="grid gap-2 text-sm sm:grid-cols-[180px_1fr]">
              {questions.map((q) => (
                <div key={q.key} className="contents">
                  <dt className="font-semibold text-ink-soft">{q.label}</dt>
                  <dd className="whitespace-pre-wrap break-words text-ink">
                    {String(payload[q.key] ?? "—") || "—"}
                  </dd>
                </div>
              ))}
              {Object.keys(payload)
                .filter((k) => !questions.find((q) => q.key === k))
                .map((k) => (
                  <div key={k} className="contents">
                    <dt className="font-semibold text-ink-soft">{k}</dt>
                    <dd className="whitespace-pre-wrap break-words text-ink-soft">
                      {String(payload[k] ?? "—")}
                    </dd>
                  </div>
                ))}
            </dl>
            <p className="mt-3 font-mono text-[11px] text-ink-soft/70">
              id: {id}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

function StatusPill({
  kind,
  status,
  code,
}: {
  kind: "webhook" | "email";
  status: string;
  code?: number | null;
}) {
  const cls =
    status === "sent"
      ? "bg-emerald-50 text-emerald-700"
      : status === "failed"
        ? "bg-red-50 text-red-700"
        : status === "pending"
          ? "bg-amber-50 text-amber-700"
          : "bg-cream-dark text-ink-soft";
  const label =
    status === "skipped"
      ? `${kind === "webhook" ? "No URL" : "No email"}`
      : status === "sent" && code
        ? `Sent · ${code}`
        : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}
