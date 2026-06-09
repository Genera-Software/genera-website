import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import { createMetadata } from "@/lib/seo";
import { FOUNDING_100_CTA_LABEL } from "@/lib/cta";
import { getPublicSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  ...createMetadata({
    title: "About Genera Dog Daycare Software",
    description:
      "Learn how Genera grew from a South West London dog walking and daycare business into pet business software for UK dog daycares and walkers.",
    path: "/our-story",
  }),
};

export const revalidate = 60;

const STATS = [
  { num: "2011", label: "Where it\nall started" },
  { num: "15+", label: "Years in\npet care" },
  { num: "5★", label: "Licensed\ndaycare" },
  { num: "UK", label: "Based &\nsupported" },
];

type TimelineEntry = {
  year: string;
  body: string;
  image_url: string | null;
};

const FALLBACK_TIMELINE: TimelineEntry[] = [
  {
    year: "2011",
    body: "Duncan and Jess start Duncan's Dog Co as a dog walking service in South West London.",
    image_url: null,
  },
  {
    year: "2013",
    body: "The business expands into full daycare services as demand grows.",
    image_url: null,
  },
  {
    year: "2016",
    body: "Move to a beautiful woodland facility in Surrey. The team grows significantly.",
    image_url: null,
  },
  {
    year: "2018",
    body: "The missed booking. A loyal customer (and developer) offers to build a solution.",
    image_url: null,
  },
  {
    year: "2019",
    body: "The first prototype of Genera goes live at Duncan's Dog Co.",
    image_url: null,
  },
  {
    year: "2022",
    body: "After years of refinement, Genera is opened up to other pet businesses.",
    image_url: null,
  },
  {
    year: "Today",
    body: "Genera is used by pet businesses across the UK. And we are just getting started.",
    image_url: null,
  },
];

async function getTimeline(): Promise<TimelineEntry[]> {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("story_timeline")
    .select("year, body, image_url")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_TIMELINE;
  return data;
}

