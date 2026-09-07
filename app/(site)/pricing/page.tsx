// Public pricing page — the long-form version of the tier cards on the homepage.
//
// Recreated from the app's own /pricing (app.generasoftware.com) in this site's design
// system, because a visitor comparing plans should never be bounced onto the product
// domain to read marketing copy. Everything a customer could hold us to — prices, seat
// counts, the trial length, what each tier unlocks — comes from lib/pricing.ts, so the
// hero, the cards, the walkthrough and the FAQ cannot drift apart from each other.

import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import Paw from "@/components/Paw";
import PricingTiers from "@/components/PricingTiers";
import WhatYouKeep from "@/components/WhatYouKeep";
import StartTrialLink from "@/components/StartTrialLink";
import { TIER_MOCKUPS } from "@/components/pricing/TierMockups";
import {
  CORE_FEATURE_CARDS,
  GATED_FEATURE_CARDS,
  PRICING_TIERS,
  SETUP_STEPS,
  TIER_STORIES,
  TRIAL_DAYS,
  money,
  seatPhrase,
  seatSummary,
} from "@/lib/pricing";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Pricing — Dog Daycare Software from £50 a Month",
    description:
      "Genera pricing for dog daycares and pet businesses: Starter £50, Grow £75 and Thrive £99 a month, each with a 30-day free trial. No commission, no per-booking fee, no contract.",
    path: "/pricing",
  }),
};

const BADGE_TONES = {
  teal: "border-teal-mid bg-teal-soft text-forest",
  gold: "border-[#FFD98A] bg-gold-light text-ink",
  muted: "border-teal-mid bg-white text-ink-soft",
} as const;

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Do I need a card to start the trial?",
    a: `No. Every plan starts with a ${TRIAL_DAYS}-day free trial and no card. You set up the Direct Debit when you decide to stay.`,
  },
  {
    q: "What happens if I move down a tier?",
    a: "Nothing is taken away from the people already working for you. If you're over the seat count for your new tier, everyone keeps their login — only the next new one is blocked. Billing should never take a working login away mid-shift.",
  },
  {
    q: "What does a feature I'm not paying for look like?",
    a: "A preview, not a locked door. The page explains what the feature is, how it's used, and shows a mock of the real screen filled with sample data — so you can see whether it's worth the upgrade before you make it.",
  },
  {
    q: "How many people can hold a login?",
    a: `${seatSummary.charAt(0).toUpperCase()}${seatSummary.slice(1)}. Drivers and service providers hold a login, so they count. The rota, time off and staff profiles themselves are in every tier.`,
  },
  {
    q: "Marketing tools are listed as in development. Am I paying for nothing?",
    a: "It isn't built yet, and we'd rather say so on the pricing page than in the small print. It's included in Thrive and will appear in your account as it ships. Everything else in Thrive is live today.",
  },
  {
    q: "Do you take a percentage of what my customers pay me?",
    a: "No. The plan is the only thing we bill you for — there is no commission on your invoices, no cut of a card payment, and no per-booking fee. You'll still pay your own payment provider their processing fee, exactly as you would without us, and we take no share of that either.",
  },
  {
    q: "How is the subscription collected?",
    a: "Monthly by Direct Debit, protected by the Direct Debit Guarantee. No setup fee, no contract, change or cancel any time. Separate from the payments your own customers make to you.",
  },
];

