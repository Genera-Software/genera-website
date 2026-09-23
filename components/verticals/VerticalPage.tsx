import Image from "next/image";
import Link from "next/link";
import Paw from "@/components/Paw";
import TrustBar, { type TrustLogo } from "@/components/TrustBar";
import Reveal from "@/components/Reveal";
import StartTrialLink from "@/components/StartTrialLink";
import FeatureIcon from "@/components/features/FeatureIcon";
import Testimonials from "@/components/testimonials/Testimonials";
import Spotlights from "@/components/verticals/Spotlights";
import { COMPARISON_POSTS } from "@/lib/compare";
import { featureCardStyle } from "@/lib/features";
import { PRICING_TIERS, TOP_TIER, TRIAL_DAYS } from "@/lib/pricing";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { getPublicSupabase } from "@/lib/supabase/server";
import { TESTIMONIAL_COLUMNS, testimonialFromRow } from "@/lib/testimonials";
import { VERTICALS, type HeroCard, type Vertical } from "@/lib/verticals";

/* ============================================================
   One landing page per business type, built from the same
   parts as the homepage and /features so the four read as one
   family: the hero with floating cards and the dogs, the trust
   bar, the one-paragraph answer, the drawn screens as
   spotlights under a /features category header, everything
   else as cards, a licensing or honesty note, testimonials, the
   plans in one strip, questions, trial.
   Copy and numbers live in lib/verticals.ts.
   ============================================================ */

const TONES: Record<HeroCard["tone"], string> = {
  coral: "from-[#E8856A] to-[#C96B52]",
  green: "from-[#6B9E72] to-[#4E7D58]",
  gold: "from-[#E8A430] to-[#C8880A]",
};
const FLOATS = ["var(--animate-float-1)", "var(--animate-float-2)", "var(--animate-float-3)"];
const OFFSETS = ["", "mt-8", "mt-2"];

