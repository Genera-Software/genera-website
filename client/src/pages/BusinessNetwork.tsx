/*
 * Founding 100 — /founding-100
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Progress } from "@/components/ui/progress";

const SPOTS_CLAIMED = 27;
const TOTAL_SPOTS = 100;

function SpotCounter() {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = () => {
          start += 1;
          setValue(start);
          if (start < SPOTS_CLAIMED) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pct = Math.round((value / TOTAL_SPOTS) * 100);

  return (
    <div ref={ref} className="w-full max-w-md mx-auto mt-8">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
          <span className="text-gold text-3xl" style={{ fontFamily: "var(--font-heading)" }}>{value}</span>
          <span className="text-white/50 text-base" style={{ fontFamily: "var(--font-sans)" }}> / {TOTAL_SPOTS} spots claimed</span>
        </span>
        <span className="text-white/40 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>Founding members</span>
      </div>
      <Progress
        value={pct}
        className="h-3 bg-white/10 rounded-full"
        style={{ "--progress-color": "#FFA800" } as React.CSSProperties}
      />
      <p className="mt-3 text-white/40 text-xs text-center" style={{ fontFamily: "var(--font-sans)" }}>
        Applications close once we reach 100. Be part of shaping the product from the start.
      </p>
    </div>
  );
}

const FOUNDING_MAILTO =
  "mailto:info@generasoftware.com?subject=Genera Business Network — Founding 100";

const businessTypes = [
  { icon: "🐕", label: "Dog Daycare" },
  { icon: "🦮", label: "Dog Walking" },
  { icon: "✂️", label: "Grooming Salons" },
  { icon: "🏠", label: "Home Boarding" },
  { icon: "🎓", label: "Training Companies" },
];

const getItems = [
  {
    num: "01",
    title: "Learn",
    items: [
      "Real-world guides and playbooks from people who've done it",
      "Licensing navigation — what to expect, when, and from who",
      "Business setup templates built from lived experience",
      "Regular expert sessions and community Q&As",
    ],
  },
  {
    num: "02",
    title: "Share",
    items: [
      "A private community of verified pet care professionals",
      "Peer-to-peer knowledge — ask, answer, grow",
      "Share what's working in your business right now",
      "No gatekeeping. No competition. Just progress.",
    ],
  },
  {
    num: "03",
    title: "Grow",
    items: [
      "State of the art software built specifically for pet care",
      "A team that's been in your shoes — and your paws",
      "Tools to raise your star rating and your standards",
      "A community that wants to see you succeed",
    ],
  },
];

export default function BusinessNetwork() {
  return (
    <Layout>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-forest relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative container py-20 lg:py-28">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p
                className="text-sm font-semibold text-gold uppercase tracking-widest mb-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Founding 100 — Applications Now Open
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] text-white leading-[1.12]">
                The future of pet care isn't built{" "}
                <span className="text-gold">behind closed doors.</span>
              </h1>
              <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
                The Genera Business Network is a community built to bring pet
                care professionals together — to learn, share, grow, and build
                stronger businesses. Side by side.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={FOUNDING_MAILTO}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-forest font-bold rounded-full shadow-md hover:bg-gold-dark hover:-translate-y-0.5 transition-all duration-200 text-sm"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Join the Founding 100
                </a>
                <a
                  href="#problem"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-200 text-sm"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PHOTO GRID ───────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="container py-0">
          <div className="grid grid-cols-5 gap-2 -mt-12 lg:-mt-16 relative z-10">
            {[
              { src: "/daycare/dog1.jpg", alt: "Dog at woodland daycare" },
              { src: "/daycare/dog2.jpg", alt: "Border collie at daycare" },
              { src: "/daycare/dog3.jpg", alt: "Dog enjoying daycare" },
              { src: "/daycare/dog4.jpg", alt: "Happy dog at daycare" },
              { src: "/daycare/dog5.jpg", alt: "Small dog at daycare" },
            ].map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.07}>
                <div className="rounded-xl overflow-hidden aspect-[3/4] shadow-lg">
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────── */}
      <section id="problem" className="bg-white">
        <div className="container py-20 lg:py-28">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p
                className="text-sm font-semibold text-gold uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                The problem
              </p>
              <h2 className="text-3xl sm:text-4xl text-charcoal leading-tight">
                For too long, the pet care industry has operated{" "}
                <span className="text-forest">behind closed doors.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-8 space-y-5 text-charcoal/70 text-lg leading-relaxed">
                <p>
                  Business owners have faced challenges alone, guarded ideas
                  and missed opportunities to learn from others who have already
                  solved the same problems.
                </p>
                <p>
                  The licensing battle that felt unique to you? Someone else
                  just went through exactly the same thing. The staff ratio
                  question you couldn't get a straight answer on? Another
                  business figured it out last month.
                </p>
                <p>
                  Without a community to share knowledge, the whole industry
                  moves slower — and the dogs and owners who rely on you deserve
                  better than that.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-12 pl-6 border-l-4 border-gold/40">
                <p
                  className="text-2xl sm:text-3xl text-forest leading-snug"
                  style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                >
                  "The industry has been behind closed doors for too long.
                  We're changing that."
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── THE SHIFT ────────────────────────────────────────────── */}
      <section className="bg-forest relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-[0.08] pointer-events-none"
          style={{ background: "#FFA800" }}
        />
        <div className="relative container py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <ScrollReveal direction="left">
              <p
                className="text-sm font-semibold text-gold uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                We're changing that
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-white leading-tight">
                A network <span className="text-gold">built together.</span>
              </h2>
              <div className="mt-6 space-y-4 text-white/70 text-lg leading-relaxed">
                <p>
                  Genera exists to create a network where pet professionals{" "}
                  <span className="text-white font-semibold">
                    learn from each other, share strategies, exchange ideas and
                    support one another.
                  </span>
                </p>
                <p>
                  Whether you run a dog daycare, dog walking business, home
                  boarding service, grooming salon or training company, you'll
                  be part of a community that wants to see you succeed.
                </p>
                <p>
                  Together, we're raising standards in pet care, improving the
                  experience for pets and owners, and building stronger
                  businesses along the way.
                </p>
              </div>
              <a
                href={FOUNDING_MAILTO}
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 bg-gold text-forest font-bold rounded-full shadow-md hover:bg-gold-dark hover:-translate-y-0.5 transition-all duration-200 text-sm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Join the Founding 100
              </a>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="rounded-2xl border border-white/10 p-8" style={{ background: "rgba(255,255,255,0.06)" }}>
                <p
                  className="text-2xl text-white leading-snug mb-6"
                  style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                >
                  "Because the future of pet care isn't built behind closed doors.{" "}
                  <span className="text-gold">It's built together.</span>"
                </p>
                <div className="space-y-3 mt-6">
                  {[
                    "Learn from people who've already solved your problems",
                    "Share what's working in your business right now",
                    "Grow with state of the art software behind you",
                    "Backed by a team who has walked in your paws",
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-3 text-white/75 text-sm leading-relaxed">
                      <span className="text-gold font-bold flex-shrink-0 mt-0.5">✓</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────── */}
      <section className="bg-light-grey">
        <div className="container py-20 lg:py-28">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <p
                className="text-sm font-semibold text-gold uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Who it's for
              </p>
              <h2 className="text-3xl sm:text-4xl text-charcoal leading-tight">
                If you work in pet care, this is your community.
              </h2>
              <p className="mt-4 text-charcoal/60 text-lg leading-relaxed">
                Every discipline. Every size. One network.
              </p>
            </div>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {businessTypes.map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <span className="text-4xl mb-3 block">{b.icon}</span>
                  <h4
                    className="text-sm font-bold text-charcoal leading-snug"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {b.label}
                  </h4>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WALKED IN YOUR PAWS ──────────────────────────────────── */}
      <section className="bg-white">
        <div className="container py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <p
                className="text-sm font-semibold text-gold uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our credibility
              </p>
              <h2 className="text-3xl sm:text-4xl text-charcoal leading-tight mb-6">
                Supported by a team who have{" "}
                <span className="text-forest">walked in your paws.</span>
              </h2>
              <div className="space-y-4 text-charcoal/70 text-lg leading-relaxed">
                <p>
                  Genera isn't built by people who read about pet care.{" "}
                  <strong className="text-charcoal font-semibold">
                    It's built by people who've lived it.
                  </strong>{" "}
                  The inspections, the planning battles, the licensing letters,
                  the sleepless nights before opening day.
                </p>
                <p>
                  Everything we build is shaped by real-world experience from
                  operating successful pet care businesses. When we say we
                  understand, we mean it.
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Operated licensed dog daycare businesses from the ground up",
                  "Navigated full licensing and planning compliance first-hand",
                  "Built software because the right tools simply didn't exist",
                  "Faced every challenge you're facing — and found the way through",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-charcoal/75 text-sm leading-relaxed">
                    <span className="text-gold font-bold text-base flex-shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 mt-8 text-forest font-semibold text-sm hover:gap-3 transition-all duration-200"
              >
                Read the full story <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            {/* Paw trail */}
            <ScrollReveal direction="right" delay={0.15}>
              <div className="flex justify-center lg:justify-end">
                <svg width="280" height="400" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <style>{`
                      @keyframes pawDraw {
                        from { stroke-dashoffset: 600; }
                        to   { stroke-dashoffset: 0; }
                      }
                      @keyframes pawIn {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                      }
                      @keyframes goldGlow {
                        0%, 100% { opacity: 0.85; }
                        50%      { opacity: 1; }
                      }
                      .paw-trail-path {
                        stroke-dasharray: 600;
                        stroke-dashoffset: 600;
                        animation: pawDraw 1.8s ease-out 0.3s forwards;
                      }
                      .paw-0 { animation: pawIn 0.35s ease-out 0.6s both; }
                      .paw-1 { animation: pawIn 0.35s ease-out 0.9s both; }
                      .paw-2 { animation: pawIn 0.35s ease-out 1.2s both; }
                      .paw-3 { animation: pawIn 0.35s ease-out 1.5s both; }
                      .paw-4 { animation: pawIn 0.35s ease-out 1.8s both; }
                      .paw-gold { animation: pawIn 0.4s ease-out 2.1s both, goldGlow 1.8s ease-in-out 2.5s infinite; }
                    `}</style>
                  </defs>
                  <path
                    className="paw-trail-path"
                    d="M80 400 C120 360 60 310 100 270 C140 230 200 240 180 190 C160 140 80 140 100 90 C120 40 200 30 220 20"
                    stroke="#003E45" strokeWidth="1.5" strokeDasharray="5 10" opacity="0.15" fill="none"
                  />
                  {[
                    {x:65,y:385,r:-10,cls:"paw-0"},
                    {x:135,y:345,r:8,cls:"paw-1"},
                    {x:75,y:285,r:-5,cls:"paw-2"},
                    {x:160,y:215,r:10,cls:"paw-3"},
                    {x:75,y:140,r:-8,cls:"paw-4"},
                  ].map((p,i)=>(
                    <g key={i} className={p.cls} style={{opacity:0}} transform={`translate(${p.x},${p.y}) rotate(${p.r})`}>
                      <ellipse cx="0" cy="10" rx="13" ry="11" fill="#003E45"/>
                      <ellipse cx="-17" cy="-7" rx="7" ry="6" fill="#003E45"/>
                      <ellipse cx="-6" cy="-17" rx="7" ry="6" fill="#003E45"/>
                      <ellipse cx="6" cy="-17" rx="7" ry="6" fill="#003E45"/>
                      <ellipse cx="17" cy="-7" rx="7" ry="6" fill="#003E45"/>
                    </g>
                  ))}
                  <g className="paw-gold" style={{opacity:0}} transform="translate(185,55) rotate(6)">
                    <ellipse cx="0" cy="11" rx="16" ry="14" fill="#FFA800"/>
                    <ellipse cx="-19" cy="-8" rx="9" ry="8" fill="#FFA800"/>
                    <ellipse cx="-7" cy="-21" rx="9" ry="8" fill="#FFA800"/>
                    <ellipse cx="7" cy="-21" rx="9" ry="8" fill="#FFA800"/>
                    <ellipse cx="19" cy="-8" rx="9" ry="8" fill="#FFA800"/>
                  </g>
                  <ellipse cx="185" cy="44" rx="32" ry="32" fill="#FFA800" opacity="0.06"/>
                  <text x="10" y="398" fontFamily="var(--font-heading)" fontSize="11" fill="#003E45" opacity="0.45">The first inspection</text>
                  <text x="10" y="295" fontFamily="var(--font-heading)" fontSize="11" fill="#003E45" opacity="0.55">The planning battle</text>
                  <text x="18" y="152" fontFamily="var(--font-heading)" fontSize="11" fill="#003E45" opacity="0.65">The licence wait</text>
                  <text x="105" y="68" fontFamily="var(--font-heading)" fontSize="13" fill="#FFA800" opacity="0.9" fontWeight="700">First dog through ✓</text>
                </svg>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────────────── */}
      <section className="bg-light-grey">
        <div className="container py-20 lg:py-28">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p
                className="text-sm font-semibold text-gold uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What you get
              </p>
              <h2 className="text-3xl sm:text-4xl text-charcoal leading-tight">
                Tools, knowledge, people.
              </h2>
              <p className="mt-4 text-charcoal/60 text-lg">
                Everything shaped by real experience. Nothing generic.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {getItems.map((card, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full">
                  <p className="text-6xl font-bold text-forest/15 mb-2 leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                    {card.num}
                  </p>
                  <h3 className="text-2xl font-bold text-forest mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                    {card.title}
                  </h3>
                  <ul className="space-y-3">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-charcoal/65 text-sm leading-relaxed">
                        <span className="text-gold font-bold flex-shrink-0 mt-0.5">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDING 100 ─────────────────────────────────────────── */}
      <section className="bg-forest relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative container py-20 lg:py-28 text-center">
          <ScrollReveal>
            <p
              className="text-sm font-semibold text-gold uppercase tracking-widest mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Founding Members
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] text-white leading-tight max-w-3xl mx-auto">
              Be one of the first{" "}
              <span className="text-gold">100.</span>
            </h2>
            <p className="mt-6 text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              The Founding 100 get early access, a lifetime founding member
              status, and a direct voice in shaping what the Genera Business
              Network becomes. These spots won't last.
            </p>
            <div className="mt-8 inline-block rounded-2xl border border-white/15 px-8 py-6 text-left mx-auto" style={{ background: "rgba(255,255,255,0.06)" }}>
              <ul className="flex flex-col gap-3">
                {[
                  { emoji: "🎁", text: "3 months free — no credit card required" },
                  { emoji: "📞", text: "One-on-one onboarding call with the Genera team" },
                  { emoji: "🚀", text: "Priority access to new features as they launch" },
                  { emoji: "🗣️", text: "Your feedback shapes the product roadmap" },
                  { emoji: "🔒", text: "Locked-in founding member pricing, forever" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/85 text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                    <span className="text-base flex-shrink-0">{item.emoji}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={FOUNDING_MAILTO}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-forest font-bold rounded-full shadow-lg hover:bg-gold-dark hover:-translate-y-0.5 transition-all duration-200 text-sm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Join the Founding 100
              </a>
              <a
                href={FOUNDING_MAILTO}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-200 text-sm"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Find out more
              </a>
            </div>
            <SpotCounter />
            <p className="mt-4 text-white/35 text-sm">
              First come, first in. Only 100 spots available.
            </p>
          </ScrollReveal>
        </div>
      </section>

    </Layout>
  );
}
