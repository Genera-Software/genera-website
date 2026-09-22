import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { GUIDES, formatGuideDate } from "@/lib/guides";
import { REPORT } from "@/lib/report";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "UK dog daycare licensing guides, from the rules to the fees",
  description:
    "Reference pages on dog daycare and boarding licensing in England, built from gov.uk guidance, legislation, council FOI responses and tribunal decisions. Every figure dated and sourced.",
  path: "/guides",
});

export default function GuidesIndex() {
  return (
    <>
      <Reveal />
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 pt-28 pb-16 text-white md:px-8 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-[860px] text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
            🐾 Reference guides
          </div>
          <h1 className="mt-2 text-white [font-size:clamp(1.9rem,3.6vw,3.1rem)] leading-[1.08]">
            The licensing rules, with the sources attached
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-white/80">
            Written by a licensed daycare owner from the primary documents: gov.uk
            statutory guidance, legislation.gov.uk, council fee schedules and Freedom of
            Information answers, and the tribunal decision that settled what the guidance
            is worth. Each page says when every figure was last checked.
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 py-16 md:px-8 md:py-22">
        <Link
          href={REPORT.path}
          className="rev mx-auto mb-8 block max-w-[1000px] rounded-2xl border-2 border-gold bg-white p-6 transition-colors hover:border-forest/60 md:p-7"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-forest-mid">
            {REPORT.eyebrow}
          </span>
          <span className="mt-2 block font-massilia text-[1.35rem] font-bold leading-snug text-forest">
            {REPORT.title}
          </span>
          <span className="mt-3 block text-[0.98rem] leading-[1.6] text-ink-soft">
            The guides below, pulled into one report with the Surrey fee comparison, the
            2027 council merger and the sentencing comparison. Eight findings, each with its
            source. Made for journalists and councillors to quote.
          </span>
          <span className="mt-5 block text-meta text-ink-soft">
            Checked {formatGuideDate(REPORT.checkedOn)} · PDF available
          </span>
        </Link>
        <ul className="mx-auto grid max-w-[1000px] gap-5 md:grid-cols-2">
          {GUIDES.map((g, i) => (
            <li key={g.slug} className={`rev d${(i % 4) + 1}`}>
              <Link
                href={`/guides/${g.slug}`}
                className="flex h-full flex-col rounded-2xl border border-cream-dark bg-white p-6 transition-colors hover:border-forest/40 md:p-7"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-forest-mid">
                  {g.eyebrow}
                </span>
                <span className="mt-2 font-massilia text-[1.35rem] font-bold leading-snug text-forest">
                  {g.title}
                </span>
                <span className="mt-3 flex-1 text-[0.98rem] leading-[1.6] text-ink-soft">
                  {g.description}
                </span>
                <span className="mt-5 text-meta text-ink-soft">
                  Checked {formatGuideDate(g.checkedOn)} · {g.sources.length} sources
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-[720px] text-center text-meta text-ink-soft">
          These pages cover England unless they say otherwise. They are not legal
          advice; they are the documents, read carefully, with the page numbers. For the
          software side, see{" "}
          <Link
            href="/dog-daycare-software"
            className="font-semibold text-forest underline decoration-gold underline-offset-2"
          >
            Genera for dog daycares
          </Link>
          .
        </p>
      </section>
    </>
  );
}
