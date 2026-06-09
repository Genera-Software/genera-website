"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import AdminMiniAnimation from "@/components/AdminMiniAnimation";
import { FOUNDING_100_CTA_LABEL } from "@/lib/cta";
import s from "./features.module.css";

/* ─────────────────────────────────────────────────────────────
   Colour cycle
   Colours come from position, not content — so reordering
   sections just means renumbering. Pass i=0,1,2… to variant().
   ───────────────────────────────────────────────────────────── */
const VARIANTS = [
  { block: s.blockLight, eyebrow: "",               h3: "text-forest", body: "text-ink-soft" },
  { block: s.blockDark,  eyebrow: "!text-gold-soft", h3: "text-white",  body: "text-white/80" },
  { block: s.blockGold,  eyebrow: "",               h3: "text-forest", body: "text-ink-soft" },
  { block: s.blockWhite, eyebrow: "",               h3: "text-forest", body: "text-ink-soft" },
] as const;

/** Returns colour tokens for section at position i (cycles automatically). */
function v(i: number) { return VARIANTS[i % VARIANTS.length]; }

/* ─────────────────────────────────────────────────────────────
   Feature nav
   ───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "capacity",       label: "Capacity" },
  { id: "brand",          label: "Customisation" },
  { id: "bookings",       label: "Bookings" },
  { id: "booking-flow",   label: "Booking Flow" },
  { id: "daily-schedule", label: "Daily Schedule" },
  { id: "portal",         label: "Customer Portal" },
  { id: "payments",       label: "Payments" },
  { id: "records",        label: "Dog Records" },
  { id: "routing",        label: "Routing" },
  { id: "staff",          label: "Staff" },
];

function FeatureNav() {
  const [activeId, setActiveId] = useState(NAV_ITEMS[0].id);

  useEffect(() => {
    const sections = NAV_ITEMS.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { threshold: 0.3 },
    );
    sections.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  }

  return (
    <div className={s.featureNav}>
      <nav className={s.featureNavInner} aria-label="Features sections">
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={e => scrollTo(e, item.id)}
            className={`${s.navLink} ${activeId === item.id ? s.navLinkActive : ""}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Browser chrome wrapper
   ───────────────────────────────────────────────────────────── */
function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className={s.browserChrome}>
      <div className={s.chromeBar}>
        <div className={s.chromeDots}>
          <span className={`${s.chromeDot} ${s.dot1}`} />
          <span className={`${s.chromeDot} ${s.dot2}`} />
          <span className={`${s.chromeDot} ${s.dot3}`} />
        </div>
        <span className={s.chromeUrl}>{url}</span>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Phone frame
   ───────────────────────────────────────────────────────────── */