export default function PricingPage() {
  const storyTiers = PRICING_TIERS.filter((tier) => TIER_STORIES[tier.name]);
  const toolCount = CORE_FEATURE_CARDS.length + GATED_FEATURE_CARDS.length;

  return (
    <>
      <Reveal />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream to-cream px-6 pt-24 pb-8 text-center md:px-8 md:pt-32 md:pb-10">
        <Paw
          aria-hidden
          className="absolute right-[6%] top-[22%] hidden h-20 w-20 animate-[var(--animate-wobble)] text-forest opacity-10 md:block"
        />

        <div className="relative z-10 mx-auto max-w-[760px]">
          <p className="eyebrow">Simple pricing</p>
          <h1 className="text-figure-md md:[font-size:clamp(2.2rem,4.4vw,3.2rem)]">
            One subscription.{" "}
            <span className="squig">
              Everything
              <svg viewBox="0 0 180 12" preserveAspectRatio="none" aria-hidden>
                <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7" />
              </svg>
            </span>{" "}
            your daycare runs on.
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-body-lg text-ink-soft md:mt-5">
            Bookings, routes, invoicing and owner communication — priced by the
            size of your setting, not by how much you use it.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-teal-mid bg-white px-4 py-1.5 text-meta font-semibold text-forest md:mt-5">
            <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
            {TRIAL_DAYS}-day free trial &nbsp;·&nbsp; no card needed to start
          </p>
        </div>
      </section>

      {/* ── Plans ───────────────────────────────────────────────── */}
      <PricingTiers id="plans" showHeader={false} background="bg-cream" />

      {/* ── What you keep ───────────────────────────────────────── */}
      <WhatYouKeep />

      {/* ── What you get ────────────────────────────────────────── */}
      <section id="features" className="bg-white px-6 py-13 md:px-8 md:py-22">
        <div className="mx-auto max-w-[1160px]">
          <div className="rev">
            <p className="eyebrow">What you get</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              {toolCount} tools, one login.
            </h2>
            <p className="mt-2.5 max-w-[62ch] text-meta text-ink-soft md:mt-4 md:text-base">
              {CORE_FEATURE_CARDS.length} of them are in every plan, whatever
              you pay. The rest arrive as your setting grows — and until they
              do, the page shows you what it does rather than a closed door.
            </p>
          </div>

          <h3 className="mb-4 mt-8 text-eyebrow font-bold uppercase tracking-wider text-ink-soft md:mt-12">
            In every plan
          </h3>
          <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {CORE_FEATURE_CARDS.map((feature, i) => (
              <div
                key={feature.title}
                className={`rev d${(i % 6) + 1} rounded-2xl border border-cream-dark bg-cream p-5`}
              >
                <p className="font-massilia text-base font-bold text-forest md:text-lg">
                  {feature.title}
                </p>
                <p className="mt-1.5 text-meta leading-snug text-ink-soft">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mb-4 mt-10 text-eyebrow font-bold uppercase tracking-wider text-ink-soft md:mt-12">
            Unlocked by your plan
          </h3>
          <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {GATED_FEATURE_CARDS.map((feature, i) => (
              <div
                key={feature.title}
                className={`rev d${(i % 6) + 1} flex flex-col rounded-2xl p-5 ${
                  feature.pending
                    ? "border border-dashed border-teal-mid bg-cream"
                    : "border border-teal-mid bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <p className="font-massilia text-base font-bold text-forest md:text-lg">
                    {feature.title}
                  </p>
                  <span
                    className={`ml-auto inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[0.7rem] font-bold uppercase tracking-wide ${
                      BADGE_TONES[feature.tone]
                    }`}
                  >
                    {feature.plan ?? feature.badge}
                  </span>
                </div>
                <p className="mt-2.5 text-meta leading-snug text-ink-soft">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Which tier ──────────────────────────────────────────── */}
      <section
        id="tiers"
        className="bg-gradient-to-b from-cream to-teal-soft px-6 py-13 md:px-8 md:py-22"
      >
        <div className="mx-auto max-w-[1160px]">
          <div className="rev">
            <p className="eyebrow">Which tier</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              Priced by the shape of your setting.
            </h2>
          </div>

          {storyTiers.map((tier, index) => {
            const story = TIER_STORIES[tier.name];
            const Mock = TIER_MOCKUPS[story.mock];
            // Alternate which side the mockup sits on; DOM order stays copy-first so the
            // heading is read before its illustration on a phone.
            const mockFirst = index % 2 === 1;
            return (
              <div
                key={tier.id}
                className="rev mt-8 grid grid-cols-1 items-center gap-6 md:mt-14 md:grid-cols-2 md:gap-10"
              >
                <div className={mockFirst ? "md:order-2" : ""}>
                  <p className="text-eyebrow font-bold uppercase tracking-wider text-ink-soft">
                    {tier.name} · {money(tier.monthlyPrice)} a month
                  </p>
                  <h3 className="mt-2 font-massilia text-lg font-bold leading-tight text-forest md:text-[1.6rem]">
                    {story.headline}
                  </h3>
                  <p className="mt-3 text-meta leading-relaxed text-ink-soft md:text-base">
                    {story.body}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5 md:mt-5">
                    {[
                      ...story.bullets,
                      seatPhrase(tier.staffLimit) + (story.seatTail || ""),
                    ].map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2.5 text-meta leading-snug text-ink"
                      >
                        <span
                          aria-hidden
                          className={`font-extrabold ${
                            tier.featured ? "text-gold" : "text-forest"
                          }`}
                        >
                          ·
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <StartTrialLink
                    tierId={tier.id}
                    className={`btn mt-5 ${
                      tier.featured ? "btn-gold" : "btn-outline-d"
                    }`}
                  >
                    Try {tier.name} free
                  </StartTrialLink>
                </div>
                <div className={mockFirst ? "md:order-1" : ""}>
                  <Mock />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Moving in ───────────────────────────────────────────── */}
      <section id="moving-in" className="bg-white px-6 py-13 md:px-8 md:py-22">
        <div className="mx-auto grid max-w-[1160px] items-start gap-7 md:grid-cols-2 md:gap-12">
          <div className="rev">
            <p className="eyebrow">Moving in</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              Set up in an afternoon, not a quarter.
            </h2>
            <p className="mt-2.5 max-w-[46ch] text-meta leading-relaxed text-ink-soft md:mt-4 md:text-base">
              You start on a {TRIAL_DAYS}-day trial with no card. Nothing is
              charged until you decide to stay, and the trial is a real trial —
              the tier you pick is the tier you&apos;re testing.
            </p>
            <Link href="/contact" className="btn btn-outline-d mt-5">
              Talk to us first
            </Link>
          </div>

          <ol className="rev d2 flex flex-col">
            {SETUP_STEPS.map((step, index) => {
              const last = index === SETUP_STEPS.length - 1;
              return (
                <li
                  key={step.title}
                  className={`flex gap-4 border-t border-cream-dark py-4 ${
                    last ? "border-b" : ""
                  }`}
                >
                  <span
                    className={`inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full font-massilia font-bold ${
                      last
                        ? "bg-gold-light text-[#8A5A00]"
                        : "bg-teal-soft text-forest"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-massilia text-base font-bold text-forest">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-meta leading-snug text-ink-soft">
                      {step.body}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="bg-cream px-6 py-13 md:px-8 md:py-22">
        <div className="mx-auto max-w-[880px]">
          <div className="rev">
            <p className="eyebrow">Before you sign up</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              Questions people ask us first.
            </h2>
          </div>

          <div className="rev d1 mt-6 md:mt-8">
            {FAQS.map((faq) => (
              // Native <details> so the FAQ needs no client JS; the "+" rotates on open.
              <details
                key={faq.q}
                className="group border-b border-cream-dark"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 py-4 font-massilia text-base font-bold text-forest marker:hidden">
                  {faq.q}
                  <span
                    aria-hidden
                    className="ml-auto shrink-0 text-xl text-gold transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mb-5 text-meta leading-relaxed text-ink-soft md:text-base">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 py-14 text-center text-white md:px-8 md:py-22">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-24 h-[300px] w-[300px] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-gold/10"
        />
        <div className="relative z-10 mx-auto max-w-[760px]">
          <p className="eyebrow !text-gold-soft">Ready when you are</p>
          <h2 className="text-section-h !text-white md:text-[length:inherit]">
            Give your Sundays back.
          </h2>
          <p className="mx-auto mt-2.5 max-w-[520px] text-meta text-white/80 md:mt-4 md:text-base">
            Set up in an afternoon. Bring your pets, owners and bookings across,
            and let the invoicing run itself.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 md:mt-7 md:flex-row md:flex-wrap md:justify-center md:gap-3.5">
            <StartTrialLink className="btn btn-gold btn-lg w-full justify-center md:w-auto">
              Start your {TRIAL_DAYS}-day trial
            </StartTrialLink>
            <Link
              href="#plans"
              className="btn btn-outline-w btn-lg w-full justify-center md:w-auto"
            >
              Back to the plans
            </Link>
          </div>
          <p className="mt-3.5 font-caveat text-base text-white/70 md:mt-5 md:text-lg">
            No credit card &nbsp;·&nbsp; No setup fee &nbsp;·&nbsp; Cancel any
            time
          </p>
        </div>
      </section>
    </>
  );
}
