"use client";

import { useState } from "react";

export type FaqItem = {
  id: string;
  q: string;
  a: string; // HTML
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-[0_4px_16px_rgba(0,62,69,0.04)]"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-massilia text-base font-bold text-forest transition-colors hover:bg-cream md:text-lg"
            >
              <span>{item.q}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
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
  );
}
