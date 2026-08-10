"use client";

import { useDeferredValue, useMemo, useRef, useState } from "react";

export type FaqItem = {
  id: string;
  q: string;
  a: string; // HTML
  category: string | null;
};

const UNCATEGORISED = "More questions";

/** Strip tags + decode the handful of entities our answers actually use. */
function toPlainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenise(query: string) {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

/** Split text into alternating unmatched/matched runs for <mark> rendering. */
function highlight(text: string, tokens: string[]) {
  if (tokens.length === 0) return [{ text, hit: false }];

  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];

  for (const token of tokens) {
    let from = 0;
    for (;;) {
      const at = lower.indexOf(token, from);
      if (at === -1) break;
      ranges.push([at, at + token.length]);
      from = at + token.length;
    }
  }
  if (ranges.length === 0) return [{ text, hit: false }];

  ranges.sort((a, b) => a[0] - b[0]);

  // Merge overlapping ranges so nested/repeated tokens don't double-wrap, and
  // ranges separated only by whitespace so a multi-word query like "direct
  // debit" reads as one highlight rather than two boxes with a gap.
  const merged: Array<[number, number]> = [ranges[0]];
  for (const [start, end] of ranges.slice(1)) {
    const last = merged[merged.length - 1];
    const gapIsBlank =
      start > last[1] && text.slice(last[1], start).trim() === "";
    if (start <= last[1] || gapIsBlank) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  const parts: Array<{ text: string; hit: boolean }> = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) parts.push({ text: text.slice(cursor, start), hit: false });
    parts.push({ text: text.slice(start, end), hit: true });
    cursor = end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });
  return parts;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // Keeps typing responsive while the (cheap, but per-keystroke) filter runs.
  const deferredQuery = useDeferredValue(query);
  const tokens = useMemo(() => tokenise(deferredQuery.trim()), [deferredQuery]);
  const searching = tokens.length > 0;

  // Pre-compute the searchable blob once per item, not once per keystroke.
  const searchable = useMemo(
    () =>
      items.map((item) => ({
        item,
        haystack: `${item.q} ${toPlainText(item.a)} ${
          item.category ?? ""
        }`.toLowerCase(),
      })),
    [items],
  );

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const key = item.category ?? UNCATEGORISED;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].map(([name, count]) => ({ name, count }));
  }, [items]);

  const results = useMemo(
    () =>
      searchable
        .filter(({ item, haystack }) => {
          if (category && (item.category ?? UNCATEGORISED) !== category)
            return false;
          return tokens.every((token) => haystack.includes(token));
        })
        .map(({ item }) => item),
    [searchable, tokens, category],
  );

  // Preserve the DB sort order within each section.
  const groups = useMemo(() => {
    const byCategory = new Map<string, FaqItem[]>();
    for (const item of results) {
      const key = item.category ?? UNCATEGORISED;
      const bucket = byCategory.get(key);
      if (bucket) bucket.push(item);
      else byCategory.set(key, [item]);
    }
    return [...byCategory.entries()].map(([name, faqs]) => ({ name, faqs }));
  }, [results]);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setQuery("");
    setCategory(null);
    setOpen(new Set());
    inputRef.current?.focus();
  }

  return (
    <div>
      {/* Search */}
      <div>
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/50"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQs — try “direct debit”, “routes”, “vaccinations”…"
            aria-label="Search frequently asked questions"
            className="w-full rounded-full border border-cream-dark bg-white py-4 pl-13 pr-5 text-base text-ink shadow-[0_4px_16px_rgba(0,62,69,0.06)] outline-none transition-colors placeholder:text-ink-soft/60 focus:border-gold focus:ring-2 focus:ring-gold-soft/50 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        {/* Category filters */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className={`rounded-full border px-3.5 py-1.5 text-fine font-semibold transition-colors ${
              category === null
                ? "border-forest bg-forest text-white"
                : "border-cream-dark bg-white text-ink-soft hover:border-forest/40 hover:text-forest"
            }`}
          >
            All <span className="opacity-60">{items.length}</span>
          </button>
          {categories.map(({ name, count }) => {
            const active = category === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(active ? null : name)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-fine font-semibold transition-colors ${
                  active
                    ? "border-forest bg-forest text-white"
                    : "border-cream-dark bg-white text-ink-soft hover:border-forest/40 hover:text-forest"
                }`}
              >
                {name} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count — only once the list is actually filtered */}
      {(searching || category) && (
        <p
          aria-live="polite"
          className="mt-5 px-1 text-fine font-semibold text-ink-soft"
        >
          {results.length === 0
            ? "No results"
            : `${results.length} ${
                results.length === 1 ? "question" : "questions"
              }`}
          {searching && <> for &ldquo;{deferredQuery.trim()}&rdquo;</>}
          {category && <> in {category}</>}
        </p>
      )}

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-cream-dark bg-white px-6 py-12 text-center">
          <p className="font-massilia text-lg font-bold text-forest">
            Nothing found for that one
          </p>
          <p className="mx-auto mt-2 max-w-[420px] text-ink-soft">
            Try a different word, or just ask us directly — we read every
            message and reply within one working day.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="btn btn-forest">
              Clear search
            </button>
            <a
              href={`mailto:info@generasoftware.com?subject=${encodeURIComponent(
                "Question about Genera",
              )}&body=${encodeURIComponent(
                deferredQuery.trim()
                  ? `I was looking for: ${deferredQuery.trim()}`
                  : "",
              )}`}
              className="btn btn-gold"
            >
              Email Us
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.name} aria-labelledby={`faq-group-${group.name}`}>
              <h2
                id={`faq-group-${group.name}`}
                className="mb-3 flex items-center gap-3 px-1 font-massilia text-mini-h font-bold text-forest"
              >
                {group.name}
                <span className="h-px flex-1 bg-cream-dark" aria-hidden="true" />
                <span className="text-fine font-semibold text-ink-soft/70">
                  {group.faqs.length}
                </span>
              </h2>

              <div className="flex flex-col gap-3">
                {group.faqs.map((item) => {
                  // While searching, matches open automatically — the answer is
                  // the thing you came for, and result sets are small.
                  const isOpen = searching || open.has(item.id);
                  return (
                    <div
                      key={item.id}
                      id={`faq-${item.id}`}
                      className="overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-[0_4px_16px_rgba(0,62,69,0.04)] scroll-mt-40"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggle(item.id)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-massilia text-base font-bold text-forest transition-colors hover:bg-cream md:text-lg"
                      >
                        <span>
                          {highlight(item.q, tokens).map((part, i) =>
                            part.hit ? (
                              <mark
                                key={i}
                                className="rounded bg-gold-soft/60 px-0.5 text-forest"
                              >
                                {part.text}
                              </mark>
                            ) : (
                              <span key={i}>{part.text}</span>
                            ),
                          )}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className={`h-5 w-5 shrink-0 text-forest transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <div
                        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="min-h-0">
                          <div
                            className="border-t border-cream-dark px-6 py-5 text-ink-soft [&_a]:font-semibold [&_a]:text-forest [&_a]:underline [&_a]:decoration-gold [&_a]:underline-offset-2 hover:[&_a]:text-forest-mid [&_p+p]:mt-3 [&_strong]:font-bold [&_strong]:text-forest [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5"
                            dangerouslySetInnerHTML={{ __html: item.a }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
