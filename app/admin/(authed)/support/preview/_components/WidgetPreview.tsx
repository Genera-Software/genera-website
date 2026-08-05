"use client";

import { useEffect, useState } from "react";
import SupportWidget from "@/support-widget/SupportWidget";

/** Questions that should each find a different Help Centre page. */
const SAMPLES = [
  "How do I add a new booking for a dog that's already on the system?",
  "I can't work out how to raise an invoice for a customer",
  "Where do I set up a direct debit for a client?",
  "How do I add a new staff member to the rota?",
  "I need to change the pickup order for the van run tomorrow",
  "Trying to add vaccination records to a pet profile",
  "How do I set up a recurring booking every Tuesday?",
];

/** These should deliberately produce nothing — a wrong hint is worse than none. */
const NEGATIVE_SAMPLES = [
  "Your website is down and I cannot log in at all",
  "asdf asdf asdf",
];

type Suggestion = { title: string; section: string; href: string };

export default function WidgetPreview() {
  // The widget is client-only and needs a real origin to call, so hold off
  // until after mount rather than guessing during SSR.
  const [origin, setOrigin] = useState<string | null>(null);
  const [probe, setProbe] = useState("");
  const [result, setResult] = useState<Suggestion[] | null>(null);
  const [probing, setProbing] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);

  async function runProbe(text: string) {
    setProbe(text);
    setProbing(true);
    try {
      const res = await fetch(
        `/api/support/suggest?q=${encodeURIComponent(text)}`,
      );
      const data = (await res.json()) as { suggestions?: Suggestion[] };
      setResult(data.suggestions ?? []);
    } catch {
      setResult([]);
    } finally {
      setProbing(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-teal-mid bg-white p-6">
        <h2 className="mb-2 font-semibold text-ink">Try a question</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Hits the same <code className="text-xs">/api/support/suggest</code>{" "}
          endpoint the widget uses, without opening it.
        </p>

        <div className="mb-4 flex gap-2">
          <input
            value={probe}
            onChange={(e) => setProbe(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runProbe(probe);
            }}
            placeholder="Type a support question and press Enter…"
            className="flex-1 rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/40"
          />
          <button
            type="button"
            onClick={() => runProbe(probe)}
            disabled={probing || probe.trim().length < 8}
            className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {probing ? "…" : "Match"}
          </button>
        </div>

        {result !== null && (
          <div className="mb-4">
            {result.length === 0 ? (
              <p className="rounded-lg border border-cream-dark bg-cream px-4 py-3 text-sm text-ink-soft">
                No suggestions — the customer goes straight to a ticket. This is
                the right answer for anything the docs don&rsquo;t cover.
              </p>
            ) : (
              <ul className="space-y-2">
                {result.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-cream-dark bg-cream px-4 py-3 hover:border-forest/40"
                    >
                      <div className="text-sm font-semibold text-ink">
                        {s.title}
                      </div>
                      <div className="text-xs text-ink-soft">
                        {s.section} · {s.href}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Should each find a page
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => runProbe(s)}
                  className="rounded-full bg-cream px-3 py-1.5 text-left text-xs text-ink-soft hover:bg-cream-dark"
                >
                  {s.length > 46 ? `${s.slice(0, 46)}…` : s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Should find nothing
            </p>
            <div className="flex flex-wrap gap-1.5">
              {NEGATIVE_SAMPLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => runProbe(s)}
                  className="rounded-full bg-cream px-3 py-1.5 text-left text-xs text-ink-soft hover:bg-cream-dark"
                >
                  {s.length > 46 ? `${s.slice(0, 46)}…` : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-teal-mid bg-white p-6">
        <h2 className="mb-2 font-semibold text-ink">The real widget</h2>
        <p className="text-sm text-ink-soft">
          The live widget is mounted bottom-right — the same component the app
          repo uses. Open it, pick a category, and type into Subject and
          Description: suggestions appear after a short pause once there are 12+
          characters.
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Sending is stubbed here (<code className="text-xs">/admin/api/widget-preview</code>
          ), so you can click through to the confirmation screen without creating
          a real ticket.
        </p>
      </section>

      {origin && (
        <SupportWidget
          appVersion="preview"
          docsOrigin={origin}
          endpoint="/admin/api/widget-preview"
          account={{
            id: "preview",
            email: "preview@generasoftware.com",
            name: "Preview User",
          }}
        />
      )}
    </div>
  );
}
