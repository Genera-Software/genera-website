import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import Paw from "@/components/Paw";
import RotatingWord from "./_components/RotatingWord";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import StartTrialLink from "@/components/StartTrialLink";
import PricingTiers from "@/components/PricingTiers";
import WhatYouKeep from "@/components/WhatYouKeep";
import AdminMiniAnimationV2 from "@/components/AdminMiniAnimationV2";
import { BOOK_DEMO_FORM_SLUG, PRICING_URL } from "@/lib/cta";
import { TRIAL_DAYS } from "@/lib/pricing";
import { getPublicSupabase } from "@/lib/supabase/server";
import { isFormActive } from "@/lib/forms";

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
    title: "Bookings that run themselves",
    body: "24/7 online booking portal for your clients, with approvals, recurring bookings and per-service capacity limits. No more inbound messages — just a clean calendar that fills itself.",
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
    body: "Charges come off the bookings you actually took. Bulk invoicing, card payments and Direct Debit — plus Xero if that's where you keep your books.",
    icon: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
  },
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
    title: "Your own app, under your own name",
    body: "Owners add your portal to their home screen and it opens with your name and your logo. Nothing to find in an app store, and nothing for you to build.",
    icon: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
        <line x1="10" y1="18.5" x2="14" y2="18.5" />
      </>
    ),
  },
  {
    title: "Every conversation in one place",
    body: "Owner messaging, driver day threads and broadcasts — instead of three WhatsApp accounts, a personal phone and a Facebook page nobody checks.",
    icon: (
      <>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
      </>
    ),
  },
  {
    title: "Assessments they'll actually read",
    body: "Trial days and temperament tests recorded on a phone in the yard, then turned into a branded report card the owner opens on theirs.",
    icon: (
      <>
        <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Routes planned in minutes, not hours",
    body: "Drag-and-drop collection and drop-off runs with optimised stops, plus a portal your drivers sign into. Always know which dog is on which van.",
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    title: "Know exactly where the money is",
    body: "What you've invoiced, what's still owed, what the diary is worth for the next six months, and what your team costs to run — on one screen.",
    icon: (
      <>
        <line x1="3" y1="21" x2="21" y2="21" />
        <rect x="5" y="12" width="4" height="7" />
        <rect x="11" y="8" width="4" height="11" />
        <rect x="17" y="4" width="4" height="15" />
      </>
    ),
  },
  {
    title: "Your team, sorted",
    body: "Rota, shift planning, time off and payroll prep — on every plan, whatever you pay. Know who's in, who's driving, and what everyone's owed.",
    icon: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
  {
    title: "Marketing tools, on the way",
    body: "Filling quiet days and bringing lapsed owners back. Still in development — included in Thrive, and it appears in your account as it ships.",
    icon: (
      <>
        <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z" />
        <path d="M17 9a4 4 0 0 1 0 6" />
        <path d="M20 6.5a8 8 0 0 1 0 11" />
      </>
    ),
  },
  {
    title: "Compliance built in",
    body: "GDPR and DEFRA-ready records, vaccination expiry alerts and a full audit trail. Cloud-based, backed up, and always on the current version.",
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Support that actually understands",
    body: "UK-based support from people who've run a daycare. You get a human who knows what a wet Tuesday in November looks like.",
    icon: (
      <>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </>
    ),
  },
];

export default async function Home() {
  const supabase = getPublicSupabase();

  const [logosRes, showBookDemo] = await Promise.all([
    supabase
      .from("trust_logos")
      .select("id, name, logo_url")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
    isFormActive(BOOK_DEMO_FORM_SLUG),
  ]);

  const trustLogos = logosRes.data ?? [];

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
          <div className="mb-4 inline-flex flex-wrap animate-[fadeInUp_0.6s_ease_both] items-center gap-x-2 gap-y-1 rounded-full border-2 border-gold/50 bg-white/10 px-4 py-1.5 font-caveat text-body-lg font-bold text-gold-soft md:px-6 md:py-2.5 md:text-section-h">
            <Paw className="h-[1.1em] w-[1.1em]" /> Built by a daycare, for
            dog <RotatingWord />
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
            gets your pet business.
          </h1>

          <p className="rev d1 mb-5 max-w-[300px] animate-[fadeInUp_0.7s_0.2s_ease_both] text-body-lg text-white/80 md:mb-6 md:max-w-[460px]">
            Built by the people behind Duncan&apos;s Dog Co - 15 years in the
            industry, finally turning that experience into software that makes
            your business run the way it should.
          </p>

          <div className="rev d2 mb-4 flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:flex-wrap md:justify-start md:gap-3.5">
            <StartTrialLink className="btn btn-gold btn-lg w-full justify-center md:w-auto" />
            {showBookDemo && (
              <BookDemoButton
                slug={BOOK_DEMO_FORM_SLUG}
                className="btn btn-outline-w btn-lg w-full justify-center md:w-auto"
              >
                Book a Demo
              </BookDemoButton>
            )}
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
              Daycare, walking, grooming and boarding. One system.
            </h2>
          </div>

          <div className="rev d1 relative mx-auto max-w-[1000px]">
            <p className="mb-3 text-center font-caveat text-body-lg text-forest md:text-xl">
              Your Monday morning, whatever you run
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
              <AdminMiniAnimationV2 />
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
            <p className="mx-auto mt-2 max-w-[600px] text-meta text-ink-soft md:mt-3 md:text-body-lg">
              Bookings, invoicing, records, your own branded app and the rota are
              in every plan. The rest arrives as your setting grows —{" "}
              <Link href={PRICING_URL} className="font-semibold text-forest underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
                see what each plan unlocks
              </Link>
              .
            </p>
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

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <PricingTiers />

      {/* ── What you keep ───────────────────────────────────────── */}
      <WhatYouKeep />

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
            Start your {TRIAL_DAYS}-day free trial today. No card required, no
            setup fee, no contract. Just one simple path to see if Genera is
            right for you.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 md:mt-7 md:flex-row md:flex-wrap md:justify-center md:gap-3.5">
            <StartTrialLink className="btn btn-gold btn-lg w-full justify-center md:w-auto" />
            <Link
              href={PRICING_URL}
              className="btn btn-outline-w btn-lg w-full justify-center md:w-auto"
            >
              Compare plans
            </Link>
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
