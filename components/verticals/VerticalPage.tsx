import Link from "next/link";
import Paw from "@/components/Paw";
import PricingTiers from "@/components/PricingTiers";
import Reveal from "@/components/Reveal";
import StartTrialLink from "@/components/StartTrialLink";
import FeatureIcon from "@/components/features/FeatureIcon";
import { featureCardStyle } from "@/lib/features";
import { PRICING_TIERS, TOP_TIER, TRIAL_DAYS } from "@/lib/pricing";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { VERTICALS, type Vertical } from "@/lib/verticals";

/* ============================================================
   One landing page per business type. The shape is fixed so the
   four pages read as one family: hero, the one-paragraph answer,
   the jobs it does for this business, a licensing or honesty
   note, the plans, questions, and a trial button. Copy lives in
   lib/verticals.ts.
   ============================================================ */

export default function VerticalPage({ vertical }: { vertical: Vertical }) {
  const url = `${SITE_URL}/${vertical.slug}`;
  const others = VERTICALS.filter((v) => v.slug !== vertical.slug);
  const from = PRICING_TIERS.reduce((a, t) => Math.min(a, t.monthlyPrice), Infinity);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url,
    description: vertical.definition,
    audience: { "@type": "BusinessAudience", audienceType: vertical.audience },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      lowPrice: from,
      highPrice: TOP_TIER.monthlyPrice,
      offerCount: PRICING_TIERS.length,
      url: `${SITE_URL}/pricing`,
    },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vertical.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Reveal />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 pt-28 pb-20 text-white md:px-8 md:pt-36 md:pb-28">
        <Paw className="absolute right-[5%] top-[18%] hidden h-24 w-24 rotate-12 animate-[var(--animate-wobble)] text-white opacity-10 md:block" />
        <div className="mx-auto max-w-[860px]">
          <span className="rounded-full bg-gold-light/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
            {vertical.eyebrow}
          </span>
          <h1 className="mt-4 text-white [font-size:clamp(2rem,4vw,3.4rem)] leading-[1.06]">
            {vertical.h1}
          </h1>
          <p className="mt-5 max-w-[640px] text-body-lg leading-[1.6] text-white/85">{vertical.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <StartTrialLink className="btn btn-gold btn-lg" />
            <Link href="/pricing" className="btn btn-outline-w btn-lg">
              Plans from £{from} a month
            </Link>
          </div>
          <p className="mt-4 text-fine text-white/70">
            {TRIAL_DAYS} days free with everything unlocked. No card to start, no contract.
          </p>
        </div>
      </section>

      {/* The one-paragraph answer */}
      <section className="bg-cream px-6 md:px-8">
        <div className="mx-auto -mt-10 max-w-[860px] md:-mt-14">
          <div className="rounded-2xl border-2 border-gold bg-white p-6 md:p-8">
            <p className="eyebrow">In one paragraph</p>
            <p className="mt-3 text-[1.1rem] leading-[1.65] text-ink md:text-[1.18rem]">
              {vertical.definition}
            </p>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="bg-cream px-6 py-16 md:px-8 md:py-22">
        <div className="mx-auto max-w-[1100px]">
          <div className="rev mb-10 text-center md:mb-14">
            <p className="eyebrow">What it does for {vertical.audience}</p>
            <h2 className="text-section-h md:text-section-h-lg">
              The jobs that eat the week, handled.
            </h2>
          </div>
          <ul className="grid gap-5 md:grid-cols-2">
            {vertical.blocks.map((b, i) => (
              <li
                key={b.title}
                className={`rev d${(i % 6) + 1} flex flex-col rounded-2xl border border-cream-dark p-6 transition-colors hover:border-[color:var(--accent-edge)] md:p-7`}
                style={featureCardStyle(b.feature, "#fff")}
              >
                <div className="flex items-start gap-4">
                  <FeatureIcon feature={b.feature} />
                  <div>
                    <h3 className="font-massilia text-[1.2rem] font-bold leading-snug text-forest">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-[1rem] leading-[1.62] text-ink-soft">{b.body}</p>
                    {b.more && (
                      <Link
                        href={`/features#${b.more}`}
                        className="mt-3 inline-block text-meta font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-forest-mid"
                      >
                        See how it works
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Notes */}
      {vertical.notes && vertical.notes.length > 0 && (
        <section className="bg-teal-soft/50 px-6 py-14 md:px-8 md:py-18">
          <div className="mx-auto grid max-w-[1100px] gap-5">
            {vertical.notes.map((n) => (
              <div
                key={n.title}
                className="rev rounded-2xl border-2 border-gold/60 bg-white p-6 md:p-8"
              >
                <h2 className="font-massilia text-[1.35rem] font-bold text-forest md:text-[1.5rem]">
                  {n.title}
                </h2>
                <p className="mt-3 text-body-lg leading-[1.65] text-ink-soft">{n.body}</p>
                {n.href && (
                  <Link
                    href={n.href}
                    className="mt-4 inline-block font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-forest-mid"
                  >
                    {n.linkLabel ?? "Read more"}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Plans */}
      <PricingTiers id="plans" showHeader background="bg-cream" />

      {/* FAQ */}
      <section className="bg-cream px-6 pb-16 md:px-8 md:pb-22">
        <div className="mx-auto max-w-[860px]">
          <h2 className="mb-5 text-center font-massilia text-[1.6rem] font-bold text-forest md:text-[1.9rem]">
            Questions {vertical.audience} ask
          </h2>
          <dl className="divide-y divide-cream-dark rounded-2xl border border-cream-dark bg-white">
            {vertical.faqs.map((f) => (
              <div key={f.q} className="px-5 py-5 md:px-6">
                <dt className="font-massilia text-[1.12rem] font-bold text-forest">{f.q}</dt>
                <dd className="mt-2 text-body-lg leading-[1.65] text-ink-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center text-meta text-ink-soft">
            Also built for{" "}
            {others.map((o, i) => (
              <span key={o.slug}>
                <Link
                  href={`/${o.slug}`}
                  className="font-semibold text-forest underline decoration-gold underline-offset-2"
                >
                  {o.audience}
                </Link>
                {i < others.length - 2 ? ", " : i === others.length - 2 ? " and " : ""}
              </span>
            ))}
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-dark px-8 py-22 text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="text-heading-mid !text-white">
            {TRIAL_DAYS} days with everything unlocked
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/80">
            Set up your services, put your logo on the app and send the link to a few
            owners. If it does not earn its place in a month, walk away; nothing was
            charged.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <StartTrialLink className="btn btn-gold btn-lg" />
            <a
              href="mailto:info@generasoftware.com?subject=Question%20about%20Genera"
              className="btn btn-outline-w btn-lg"
            >
              Ask a question
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
