import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import { REGISTER_URL } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Features — Genera Software",
  description:
    "Everything you need. Nothing you don't. Genera is software built inside a real pet business — every feature exists because we needed it ourselves.",
};

type Feature = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  image: string;
  url?: string;
  plain?: boolean;
};

const FEATURES: Feature[] = [
  {
    eyebrow: "Client Management",
    title: "Every pet. Every detail. Always at your fingertips.",
    body: "No more flicking through notebooks or searching old emails. Genera gives every pet a complete profile: breed, weight, health records, vaccination status, behavioural notes, dietary needs, and emergency contacts. Client details sit right alongside. One search and you have everything you need before a dog even walks through the door.",
    bullets: [
      "Complete pet profiles with health and vaccination tracking",
      "Behavioural notes visible to all staff instantly",
      "Client contact details and communication history",
      "Custom fields for anything specific to your business",
    ],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/feature-clients_86423985.webp",
    url: "app.generasoftware.com/pets",
  },
  {
    eyebrow: "Bookings",
    title: "Bookings that run themselves. Clients that book themselves.",
    body: "Your clients get their own online portal. They can see availability, book sessions, set up recurring slots, and manage their own schedule. You set the rules: capacity limits, approval controls, blackout dates. The system does the rest. No more texts at 10pm asking if there is space on Thursday.",
    bullets: [
      "24/7 online booking portal for your clients",
      "Recurring bookings with automatic scheduling",
      "Capacity limits and approval controls you set",
      "Instant notifications for new and changed bookings",
    ],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/feature-bookings_0fc67412.webp",
    url: "app.generasoftware.com/bookings",
  },
  {
    eyebrow: "Billing",
    title: "Get paid on time. Every time. Without lifting a finger.",
    body: "Set up auto-charges and let Genera collect payments for you. Need to send invoices? Generate them in bulk with one click. Choose weekly, fortnightly, or monthly billing cycles. Handle cancellation charges, late fees, and credits without the spreadsheet gymnastics. Your Sunday evenings are yours again.",
    bullets: [
      "Auto-charge cards on file for seamless payments",
      "Bulk invoice generation in one click",
      "Weekly, fortnightly, and monthly billing cycles",
      "Built-in cancellation charges, late fees, and credits",
    ],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/feature-billing_524653f0.webp",
    url: "app.generasoftware.com/billing",
  },
  {
    eyebrow: "Routing",
    title:
      "Routes planned in minutes. Not scribbled on the back of an envelope.",
    body: "Drag and drop to build your daily schedule. Genera optimises your team's routes so drivers take the most efficient path. See every dog, every driver, and every stop on a single screen. When plans change mid-morning (and they always do), adjusting is just a drag away.",
    bullets: [
      "Drag-and-drop daily schedule builder",
      "Route optimisation for your whole team",
      "Live overview of all dogs, drivers, and stops",
      "Quick adjustments when plans change on the fly",
    ],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/feature-routing_9dc778bb.webp",
    url: "app.generasoftware.com/routes",
  },
  {
    eyebrow: "Staff Management",
    title: "Your team, organised. Without the paper trail.",
    body: "Plan shifts, approve holiday requests, track sick days, and keep payroll-ready records. All in one place. Your staff can see their schedules. You can see who is available. No more WhatsApp groups trying to figure out who is covering Tuesday.",
    bullets: [
      "Visual shift planning and rota management",
      "Holiday request and approval workflow",
      "Sick day tracking with automatic records",
      "Payroll-ready exports when you need them",
    ],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/feature-staff_d64b9a5b.webp",
    url: "app.generasoftware.com/team",
  },
  {
    eyebrow: "Support & Compliance",
    title:
      "Real support from people who get it. Plus full compliance built in.",
    body: "Our support team is UK-based and understands the pet care industry. We are fully GDPR and DEFRA compliant, so you can focus on your business without worrying about regulations. Genera is cloud-based, always on, and we actively welcome feature requests. This is software built with you, not just for you.",
    bullets: [
      "UK-based support team who understand your business",
      "Fully GDPR and DEFRA compliant",
      "Cloud-based: access from anywhere, always available",
      "Feature requests welcomed and regularly shipped",
    ],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/support-compliance-JeKzKHpDAFGQbeaouDFgfh.webp",
    plain: true,
  },
];

function Check() {
  return (
    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-light">
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

function FeatureSection({ feature, index }: { feature: Feature; index: number }) {
  const reverse = index % 2 === 1;
  const bgClass = reverse ? "bg-cream" : "bg-white";

  const copy = (
    <div className="rev">
      <p className="eyebrow">{feature.eyebrow}</p>
      <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.2rem)]">{feature.title}</h2>
      <p className="mt-4 text-ink-soft">{feature.body}</p>
      <ul className="mt-6 flex flex-col gap-3">
        {feature.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-ink-soft">
            <Check />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const visual = (
    <div className="rev d2">
      {feature.plain ? (
        <div className="overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(0,62,69,0.16)]">
          <Image
            src={feature.image}
            alt={`${feature.eyebrow} screen`}
            width={1600}
            height={1000}
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-teal-mid/40 bg-white shadow-[0_24px_60px_rgba(0,62,69,0.16)]">
          <div className="flex items-center gap-3 border-b border-cream-dark bg-cream px-4 py-3">
            <div className="flex gap-1.5">
              <span className="block h-3 w-3 rounded-full bg-[#FF6058]" />
              <span className="block h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <span className="block h-3 w-3 rounded-full bg-[#28C940]" />
            </div>
            <div className="rounded-md bg-white px-3 py-1 text-xs text-ink-soft">
              {feature.url}
            </div>
          </div>
          <Image
            src={feature.image}
            alt={`${feature.eyebrow} screen`}
            width={1600}
            height={900}
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );

  return (
    <section className={`${bgClass} px-8 py-22`}>
      <div className="mx-auto grid max-w-[1160px] gap-12 md:grid-cols-2 md:items-center">
        {reverse ? visual : copy}
        {reverse ? copy : visual}
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <Reveal />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto grid max-w-[1160px] items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow !text-gold-soft">Features</p>
            <h1 className="mt-2 text-white">
              Everything you need.{" "}
              <em className="text-gold">Nothing you don&apos;t.</em>
            </h1>
            <p className="mt-5 max-w-[520px] text-white/80">
              Genera was built inside a real pet business over many years.
              Every feature exists because we needed it ourselves. No bloat. No
              gimmicks. Just the tools that actually make your day easier.
            </p>
            <div className="mt-7">
              <a
                href={REGISTER_URL}
                className="btn btn-gold btn-lg"
              >
                Start 3-Month Free Trial
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full" aria-hidden>
            <Image
              src="https://static.wixstatic.com/media/a043b3_618705dc1b2a4277b7d0a084edd8678c~mv2.png"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Feature sections */}
      {FEATURES.map((f, i) => (
        <FeatureSection key={f.eyebrow} feature={f} index={i} />
      ))}

      {/* Final CTA */}
      <section className="bg-forest-dark px-8 py-22 text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="!text-white">
            Ready to see how Genera fits your business?
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/80">
            Start your 3-month free trial or book a walkthrough with our team.
            No pressure. No hard sell. Just a conversation.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={REGISTER_URL}
              className="btn btn-gold btn-lg"
            >
              Start 3-Month Free Trial
            </a>
            <BookDemoButton className="btn btn-outline-w btn-lg">
              Book a Demo
            </BookDemoButton>
          </div>
        </div>
      </section>
    </>
  );
}