export default async function VerticalPage({ vertical }: { vertical: Vertical }) {
  const url = `${SITE_URL}/${vertical.slug}`;
  const others = VERTICALS.filter((v) => v.slug !== vertical.slug);
  const from = PRICING_TIERS.reduce((a, t) => Math.min(a, t.monthlyPrice), Infinity);

  let testimonials: ReturnType<typeof testimonialFromRow>[] = [];
  let trustLogos: TrustLogo[] = [];
  try {
    const supabase = getPublicSupabase();
    const [logosRes, testimonialsRes] = await Promise.all([
      supabase
        .from("trust_logos")
        .select("id, name, logo_url")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("testimonials")
        .select(TESTIMONIAL_COLUMNS)
        .eq("is_visible", true)
        .order("sort_order", { ascending: true }),
    ]);
    trustLogos = logosRes.data ?? [];
    testimonials = (testimonialsRes.data ?? []).map(testimonialFromRow);
  } catch {
    // No Supabase (local preview): the page still renders, without logos or quotes.
  }

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

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative flex flex-col overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 pt-24 pb-0 md:px-8 md:pt-32 md:pb-16">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-24 h-[260px] w-[260px] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-gold/10 md:h-[420px] md:w-[420px]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 -left-20 h-[200px] w-[200px] rounded-[40%_60%_55%_45%/48%_52%_48%_52%] bg-white/5 md:h-[280px] md:w-[280px]"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/4 md:block">
          <Image
            src="/images/hero-background-fun.png"
            alt=""
            aria-hidden
            fill
            priority
            sizes="(max-width: 1280px) 50vw, 560px"
            className="object-contain object-right"
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1160px] flex-col items-start text-left">
          <div className="mb-4 inline-flex animate-[fadeInUp_0.6s_ease_both] items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-4 py-1.5 font-caveat text-body-lg font-bold text-gold-soft md:px-6 md:py-2.5 md:text-section-h">
            <Paw className="h-[1.1em] w-[1.1em]" /> {vertical.pill}
          </div>

          <h1 className="rev mb-3 max-w-[560px] animate-[fadeInUp_0.7s_0.1s_ease_both] text-white text-figure-md md:mb-4 md:[font-size:clamp(2.4rem,4vw,3.6rem)]">
            {vertical.h1}
          </h1>

          <p className="rev d1 mb-5 max-w-[300px] animate-[fadeInUp_0.7s_0.2s_ease_both] text-body-lg text-white/80 md:mb-6 md:max-w-[460px]">
            {vertical.lead}
          </p>

          <div className="rev d2 mb-2 flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:flex-wrap md:gap-3.5">
            <StartTrialLink className="btn btn-gold btn-lg w-full justify-center md:w-auto" />
            <Link
              href="/pricing"
              className="btn btn-outline-w btn-lg w-full justify-center md:w-auto"
            >
              Plans from £{from} a month
            </Link>
          </div>
          <p className="rev d2 mb-4 text-fine text-white/70">
            {TRIAL_DAYS} days free with everything unlocked. No card to start, no contract.
          </p>

          {/* Mobile-only artwork */}
          <div aria-hidden className="-mx-6 mt-0 w-[calc(100%+3rem)] px-3.5 pt-4 md:hidden">
            <Image
              src="/images/hero-background-fun.png"
              alt=""
              width={1200}
              height={900}
              className="block h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              priority
            />
          </div>

          {/* Desktop floating cards, this business's numbers */}
          <div className="rev d3 mt-16 hidden w-full flex-wrap items-start gap-5 md:flex">
            {vertical.heroCards.map((c, i) => (
              <div
                key={c.badge}
                className={`relative min-w-[200px] max-w-[230px] overflow-hidden rounded-[20px_16px_22px_18px/18px_22px_16px_20px] bg-gradient-to-br ${TONES[c.tone]} ${OFFSETS[i]} px-7 pt-7 pb-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.1)]`}
                style={{ animation: FLOATS[i] }}
              >
                <span className="absolute right-4 top-4 rounded-full bg-white/35 px-2.5 py-0.5 text-eyebrow font-bold tracking-wide text-white backdrop-blur-sm">
                  {c.badge}
                </span>
                <div className="mb-2 font-massilia text-figure-lg font-bold leading-none text-white">
                  {c.figure}
                </div>
                <p className="font-massilia text-base font-bold text-white">{c.title}</p>
                <p className="text-fine leading-snug text-white/80">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile stat cards ──────────────────────────────────── */}
      <section
        aria-label="At a glance"
        className="grid grid-cols-3 gap-2.5 bg-gradient-to-b from-[#007080] to-forest-mid px-4 pt-5 pb-7 md:hidden"
      >
        {vertical.heroCards.map((c) => (
          <div
            key={c.badge}
            className={`relative overflow-hidden rounded-[18px_14px_20px_16px/16px_20px_14px_18px] bg-gradient-to-br ${TONES[c.tone]} px-3 pt-3 pb-3 text-left text-white shadow-[0_6px_18px_rgba(0,0,0,0.14)]`}
          >
            <span className="inline-block rounded-full bg-white/35 px-1.5 py-0.5 text-eyebrow font-bold uppercase tracking-wider">
              {c.badge}
            </span>
            <div className="mt-2 mb-1 font-massilia text-figure-md font-bold leading-none">
              {c.figure}
            </div>
            <p className="font-massilia text-fine font-bold leading-tight">{c.title}</p>
          </div>
        ))}
      </section>

      {/* ── Trust bar ──────────────────────────────────────────── */}
      <TrustBar logos={trustLogos} />

      {/* ── The one-paragraph answer ───────────────────────────── */}
      <section className="bg-cream px-6 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-[860px]">
          <p className="mb-3 text-center font-caveat text-body-lg text-forest md:text-mini-h">
            In one paragraph
          </p>
          <div className="rounded-[22px_18px_24px_20px/20px_24px_18px_22px] border-2 border-teal-mid bg-white px-7 py-8 md:px-10 md:py-10">
            <p className="text-[1.08rem] leading-[1.7] text-ink md:text-[1.18rem]">
              {vertical.definition}
            </p>
          </div>
        </div>
      </section>

      {/* ── Spotlights: the drawn screens, laid out as on /features ── */}
      <section className="bg-white px-[clamp(22px,4vw,56px)] pb-6 md:pb-10">
        <Spotlights
          items={vertical.spotlights}
          title={`Why ${vertical.audience} switch`}
          desc={vertical.categoryDesc}
        />
      </section>

      {/* ── Everything else ────────────────────────────────────── */}
      <section className="bg-white px-6 pb-16 md:px-8 md:pb-22">
        <div className="mx-auto max-w-[1160px]">
          <p className="rev mb-5 text-center font-caveat text-body-lg text-forest md:mb-8 md:text-mini-h">
            What you get for {vertical.audience}
          </p>
          <ul className="grid gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {vertical.blocks.map((b, i) => (
              <li
                key={b.title}
                className={`rev d${(i % 6) + 1} rounded-2xl border border-cream-dark p-5 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-[color:var(--accent-edge)] hover:shadow-[0_12px_28px_rgba(0,62,69,0.08)] md:p-7`}
                style={featureCardStyle(b.feature)}
              >
                <FeatureIcon feature={b.feature} />
                <h3 className="mt-4 font-massilia text-[1.15rem] font-bold leading-snug text-forest">
                  {b.title}
                </h3>
                <p className="mt-2 text-meta leading-[1.6] text-ink-soft md:text-base">{b.body}</p>
                {b.more && (
                  <Link
                    href={`/features#${b.more}`}
                    className="mt-3 inline-block text-meta font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-forest-mid"
                  >
                    See how it works
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="rev mt-8 text-center text-meta text-ink-soft">
            Every one of these has a screen you can look at on{" "}
            <Link
              href="/features"
              className="font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-forest-mid"
            >
              the features page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── How Genera compares ────────────────────────────────── */}
      <section className="bg-white px-6 pb-16 md:px-8 md:pb-22">
        <div className="mx-auto max-w-[1160px] rounded-2xl border border-cream-dark bg-cream px-6 py-7 md:px-9 md:py-9">
          <div className="md:flex md:items-start md:justify-between md:gap-10">
            <div className="md:max-w-[360px]">
              <p className="eyebrow">How Genera compares</p>
              <p className="text-meta text-ink-soft md:text-body-lg">
                Honest, feature by feature, against the systems {vertical.audience} in the
                UK are usually moving from.
              </p>
            </div>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 md:mt-0 md:min-w-[480px]">
              {COMPARISON_POSTS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block rounded-xl border border-cream-dark bg-white px-4 py-3 text-[0.98rem] font-semibold text-forest transition-colors hover:border-forest/40 hover:text-forest-mid"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Notes ──────────────────────────────────────────────── */}
      {vertical.notes && vertical.notes.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-b from-cream to-teal-soft px-6 py-14 md:px-8 md:py-18">
          <Paw className="absolute left-[4%] bottom-[10%] hidden h-[4.5rem] w-[4.5rem] -rotate-12 text-forest opacity-10 md:block" />
          <div className="mx-auto grid max-w-[1000px] gap-5">
            {vertical.notes.map((n) => (
              <div
                key={n.title}
                className="rev rounded-[22px_18px_24px_20px/20px_24px_18px_22px] border-2 border-gold/60 bg-white px-7 py-7 md:px-10 md:py-9"
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

      {/* ── Testimonials ───────────────────────────────────────── */}
      <Testimonials testimonials={testimonials} />

      {/* ── Plans, in one strip. The full cards live on /pricing. ── */}
      <section id="plans" className="bg-cream px-6 pt-16 pb-6 md:px-8 md:pt-22 md:pb-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="rev mb-6 text-center">
            <p className="eyebrow">Simple pricing</p>
            <h2 className="text-section-h md:text-section-h-lg">
              One subscription. From £{from} a month.
            </h2>
            <p className="mx-auto mt-2 max-w-[560px] text-meta text-ink-soft md:mt-3 md:text-body-lg">
              {TRIAL_DAYS} days free with everything unlocked and no card. No setup fee, no
              contract, nothing per dog or per booking.
            </p>
          </div>
          <ul className="rev grid gap-3 md:grid-cols-3 md:gap-5">
            {PRICING_TIERS.map((t) => (
              <li
                key={t.name}
                className={`rounded-2xl border-2 bg-white px-5 py-4 md:px-6 md:py-5 ${
                  t.featured ? "border-gold" : "border-teal-mid"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-massilia text-[1.15rem] font-bold text-forest">{t.name}</span>
                  <span className="font-massilia text-[1.35rem] font-bold text-forest">
                    £{t.monthlyPrice}
                    <span className="text-meta font-normal text-ink-soft">/month</span>
                  </span>
                </div>
                <p className="mt-1.5 text-meta leading-snug text-ink-soft">{t.tagline}</p>
              </li>
            ))}
          </ul>
          <p className="rev mt-5 text-center text-meta text-ink-soft">
            <Link
              href="/pricing"
              className="font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-forest-mid"
            >
              See what each plan unlocks
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="bg-cream px-6 pb-16 md:px-8 md:pb-22">
        <div className="mx-auto max-w-[860px]">
          <div className="rev mb-6 text-center">
            <p className="eyebrow">Questions {vertical.audience} ask</p>
          </div>
          <dl className="rev divide-y divide-cream-dark rounded-2xl border border-cream-dark bg-white">
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

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="bg-forest-dark px-8 py-22 text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="text-heading-mid !text-white">
            {TRIAL_DAYS} days with everything unlocked
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/80">
            Set up your services, put your logo on the app and send the link to a few
            owners. If it has not earned its place in a month, walk away. Nothing was
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