export default async function OurStoryPage() {
  const timeline = await getTimeline();
  return (
    <>
      <Reveal />

      {/* Split hero — text left, video right with soft blended edge */}
      <section className="grid grid-cols-1 overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] md:grid-cols-2">
        {/* Left: text */}
        <div className="relative z-10 overflow-hidden px-8 pt-28 pb-20 text-white md:px-14 md:pt-36">
          <span aria-hidden className="pointer-events-none absolute -top-20 -right-24 h-[320px] w-[320px] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-gold/8" />
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
            Our Story · Built from the ground up
          </div>
          <h1 className="mt-2 text-white [font-size:clamp(2rem,3.8vw,3.4rem)] leading-[1.05]">
            We didn&apos;t set out to build software.
            <br />
            <em className="text-gold">We set out to walk dogs.</em>
          </h1>
          <p className="mt-5 max-w-[480px] text-white/80">
            From a dog walking round in South West London in 2011 to software
            used by pet businesses across the UK. Here&apos;s how it happened.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {STATS.map((s) => (
              <div key={s.num} className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="font-massilia text-lg font-bold leading-none text-gold">{s.num}</span>
                <span className="text-xs uppercase tracking-wider text-white/60">{s.label.replace("\n", " ")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: video with soft left-edge blend into text panel */}
        <div className="relative min-h-[300px] overflow-hidden md:min-h-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="https://video.wixstatic.com/video/a043b3_7798ca77d10a457781f9ce9380492181/720p/mp4/file.mp4"
              type="video/mp4"
            />
          </video>
          {/* Soft left-edge blend matching the text panel gradient */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-forest via-forest/55 to-transparent" />
          {/* Top tint to tie into the section gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#007080]/30 via-transparent to-transparent" />
        </div>
      </section>

      {/* DDC origin callout */}
      <section className="px-8 py-14" style={{ background: "linear-gradient(170deg,#fff 0%,#E0F0F2 100%)" }}>
        <div className="mx-auto flex max-w-[760px] items-center gap-8 rounded-3xl border border-teal-mid/20 bg-white p-8 shadow-[0_8px_32px_rgba(0,62,69,0.08)] md:p-10">
          <div className="shrink-0">
            <Image
              src="/images/duncans-dog-co-logo.png"
              alt="Duncan's Dog Co logo"
              width={96}
              height={96}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="eyebrow mb-1">Where it all began</p>
            <h3 className="font-massilia text-xl font-bold text-forest md:text-2xl">
              Duncan&apos;s Dog Co.
            </h3>
            <p className="mt-2 text-ink-soft">
              The UK&apos;s longest-standing five-star licensed doggy daycare in Surrey — and the business that Genera was born inside.{" "}
              <a
                href="https://www.duncansdogco.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-forest underline underline-offset-2 hover:text-gold"
              >
                Visit duncansdogco.com →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Story — card blocks, alternating teal / gold like Features page */}
      <section className="px-6 py-16 md:px-8 md:py-20" style={{ background: "linear-gradient(170deg,#fff 0%,#E0F0F2 100%)" }}>
        <div className="mx-auto max-w-[900px]">
          <div className="rev mb-3 text-center">
            <p className="eyebrow">The story</p>
          </div>
          <div className="flex flex-col gap-6">

            {/* Card 1 — origins */}
            <div className="rev d1 overflow-hidden rounded-3xl border border-teal-mid/20 bg-white shadow-[0_8px_32px_rgba(0,62,69,0.07)] md:grid md:grid-cols-[1fr_1fr]">
              <div className="p-8 md:p-10">
                <p className="eyebrow mb-2">2011</p>
                <h3 className="mb-4 font-massilia text-xl font-bold text-forest md:text-2xl">It started with a handful of leads and a lot of heart</h3>
                <p className="text-sm text-ink-soft">Duncan and Jess started Duncan&apos;s Dog Co as a dog walking service in South West London. Just the two of them and a growing list of dogs who needed looking after during the day.</p>
                <p className="mt-3 text-sm text-ink-soft">The business grew quickly — walks turned into a full schedule, then daycare, then boarding. Before long they were running one of the busiest independent pet businesses in the area.</p>
              </div>
              <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-forest-mid to-forest">
                <Image src="/images/duncan-jess.jpg" alt="Duncan and Jess, founders" fill sizes="450px" className="object-cover object-top" loading="lazy" />
              </div>
            </div>

            {/* Card 2 — growing pains */}
            <div className="rev d2 overflow-hidden rounded-3xl border border-teal-mid/20 bg-white shadow-[0_8px_32px_rgba(0,62,69,0.07)] md:grid md:grid-cols-[1fr_1fr]">
              <div className="relative order-2 min-h-[220px] overflow-hidden bg-gradient-to-br from-teal-mid/30 to-forest-mid/40 md:order-1">
                <Image src="/images/team-certificates.png" alt="The Duncan's Dog Co team" fill sizes="450px" className="object-cover" loading="lazy" />
              </div>
              <div className="order-1 p-8 md:order-2 md:p-10">
                <p className="eyebrow mb-2">The growing pains</p>
                <h3 className="mb-4 font-massilia text-xl font-bold text-forest md:text-2xl">Five stars. Woodland facility. One spreadsheet too many.</h3>
                <p className="text-sm text-ink-soft">They moved to a beautiful woodland facility in Surrey. The team grew. The client list grew. And the admin grew with it.</p>
                <p className="mt-3 text-sm text-ink-soft">Bookings by text, email, phone and Facebook. Invoices raised one by one every week. Routes planned on paper. Staff schedules in WhatsApp groups. It all sort of worked. Until it didn&apos;t.</p>
                <blockquote className="mt-5 border-l-4 border-gold pl-4 font-massilia text-base italic text-forest">
                  &ldquo;We were running everything on spreadsheets. It worked until it did not.&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Card 3 — the missed booking */}
            <div className="rev d3 rounded-3xl border border-forest/10 bg-forest p-8 shadow-[0_8px_32px_rgba(0,62,69,0.18)] md:p-10">
              <div className="md:max-w-[640px]">
                <p className="eyebrow mb-2 !text-gold/70">The turning point</p>
                <h3 className="mb-4 font-massilia text-xl font-bold text-white md:text-2xl">The missed booking that changed everything</h3>
                <p className="text-sm text-white/75">One day a loyal customer&apos;s pickup was missed. A booking had slipped through the cracks. It was embarrassing. It was avoidable. And it was the moment everything changed.</p>
                <p className="mt-3 text-sm text-white/75">That customer happened to be a developer. Instead of leaving a bad review, he said something unexpected.</p>
                <blockquote className="mt-5 font-massilia text-lg font-bold italic text-gold md:text-xl">
                  &ldquo;Instead of leaving a bad review, he said: I will build you something.&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Card 4 — prototype to platform */}
            <div className="rev d4 overflow-hidden rounded-3xl border border-teal-mid/20 bg-white shadow-[0_8px_32px_rgba(0,62,69,0.07)] md:grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <p className="eyebrow mb-2">2019 – today</p>
                <h3 className="mb-4 font-massilia text-xl font-bold text-forest md:text-2xl">From prototype to platform — built in the mud, not a lab</h3>
                <p className="text-sm text-ink-soft">That first version was rough. But it worked. Bookings stopped falling through. Invoices went out on time. Routes made sense.</p>
                <p className="mt-3 text-sm text-ink-soft">Every feature was tested in a real business, every day. It wasn&apos;t built by people guessing what pet businesses need — it was built at 7am with muddy boots, on late Sunday evenings that used to be spent on invoices.</p>
                <p className="mt-3 text-sm text-ink-soft">After years of refining it internally, Duncan and Jess decided to share it. Not as a corporate product launch, but as one small business helping others.</p>
              </div>
              <div className="flex flex-col justify-center bg-gradient-to-br from-[#FFF3CC] to-[#FFD66C] p-8 md:p-10">
                <p className="font-massilia text-4xl font-bold text-forest">2022</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-forest/60">Opened to the industry</p>
                <p className="mt-4 text-sm text-forest/80">Genera is now used by pet businesses across the UK — and we are just getting started.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-8 py-22" style={{ background: "linear-gradient(170deg,#FFF3CC 0%,#FFD66C 100%)" }}>
        <div className="mx-auto max-w-[860px]">
          <h2 className="rev mb-10 text-center text-2xl font-bold text-forest md:text-3xl">The journey so far</h2>

          <ol className="relative flex flex-col gap-5 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-forest/20">
            {timeline.map((t, i) => {
              const isLast = i === timeline.length - 1;
              const left = i % 2 === 0;
              return (
                <li
                  key={`${t.year}-${i}`}
                  className={`rev d${(i % 6) + 1} relative grid grid-cols-[1fr_auto_1fr] items-center gap-4`}
                >
                  <div className="flex justify-end">
                    {left ? (
                      <TimelineCard year={t.year} text={t.body} />
                    ) : (
                      <PolaroidPlaceholder
                        year={t.year}
                        imageUrl={t.image_url}
                        side="left"
                      />
                    )}
                  </div>
                  <span
                    className={`relative z-10 block h-4 w-4 rounded-full ring-4 ring-gold/30 ${
                      isLast ? "bg-forest" : "bg-gold"
                    }`}
                  />
                  <div className="flex justify-start">
                    {!left ? (
                      <TimelineCard year={t.year} text={t.body} />
                    ) : (
                      <PolaroidPlaceholder
                        year={t.year}
                        imageUrl={t.image_url}
                        side="right"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Team card */}
      <section className="px-8 py-22" style={{ background: "linear-gradient(170deg,#fff 0%,#E0F0F2 100%)" }}>
        <div className="mx-auto max-w-[1000px]">
          <div className="rev mb-12 text-center">
            <p className="eyebrow">The people behind Genera</p>
            <h2 className="mt-2">It takes a team who actually cares.</h2>
          </div>

          {/* Becks */}
          <div className="rev d1 grid gap-10 overflow-hidden rounded-3xl border border-cream-dark bg-cream shadow-[0_24px_60px_rgba(0,62,69,0.08)] md:grid-cols-[2fr_3fr]">
            <div className="relative aspect-[4/5] md:aspect-auto">
              <Image
                src="/images/becks.png"
                alt="Becks, Operations & Customer Success at Genera Software"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-8 md:p-12">
              <p className="eyebrow">Meet the team</p>
              <h3 className="mt-2 font-massilia text-3xl font-bold text-forest">
                Becks
              </h3>
              <p className="mt-1 font-medium text-gold">
                Operations &amp; Customer Success
              </p>
              <div className="mt-5 flex flex-col gap-3 text-ink-soft">
                <p>
                  Becks was Duncan and Jess&apos;s very first employee — joining
                  the team over ten years ago and playing a pivotal role in
                  shaping what Duncan&apos;s Dog Co became.
                </p>
                <p>
                  She has been there through every stage of building the
                  daycare, from the early days on the ground to the full
                  operation it is today. She knows the industry inside out,
                  understands exactly how a real pet business runs, and has
                  lived every challenge that Genera was built to solve.
                </p>
                <p>
                  Now part of the Genera team, Becks brings that same hands-on
                  expertise to our customers — helping new businesses get set
                  up, get confident, and get the most out of the platform from
                  day one.
                </p>
              </div>
            </div>
          </div>

          {/* Jess — photo on the right on desktop */}
          <div className="rev d2 mt-8 grid gap-10 overflow-hidden rounded-3xl border border-cream-dark bg-cream shadow-[0_24px_60px_rgba(0,62,69,0.08)] md:grid-cols-[3fr_2fr]">
            <div className="p-8 md:p-12 md:order-1">
              <p className="eyebrow">Meet the team</p>
              <h3 className="mt-2 font-massilia text-3xl font-extrabold text-forest">
                Jess
              </h3>
              <p className="mt-1 font-medium text-gold">
                Co-Founder &amp; Director
              </p>
              <div className="mt-5 flex flex-col gap-3 text-ink-soft">
                <p>
                  Jess co-founded Duncan&apos;s Dog Co alongside Duncan in 2011,
                  building it from a dog walking round in South West London into
                  one of the UK&apos;s longest-standing five-star licensed
                  daycares.
                </p>
                <p>
                  She has run every part of the business — from the early
                  morning runs and client relationships to managing a full team
                  and navigating the day-to-day realities of running a licensed
                  facility. Every problem Genera solves is one she has lived
                  first hand.
                </p>
                <p>
                  As co-founder of Genera, Jess brings that same care and
                  attention to detail to every part of how the product is built
                  and how customers are supported.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] md:aspect-auto md:order-2">
              <Image
                src="/images/jess.png"
                alt="Jess, Co-Founder of Genera Software"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-top"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-forest-dark px-8 py-22 text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="!text-white">
            We built Genera for businesses{" "}
            <em className="text-gold">like yours</em>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/80">
            Apply for the Founding 100 and we&apos;ll help you decide whether
            Genera is the right fit.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <BookDemoButton className="btn btn-gold btn-lg">
              {FOUNDING_100_CTA_LABEL}
            </BookDemoButton>
          </div>
        </div>
      </section>
    </>
  );
}

function TimelineCard({ year, text }: { year: string; text: string }) {
  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-5 shadow-[0_4px_18px_rgba(0,62,69,0.06)]">
      <div className="font-massilia text-xl font-bold text-gold">
        {year}
      </div>
      <p className="mt-1 text-ink-soft">{text}</p>
    </div>
  );
}

function PolaroidPlaceholder({
  year,
  imageUrl,
  side,
}: {
  year: string;
  imageUrl: string | null;
  side: "left" | "right";
}) {
  const rotation = side === "left" ? "-rotate-[4deg]" : "rotate-[4deg]";
  return (
    <div
      className={`group inline-block ${rotation} bg-white p-2 pb-7 shadow-[0_14px_30px_rgba(0,62,69,0.18)] transition-transform duration-300 hover:rotate-0 hover:scale-[1.04] md:p-3 md:pb-10`}
    >
      <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden bg-linear-to-br from-cream-dark via-cream to-teal-mid/30 md:h-44 md:w-44">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Photo from ${year}`}
            fill
            sizes="(max-width: 768px) 112px, 176px"
            className="object-cover object-top"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-forest/40 md:h-10 md:w-10"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="12" cy="12" r="3.2" />
            <path d="M8 5l1.5-2h5L16 5" />
          </svg>
        )}
      </div>
      <p className="mt-2 text-center font-caveat text-lg leading-none text-forest md:text-xl">
        {year}
      </p>
    </div>
  );
}
