import Link from "next/link";
import type { Metadata } from "next";
import { getDocSections, getLatestUpdates } from "./_data/load";
import { WHATS_NEW_SLUG, type UpdateSummary } from "./_data/sections";
import SectionIcon from "./_components/SectionIcon";
import SupportTicketButton from "./_components/SupportTicketButton";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Help Centre",
  description:
    "Everything you need to run your daycare in Genera — a page-by-page guide to the admin portal.",
};

export default async function DocsHome() {
  const [SECTIONS, updates] = await Promise.all([
    getDocSections(),
    getLatestUpdates(3),
  ]);
  const guide = SECTIONS.filter((s) => s.slug !== WHATS_NEW_SLUG);
  const latest = updates.items[0];
  return (
    <div className="mx-auto max-w-[860px]">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-7 py-12 text-white sm:px-10 sm:py-14">
        {latest && (
          <Link
            href={`/docs/${WHATS_NEW_SLUG}#${latest.anchor}`}
            className="group mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 py-1 pr-3 pl-1 text-fine text-white ring-1 ring-white/20 transition hover:bg-white/15"
          >
            <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 font-massilia text-[0.7rem] font-bold tracking-wide text-ink">
              NEW
            </span>
            <span className="truncate">{latest.title}</span>
            <span
              aria-hidden
              className="shrink-0 text-gold transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        )}
        <p className="eyebrow !text-gold-soft !mb-2">Help Centre</p>
        <h1 className="!text-white text-[clamp(2.1rem,5vw,3.2rem)]">
          Learn <em className="text-gold">Genera</em>, page by page
        </h1>
        <p className="mt-4 max-w-[560px] text-white/80">
          A practical reference for the admin portal. Every section below
          explains what a page does and how to use it day to day. Pick a topic
          to get started.
        </p>
      </section>

      {updates.items.length > 0 && (
        <WhatsNewPanel items={updates.items} total={updates.total} />
      )}

      {/* Orientation note */}
      <section className="mt-8 rounded-2xl border border-teal-mid bg-white p-6">
        <h2 className="!text-[1.4rem] text-forest">Before you start</h2>
        <p className="mt-3 text-meta text-ink-soft">
          The admin portal lives under <Code>/admin</Code>. Every daycare has its
          own tenant, so all the data you see is scoped to your business. The
          left sidebar holds the main navigation — Dashboard, Bookings, Owners,
          Pets, Finance, Reports, Team and Routes — plus Settings under your
          profile menu. Some Finance and booking features require a connected
          payment provider (Stripe or GoCardless).
        </p>
      </section>

      {/* Section grid */}
      <h2 className="mt-12 mb-5 !text-[1.65rem] text-ink">Browse by section</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {guide.map((s) => (
          <Link
            key={s.slug}
            href={`/docs/${s.slug}`}
            className="group flex gap-4 rounded-2xl border border-teal-mid bg-white p-5 transition-all hover:-translate-y-1 hover:border-forest hover:shadow-[0_14px_32px_rgba(0,62,69,0.12)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-forest transition-colors group-hover:bg-forest group-hover:text-gold">
              <SectionIcon slug={s.slug} className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="font-massilia text-fine font-bold text-gold">
                  {String(s.num).padStart(2, "0")}
                </span>
                <span className="font-massilia text-[1.2rem] font-bold text-ink">
                  {s.title}
                </span>
              </span>
              <span className="mt-1 block text-meta text-ink-soft">
                {s.tagline}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-7 py-10 text-white sm:px-10">
        <p className="font-caveat text-xl text-gold-soft">Still stuck?</p>
        <h2 className="!text-white mt-1 text-[clamp(1.5rem,3vw,2rem)]">
          Submit a support ticket
        </h2>
        <p className="mt-3 max-w-[480px] text-white/80">
          A few quick questions and we&apos;ll get a ticket to the Genera team —
          typically within a day.
        </p>
        <SupportTicketButton className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-6 py-3 font-massilia text-[0.95rem] font-bold text-ink shadow-[0_4px_18px_rgba(255,168,0,0.35)] transition hover:shadow-[0_8px_28px_rgba(255,168,0,0.45)]">
          Get help
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </SupportTicketButton>
      </section>
    </div>
  );
}

/* The latest few changelog entries, straight under the hero, so returning
   users see what changed before they reach the guide. */
function WhatsNewPanel({
  items,
  total,
}: {
  items: UpdateSummary[];
  total: number;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-gold-soft bg-white p-6 shadow-[0_10px_30px_rgba(255,168,0,0.10)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-forest">
            <SectionIcon slug={WHATS_NEW_SLUG} className="h-5 w-5" />
          </span>
          <div>
            <h2 className="!text-[1.4rem] text-forest">What&apos;s New</h2>
            <p className="!text-fine text-ink-soft">
              The latest changes to Genera
            </p>
          </div>
        </div>
        <Link
          href={`/docs/${WHATS_NEW_SLUG}`}
          className="text-meta font-semibold text-forest underline decoration-gold underline-offset-4 transition-colors hover:text-forest-dark"
        >
          See all {total} updates →
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-teal-mid/70">
        {items.map((u) => (
          <li key={u.anchor}>
            <Link
              href={`/docs/${WHATS_NEW_SLUG}#${u.anchor}`}
              className="group flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-4"
            >
              {u.date && (
                <span className="shrink-0 text-fine font-semibold text-ink-soft sm:w-[8.5rem]">
                  {u.date}
                </span>
              )}
              <span className="font-massilia text-[1.02rem] font-bold text-ink transition-colors group-hover:text-forest">
                {u.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-cream-dark px-1.5 py-0.5 font-mono text-[0.85em] text-forest">
      {children}
    </code>
  );
}
