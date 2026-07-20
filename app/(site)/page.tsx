import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import Paw from "@/components/Paw";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import FoundingSpotsStats from "@/components/FoundingSpotsStats";
import AdminMiniAnimation from "@/components/AdminMiniAnimation";
import { FOUNDING_100_CTA_LABEL } from "@/lib/cta";
import { getPublicSupabase } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata = createMetadata({
  title: "Dog Daycare Software for Bookings, Payments & Routes",
  description:
    "Genera helps UK dog daycares and pet care businesses manage online bookings, invoices, payments, transport routes, staff schedules and pet records.",
  path: "/",
});

const PAIN_POINTS = [
  {
    n: "01",
    title: "Bookings from every direction",
    body: "Texts, emails, DMs, calls — all landing in different places. You spend more time managing messages than caring for dogs.",
  },
  {
    n: "02",
    title: "Sunday evenings lost to invoicing",
    body: "Manually building invoices for every client, every week. Chasing payments. Wondering who's paid and who hasn't.",
  },
  {
    n: "03",
    title: "Pickup logistics that break your brain",
    body: "Juggling driver routes, pickup windows and last-minute changes with no real system. Just a spreadsheet and a prayer.",
  },
];

const FEATURES = [
  {
    title: "Every pet. Every detail. One place.",
    body: "Full client and pet profiles — feeding notes, vet contacts, vaccination records — accessible in seconds by anyone on your team.",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Bookings that run themselves",
    body: "24/7 online booking portal for your clients. No more inbound messages — just a clean calendar that fills itself.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Get paid without chasing anyone",
    body: "Auto-charge on collection, bulk invoicing, direct debit and card payments. Your money arrives on time, every time.",
    icon: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
  },
  {
    title: "Routes planned in minutes, not hours",
    body: "Drag-and-drop transport scheduling with optimised routes for your drivers. No more scrambling on collection day.",
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    title: "Your team, sorted",
    body: "Staff schedules, shift planning and payroll prep — all in one system. Know who's in, who's driving, and what everyone's owed.",
    icon: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
  {
    title: "Support that actually understands",
    body: "UK-based support from people who've run a daycare. GDPR & DEFRA compliant, cloud-based and always up to date.",
    icon: (
      <>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </>
    ),
  },
];

const FOUNDING_PERKS = [
  "1 month free, then £50 a month. No credit card required",
  "One-on-one onboarding call with the Genera team",
  "Priority access to new features as they launch",
  "Your feedback shapes the product roadmap",
  "Locked-in founding member pricing, forever",
];

export default async function Home() {
  const supabase = getPublicSupabase();

  const [logosRes, spotsRes] = await Promise.all([
    supabase
      .from("trust_logos")
      .select("id, name, logo_url")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("founding_spots")
      .select("total_spots, claimed_spots")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  const trustLogos = logosRes.data ?? [];
  const totalSpots = spotsRes.data?.total_spots ?? 100;
  const claimedSpots = spotsRes.data?.claimed_spots ?? 0;

  return (
    <>
      <Reveal />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative flex flex-col overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 pt-24 pb-0 md:min-h-screen md:px-8 md:pt-32 md:pb-12">
        {/* decorative blobs */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-24 h-[260px] w-[260px] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-gold/10 md:h-[420px] md:w-[420px]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 -left-20 h-[200px] w-[200px] rounded-[40%_60%_55%_45%/48%_52%_48%_52%] bg-white/5 md:h-[280px] md:w-[280px]"
        />

        {/* Right-justified backdrop image — desktop only */}
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

        <div className="relative z-10 mx-auto flex w-full max-w-[1160px] flex-col items-start text-left md:items-start md:text-left">
          <div className="mb-4 inline-flex animate-[fadeInUp_0.6s_ease_both] items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5 md:text-body-lg">
            <Paw className="h-[1.1em] w-[1.1em]" /> Built by a daycare, for
            daycares
          </div>

          <h1 className="rev mb-3 animate-[fadeInUp_0.7s_0.1s_ease_both] text-white text-figure-md md:mb-4 md:[font-size:clamp(2.4rem,4vw,3.6rem)]">
            Software that{" "}
            <span className="squig">
              actually
              <svg viewBox="0 0 180 12" preserveAspectRatio="none">
                <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7" />
              </svg>
            </span>
            <br />
            gets your daycare.
          </h1>

          <p className="rev d1 mb-5 max-w-[300px] animate-[fadeInUp_0.7s_0.2s_ease_both] text-body-lg text-white/80 md:mb-6 md:max-w-[460px]">
            Built by the people behind Duncan&apos;s Dog Co - 15 years in the
            industry, finally turning that experience into software that makes
            your business run the way it should.
          </p>

          <div className="rev d2 mb-4 flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:flex-wrap md:justify-start md:gap-3.5">
            <BookDemoButton
              className="btn btn-gold btn-lg w-full justify-center md:w-auto"
            >
              {FOUNDING_100_CTA_LABEL}
            </BookDemoButton>
            <BookDemoButton
              slug="book-demo"
              className="btn btn-outline-w btn-lg w-full justify-center md:w-auto"
            >
              Book a Demo
            </BookDemoButton>
          </div>

          {/* Mobile-only artwork panel — sits inside the hero, full-width below CTAs */}
          <div
            aria-hidden
            className="-mx-6 mt-0 w-[calc(100%+3rem)] px-3.5 pt-4 md:hidden"
          >
            <Image
              src="/images/hero-background-fun.png"
              alt=""
              width={1200}
              height={900}
              className="block h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              priority
            />
          </div>

          {/* Desktop floating UI cards — hidden on mobile (stats become their own section) */}
          <div className="rev d3 mt-20 hidden w-full flex-wrap items-start justify-center gap-5 md:flex md:justify-start">
            <div className="relative min-w-[200px] max-w-[220px] animate-[var(--animate-float-1)] overflow-hidden rounded-[20px_16px_22px_18px/18px_22px_16px_20px] bg-gradient-to-br from-[#E8856A] to-[#C96B52] px-7 pt-7 pb-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <span className="absolute right-4 top-4 rounded-full bg-white/35 px-2.5 py-0.5 text-eyebrow font-bold tracking-wide text-white backdrop-blur-sm">
                Today
              </span>
              <div className="mb-2 font-massilia text-figure-lg font-bold leading-none text-white">
                12
              </div>
              <p className="font-massilia text-base font-bold text-white">
                Bookings, handled.
              </p>
              <p className="text-fine leading-snug text-white/80">
                A clean calendar that fills itself — no more &quot;did you get
                my text?&quot;
              </p>
            </div>

            <div className="relative mt-8 min-w-[200px] max-w-[220px] animate-[var(--animate-float-2)] overflow-hidden rounded-[20px_16px_22px_18px/18px_22px_16px_20px] bg-gradient-to-br from-[#6B9E72] to-[#4E7D58] px-7 pt-7 pb-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <span className="absolute right-4 top-4 rounded-full bg-white/35 px-2.5 py-0.5 text-eyebrow font-bold tracking-wide text-white backdrop-blur-sm">
                Paid
              </span>
              <div className="mb-2 font-massilia text-figure-md font-bold leading-none text-white">
                £840
              </div>
              <p className="font-massilia text-base font-bold text-white">
                Money, in the bank.
              </p>
              <p className="text-fine leading-snug text-white/80">
                Auto-charge, bulk invoices, direct debit. No chasing. Ever.
              </p>
            </div>

            <div className="relative mt-2 min-w-[200px] max-w-[220px] animate-[var(--animate-float-3)] overflow-hidden rounded-[20px_16px_22px_18px/18px_22px_16px_20px] bg-gradient-to-br from-[#E8A430] to-[#C8880A] px-7 pt-7 pb-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <span className="absolute right-4 top-4 rounded-full bg-white/35 px-2.5 py-0.5 text-eyebrow font-bold tracking-wide text-white backdrop-blur-sm">
                Routed
              </span>
              <div className="mb-2 font-massilia text-figure-lg font-bold leading-none text-white">
                3
              </div>
              <p className="font-massilia text-base font-bold text-white">
                Pickups, sorted.
              </p>
              <p className="text-fine leading-snug text-white/80">
                Drag-and-drop routes your drivers can follow on their phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats (mobile only) ────────────────────────────────── */}
      <section
        aria-label="At a glance"
        className="grid grid-cols-3 gap-2.5 bg-gradient-to-b from-[#007080] to-forest-mid px-4 pt-5 pb-7 md:hidden"
      >
        <div className="relative overflow-hidden rounded-[18px_14px_20px_16px/16px_20px_14px_18px] bg-gradient-to-br from-[#E8856A] to-[#C96B52] px-3 pt-3 pb-3 text-left text-white shadow-[0_6px_18px_rgba(0,0,0,0.14)]">
          <span className="inline-block rounded-full bg-white/35 px-1.5 py-0.5 text-eyebrow font-bold uppercase tracking-wider">
            Today
          </span>
          <div className="mt-2 mb-1 font-massilia text-figure-md font-bold leading-none">
            12
          </div>
          <p className="font-massilia text-fine font-bold leading-tight">
            Bookings, handled.
          </p>
          <p className="mt-0.5 text-eyebrow leading-snug opacity-80">
            A calendar that fills itself.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[18px_14px_20px_16px/16px_20px_14px_18px] bg-gradient-to-br from-[#6B9E72] to-[#4E7D58] px-3 pt-3 pb-3 text-left text-white shadow-[0_6px_18px_rgba(0,0,0,0.14)]">
          <span className="inline-block rounded-full bg-white/35 px-1.5 py-0.5 text-eyebrow font-bold uppercase tracking-wider">
            Paid
          </span>
          <div className="mt-2 mb-1 font-massilia text-section-h font-bold leading-none">
            £840
          </div>
          <p className="font-massilia text-fine font-bold leading-tight">
            In the bank.
          </p>
          <p className="mt-0.5 text-eyebrow leading-snug opacity-80">
            No chasing. Ever.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[18px_14px_20px_16px/16px_20px_14px_18px] bg-gradient-to-br from-[#E8A430] to-[#C8880A] px-3 pt-3 pb-3 text-left text-white shadow-[0_6px_18px_rgba(0,0,0,0.14)]">
          <span className="inline-block rounded-full bg-white/35 px-1.5 py-0.5 text-eyebrow font-bold uppercase tracking-wider">
            Routed
          </span>
          <div className="mt-2 mb-1 font-massilia text-figure-md font-bold leading-none">
            3
          </div>
          <p className="font-massilia text-fine font-bold leading-tight">
            Pickups sorted.
          </p>
          <p className="mt-0.5 text-eyebrow leading-snug opacity-80">
            Drag-and-drop routes.
          </p>
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────────────── */}
      <div
        aria-label="Businesses using Genera"
        className="overflow-x-hidden overflow-y-visible border-y-2 border-teal-mid bg-teal-soft py-4 md:py-8"
      >
        <p className="mb-2 text-center font-caveat text-body-lg text-forest md:text-mini-h">
          Businesses already on board
        </p>
        <div className="overflow-y-visible">
          <div className="flex w-max animate-[var(--animate-scroll-x)] gap-2 md:gap-4">
            {[...trustLogos, ...trustLogos].map((logo, i) =>
              logo.logo_url ? (
                <span
                  key={`${logo.id}-${i}`}
                  className="relative mt-1.5 shrink-0 pt-7 md:mt-2 md:pt-8"
                >
                  <span className="flex h-9 items-center justify-center rounded-full border-2 border-teal-mid bg-white px-3.5 md:h-11 md:px-4">
                    <span className="whitespace-nowrap text-eyebrow font-semibold text-forest md:text-fine">
                      {logo.name}
                    </span>
                  </span>
                  <span className="absolute -top-3 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center overflow-hidden rounded-full border-2 border-teal-mid bg-white md:-top-4 md:h-14 md:w-14">
                    <Image
                      src={logo.logo_url}
                      alt={logo.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </span>
                </span>
              ) : (
                <span
                  key={`${logo.id}-${i}`}
                  className="relative mt-1.5 shrink-0 pt-7 md:mt-2 md:pt-8"
                >
                  <span className="flex h-9 items-center justify-center whitespace-nowrap rounded-full border-2 border-teal-mid bg-white px-3.5 text-eyebrow font-semibold text-forest md:h-11 md:px-4 md:text-fine">
                    {logo.name}
                  </span>
                  <span className="absolute -top-3 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border-2 border-teal-mid bg-white font-massilia text-eyebrow font-bold text-forest md:-top-4 md:h-14 md:w-14 md:text-fine">
                    {logo.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((word) => word[0]?.toUpperCase())
                      .join("")}
                  </span>
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 px-6 font-caveat text-meta text-forest md:mt-6 md:text-body-lg">
          <span className="tracking-widest text-gold">★★★★★</span>
          <span>Trusted by pet businesses across the UK</span>
        </div>
      </div>

      {/* ── Pain points ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream to-teal-soft px-6 py-12 md:px-8 md:py-22">
        <Paw
          className="absolute right-[3%] top-[5%] hidden h-[5rem] w-[5rem] animate-[var(--animate-wobble)] text-forest opacity-10 md:block"
        />

        <div className="mx-auto max-w-[1160px]">
          <div className="rev mb-6 text-center md:mb-14">
            <p className="eyebrow">Sound familiar?</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              Running a daycare is harder than it looks.
            </h2>
            <p className="mx-auto mt-2 max-w-[560px] text-meta text-ink-soft md:mt-3 md:text-body-lg">
              You got into this for the dogs — not the admin. We&apos;ll handle
              the rest.
            </p>
          </div>
          <div className="relative grid gap-3.5 md:grid-cols-3 md:gap-6">
            {/* Desktop overlap illustration */}
            <Image
              src="/images/confused.png"
              alt=""
              aria-hidden
              width={720}
              height={720}
              className="pointer-events-none absolute -bottom-24 -left-40 z-0 hidden h-[28rem] w-auto -rotate-6 select-none drop-shadow-[0_10px_24px_rgba(0,62,69,0.22)] md:block md:-bottom-32 md:-left-48 md:h-[36rem]"
            />
            {PAIN_POINTS.map((p, i) => (
              <div
                key={p.n}
                className={`rev d${i + 1} relative z-10 rounded-2xl border border-teal-mid/60 bg-white/80 p-5 shadow-[0_4px_20px_rgba(0,62,69,0.06)] backdrop-blur-sm md:p-7`}
              >
                <div className="mb-1.5 font-massilia text-section-h font-bold leading-none text-gold/70 md:mb-3 md:text-figure-md">
                  {p.n}
                </div>
                <h3 className="mb-1.5 font-massilia text-base font-bold md:mb-2 md:text-lg">
                  {p.title}
                </h3>
                <p className="text-meta text-ink-soft md:text-base">
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile-only illustration panel — sits below the cards */}
          <div className="relative mt-7 flex items-end justify-center md:hidden">
            <span className="absolute right-[10%] top-2 z-10 -rotate-[4deg] whitespace-nowrap rounded-full border-2 border-teal-mid bg-white px-3.5 py-1.5 font-caveat text-base text-forest shadow-[0_4px_14px_rgba(0,62,69,0.08)]">
              …sound about right?
            </span>
            <Image
              src="/images/confused.png"
              alt=""
              aria-hidden
              width={720}
              height={720}
              className="pointer-events-none pr-20 h-[230px] w-auto -rotate-3 select-none drop-shadow-[0_10px_18px_rgba(0,62,69,0.18)]"
            />
          </div>
        </div>
      </section>

      {/* ── Product showcase ────────────────────────────────────── */}
      <section className="bg-cream px-4 py-12 md:px-8 md:py-22">
        <div className="mx-auto max-w-[1160px]">
          <div className="rev mb-4 text-center md:mb-14">
            <p className="eyebrow">See it in action</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              A dashboard built for busy people.
            </h2>
          </div>

          <div className="rev d1 relative mx-auto max-w-[1000px]">
            <p className="mb-3 text-center font-caveat text-body-lg text-forest md:text-xl">
              Your 9am Monday, sorted ☕
            </p>

            <div className="relative overflow-hidden rounded-2xl border border-teal-mid/50 bg-white shadow-[0_18px_40px_rgba(0,62,69,0.16)] md:rounded-3xl md:shadow-[0_24px_60px_rgba(0,62,69,0.16)]">
              <div className="flex items-center gap-2 border-b border-cream-dark bg-cream px-2.5 py-2 md:gap-3 md:px-4 md:py-3">
                <div className="flex gap-1.5">
                  <span className="block h-[9px] w-[9px] rounded-full bg-[#FF6058] md:h-3 md:w-3" />
                  <span className="block h-[9px] w-[9px] rounded-full bg-[#FFBD2E] md:h-3 md:w-3" />
                  <span className="block h-[9px] w-[9px] rounded-full bg-[#28C940] md:h-3 md:w-3" />
                </div>
                <div className="flex-1 rounded-md bg-white px-2.5 py-1 text-center text-eyebrow text-ink-soft md:flex-none md:text-xs">
                  app.generasoftware.com
                </div>
              </div>
              <AdminMiniAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className="bg-white px-6 py-13 md:px-8 md:py-22">
        <div className="mx-auto max-w-[1160px]">
          <div className="rev mb-6 text-center md:mb-14">
            <p className="eyebrow">What Genera does</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              Everything you need.
              <br />
              Nothing you don&apos;t.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`rev d${(i % 6) + 1} rounded-2xl border border-cream-dark bg-cream p-5 transition-transform hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,62,69,0.08)] md:p-8`}
              >
                <div className="mb-3 grid h-[42px] w-[42px] place-items-center rounded-xl bg-forest text-gold md:mb-4 md:h-12 md:w-12">
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3 className="mb-1.5 font-massilia text-base font-bold md:mb-2 md:text-lg">
                  {f.title}
                </h3>
                <p className="text-meta text-ink-soft md:text-base">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founding 100 ────────────────────────────────────────── */}
      <section
        id="founding"
        className="relative overflow-hidden bg-forest-dark px-6 py-13 text-white md:px-8 md:py-22"
      >
        <div className="mx-auto grid max-w-[1160px] gap-6 md:grid-cols-2 md:items-center md:gap-12">
          <div className="rev">
            <p className="eyebrow !text-gold">Limited offer</p>
            <h2 className="text-section-h !text-white md:text-[length:inherit]">
              The Founding One Hundred.
            </h2>
            <p className="mt-2.5 text-meta text-white/80 md:mt-4 md:text-base">
              We&apos;re selecting 100 pet businesses to join Genera before we
              open to the public. You&apos;ll get your first month completely free,
              priority onboarding and a direct line to our team.
            </p>
            <ul className="mt-4 flex flex-col gap-2 md:mt-5 md:gap-2.5">
              {FOUNDING_PERKS.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2 text-meta text-white/85 md:text-base"
                >
                  <span className="mt-0.5 text-gold">✓</span> {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rev d2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:overflow-visible md:p-8 md:pr-64">
            <Image
              src="/images/welcome.png"
              alt=""
              aria-hidden
              width={720}
              height={720}
              className="pointer-events-none absolute -right-6 bottom-0 z-0 h-[180px] w-auto select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)] md:-right-40 md:-bottom-16 md:z-20 md:h-[28rem] md:drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
            />
            <FoundingSpotsStats
              totalSpots={totalSpots}
              claimedSpots={claimedSpots}
            />
            <p className="relative z-10 mt-3.5 max-w-[200px] text-meta text-white/80 md:mt-4 md:max-w-none md:text-base">
              Applications close once we reach 100. Be part of shaping the
              product from the start.
            </p>
            <BookDemoButton
              className="btn btn-gold btn-lg relative z-10 mt-4 md:mt-5"
            >
              {FOUNDING_100_CTA_LABEL}
            </BookDemoButton>
          </div>

        </div>
      </section>

      {/* ── Story teaser ────────────────────────────────────────── */}
      <section id="story" className="bg-white px-6 py-13 md:px-8 md:py-22">
        <div className="mx-auto grid max-w-[1160px] gap-7 md:grid-cols-2 md:items-center md:gap-12">
          <div className="rev flex justify-center">
            <div className="polaroid">
              <div className="polaroid-window">
                <Image
                  src="/images/duncan-jess.jpg"
                  alt="Duncan and Jess, founders of Genera Software"
                  fill
                  sizes="(max-width: 768px) 100vw, 520px"
                  className="object-cover object-[center_55%]"
                  loading="lazy"
                />
              </div>
              <p className="polaroid-caption">
                Duncan &amp; Jess, South West London{" "}
                <Paw className="inline h-[1em] w-[1em] align-[-0.1em]" />
              </p>
            </div>
          </div>

          <div className="rev d2">
            <p className="eyebrow">Why we built this</p>
            <h2 className="text-section-h md:text-[length:inherit]">
              From a dog walking round in South West London to software used
              across the UK.
            </h2>
            <p className="mt-2.5 text-meta text-ink-soft md:mt-4 md:text-base">
              Duncan and Jess started with a dog walking round in 2011. Fifteen
              years later they&apos;re running a licensed daycare — and they
              still couldn&apos;t find software that actually understood how a
              pet business works.
            </p>
            <p className="mt-3 text-meta text-ink-soft md:text-base">
              So they built Genera themselves. Every feature exists because they
              needed it. Every decision is made by people who&apos;ve been on
              the end of a very muddy lead.
            </p>
            <Link
              href="/our-story"
              className="mt-3.5 inline-flex items-center gap-2 font-massilia font-bold text-forest hover:text-gold md:mt-5"
            >
              Read the full story →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 py-14 text-center text-white md:px-8 md:py-22">
        <div className="relative z-10 mx-auto max-w-[760px]">
          <h2 className="text-section-h !text-white md:text-[length:inherit]">
            Ready when you are.
          </h2>
          <p className="mt-2.5 text-meta text-white/80 md:mt-4 md:text-base">
            Apply for the Founding 100 today. No credit card required. No
            commitment. Just one simple path to see if Genera is right for you.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 md:mt-7 md:flex-row md:flex-wrap md:justify-center md:gap-3.5">
            <BookDemoButton
              className="btn btn-gold btn-lg w-full justify-center md:w-auto"
            >
              {FOUNDING_100_CTA_LABEL}
            </BookDemoButton>
          </div>
          <p className="mt-3.5 font-caveat text-base text-white/70 md:mt-5 md:text-lg">
            No credit card &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Cancel
            anytime
          </p>
        </div>
      </section>
    </>
  );
}
