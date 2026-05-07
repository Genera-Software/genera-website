import Image from "next/image";
import Link from "next/link";
import Paw from "@/components/Paw";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import { REGISTER_URL } from "@/lib/urls";

const TRUST_CHIPS = [
  "Paws & Play",
  "Bark & Stride",
  "Wag Walkers",
  "Tail End Daycare",
  "The Dog Lodge",
  "Muddy Paws Co",
  "Happy Hounds HQ",
  "Fetch & Go",
  "Pawsitive Vibes",
  "Walkies Club",
  "Snout & About",
  "Good Boy Daycare",
];

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
  "3 months free — no credit card required",
  "One-on-one onboarding call with the Genera team",
  "Priority access to new features as they launch",
  "Your feedback shapes the product roadmap",
  "Locked-in founding member pricing, forever",
];

export default function Home() {
  return (
    <>
      <Reveal />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 pt-20 pb-12">
        {/* decorative blobs */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-24 h-[420px] w-[420px] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-gold/10"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 -left-20 h-[280px] w-[280px] rounded-[40%_60%_55%_45%/48%_52%_48%_52%] bg-white/5"
        />

        {/* Right-justified backdrop image — above the gradient, below the text */}
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

        <div className="relative z-10 mx-auto flex w-full max-w-[1160px] flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-4 inline-flex animate-[fadeInUp_0.6s_ease_both] items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-4 py-1.5 font-caveat text-[1.05rem] font-bold text-gold-soft">
            <Paw className="h-[1.1em] w-[1.1em]" /> Built by a daycare, for
            daycares
          </div>

          <h1 className="rev mb-4 animate-[fadeInUp_0.7s_0.1s_ease_both] text-white [font-size:clamp(2.4rem,4vw,3.6rem)]">
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

          <p className="rev d1 mb-6 max-w-[460px] animate-[fadeInUp_0.7s_0.2s_ease_both] text-[0.98rem] text-white/80">
            Built by the people behind Duncan&apos;s Dog Co — 15 years in the
            industry, finally turning that experience into software that makes
            your business run the way it should.
          </p>

          <div className="rev d2 mb-4 flex flex-wrap justify-center gap-3.5 md:justify-start">
            <a
              href={REGISTER_URL}
              className="btn btn-gold btn-lg"
            >
              Start Your 3-Month Free Trial
            </a>
            <BookDemoButton className="btn btn-forest btn-lg">
              Book a Demo
            </BookDemoButton>
          </div>

          {/* Floating UI cards — left-aligned within the same nav-width container */}
          <div className="rev d3 mt-20 flex w-full flex-wrap items-start justify-center gap-5 md:justify-start">
            <div className="relative min-w-[200px] max-w-[220px] animate-[var(--animate-float-1)] overflow-hidden rounded-[20px_16px_22px_18px/18px_22px_16px_20px] bg-gradient-to-br from-[#E8856A] to-[#C96B52] px-7 pt-7 pb-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <span className="absolute right-4 top-4 rounded-full bg-white/35 px-2.5 py-0.5 text-[0.72rem] font-bold tracking-wide text-white backdrop-blur-sm">
                Today
              </span>
              <div className="mb-2 font-poppins text-[3.2rem] font-extrabold leading-none text-white">
                12
              </div>
              <p className="font-poppins text-base font-bold text-white">
                Bookings, handled.
              </p>
              <p className="text-[0.8rem] leading-snug text-white/80">
                A clean calendar that fills itself — no more &quot;did you get
                my text?&quot;
              </p>
            </div>

            <div className="relative mt-8 min-w-[200px] max-w-[220px] animate-[var(--animate-float-2)] overflow-hidden rounded-[20px_16px_22px_18px/18px_22px_16px_20px] bg-gradient-to-br from-[#6B9E72] to-[#4E7D58] px-7 pt-7 pb-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <span className="absolute right-4 top-4 rounded-full bg-white/35 px-2.5 py-0.5 text-[0.72rem] font-bold tracking-wide text-white backdrop-blur-sm">
                Paid
              </span>
              <div className="mb-2 font-poppins text-[2.4rem] font-extrabold leading-none text-white">
                £840
              </div>
              <p className="font-poppins text-base font-bold text-white">
                Money, in the bank.
              </p>
              <p className="text-[0.8rem] leading-snug text-white/80">
                Auto-charge, bulk invoices, direct debit. No chasing. Ever.
              </p>
            </div>

            <div className="relative mt-2 min-w-[200px] max-w-[220px] animate-[var(--animate-float-3)] overflow-hidden rounded-[20px_16px_22px_18px/18px_22px_16px_20px] bg-gradient-to-br from-[#E8A430] to-[#C8880A] px-7 pt-7 pb-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <span className="absolute right-4 top-4 rounded-full bg-white/35 px-2.5 py-0.5 text-[0.72rem] font-bold tracking-wide text-white backdrop-blur-sm">
                Routed
              </span>
              <div className="mb-2 font-poppins text-[3.2rem] font-extrabold leading-none text-white">
                3
              </div>
              <p className="font-poppins text-base font-bold text-white">
                Pickups, sorted.
              </p>
              <p className="text-[0.8rem] leading-snug text-white/80">
                Drag-and-drop routes your drivers can follow on their phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────────────── */}
      <div
        aria-label="Businesses using Genera"
        className="overflow-hidden border-y-2 border-teal-mid bg-teal-soft py-8"
      >
        <p className="mb-2 text-center font-caveat text-[1.3rem] text-forest">
          Businesses already on board
        </p>
        <div className="overflow-hidden">
          <div className="flex w-max animate-[var(--animate-scroll-x)] gap-4">
            {[...TRUST_CHIPS, ...TRUST_CHIPS].map((c, i) => (
              <span
                key={i}
                className="shrink-0 whitespace-nowrap rounded-full border-2 border-teal-mid bg-white px-4 py-1.5 text-[0.88rem] font-semibold text-forest"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 px-6 font-caveat text-[1.15rem] text-forest">
          <span className="tracking-widest text-gold">★★★★★</span>
          <span>Trusted by pet businesses across the UK</span>
        </div>
      </div>

      {/* ── Pain points ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream to-teal-soft px-8 py-22">
        <Paw
          className="absolute right-[3%] top-[5%] h-[5rem] w-[5rem] animate-[var(--animate-wobble)] text-forest opacity-10"
        />

        <div className="mx-auto max-w-[1160px]">
          <div className="rev mb-14 text-center">
            <p className="eyebrow">Sound familiar?</p>
            <h2>
              Running a daycare is
              <br />
              harder than it looks.
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-[1.15rem] text-ink-soft">
              You got into this for the dogs — not the admin. We&apos;ll handle
              the rest.
            </p>
          </div>
          <div className="relative grid gap-6 md:grid-cols-3">
            <Image
              src="/images/confused.png"
              alt=""
              aria-hidden
              width={720}
              height={720}
              className="pointer-events-none absolute -bottom-24 -left-40 z-0 h-[28rem] w-auto -rotate-6 select-none drop-shadow-[0_10px_24px_rgba(0,62,69,0.22)] md:-bottom-32 md:-left-48 md:h-[36rem]"
            />
            {PAIN_POINTS.map((p, i) => (
              <div
                key={p.n}
                className={`rev d${i + 1} relative z-10 rounded-2xl border border-teal-mid/60 bg-white/80 p-7 shadow-[0_4px_20px_rgba(0,62,69,0.06)] backdrop-blur-sm`}
              >
                <div className="mb-3 font-poppins text-[2.2rem] font-extrabold leading-none text-gold/70">
                  {p.n}
                </div>
                <h3 className="mb-2 font-poppins text-lg font-bold">
                  {p.title}
                </h3>
                <p className="text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product showcase ────────────────────────────────────── */}
      <section className="bg-cream px-8 py-22">
        <div className="mx-auto max-w-[1160px]">
          <div className="rev mb-14 text-center">
            <p className="eyebrow">See it in action</p>
            <h2>A dashboard built for busy people.</h2>
          </div>

          <div className="rev d1 relative mx-auto max-w-[1000px]">
            <p className="mb-3 text-center font-caveat text-xl text-forest">
              Your 9am Monday, sorted ☕
            </p>

            <div className="relative overflow-hidden rounded-3xl border border-teal-mid/50 bg-white shadow-[0_24px_60px_rgba(0,62,69,0.16)]">
              <div className="flex items-center gap-3 border-b border-cream-dark bg-cream px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="block h-3 w-3 rounded-full bg-[#FF6058]" />
                  <span className="block h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <span className="block h-3 w-3 rounded-full bg-[#28C940]" />
                </div>
                <div className="rounded-md bg-white px-3 py-1 text-xs text-ink-soft">
                  app.generasoftware.com
                </div>
              </div>
              <Image
                src="/images/app-screenshot.png"
                alt="Genera software dashboard overview"
                width={1600}
                height={900}
                className="block h-auto w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className="bg-white px-8 py-22">
        <div className="mx-auto max-w-[1160px]">
          <div className="rev mb-14 text-center">
            <p className="eyebrow">What Genera does</p>
            <h2>
              Everything you need.
              <br />
              Nothing you don&apos;t.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`rev d${(i % 6) + 1} rounded-2xl border border-cream-dark bg-cream p-8 transition-transform hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,62,69,0.08)]`}
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-forest text-gold">
                  <svg
                    width={22}
                    height={22}
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
                <h3 className="mb-2 font-poppins text-lg font-bold">
                  {f.title}
                </h3>
                <p className="text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founding 100 ────────────────────────────────────────── */}
      <section
        id="founding"
        className="relative overflow-hidden bg-forest-dark px-8 py-22 text-white"
      >
        <div className="mx-auto grid max-w-[1160px] gap-12 md:grid-cols-2 md:items-center">
          <div className="rev">
            <p className="eyebrow !text-gold">Limited offer</p>
            <h2 className="!text-white">The Founding One Hundred.</h2>
            <p className="mt-4 text-white/80">
              We&apos;re selecting 100 pet businesses to join Genera before we
              open to the public. You&apos;ll get three months completely free,
              priority onboarding and a direct line to our team.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {FOUNDING_PERKS.map((p) => (
                <li key={p} className="flex items-start gap-2 text-white/85">
                  <span className="mt-0.5 text-gold">✓</span> {p}
                </li>
              ))}
            </ul>
            <a
              href={REGISTER_URL}
              className="btn btn-outline-w btn-lg mt-6"
            >
              Apply for a Founding Spot →
            </a>
          </div>

          <div className="rev d2 relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:pr-64">
            <Image
              src="/images/welcome.png"
              alt=""
              aria-hidden
              width={720}
              height={720}
              className="pointer-events-none absolute -right-32 -bottom-16 z-20 h-80 w-auto select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:-right-40 md:h-[28rem]"
            />
            <p className="text-sm uppercase tracking-widest text-gold-soft">
              Spots remaining
            </p>
            <div className="mt-2 font-poppins text-[5rem] font-extrabold leading-none text-gold">
              73
            </div>
            <p className="mb-5 text-white/70">out of 100 founding members</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[27%] rounded-full bg-gold" />
            </div>
            <p className="mt-2 text-sm text-white/60">
              27 spots claimed so far
            </p>
            <p className="mt-4 text-white/80">
              Applications close once we reach 100. Be part of shaping the
              product from the start.
            </p>
            <a
              href={REGISTER_URL}
              className="btn btn-gold btn-lg mt-5"
            >
              Claim Your Spot Now
            </a>
          </div>
        </div>
      </section>

      {/* ── Story teaser ────────────────────────────────────────── */}
      <section id="story" className="bg-white px-8 py-22">
        <div className="mx-auto grid max-w-[1160px] gap-12 md:grid-cols-2 md:items-center">
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
            <h2>
              From a dog walking round in South West London to software used
              across the UK.
            </h2>
            <p className="mt-4 text-ink-soft">
              Duncan and Jess started with a dog walking round in 2011. Fifteen
              years later they&apos;re running a licensed daycare — and they
              still couldn&apos;t find software that actually understood how a
              pet business works.
            </p>
            <p className="mt-3 text-ink-soft">
              So they built Genera themselves. Every feature exists because they
              needed it. Every decision is made by people who&apos;ve been on
              the end of a very muddy lead.
            </p>
            <Link
              href="/our-story"
              className="mt-5 inline-flex items-center gap-2 font-poppins font-bold text-forest hover:text-gold"
            >
              Read the full story →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-22 text-center text-white">
        <div className="relative z-10 mx-auto max-w-[760px]">
          <h2 className="!text-white">Ready when you are.</h2>
          <p className="mt-4 text-white/80">
            Start your 3-month free trial today. No credit card required. No
            commitment. Just the tools you need to run your business properly.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <a
              href={REGISTER_URL}
              className="btn btn-gold btn-lg"
            >
              Start Your Free Trial
            </a>
            <BookDemoButton className="btn btn-outline-w btn-lg">
              Book a Demo
            </BookDemoButton>
          </div>
          <p className="mt-5 font-caveat text-lg text-white/70">
            No credit card &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Cancel
            anytime
          </p>
        </div>
      </section>
    </>
  );
}
