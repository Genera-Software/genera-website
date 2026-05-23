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

      {/* Split hero */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-20 text-white md:px-14">
          <p className="font-caveat text-xl text-gold-soft">
            Our Story · Built from the ground up
          </p>
          <h1 className="mt-3 text-white">
            We didn&apos;t set out to build software.
            <br />
            <em className="text-gold">We set out to walk dogs.</em>
          </h1>
          <p className="mt-5 max-w-[480px] text-white/80">
            From a dog walking round in South West London in 2011 to software
            used by pet businesses across the UK. Here&apos;s how it happened.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.num}>
                <div className="font-massilia text-[2.4rem] font-bold leading-none text-gold">
                  {s.num}
                </div>
                <div className="mt-1 whitespace-pre-line text-xs uppercase tracking-widest text-white/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-forest-dark md:min-h-0">
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
        </div>
      </section>

      {/* Story prose */}
      <section className="bg-white px-8 py-22">
        <div className="mx-auto flex max-w-[760px] flex-col gap-10">
          <article className="rev flex flex-col gap-4">
            <h2>It started with a handful of leads and a lot of heart</h2>
            <p className="text-ink-soft">
              In 2011, Duncan and Jess started Duncan&apos;s Dog Co as a dog
              walking service in South West London. It was just the two of them
              and a growing list of dogs who needed looking after during the
              day.
            </p>
            <p className="text-ink-soft">
              The business grew quickly. What started as a handful of walks
              turned into a full schedule. Then clients started asking about
              daycare. Then boarding. Before long, Duncan and Jess were running
              one of the busiest independent pet care businesses in the area.
            </p>
          </article>

          <blockquote className="rev rounded-2xl border-l-4 border-gold bg-cream px-7 py-6 font-massilia text-xl font-bold leading-none italic text-forest md:text-2xl">
            &ldquo;We were running everything on spreadsheets and manual
            invoices. It worked until it did not.&rdquo;
          </blockquote>

          <article className="rev flex flex-col gap-4">
            <h2>Growing pains</h2>
            <p className="text-ink-soft">
              Over the years, Duncan&apos;s Dog Co grew into one of the
              longest-standing, five-star licensed doggy daycares in the UK.
              They moved to a beautiful woodland facility in Surrey. The team
              grew. The client list grew. And the admin grew with it.
            </p>
            <p className="text-ink-soft">
              Bookings came in by text, email, phone, and Facebook. Invoices
              were raised manually, one by one, every week. Routes were planned
              on paper. Staff schedules lived in WhatsApp groups. It all sort
              of worked. Until it did not.
            </p>
          </article>

          <div className="rev overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(0,62,69,0.16)]">
            <Image
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/duncans-woodland_6f11b5ea.jpg"
              alt="The woodland daycare facility"
              width={1600}
              height={1000}
              className="block h-auto w-full"
              loading="lazy"
            />
          </div>

          <article className="rev flex flex-col gap-4">
            <h2>The missed booking</h2>
            <p className="text-ink-soft">
              One day, a loyal customer&apos;s pickup was missed. A booking had
              slipped through the cracks. It was the kind of thing that happens
              when you are juggling too many systems and not enough hours. It
              was embarrassing. It was avoidable. And it was the moment
              everything changed.
            </p>
            <p className="text-ink-soft">
              That customer happened to be a developer. Instead of leaving a
              bad review, he said something unexpected: &ldquo;I will build you
              something.&rdquo;
            </p>
            <p className="text-ink-soft">And he did.</p>
          </article>

          <blockquote className="rev rounded-2xl bg-forest px-7 py-6 font-massilia text-xl font-bold leading-none italic text-white md:text-2xl">
            &ldquo;Instead of leaving a bad review, he said: I will build you
            something.&rdquo;
          </blockquote>

          <article className="rev flex flex-col gap-4">
            <h2>From prototype to platform</h2>
            <p className="text-ink-soft">
              That first version was rough. But it worked. Bookings stopped
              falling through. Invoices went out on time. Routes made sense.
              Over the following years, the software was refined, rebuilt, and
              improved. Every feature was tested in a real business, every day,
              by real people.
            </p>
            <p className="text-ink-soft">
              It was not built in a lab by people guessing what pet businesses
              need. It was built in the mud, in the woods, at the front desk,
              and on those late Sunday evenings that used to be spent on
              invoices.
            </p>
          </article>

          <article className="rev flex flex-col gap-4">
            <h2>Sharing it with the industry</h2>
            <p className="text-ink-soft">
              After years of running Genera internally, Duncan and Jess
              realised something. Every small pet business they spoke to was
              fighting the same battles. The same spreadsheets. The same missed
              messages. The same Sunday evening dread.
            </p>
            <p className="text-ink-soft">
              They decided to share it. Not as some corporate product launch,
              but as one small business helping others. That is why Genera
              exists. It is software built by people who have been up at 7am
              with muddy boots, chased late invoices, and stayed up planning
              the next day&apos;s schedule.
            </p>
            <p className="text-ink-soft">
              We have been where you are. And we built the thing we wish we had
              from the start.
            </p>
          </article>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cream px-8 py-22">
        <div className="mx-auto max-w-[860px]">
          <h2 className="rev mb-14 text-center">The journey so far</h2>

          <ol className="relative flex flex-col gap-8 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-teal-mid">
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
                    className={`relative z-10 block h-4 w-4 rounded-full ring-4 ring-cream ${
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
      <section className="bg-white px-8 py-22">
        <div className="mx-auto max-w-[1000px]">
          <div className="rev mb-12 text-center">
            <p className="eyebrow">The people behind Genera</p>
            <h2 className="mt-2">It takes a team who actually cares.</h2>
          </div>

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
      <div className="relative flex h-24 w-28 items-center justify-center overflow-hidden bg-linear-to-br from-cream-dark via-cream to-teal-mid/30 md:h-36 md:w-44">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Photo from ${year}`}
            fill
            sizes="(max-width: 768px) 112px, 176px"
            className="object-cover"
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