function Phone({
  phoneClass = "",
  screenClass = s.scrStd,
  children,
}: {
  phoneClass?: string;
  screenClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${s.phone} ${phoneClass}`}>
      <div className={`${s.phoneScreen} ${screenClass}`}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Booking flow animation
   ───────────────────────────────────────────────────────────── */
const CAL_SLOTS = [...Array.from({ length: 31 }, (_, i) => i + 1), null, null, null, null];

function BookingFlowAnimation() {
  return (
    <div className={s.bookingAnimation} aria-label="Animated customer booking process">
      <div className={`${s.floatIcon} ${s.floatOne}`}>🐾</div>
      <div className={`${s.floatIcon} ${s.floatTwo}`}>✓</div>

      <div className={s.animatedPhone}>
        <div className={s.animatedScreen}>
          <div className={s.animatedNotch} />
          <div className={s.stepTrack}><div className={s.stepFill} /></div>

          <div className={s.portalTop}>
            <div className={s.portalPill}>Genera Portal</div>
            <p className={s.portalTitle}>Customer booking</p>
          </div>

          <div className={s.bookingStage}>
            {/* Step 1 — Select a pet */}
            <div className={s.bookingCard}>
              <div className={s.stepLabel}>Step 1 of 4</div>
              <p className={s.cardTitle}>Select a pet</p>
              <p className={s.cardBody}>The customer starts from their own portal and chooses the dog they want to book in.</p>
              {[
                { init: "CW", name: "Chewie Whiskers", owner: "Sarah Whiskers" },
                { init: "O",  name: "Oprah",           owner: "Bruno" },
                { init: "A",  name: "Ashton",           owner: "Mila Kunis" },
              ].map(dog => (
                <div key={dog.init} className={s.dogRow}>
                  <span className={s.dogAvatar}>{dog.init}</span>
                  <span>{dog.name}<span className={s.rowMeta}>{dog.owner}</span></span>
                </div>
              ))}
            </div>

            {/* Step 2 — Choose service */}
            <div className={s.bookingCard}>
              <div className={s.stepLabel}>Step 2 of 4</div>
              <p className={s.cardTitle}>Choose the booking type</p>
              <p className={s.cardBody}>They pick from the services you have already set up, including memberships and recurring options.</p>
              {[
                { icon: "+", label: "Daycare" },
                { icon: "£", label: "Membership request" },
                { icon: "↻", label: "Recurring booking" },
              ].map(svc => (
                <div key={svc.label} className={s.serviceRow}>
                  <span className={s.serviceIcon}>{svc.icon}</span>
                  <span>{svc.label}</span>
                </div>
              ))}
              <div className={s.requestBtn}>Continue</div>
            </div>

            {/* Step 3 — Pick dates */}
            <div className={s.bookingCard}>
              <div className={s.stepLabel}>Step 3 of 4</div>
              <p className={s.cardTitle}>Pick dates</p>
              <p className={s.cardBody}>The request follows your service rules, availability and approval settings.</p>
              <div className={s.calendarMini}>
                {CAL_SLOTS.map((day, i) => (
                  <span key={i} className={`${s.calDay} ${day === 12 ? s.calPicked : ""}`}>
                    {day ?? ""}
                  </span>
                ))}
              </div>
              <div className={s.requestBtn}>Request Booking</div>
            </div>

            {/* Step 4 — Admin approves */}
            <div className={s.bookingCard}>
              <div className={s.stepLabel}>Step 4 of 4</div>
              <p className={s.cardTitle}>Admin approves</p>
              <p className={s.cardBody}>The customer has done the admin, but you still decide what becomes confirmed.</p>
              <div className={s.approvalCard}>
                Approval needed
                <small>Daycare request from Chewie Whiskers</small>
              </div>
              <div className={s.summaryRow}><span className={s.serviceIcon}>✓</span><span>Accept request</span></div>
              <div className={s.summaryRow}><span className={s.serviceIcon}>×</span><span>Decline request</span></div>
              <div className={s.approvalChip}>Nothing confirms without you</div>
            </div>

            {/* Pagination dots */}
            <div className={s.flowCaption}>
              <span className={s.flowDot} />
              <span className={s.flowDot} />
              <span className={s.flowDot} />
              <span className={s.flowDot} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Proof chips
   ───────────────────────────────────────────────────────────── */
const PROOF_CHIPS = [
  "Built by a licensed daycare",
  "Customer portal included",
  "Routes, payments and compliance together",
];

/* ─────────────────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────────────────── */
export default function FeaturesClient() {
  return (
    <>
      <Reveal />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] text-white px-[22px] pt-[88px] md:pt-[116px] pb-10 md:pb-[74px]">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -right-[180px] -bottom-[260px] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,168,0,.16),transparent_66%)]" aria-hidden />

        <div className="relative z-10 mx-auto grid max-w-[1180px] grid-cols-1 md:grid-cols-[minmax(0,1.02fr)_minmax(360px,.98fr)] gap-0 md:gap-[54px] items-center">
          <div className="rev pb-6 md:pb-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
              🐾 Built for how pet care actually works
            </div>
            <h1 className="text-white text-figure-md md:[font-size:clamp(2.4rem,4vw,3.6rem)]">
              Genera works{" "}
              <span className="squig">
                around
                <svg viewBox="0 0 180 12" preserveAspectRatio="none">
                  <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7" />
                </svg>
              </span>
              {" "}your daycare.
            </h1>
            <p className="mt-3 mb-5 md:mt-5 md:mb-7 max-w-[560px] text-white/80 text-[clamp(1rem,2vw,1.25rem)] leading-relaxed">
              Your services, your pricing, your approvals, your dog bus, your team. One operating system for the way pet care businesses actually run.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <BookDemoButton className="btn btn-gold btn-lg">{FOUNDING_100_CTA_LABEL}</BookDemoButton>
              <BookDemoButton className="btn btn-outline-w btn-lg">Book a Demo</BookDemoButton>
            </div>
            {/* Proof chips — hidden on mobile to keep hero compact */}
            <div className="hidden md:flex mt-6 flex-wrap gap-2">
              {PROOF_CHIPS.map(chip => (
                <span key={chip} className="border border-white/20 bg-white/10 rounded-full px-3 py-2 text-sm text-white/80">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Hero screenshot stack */}
          <div className={`rev d2 ${s.heroStack}`} aria-hidden="true">
            <div className={s.screenSide}>
              <Image
                src="/mockup-screens/features/mobile-daily-schedule.png"
                alt="Genera mobile daily schedule"
                fill
                className="object-contain object-bottom"
              />
            </div>
            <div className={s.screenMain}>
              <AdminMiniAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature nav ──────────────────────────────────────── */}
      <FeatureNav />

      {/* ── Feature sections ─────────────────────────────────── */}
      <div className="px-[clamp(22px,3vw,56px)] pt-6 md:pt-8">
        <div className="max-w-[1380px] mx-auto">

          {/* ── Capacity & DEFRA ────────────────────────────── i=0 */}
          {/* paddingBottom:0 so the teal gradient tail of blockLight doesn't show as a blue strip */}
          <article id="capacity" className={`rev ${s.block} ${v(0).block} ${s.blockRecords}`} style={{ paddingBottom: 0 }}>
            <div className={s.recordsCopyGrid}>
              <div>
                <p className={`eyebrow ${v(0).eyebrow}`}>Capacity &amp; DEFRA Compliance</p>
                <h3 className={`${v(0).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                  Stay within your licensed limits. Always.
                </h3>
                <p className={`${v(0).body} mt-4 leading-relaxed`}>
                  Set the maximum dogs per service before bookings open. Genera enforces your DEFRA-licensed capacity so you never accidentally exceed your permitted numbers — something no other pet software does.
                </p>
              </div>
              <ul className={s.bullets}>
                <li>Caps per service tied to your licensed dog limit</li>
                <li>Waitlist requests when capacity is reached</li>
                <li>Stay DEFRA-compliant without counting manually</li>
              </ul>
            </div>
            <BrowserChrome url="app.generasoftware.com / service-settings">
              <div className={s.capacityImgCrop}>
                {/* Regular img: needs direct CSS transforms that next/image wrapping complicates */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mockup-screens/features/desktop-service-settings-capacity.png"
                  alt="Desktop service capacity settings"
                  loading="lazy"
                />
              </div>
            </BrowserChrome>
          </article>

          {/* ── Customisation & Alerts ──────────────────────── i=1 */}
          <article id="brand" className={`rev ${s.block} ${v(1).block}`}>
            <div>
              <p className={`eyebrow ${v(1).eyebrow}`}>Customisation &amp; Alerts</p>
              <h3 className={`${v(1).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                Your portal. Your alerts. Your way of working.
              </h3>
              <p className={`${v(1).body} mt-4 leading-relaxed`}>
                Before customers book, set the experience around your business: your daycare branding, your customer portal and the alerts admins need to see.
              </p>
              <ul className={s.bullets}>
                <li>Custom customer portal branding and background</li>
                <li>Admin notification controls for customer actions</li>
                <li>New customers, bookings, memberships and direct debit alerts</li>
              </ul>
            </div>
            {/* sm: = 640px — at smaller sizes one phone is enough; block is too narrow for two */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <Phone screenClass={s.scrStd}>
                <Image src="/mockup-screens/business-customising.png" alt="Business customisation" fill className="object-cover object-top" />
              </Phone>
              <Phone phoneClass="max-sm:hidden" screenClass={s.scrStd}>
                <Image src="/mockup-screens/notifications.png" alt="Admin notification settings" fill className="object-cover object-top" />
              </Phone>
            </div>
          </article>

          {/* ── Bookings ───────────────────────────────────── i=2 */}
          <article id="bookings" className={`rev ${s.block} ${v(2).block}`}>
            <div>
              <p className={`eyebrow ${v(2).eyebrow}`}>Bookings</p>
              <h3 className={`${v(2).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                Clients can request. You stay in control.
              </h3>
              <p className={`${v(2).body} mt-4 leading-relaxed`}>
                Genera positions bookings as controlled self-serve. Customers reduce the admin, but owners still decide what gets confirmed.
              </p>
              <ul className={s.bullets}>
                <li>Pending approvals for bookings and memberships</li>
                <li>Quick admin bookings without the back and forth</li>
                <li>Recurring bookings for regular daycare clients</li>
              </ul>
            </div>
            <div className={s.twoPhones}>
              <Phone screenClass={s.scrLg}>
                <Image src="/mockup-screens/features/mobile-add-booking-recurring.png" alt="Quick recurring admin booking" fill className="object-cover object-top" />
              </Phone>
              <Phone screenClass={s.scrLg}>
                <Image src="/mockup-screens/features/mobile-pending-approval.png" alt="Mobile pending approval requests" fill className="object-cover object-top" />
              </Phone>
            </div>
          </article>

          {/* ── Booking Flow ───────────────────────────────── i=3 */}
          <article id="booking-flow" className={`rev ${s.block} ${v(3).block}`}>
            <div>
              <p className={`eyebrow ${v(3).eyebrow}`}>Booking Flow</p>
              <h3 className={`${v(3).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                From customer request to owner approval.
              </h3>
              <p className={`${v(3).body} mt-4 leading-relaxed`}>
                The complete customer booking journey: pick the dog, choose the service, request the booking, then wait for your approval. Nothing is confirmed without you.
              </p>
              <ul className={s.bullets}>
                <li>Client selects their dog from the portal</li>
                <li>Chooses service type and dates</li>
                <li>Request lands in admin for approval</li>
              </ul>
            </div>
            <BookingFlowAnimation />
          </article>

          {/* ── Daily Schedule ─────────────────────────────── i=4 */}
          <article id="daily-schedule" className={`rev ${s.block} ${v(4).block}`}>
            <div>
              <p className={`eyebrow ${v(4).eyebrow}`}>Daily Schedule</p>
              <h3 className={`${v(4).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                Know exactly who&apos;s in today.
              </h3>
              <p className={`${v(4).body} mt-4 leading-relaxed`}>
                Once bookings are in, the daily schedule becomes the control room. See the day&apos;s dogs, services, collections, drop-offs and unassigned tasks without digging around.
              </p>
              <ul className={s.bullets}>
                <li>See every booking for the day</li>
                <li>Spot unassigned collections and drop-offs</li>
                <li>Create bookings from the same screen</li>
              </ul>
            </div>
            <div className={s.singlePhone}>
              <Phone phoneClass={s.phoneDaily} screenClass={s.scrXl}>
                {/* left top: pet avatars are on the left — centering crops them */}
                <Image src="/mockup-screens/features/mobile-daily-schedule-polished.png" alt="Mobile daily schedule for today" fill className="object-cover" style={{ objectPosition: 'left top' }} />
              </Phone>
            </div>
          </article>

          {/* ── Customer Portal ────────────────────────────── i=5 */}
          <article id="portal" className={`rev ${s.block} ${v(5).block}`}>
            <div>
              <p className={`eyebrow ${v(5).eyebrow}`}>Customer Portal</p>
              <h3 className={`${v(5).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                Customers can book, request memberships and update pet details.
              </h3>
              <p className={`${v(5).body} mt-4 leading-relaxed`}>
                Give customers a branded place to manage their pets and request the services they need, while every important action still comes back to your team for approval.
              </p>
              <ul className={s.bullets}>
                <li>Membership requests from the customer portal</li>
                <li>Pet profile details held in one place</li>
                <li>Branded portal with your daycare details</li>
              </ul>
            </div>
            <div className={s.portalPhones}>
              <Phone screenClass={s.scrXxl}>
                <Image src="/mockup-screens/features/customer-portal-membership-profile.png" alt="Customer portal membership and pet profile" fill className="object-cover object-top" />
              </Phone>
              <Phone screenClass={s.scrXxl}>
                <Image src="/mockup-screens/features/customer-portal-book-service.png" alt="Customer portal booking details" fill className="object-cover object-top" />
              </Phone>
            </div>
          </article>
        </div>
      </div>

      {/* ── Alt background section ───────────────────────────── */}
      <div className="bg-white px-[clamp(22px,3vw,56px)] py-10 md:py-[78px]">
        <div className="max-w-[1380px] mx-auto">

          {/* ── Payments ───────────────────────────────────── i=6 */}
          <article id="payments" className={`rev ${s.block} ${v(6).block}`}>
            <div>
              <p className={`eyebrow ${v(6).eyebrow}`}>Payments</p>
              <h3 className={`${v(6).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                Every payment route, without losing track.
              </h3>
              <p className={`${v(6).body} mt-4 leading-relaxed`}>
                Financial visibility, not just &quot;payments supported&quot;. See who has paid, who has not, and stop spending Sunday night on invoicing.
              </p>
              <ul className={s.bullets}>
                <li>Finance dashboard for invoiced, paid and outstanding</li>
                <li>Stripe, GoCardless and bank transfer options</li>
                <li>Bulk invoice raising and status tracking</li>
              </ul>
            </div>
            <div className={s.singlePhone}>
              <Phone phoneClass={s.phonePayment} screenClass={s.scrPay}>
                {/* 22% skips past iOS status bar + browser URL bar at the top of the screenshot */}
                <Image src="/mockup-screens/payment-methods.png" alt="Stripe and GoCardless payment methods" fill className="object-cover" style={{ objectPosition: "center 22%" }} />
              </Phone>
            </div>
          </article>

          {/* ── Dog Records ────────────────────────────────── i=7 */}
          <article id="records" className={`rev ${s.block} ${v(7).block} ${s.blockRecords}`}>
            <div className={s.recordsCopyGrid}>
              <div>
                <p className={`eyebrow ${v(7).eyebrow}`}>Dog Records &amp; Compliance</p>
                <h3 className={`${v(7).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                  Every dog detail, ready when you need it.
                </h3>
                <p className={`${v(7).body} mt-4 leading-relaxed`}>
                  Pet status, memberships, custom prices, behavioural notes and incident logs. Practical records that help the business run, not fluffy extras.
                </p>
              </div>
              <ul className={s.bullets}>
                <li>Dog list with active, trial, dormant and custom-price filters</li>
                <li>Membership and pricing status visible at a glance</li>
                <li>Behavioural, logistic and health records kept together</li>
              </ul>
            </div>
            <BrowserChrome url="app.generasoftware.com / records">
              <Image
                src="/mockup-screens/features/desktop-records-log-polished.png"
                alt="Desktop pet records log with behavioural and logistic notes"
                width={1600}
                height={900}
                className="w-full h-auto block"
                loading="lazy"
              />
            </BrowserChrome>
          </article>

          {/* ── Routing ────────────────────────────────────── i=8 */}
          <article id="routing" className={`rev ${s.block} ${v(8).block}`}>
            <div>
              <p className={`eyebrow ${v(8).eyebrow}`}>Routing</p>
              <h3 className={`${v(8).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                Plan the dog bus without rebuilding the route every morning.
              </h3>
              <p className={`${v(8).body} mt-4 leading-relaxed`}>
                Routing as a practical transport workflow: set up route groups, assign pets and drivers, then check the pickup run on the map.
              </p>
              <ul className={s.bullets}>
                <li>Build default routes for regular pickup runs</li>
                <li>Assign dogs, drivers and stop order in one view</li>
                <li>Open the route map when the team needs the full picture</li>
              </ul>
            </div>
            <div className={s.singlePhone}>
              <Phone phoneClass={s.phoneRoute} screenClass={s.scrXl}>
                <Image src="/mockup-screens/features/mobile-route-pickups-latest.png" alt="Mobile morning pickup route for the dog bus" fill className="object-cover object-top" />
              </Phone>
            </div>
          </article>

        </div>
      </div>

      {/* ── Staff ────────────────────────────────────────────── */}
      <div className="px-[clamp(22px,3vw,56px)] py-10 md:py-[78px]">
        <div className="max-w-[1380px] mx-auto">
          {/* ── Staff ──────────────────────────────────────── i=9 */}
          <article id="staff" className={`rev ${s.block} ${v(9).block}`}>
            <div>
              <p className={`eyebrow ${v(9).eyebrow}`}>Staff</p>
              <h3 className={`${v(9).h3} text-[clamp(1.8rem,3.4vw,3.1rem)]`}>
                Staff days, holiday and sick records in one place.
              </h3>
              <p className={`${v(9).body} mt-4 leading-relaxed`}>
                Log time off, track allowances and keep payroll-ready staff records in the same system as everything else.
              </p>
              <ul className={s.bullets}>
                <li>Log holiday, sick day and day-in-lieu entries</li>
                <li>Track holiday allowance and remaining balances</li>
                <li>Keep salary and staff records ready for month end</li>
              </ul>
            </div>
            <div className={s.singlePhone}>
              <Phone phoneClass={s.phoneStaff} screenClass={s.scrXl}>
                <Image src="/mockup-screens/features/mobile-staff-schedule-latest.png" alt="Mobile staff schedule with holiday and sick day tracking" fill className="object-cover object-top" />
              </Phone>
            </div>
          </article>
        </div>
      </div>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="bg-forest-dark px-8 py-[86px] text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="text-heading-mid !text-white">
            Run the daycare you already built, without rebuilding your admin every week.
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-white/80 leading-relaxed">
            Bookings, payments, routes, dog records, staff and compliance in one system built around real pet care operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookDemoButton className="btn btn-gold btn-lg">{FOUNDING_100_CTA_LABEL}</BookDemoButton>
          </div>
        </div>
      </section>
    </>
  );
}
