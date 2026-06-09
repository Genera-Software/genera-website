"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import FoundingSpotsStats from "@/components/FoundingSpotsStats";
import Paw from "@/components/Paw";
import { FOUNDING_100_CTA_LABEL } from "@/lib/cta";

/* ── Animated paw trail ──────────────────────────────────────── */
function PawTrail() {
  return (
    <svg width="280" height="400" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <style>{`
          @keyframes pawDraw { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
          @keyframes pawIn   { from { opacity: 0; } to { opacity: 1; } }
          @keyframes goldGlow { 0%,100% { opacity:0.85; } 50% { opacity:1; } }
          .pt-path { stroke-dasharray:600; stroke-dashoffset:600; animation: pawDraw 1.8s ease-out 0.3s forwards; }
          .pt-0 { animation: pawIn 0.35s ease-out 0.6s both; }
          .pt-1 { animation: pawIn 0.35s ease-out 0.9s both; }
          .pt-2 { animation: pawIn 0.35s ease-out 1.2s both; }
          .pt-3 { animation: pawIn 0.35s ease-out 1.5s both; }
          .pt-4 { animation: pawIn 0.35s ease-out 1.8s both; }
          .pt-gold { animation: pawIn 0.4s ease-out 2.1s both, goldGlow 1.8s ease-in-out 2.5s infinite; }
        `}</style>
      </defs>
      <path className="pt-path" d="M80 400 C120 360 60 310 100 270 C140 230 200 240 180 190 C160 140 80 140 100 90 C120 40 200 30 220 20"
        stroke="#003E45" strokeWidth="1.5" strokeDasharray="5 10" opacity="0.15" fill="none"/>
      {([
        {x:65,y:385,r:-10,c:"pt-0"},{x:135,y:345,r:8,c:"pt-1"},{x:75,y:285,r:-5,c:"pt-2"},
        {x:160,y:215,r:10,c:"pt-3"},{x:75,y:140,r:-8,c:"pt-4"},
      ] as const).map((p,i) => (
        <g key={i} className={p.c} style={{opacity:0}} transform={`translate(${p.x},${p.y}) rotate(${p.r})`}>
          <ellipse cx="0" cy="10" rx="13" ry="11" fill="#003E45"/>
          <ellipse cx="-17" cy="-7" rx="7" ry="6" fill="#003E45"/>
          <ellipse cx="-6" cy="-17" rx="7" ry="6" fill="#003E45"/>
          <ellipse cx="6" cy="-17" rx="7" ry="6" fill="#003E45"/>
          <ellipse cx="17" cy="-7" rx="7" ry="6" fill="#003E45"/>
        </g>
      ))}
      <g className="pt-gold" style={{opacity:0}} transform="translate(185,55) rotate(6)">
        <ellipse cx="0" cy="11" rx="16" ry="14" fill="#FFA800"/>
        <ellipse cx="-19" cy="-8" rx="9" ry="8" fill="#FFA800"/>
        <ellipse cx="-7" cy="-21" rx="9" ry="8" fill="#FFA800"/>
        <ellipse cx="7" cy="-21" rx="9" ry="8" fill="#FFA800"/>
        <ellipse cx="19" cy="-8" rx="9" ry="8" fill="#FFA800"/>
      </g>
      <ellipse cx="185" cy="44" rx="32" ry="32" fill="#FFA800" opacity="0.06"/>
      <text x="10" y="398" fontFamily="massilia,sans-serif" fontSize="11" fill="#003E45" opacity="0.45">The first inspection</text>
      <text x="10" y="295" fontFamily="massilia,sans-serif" fontSize="11" fill="#003E45" opacity="0.55">The planning battle</text>
      <text x="18" y="152" fontFamily="massilia,sans-serif" fontSize="11" fill="#003E45" opacity="0.65">The licence wait</text>
      <text x="105" y="68" fontFamily="massilia,sans-serif" fontSize="13" fill="#FFA800" opacity="0.9" fontWeight="700">First dog through ✓</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Static data
   ───────────────────────────────────────────────────────────── */
const FOUNDING_PERKS = [
  { icon: "🎁", text: "3 months completely free — no credit card required" },
  { icon: "📞", text: "One-on-one onboarding call with the Genera team" },
  { icon: "🚀", text: "Priority access to every new feature as it launches" },
  { icon: "🗺️", text: "Your feedback directly shapes our product roadmap" },
  { icon: "🔒", text: "Locked-in founding member pricing, forever" },
  { icon: "🏅", text: "Lifetime founding member status in the Genera Network" },
];

const COMMUNITY_PILLARS = [
  {
    icon: "📚",
    heading: "Real-world guides and playbooks",
    body: "From people who've actually done it. Licensing navigation, planning applications, DEFRA compliance — step by step from businesses that went through it first.",
  },
  {
    icon: "🤝",
    heading: "Peer-to-peer knowledge",
    body: "Ask a question, get an answer from someone who solved the same problem last month. No gatekeeping. No competition. Just progress.",
  },
  {
    icon: "🎤",
    heading: "Expert sessions and community Q&As",
    body: "Regular sessions with industry professionals, compliance experts, and the Genera team. Built around what the community actually wants to learn.",
  },
  {
    icon: "🔒",
    heading: "A private verified community",
    body: "Every member is a real pet care professional. No noise, no spam — just the people who understand exactly what you're dealing with.",
  },
];

const BUSINESS_TYPES = [
  { icon: "🐕",  label: "Dog Daycare"         },
  { icon: "🦮",  label: "Dog Walking"          },
  { icon: "✂️",  label: "Grooming Salons"      },
  { icon: "🏠",  label: "Home Boarding"        },
  { icon: "🎓",  label: "Training Companies"   },
  { icon: "🐾",  label: "Pet Sitting"          },
];

const TEAM_CREDENTIALS = [
  "Operated licensed dog daycare businesses from the ground up",
  "Navigated full DEFRA licensing and planning compliance first-hand",
  "Built software because the right tools simply didn't exist",
  "Faced every challenge you're facing — and found the way through",
];

/* ─────────────────────────────────────────────────────────────
   Check icon
   ───────────────────────────────────────────────────────────── */
function Check({ className = "" }: { className?: string }) {
  return (
    <span
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 ${className}`}
    >
      <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
        <path
          d="M2 6.5L4.5 9L10 3.5"
          stroke="#c97d00"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CheckWhite() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15">
      <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
        <path
          d="M2 6.5L4.5 9L10 3.5"
          stroke="#FFD166"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────────────────── */
export default function CommunityClient({
  totalSpots,
  claimedSpots,
}: {
  totalSpots: number;
  claimedSpots: number;
}) {
  const remainingSpots = Math.max(totalSpots - claimedSpots, 0);

  return (
    <>
      <Reveal />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 pt-24 pb-14 text-white md:px-8 md:pt-32 md:pb-22">
        {/* decorative blobs */}
        <span aria-hidden className="pointer-events-none absolute -top-20 -right-24 h-[320px] w-[320px] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-gold/8 md:h-[480px] md:w-[480px]" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 -left-20 h-[200px] w-[200px] rounded-[40%_60%_55%_45%/48%_52%_48%_52%] bg-white/5 md:h-[280px] md:w-[280px]" />

        <div className="relative z-10 mx-auto max-w-[1160px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft">
            <Paw className="h-[1.1em] w-[1.1em]" /> Founding 100 · Launching 2025
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-16">
            <div className="rev max-w-[640px]">
              <h1 className="text-white [font-size:clamp(2rem,3.8vw,3.4rem)] leading-[1.05]">
                The future of pet care{" "}
                <span className="squig">
                  isn&apos;t built
                  <svg viewBox="0 0 180 12" aria-hidden preserveAspectRatio="none">
                    <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7"/>
                  </svg>
                </span>{" "}
                <em className="not-italic text-gold">behind closed doors.</em>
              </h1>
              <p className="mt-5 text-[1.15rem] leading-relaxed text-white/80 md:text-[1.25rem]">
                The Genera Business Network brings pet care professionals
                together to learn, share, grow, and build stronger businesses.
                Side by side. The Founding 100 are the first through the door.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <BookDemoButton className="btn btn-gold btn-lg">
                  {FOUNDING_100_CTA_LABEL}
                </BookDemoButton>
                <a href="#what-you-get" className="btn btn-outline-w btn-lg">
                  What&apos;s included
                </a>
              </div>
              <p className="mt-4 text-sm text-white/60">
                No credit card · No commitment ·{" "}
                <strong className="text-gold">{remainingSpots} spots remaining</strong>
              </p>
            </div>

            {/* Spots card */}
            <div className="rev d2 relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:min-w-[280px] md:max-w-[320px] md:p-8">
              <Image
                src="/images/welcome.png"
                alt=""
                aria-hidden
                width={300}
                height={300}
                className="pointer-events-none absolute -right-4 bottom-0 z-0 h-[130px] w-auto select-none opacity-70 md:h-[160px]"
              />
              <FoundingSpotsStats
                totalSpots={totalSpots}
                claimedSpots={claimedSpots}
              />
              <p className="relative z-10 mt-3 text-sm text-white/70">
                Applications close once we reach 100.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dog photo banner ──────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-hidden md:gap-2" aria-hidden>
        {[1,2,3,4,5].map(n => (
          <div key={n} className="relative h-[180px] flex-1 overflow-hidden md:h-[260px]">
            <img
              src={`/daycare/dog${n}.jpg`}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* ── The problem ───────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-16 md:px-8 md:py-22">
        <div className="mx-auto max-w-[760px]">
          <div className="rev">
            <p className="eyebrow">Why this matters</p>
            <h2 className="mt-2 text-heading-mid">
              For too long, the pet care industry has operated in isolation.
            </h2>
            <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
              <p>
                Business owners have faced challenges alone, guarded ideas, and
                missed opportunities to learn from others who already solved the
                same problems.
              </p>
              <p>
                The licensing battle that felt unique to you? Someone else just
                went through exactly the same thing. The staff ratio question you
                couldn&apos;t get a straight answer on? Another business figured
                it out last month.
              </p>
              <p>
                Without a community to share knowledge, the whole industry moves
                slower — and the dogs and owners who rely on you deserve better
                than that.
              </p>
            </div>
            <blockquote className="mt-8 border-l-4 border-gold/50 pl-5">
              <p className="font-massilia text-[1.15rem] font-bold leading-snug text-forest">
                &ldquo;The industry has been behind closed doors for too long.
                We&apos;re changing that.&rdquo;
              </p>
              <cite className="mt-2 block text-sm text-ink-soft not-italic">
                — Duncan &amp; Jess, founders of Genera
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Who it's for ──────────────────────────────────────────────── */}
      <section className="bg-cream px-6 py-16 md:px-8 md:py-22">
        <div className="mx-auto max-w-[1160px]">
          <div className="rev text-center mb-10 md:mb-14">
            <p className="eyebrow">Who it&apos;s for</p>
            <h2 className="mt-2 text-heading-mid">
              If you work in pet care, this is your community.
            </h2>
            <p className="mt-4 text-ink-soft text-lg">
              Every discipline. Every size. One network.
            </p>
          </div>
          <div className="rev d2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {BUSINESS_TYPES.map((t) => (
              <div
                key={t.label}
                className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-6 shadow-sm border border-cream-dark"
              >
                <span className="text-5xl leading-none">{t.icon}</span>
                <span className="font-massilia font-bold text-forest text-center text-sm leading-snug">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get: Founding 100 benefits ───────────────────────── */}
      <section
        id="what-you-get"
        className="relative overflow-hidden bg-forest-dark px-6 py-16 text-white md:px-8 md:py-22"
      >
        <span aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-gold/5" />

        <div className="relative z-10 mx-auto max-w-[1160px]">
          <div className="rev text-center md:text-left">
            <p className="eyebrow !text-gold">Limited offer</p>
            <h2 className="mt-2 text-heading-mid !text-white">The Founding One Hundred.</h2>
            <p className="mt-4 max-w-[680px] text-[1.1rem] text-white/80 leading-relaxed md:mx-0 mx-auto">
              We&apos;re selecting 100 pet businesses to join Genera before we
              open to the public. You&apos;ll get three months completely free,
              priority onboarding, and a direct line to our team — plus
              founding member access to the Genera Business Network when it
              launches.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {FOUNDING_PERKS.map((perk, i) => (
              <div
                key={i}
                className="rev flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm md:p-6"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <span className="mt-0.5 text-2xl">{perk.icon}</span>
                <p className="text-base text-white/85 leading-relaxed">
                  {perk.text}
                </p>
              </div>
            ))}
          </div>

          <div className="rev mt-12 flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:flex-row md:gap-12 md:p-10">
            <div className="w-full md:max-w-[260px]">
              <FoundingSpotsStats
                totalSpots={totalSpots}
                claimedSpots={claimedSpots}
              />
              <p className="relative z-10 mt-3 text-sm text-white/70">
                Be part of shaping the product from the start. Applications
                close once we reach 100.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-lg font-bold text-white">
                Ready to be one of the first 100?
              </p>
              <p className="text-white/70 leading-relaxed">
                No credit card required. No commitment. Just one simple
                application to see if Genera is right for your business.
              </p>
              <BookDemoButton className="btn btn-gold btn-lg">
                {FOUNDING_100_CTA_LABEL}
              </BookDemoButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community pillars ─────────────────────────────────────────── */}
      <section className="bg-cream px-6 py-16 md:px-8 md:py-22">
        <div className="mx-auto max-w-[1160px]">
          <div className="rev text-center">
            <p className="eyebrow">Genera Business Network</p>
            <h2 className="mt-2 text-heading-mid">More than software. A community.</h2>
            <p className="mx-auto mt-4 max-w-[600px] text-ink-soft leading-relaxed">
              Founding members get early access to the Genera Business Network
              — a private community of verified pet care professionals built to
              raise standards across the industry.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {COMMUNITY_PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="rev flex gap-5 rounded-2xl border border-teal-mid/40 bg-white p-6 shadow-[0_8px_32px_rgba(0,62,69,0.07)] md:p-7"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className="mt-1 text-3xl">{pillar.icon}</span>
                <div>
                  <h3 className="text-forest">{pillar.heading}</h3>
                  <p className="mt-2 text-ink-soft leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Big quote */}
          <div className="rev mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-forest to-forest-mid p-8 text-white md:p-12">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
              <div>
                <p className="text-[1.4rem] font-bold leading-snug text-white md:text-[1.8rem]">
                  Together, we&apos;re raising standards in pet care, improving
                  the experience for pets and owners, and building stronger
                  businesses along the way.
                </p>
                <p className="mt-5 text-white/70 leading-relaxed">
                  No gatekeeping. No competition. Just a community of people
                  who want to see the whole industry succeed.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  "Learn from people who've already solved your problems",
                  "Grow with state-of-the-art software behind you",
                  "Backed by a team who has walked in your paws",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckWhite />
                    <span className="text-sm text-white/80 leading-relaxed">
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Backed by experience ──────────────────────────────────────── */}
      <section className="bg-white px-6 py-16 md:px-8 md:py-22">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div className="rev flex justify-center items-center">
              <PawTrail />
            </div>

            <div className="rev d2">
              <p className="eyebrow">Supported by a team who&apos;ve been there</p>
              <h2 className="mt-2 text-heading-mid">
                Genera isn&apos;t built by people who{" "}
                <em>read about</em> pet care.
              </h2>
              <p className="mt-4 text-ink-soft leading-relaxed">
                It&apos;s built by people who&apos;ve lived it. The
                inspections, the planning battles, the licensing letters, the
                sleepless nights before opening day.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {TEAM_CREDENTIALS.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <Check />
                    <span className="text-ink-soft leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-bold text-forest">
                Everything shaped by real experience. Nothing generic.
              </p>
              <Link
                href="/our-story"
                className="mt-3 inline-flex items-center gap-2 font-massilia font-bold text-forest hover:text-gold transition-colors"
              >
                Read our story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 py-16 text-center text-white md:px-8 md:py-24">
        <span aria-hidden className="pointer-events-none absolute -top-20 -right-24 h-[300px] w-[300px] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-gold/8" />

        <div className="relative z-10 mx-auto max-w-[760px]">
          <div className="rev">
            <p className="eyebrow !text-gold-soft">Only 100 spots</p>
            <h2 className="mt-2 text-heading-mid !text-white">
              First come, first in.
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-[1.1rem] text-white/80 leading-relaxed">
              The Founding 100 get early access, a lifetime founding member
              status, and a direct voice in shaping what the Genera Business
              Network becomes. These spots won&apos;t last.
            </p>
          </div>

          {/* Perks card */}
          <div className="rev d2 mx-auto mt-8 inline-block rounded-2xl border border-white/15 px-8 py-6 text-left backdrop-blur-sm" style={{background:"rgba(255,255,255,0.06)"}}>
            <ul className="flex flex-col gap-3">
              {FOUNDING_PERKS.map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-white/85 text-sm font-niveau">
                  <span className="text-base shrink-0">{p.icon}</span>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Spots counter */}
          <div className="rev d3 mx-auto mt-8 max-w-[320px] rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
            <FoundingSpotsStats
              totalSpots={totalSpots}
              claimedSpots={claimedSpots}
            />
          </div>

          <div className="rev d4 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <BookDemoButton className="btn btn-gold btn-lg">
              {FOUNDING_100_CTA_LABEL}
            </BookDemoButton>
          </div>
          <p className="mt-4 text-sm text-white/60">
            No credit card · No commitment · Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}
