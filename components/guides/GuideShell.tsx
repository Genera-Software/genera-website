import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { AUTHOR_BIO, AUTHOR_NAME, AUTHOR_TITLE, SITE_NAME, SITE_URL } from "@/lib/seo";
import { GUIDES, formatGuideDate, type Guide } from "@/lib/guides";

/* ============================================================
   The frame every reference guide sits in. Title, the dates it
   was published and last checked, the short answer in a box an
   answer engine can lift whole, an in-page contents list, the
   body, the FAQ (also emitted as FAQPage schema), the sources,
   the author, and a soft product link. No hard sell: a licence
   page that pushes a trial reads as an advert and gets treated
   like one.
   ============================================================ */

export type GuideContentsItem = { id: string; label: string };

export default function GuideShell({
  guide,
  contents,
  children,
  related,
}: {
  guide: Guide;
  contents: GuideContentsItem[];
  children: ReactNode;
  /** Slugs of other guides to list at the foot. Defaults to every other guide. */
  related?: string[];
}) {
  const url = `${SITE_URL}/guides/${guide.slug}`;
  const others = GUIDES.filter((g) =>
    related ? related.includes(g.slug) : g.slug !== guide.slug,
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedOn,
    dateModified: guide.checkedOn,
    inLanguage: "en-GB",
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      description: AUTHOR_BIO,
      jobTitle: AUTHOR_TITLE,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/genera-svg.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    citation: guide.sources.map((s) => s.href),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Reveal />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 pt-28 pb-14 text-white md:px-8 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-[820px]">
          <Link
            href="/guides"
            className="mb-6 flex w-fit items-center gap-2 text-sm font-semibold text-gold-soft transition-colors hover:text-gold"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All guides
          </Link>
          <span className="rounded-full bg-gold-light/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
            {guide.eyebrow}
          </span>
          <h1 className="mt-4 text-white [font-size:clamp(1.9rem,3.6vw,3.1rem)] leading-[1.08]">
            {guide.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/80">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-bold text-forest-dark">
              {AUTHOR_NAME.charAt(0)}
            </span>
            <span className="font-semibold text-white">{AUTHOR_NAME}</span>
            <span className="hidden h-3 w-px bg-white/30 sm:block" />
            <span>Published {formatGuideDate(guide.publishedOn)}</span>
            <span className="hidden h-3 w-px bg-white/30 sm:block" />
            <span>
              Every figure checked against its source on{" "}
              <time dateTime={guide.checkedOn} className="font-semibold text-white">
                {formatGuideDate(guide.checkedOn)}
              </time>
            </span>
          </div>
        </div>
      </section>

      {/* Short answer. Lifts into the hero, so it needs its own stacking
          context: the hero is overflow-hidden and clips it otherwise. */}
      <section className="relative z-10 bg-cream px-6 md:px-8">
        <div className="mx-auto -mt-8 max-w-[820px] md:-mt-10">
          <div className="rounded-2xl border-2 border-gold bg-white p-6 md:p-8">
            <p className="eyebrow">Short answer</p>
            <p className="mt-3 text-[1.15rem] leading-[1.65] text-ink md:text-[1.22rem]">
              {guide.shortAnswer}
            </p>
          </div>
        </div>
      </section>

      {/* The numbers people came for, before the prose starts. */}
      {guide.keyFigures && guide.keyFigures.length > 0 && (
        <section className="bg-cream px-6 pt-10 md:px-8 md:pt-12">
          <ul className="mx-auto grid max-w-[820px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {guide.keyFigures.map((k) => (
              <li
                key={k.label}
                className="rev rounded-2xl border-2 border-teal-mid bg-white px-5 py-4 text-center"
              >
                <span className="block font-massilia text-figure-md font-bold leading-none text-forest">
                  {k.figure}
                </span>
                <span className="mt-2 block text-meta font-semibold text-ink">{k.label}</span>
                <span className="mt-1 block text-fine text-ink-soft">{k.note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Contents + body */}
      <section className="bg-cream px-6 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[820px]">
          <nav
            aria-label="On this page"
            className="mb-12 rounded-2xl border border-cream-dark bg-white/70 px-5 py-4"
          >
            <p className="text-eyebrow font-bold uppercase tracking-wider text-forest">
              On this page
            </p>
            <ol className="mt-2 grid gap-x-8 gap-y-1.5 text-[0.98rem] md:grid-cols-2">
              {contents.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="text-forest underline decoration-gold/70 underline-offset-2 hover:text-forest-mid"
                  >
                    {i + 1}. {c.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#faq"
                  className="text-forest underline decoration-gold/70 underline-offset-2 hover:text-forest-mid"
                >
                  {contents.length + 1}. Questions people ask
                </a>
              </li>
              <li>
                <a
                  href="#sources"
                  className="text-forest underline decoration-gold/70 underline-offset-2 hover:text-forest-mid"
                >
                  {contents.length + 2}. Sources
                </a>
              </li>
            </ol>
          </nav>

          <div className="space-y-14">{children}</div>

          {/* FAQ */}
          <section id="faq" className="mt-14 scroll-mt-28">
            <h2 className="mb-4 font-massilia text-[1.6rem] font-bold leading-[var(--leading-title)] text-forest md:text-[1.85rem]">
              Questions people ask
            </h2>
            <dl className="divide-y divide-cream-dark rounded-2xl border border-cream-dark bg-white">
              {guide.faqs.map((f) => (
                <div key={f.q} className="px-5 py-5 md:px-6">
                  <dt className="font-massilia text-[1.12rem] font-bold text-forest">{f.q}</dt>
                  <dd className="mt-2 text-body-lg leading-[1.65] text-ink-soft">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Sources */}
          <section id="sources" className="mt-14 scroll-mt-28">
            <h2 className="mb-4 font-massilia text-[1.6rem] font-bold leading-[var(--leading-title)] text-forest md:text-[1.85rem]">
              Sources
            </h2>
            <p className="mb-4 text-meta text-ink-soft">
              Everything above comes from one of these. Each was read on{" "}
              {formatGuideDate(guide.checkedOn)}. If a figure has moved since, email{" "}
              <a
                href="mailto:info@generasoftware.com?subject=Guide%20correction"
                className="font-semibold text-forest underline decoration-gold underline-offset-2"
              >
                info@generasoftware.com
              </a>{" "}
              and the page is corrected, not appended.
            </p>
            <ol className="list-decimal space-y-3 pl-6 text-[0.98rem] leading-[1.6] text-ink-soft">
              {guide.sources.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-forest-mid"
                  >
                    {s.label}
                  </a>
                  {s.note && <span className="block text-meta text-ink-soft">{s.note}</span>}
                </li>
              ))}
            </ol>
          </section>

          {/* Author */}
          <div className="mt-14 rounded-2xl border border-cream-dark bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-forest text-lg font-bold text-white">
                {AUTHOR_NAME.charAt(0)}
              </span>
              <div>
                <p className="font-massilia text-lg font-bold text-forest">{AUTHOR_NAME}</p>
                <p className="mb-2 text-sm font-semibold text-forest-mid">{AUTHOR_TITLE}</p>
                <p className="text-sm leading-relaxed text-ink-soft">{AUTHOR_BIO}</p>
              </div>
            </div>
          </div>

          {/* Related */}
          {others.length > 0 && (
            <div className="mt-10">
              <p className="eyebrow">More guides</p>
              <ul className="mt-3 grid gap-3 md:grid-cols-2">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides/${g.slug}`}
                      className="block rounded-2xl border border-cream-dark bg-white px-5 py-4 transition-colors hover:border-forest/40"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-forest-mid">
                        {g.eyebrow}
                      </span>
                      <span className="mt-1 block font-massilia text-[1.05rem] font-bold leading-snug text-forest">
                        {g.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Soft product link */}
      <section className="bg-forest-dark px-6 py-16 text-center text-white md:px-8 md:py-20">
        <div className="rev mx-auto max-w-[680px]">
          <h2 className="text-heading-mid !text-white">Where Genera comes in</h2>
          <p className="mx-auto mt-4 text-white/80">
            Genera is the booking and invoicing software Duncan built to run his own
            licensed daycare. It holds you to the daily numbers on your licence, keeps
            every dog&apos;s vaccination dates where an inspector can see them, and
            invoices the month from the bookings you actually took.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/dog-daycare-software" className="btn btn-gold btn-lg">
              See it for daycares
            </Link>
            <Link href="/pricing" className="btn btn-outline-w btn-lg">
              Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
