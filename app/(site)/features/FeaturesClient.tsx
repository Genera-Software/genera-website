"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import {
  BOOK_DEMO_FORM_SLUG,
  FOUNDING_100_CTA_LABEL,
  FOUNDING_100_FORM_SLUG,
} from "@/lib/cta";
import s from "./features.module.css";

/* ─────────────────────────────────────────────────────────────
   Feature nav
   ───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "capacity",       label: "Capacity" },
  { id: "brand",          label: "Customisation" },
  { id: "bookings",       label: "Bookings" },
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
  children,
}: {
  phoneClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${s.phone} ${phoneClass}`}>
      <div className={s.phoneScreen}>{children}</div>
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
   Capacity animation — numbers count up service by service,
   then Save button flashes gold and resets
   ───────────────────────────────────────────────────────────── */
const CAP_SERVICES = [
  { name: "Daycare",       sub: "Maximum bookings per day", max: 15 },
  { name: "Full Groom",    sub: "Maximum bookings per day", max: 6  },
  { name: "Nail Clipping", sub: "Maximum bookings per day", max: 12 },
  { name: "SWIMMING",      sub: "Maximum bookings per day", max: 4  },
  { name: "Sleepover",     sub: "Maximum bookings per day", max: 8  },
];

function CapacityAnimation() {
  const maxTotal = CAP_SERVICES.reduce((a, sv) => a + sv.max, 0);
  const HOLD = 22;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => (t >= maxTotal + HOLD ? 0 : t + 1));
    }, 65);
    return () => clearInterval(id);
  }, [maxTotal]);

  const vals = CAP_SERVICES.map((sv, i) => {
    const offset = CAP_SERVICES.slice(0, i).reduce((a, s) => a + s.max, 0);
    return Math.min(sv.max, Math.max(0, tick - offset));
  });
  const allFull = vals.every((v, i) => v === CAP_SERVICES[i].max);

  return (
    <BrowserChrome url="app.generasoftware.com / service-settings">
      <div className={s.capacityAnim}>
        {CAP_SERVICES.map((sv, i) => (
          <div key={sv.name} className={s.capRow}>
            <div>
              <div className={s.capLabel}>{sv.name}</div>
              <div className={s.capSub}>{sv.sub}</div>
            </div>
            <div className={`${s.capInput} ${vals[i] === sv.max && vals[i] > 0 ? s.capInputFilled : ""}`}>
              {vals[i] > 0 ? vals[i] : ""}
            </div>
          </div>
        ))}
        <div className={s.capFooter}>
          <div className={`${s.capSaveBtn} ${allFull ? s.capSaveBtnActive : ""}`}>
            {allFull ? "Saved ✓" : "Save"}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

/* ─────────────────────────────────────────────────────────────
   Notification toggle animation — switches flick on then off
   and back, cycling through all five types
   ───────────────────────────────────────────────────────────── */
const NOTIF_ITEMS = [
  { emoji: "📅", label: "Approval needed",         sub: "A service requires your sign-off before confirming" },
  { emoji: "🔔", label: "New booking",             sub: "A booking has been scheduled or confirmed" },
  { emoji: "👤", label: "New customer",            sub: "A new owner signed up via the portal" },
  { emoji: "💳", label: "Membership request",      sub: "A customer requested a membership plan" },
  { emoji: "💰", label: "Direct debit collected",  sub: "A GoCardless payment was taken" },
];
const NOTIF_SEQ: boolean[][] = [
  [false, false, false, false, false],
  [true,  false, false, false, false],
  [true,  true,  false, false, false],
  [true,  true,  true,  false, false],
  [true,  true,  true,  true,  false],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true ], // hold
  [true,  true,  true,  true,  true ], // hold
  [false, true,  true,  true,  true ],
  [true,  true,  true,  true,  true ],
  [true,  true,  false, true,  true ],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  false, true ],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true ], // hold before reset
];

function NotificationAnimation() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % NOTIF_SEQ.length), 820);
    return () => clearInterval(id);
  }, []);
  const states = NOTIF_SEQ[phase];
  return (
    <div className={s.notifWrap}>
      <div className={s.notifTitle}>Notification Types</div>
      {NOTIF_ITEMS.map((item, i) => (
        <div key={item.label} className={s.notifRow}>
          <span className={s.notifIcon}>{item.emoji}</span>
          <div className={s.notifRowText}>
            <div className={s.notifRowLabel}>{item.label}</div>
            <div className={s.notifRowSub}>{item.sub}</div>
          </div>
          <div className={`${s.notifToggle} ${states[i] ? s.notifToggleOn : ""}`}>
            <div className={s.notifThumb} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Bookings admin animation — left phone
   Service dropdown cycles through options, recurring toggle
   flicks, then Submit flashes green
   ───────────────────────────────────────────────────────────── */
const ADMIN_SERVICES = ["Daycare", "Full Groom", "Nail Clipping", "Sleepover", "SWIMMING"];

function BookingsAdminAnimation() {
  const [svcIdx, setSvcIdx]       = useState(0);
  const [recurring, setRecurring] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // each "phase" advances the dropdown by 1, then submits, then resets
    const TOTAL = ADMIN_SERVICES.length + 2; // +1 submit, +1 reset hold
    let phase = 0;
    const id = setInterval(() => {
      phase = (phase + 1) % TOTAL;
      if (phase < ADMIN_SERVICES.length) {
        setSvcIdx(phase);
        setRecurring(phase % 2 === 0);
        setSubmitted(false);
      } else if (phase === ADMIN_SERVICES.length) {
        setSubmitted(true);
      } else {
        setSvcIdx(0);
        setRecurring(false);
        setSubmitted(false);
      }
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={s.bookAdminWrap}>
      <div className={s.bookAdminTitle}>Add Booking</div>
      <div className={s.bookAdminField}>
        <div className={s.bookAdminFieldLabel}>Owner</div>
        <div className={s.bookAdminFieldValue}>Ashton · Mila Kunis</div>
      </div>
      <div className={s.bookAdminField}>
        <div className={s.bookAdminFieldLabel}>Service</div>
        <div className={`${s.bookAdminDropdown} ${submitted ? s.bookAdminDropdownActive : ""}`}>
          {ADMIN_SERVICES[svcIdx]}
          <span className={s.bookAdminChevron}>▾</span>
        </div>
      </div>
      <div className={s.bookAdminField}>
        <div className={s.bookAdminFieldLabel}>Start date</div>
        <div className={s.bookAdminFieldValue}>27 May 2026</div>
      </div>
      <div className={s.bookAdminToggleRow}>
        <span>Recurring booking</span>
        <div className={`${s.notifToggle} ${recurring ? s.notifToggleOn : ""}`}>
          <div className={s.notifThumb} />
        </div>
      </div>
      <div className={`${s.bookAdminSubmit} ${submitted ? s.bookAdminSubmitReady : ""}`}>
        {submitted ? "✓ Booking created" : "Create booking"}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Bookings pending animation — right phone
   Approval queue: requests get accepted one by one
   ───────────────────────────────────────────────────────────── */
const PENDING_BOOKINGS = [
  { date: "22/06/2026", name: "Taylor Swift",  dog: "Bruno",  service: "🌙 Sleepover"  },
  { date: "29/05/2026", name: "Oprah",         dog: "Chewie", service: "☀️ Daycare"    },
  { date: "16/06/2026", name: "Mila Kunis",    dog: "Ashton", service: "✂️ Full Groom" },
];
// phases: 0=none accepted, 1=first accepted, 2=second, 3=all, 4=hold, then reset
const PENDING_PHASES = 6;

function BookingsPendingAnimation() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % PENDING_PHASES), 1300);
    return () => clearInterval(id);
  }, []);
  const accepted = [phase >= 1, phase >= 2, phase >= 3];
  return (
    <div className={s.pendingWrap}>
      <div className={s.pendingWrapTitle}>Pending Approval</div>
      {PENDING_BOOKINGS.map((b, i) => (
        <div key={b.name} className={s.pendingItem}>
          <div className={s.pendingItemTop}>
            <span className={s.pendingItemDate}>{b.date}</span>
            <span className={`${s.pendingItemBadge} ${accepted[i] ? s.pendingItemBadgeAccepted : ""}`}>
              {accepted[i] ? "✓ Accepted" : "● Pending"}
            </span>
          </div>
          <div className={s.pendingDogRow}>
            <div className={s.pendingDogAvatar}>{b.name[0]}</div>
            <div>
              <div className={s.pendingDogName}>{b.name}</div>
              <div className={s.pendingDogService}>{b.service}</div>
            </div>
          </div>
          {!accepted[i] && (
            <div className={s.pendingActions}>
              <div className={s.pendingAcceptBtn}>✓ Accept</div>
              <div className={s.pendingDeclineBtn}>✗ Decline</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Daily schedule animation — dogs appear one by one,
   count badge increments, + Create booking button pulses
   ───────────────────────────────────────────────────────────── */
const SCHED_DOGS = [
  { name: "Zendaya",   owner: "Tom Holland",  svc: "Sleepover", wks: "0 this wk" },
  { name: "Charlotte", owner: "Mia Cat",      svc: "Daycare",   wks: "5 this wk" },
  { name: "Ashton",    owner: "Mila Kunis",   svc: "Daycare",   wks: "6 this wk" },
  { name: "Dolly",     owner: "Miley Cyrus",  svc: "Sleepover", wks: "1 this wk" },
  { name: "Bruno",     owner: "Tom Hardy",    svc: "Full Groom",wks: "2 this wk" },
];

function DailyScheduleAnimation() {
  const [count, setCount] = useState(2);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => (c >= SCHED_DOGS.length ? 2 : c + 1));
    }, 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={s.schedWrap}>
      <div className={s.schedTopBar}>🔍 Search pets and customers</div>
      <div className={s.schedTitle}>Daily Schedule</div>
      <div className={s.schedSubTitle}>Plan today's bookings, routes and drop-offs</div>
      <div className={s.schedTabs}>
        <span className={s.schedTab}>Monthly</span>
        <span className={`${s.schedTab} ${s.schedTabActive}`}>🐾 Daily</span>
        <span className={s.schedTab}>Map</span>
      </div>
      <div className={s.schedDate}>‹ TODAY · 27 May 2026 ›</div>
      <div className={s.schedFilters}>
        <span className={`${s.schedFilterChip} ${s.schedFilterChipActive}`}>🐾 All Pets {count}</span>
        <span className={s.schedFilterChip}>Collections</span>
        <span className={s.schedFilterChip}>Drop-offs</span>
      </div>
      <div className={s.schedCreateBtn}>+ Create booking</div>
      <div className={s.schedList}>
        {SCHED_DOGS.slice(0, count).map((dog, i) => (
          <div key={dog.name} className={`${s.schedRow} ${i >= 2 ? s.schedRowNew : ""}`}>
            <div className={s.schedAvatar}>{dog.name[0]}</div>
            <div>
              <div className={s.schedDogName}>{dog.name}</div>
              <div className={s.schedDogSub}>{dog.svc} · {dog.owner}</div>
            </div>
            <span className={s.schedWeeks}>{dog.wks}</span>
            <span className={s.schedViewBtn}>View</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Customer portal — left phone (membership)
   Membership button cycles: idle → active → "Requested ✓"
   ───────────────────────────────────────────────────────────── */
function CustomerPortalMembershipAnimation() {
  // phases: 0-1=idle, 2=button highlight, 3-4=done, then reset
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 7), 900);
    return () => clearInterval(id);
  }, []);
  const done = phase >= 3;
  return (
    <div className={s.cpProfileWrap}>
      <div className={s.cpUrlBar}>🔒 portal.generasoftware.com</div>
      <div className={s.cpBackRow}>← Pet Profile</div>
      <div className={s.cpSection}>
        <div className={s.cpSectionTitle}>Membership</div>
        <div className={s.cpMembershipDesc}>
          Choose a membership plan for a fixed weekly schedule. Requests go to your daycare for approval.
        </div>
        <div className={`${s.cpMembershipBtn} ${done ? s.cpMembershipBtnDone : ""}`}>
          {done ? "✓ Requested" : "Request membership"}
        </div>
      </div>
      <div className={s.cpSection}>
        <div className={s.cpSectionTitle}>Profile Information</div>
        <div className={s.cpField}><span className={s.cpFieldLabel}>Name</span><span className={s.cpFieldValue}>Oprah</span></div>
        <div className={s.cpField}><span className={s.cpFieldLabel}>Last name</span><span className={s.cpFieldValue}>Bruno</span></div>
        <div className={s.cpField}><span className={s.cpFieldLabel}>Breed</span><span className={s.cpFieldValue}>Bedlington Terrier</span></div>
        <div className={s.cpField}><span className={s.cpFieldLabel}>Date of birth</span><span className={s.cpFieldValue}>05/03/2016</span></div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Customer portal — right phone (service selection)
   Service rows cycle through highlighted selection
   ───────────────────────────────────────────────────────────── */
const PORTAL_SERVICES = [
  { icon: "☀️", name: "Book Daycare"        },
  { icon: "✂️", name: "Book Full Groom"     },
  { icon: "💅", name: "Book Nail Clipping"  },
  { icon: "🏊", name: "Book SWIMMING"       },
  { icon: "🌙", name: "Book Sleepover"      },
];

function CustomerPortalBookingAnimation() {
  const [selIdx, setSelIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSelIdx(i => (i + 1) % PORTAL_SERVICES.length), 1100);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={s.cpBookingWrap}>
      <div className={s.cpUrlBar}>🔒 portal.generasoftware.com</div>
      <div className={s.cpBookingHeader}>
        <div className={s.cpBookingTitle}>Bookings</div>
        <div className={s.cpBookingDate}>Saturday, 30 May 2026</div>
      </div>
      <div className={s.cpServiceLabel}>CHOOSE SERVICE TYPE</div>
      {PORTAL_SERVICES.map((svc, i) => (
        <div key={svc.name} className={`${s.cpServiceRow} ${i === selIdx ? s.cpServiceRowSelected : ""}`}>
          <span className={s.cpServiceIcon}>{svc.icon}</span>
          <span>{svc.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Payments animation — inside phone frame
   Stripe cycles: Not set up → Connecting → Connected ✓
   GoCardless and Manual stay connected throughout
   ───────────────────────────────────────────────────────────── */
function PaymentsAnimation() {
  // 0=not set up, 1=connecting, 2+=connected
  const [stripePhase, setStripePhase] = useState(0);
  useEffect(() => {
    const durations = [2200, 1100, 2800];
    let phase = 0;
    let t: ReturnType<typeof setTimeout>;
    function advance() {
      phase = (phase + 1) % 3;
      setStripePhase(phase);
      t = setTimeout(advance, durations[phase]);
    }
    t = setTimeout(advance, durations[0]);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={s.paymentsAnimWrap}>
      <div className={s.pmHeader}>
        <div className={s.pmHeaderTitle}>Payment Methods</div>
        <div className={s.pmHeaderSub}>Connect the payment providers your business uses</div>
      </div>
      {/* Stripe — animated */}
      <div className={s.pmCard}>
        <div className={s.pmCardTop}>
          <div className={s.pmIcon} style={{ background: "#635BFF" }}>S</div>
          <div>
            <div className={s.pmName}>Stripe</div>
            <div className={s.pmSub}>Card + BACS, hosted invoice pages, automatic reconciliation</div>
            {stripePhase === 0 && <div className={s.pmStatusNotSet}>Not set up</div>}
            {stripePhase === 1 && <div className={s.pmStatusConnecting}>Connecting…</div>}
            {stripePhase >= 2 && <div className={s.pmStatusConnected}>● Connected</div>}
          </div>
        </div>
        <div className={`${s.pmConnectBtn} ${stripePhase >= 2 ? s.pmManageBtn : ""}`}>
          {stripePhase >= 2 ? "Manage ↗" : "Connect Stripe ↗"}
        </div>
      </div>
      {/* GoCardless — always connected */}
      <div className={`${s.pmCard} ${s.pmCardActive}`}>
        <div className={s.pmCardTop}>
          <div className={s.pmIcon} style={{ background: "#00B140" }}>G</div>
          <div>
            <div className={s.pmName}>GoCardless <span className={s.pmInUse}>● In use</span></div>
            <div className={s.pmSub}>BACS Direct Debit — auto-debit invoices once owners sign a mandate</div>
            <div className={s.pmStatusConnected}>● Connected</div>
          </div>
        </div>
        <div className={`${s.pmConnectBtn} ${s.pmManageBtn}`}>Manage GoCardless ↗</div>
      </div>
      {/* Manual */}
      <div className={`${s.pmCard} ${s.pmCardActive}`}>
        <div className={s.pmCardTop}>
          <div className={s.pmIcon} style={{ background: "#4CAF50" }}>M</div>
          <div>
            <div className={s.pmName}>Manual invoicing</div>
            <div className={s.pmSub}>PDF invoices with your bank details — owners pay by bank transfer</div>
            <div className={s.pmStatusConnected}>● Connected</div>
          </div>
        </div>
        <div className={`${s.pmConnectBtn} ${s.pmManageBtn}`}>Edit bank details ↗</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dog records animation — inside BrowserChrome
   Two existing records shown, then a third row types itself in
   ───────────────────────────────────────────────────────────── */
const BASE_RECORDS = [
  { icon: "💜", type: "Behavioural", detail: "She wouldn't stop barking at the new member of staff", date: "28/05/2026" },
  { icon: "🚗", type: "Logistic",    detail: "Lives on a school road — can't pick up between 8.20–9am",  date: "28/05/2026" },
];
const TYPING_RECORD = "Vaccines up to date as of June 2026";

function DogRecordsAnimation() {
  const [typedLen, setTypedLen] = useState(0);
  const [showNew, setShowNew]   = useState(false);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    let outer: ReturnType<typeof setTimeout>;
    function run() {
      setShowNew(false); setTypedLen(0); setDone(false);
      outer = setTimeout(() => {
        setShowNew(true);
        let i = 0;
        const typer = setInterval(() => {
          i++;
          setTypedLen(i);
          if (i >= TYPING_RECORD.length) {
            clearInterval(typer);
            setDone(true);
            outer = setTimeout(run, 2800);
          }
        }, 46);
      }, 1400);
    }
    run();
    return () => clearTimeout(outer);
  }, []);

  return (
    <BrowserChrome url="app.generasoftware.com / records">
      <div className={s.dogRecordsWrap}>
        <div className={s.dogRecordsHeader}>
          <div>
            <div className={s.dogRecordsTitle}>Records</div>
            <div className={s.dogRecordsSub}>Notes and incidents logged for this pet.</div>
          </div>
          <div className={s.dogRecordsAddBtn}>+ Add Record</div>
        </div>
        <table className={s.dogRecordsTable}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Details</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {BASE_RECORDS.map(r => (
              <tr key={r.type}>
                <td><div className={s.dogRecordsTypeCell}><span className={s.dogRecordsTypeIcon}>{r.icon}</span><span>{r.type}</span></div></td>
                <td className={s.dogRecordDetail}>{r.detail}</td>
                <td className={s.dogRecordDate}>{r.date}</td>
                <td className={s.dogRecordDelete}>Delete</td>
              </tr>
            ))}
            {showNew && (
              <tr className={s.dogRecordNewRow}>
                <td><div className={s.dogRecordsTypeCell}><span className={s.dogRecordsTypeIcon}>💚</span><span>Health</span></div></td>
                <td className={s.dogRecordDetail}>
                  {TYPING_RECORD.slice(0, typedLen)}
                  {!done && <span className={s.dogRecordCursor}>|</span>}
                </td>
                <td className={s.dogRecordDate}>{done ? "09/06/2026" : "—"}</td>
                <td className={s.dogRecordDelete}>{done ? "Delete" : ""}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BrowserChrome>
  );
}

/* ─────────────────────────────────────────────────────────────
   Routing animation — checkboxes tick off stop by stop,
   completed counter increments, then resets
   ───────────────────────────────────────────────────────────── */
const ROUTE_STOPS = [
  { num: 1, name: "Stomzi",    owner: "Maya James",      addr: "17 Effra Road, London"        },
  { num: 2, name: "Bailey",    owner: "Carole Fontaine", addr: "18 Mantlet Close, London"     },
  { num: 3, name: "Ashton",    owner: "Mila Kunis",      addr: "15 Clapham High St, London"   },
  { num: 4, name: "Bart",      owner: "Marge Simpson",   addr: "Felsham Road, London"         },
  { num: 5, name: "Charlotte", owner: "Mia Cat",         addr: "12 Lombard Road, London"      },
];

function RoutingAnimation() {
  const [completed, setCompleted] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCompleted(c => (c >= ROUTE_STOPS.length ? 0 : c + 1));
    }, 950);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={s.routeWrap}>
      <div className={s.routeHeader}>
        <div className={s.routeRouteName}>Route · RONNIE</div>
        <div className={s.routeDate}>Thu, 28 May 2026</div>
        <div className={s.routeCompleted}>Completed {completed}/{ROUTE_STOPS.length}</div>
      </div>
      <div className={s.routeStopList}>
        {ROUTE_STOPS.map((stop, i) => (
          <div key={stop.name} className={`${s.routeStop} ${i < completed ? s.routeStopDone : ""}`}>
            <div className={`${s.routeCheckCircle} ${i < completed ? s.routeCheckCircleDone : ""}`}>
              {i < completed ? "✓" : ""}
            </div>
            <div>
              <div className={s.routeStopNum}>{stop.num}. {stop.name}</div>
              <div className={s.routeStopOwner}>{stop.owner}</div>
              <div className={s.routeStopAddr}>{stop.addr}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={s.routeNavBar}>
        <span>Pickups</span>
        <span>Dropoffs</span>
        <span className={s.routeNavActive}>📍</span>
        <span>Schedule</span>
        <span>Profile</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Staff animation — holiday request cycles through states:
   idle → pending → approved → balance decrements → reset
   ───────────────────────────────────────────────────────────── */
const STAFF_HOLIDAY_TOTAL = 20;
// sequence of states (index into array)
const STAFF_SEQ = [0, 0, 0, 1, 2, 3, 3, 0] as const; // 0=idle,1=pending,2=approved,3=done

function StaffAnimation() {
  const [tick, setTick]   = useState(0);
  const [used, setUsed]   = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => {
        const next = (t + 1) % STAFF_SEQ.length;
        // When transitioning into "approved" bump the used count
        if (STAFF_SEQ[next] === 3 && STAFF_SEQ[t] !== 3) {
          setUsed(u => Math.min(u + 1, STAFF_HOLIDAY_TOTAL));
        }
        // Reset used when cycling back to start
        if (next === 0) setUsed(0);
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const state   = STAFF_SEQ[tick];
  const left    = STAFF_HOLIDAY_TOTAL - used;
  const btnText = state === 1 ? "● Pending…"
                : state === 2 ? "✓ Approved!"
                : state === 3 ? "✓ Approved!"
                : "Request holiday";
  const btnCls  = state === 1 ? s.staffReqBtnPending
                : state >= 2  ? s.staffReqBtnApproved
                : "";

  return (
    <div className={s.staffAnimWrap}>
      <div className={s.staffTopTabs}>
        <span className={`${s.staffTopTab} ${s.staffTopTabActive}`}>Today</span>
        <span className={s.staffTopTab}>● Working</span>
        <span className={s.staffTopTab}>● Holiday</span>
        <span className={s.staffTopTab}>● Sick</span>
      </div>
      <div className={s.staffSectionLabel}>TIME OFF · 2026</div>
      {/* Holiday card */}
      <div className={s.staffTimeCard} style={{ background: "#FFFAEB" }}>
        <div className={s.staffCardRow}>
          <span className={s.staffCardEmoji}>☀️</span>
          <span className={s.staffCardName}>HOLIDAY</span>
          <span className={s.staffCardBalance}>{left}/{STAFF_HOLIDAY_TOTAL} left</span>
        </div>
        <div className={s.staffUsed}>{used} used</div>
        <div className={`${s.staffReqBtn} ${btnCls}`}>{btnText}</div>
      </div>
      {/* Sick card */}
      <div className={s.staffTimeCard} style={{ background: "#FFF0F0" }}>
        <div className={s.staffCardRow}>
          <span className={s.staffCardEmoji}>❤️</span>
          <span className={s.staffCardName}>SICK</span>
          <span className={s.staffCardBalance}>20/20 left</span>
        </div>
        <div className={s.staffUsed}>0 used</div>
        <div className={s.staffReqBtn}>Request sick day</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero admin calendar — month grid where the booking stats count
   up, day chips stagger in, then a light sweep replays the cycle
   ───────────────────────────────────────────────────────────── */
type HeroCell = {
  d: number;
  off?: boolean;
  today?: boolean;
  full?: boolean;
  pending?: string;
  cake?: boolean;
  svc?: [string, string][];
};

const HERO_CELLS: HeroCell[] = [
  { d: 27, off: true }, { d: 28, off: true }, { d: 29, off: true }, { d: 30, off: true },
  { d: 1, svc: [["sun", "2 Daycares"]] }, { d: 2, svc: [["moon", "1 Sleepover"]] }, { d: 3, svc: [["moon", "1 Sleepover"]] },
  { d: 4, svc: [["sun", "6 Daycares"]] }, { d: 5, svc: [["sun", "24 Daycares"]], full: true }, { d: 6, svc: [["sun", "27 Daycares"]] },
  { d: 7, svc: [["sun", "27 Daycares"]] }, { d: 8, svc: [["sun", "24 Daycares"]], full: true }, { d: 9, svc: [["moon", "3 Sleepovers"]], cake: true },
  { d: 10, svc: [["moon", "3 Sleepovers"]] }, { d: 11, svc: [["sun", "18 Daycares"]] }, { d: 12, svc: [["sun", "18 Daycares"]] },
  { d: 13, svc: [["sun", "17 Daycares"]], today: true }, { d: 14, svc: [["sun", "17 Daycares"]] }, { d: 15, svc: [["sun", "17 Daycares"]] },
  { d: 16, pending: "2 Pending" }, { d: 17, svc: [["meet", "1 Meet & Greet"]] }, { d: 18, svc: [["sun", "15 Daycares"]] },
  { d: 19, svc: [["sun", "13 Daycares"]] }, { d: 20, svc: [["combo", "2 Combos"]] }, { d: 21, svc: [["sun", "15 Daycares"]] },
  { d: 22, svc: [["sun", "17 Daycares"]] }, { d: 23, svc: [["moon", "2 Sleepovers"]] }, { d: 24, svc: [["moon", "2 Sleepovers"]] },
  { d: 25, svc: [["sun", "8 Daycares"]] }, { d: 26, svc: [["sun", "17 Daycares"]] }, { d: 27, svc: [["sun", "17 Daycares"]] },
  { d: 28, svc: [["sun", "16 Daycares"]] }, { d: 29, svc: [["combo", "1 Combo"]] }, { d: 30, svc: [["moon", "5 Sleepovers"]] }, { d: 31, svc: [["moon", "5 Sleepovers"]] },
];

const HERO_STATS: [string, number][] = [
  ["Admin", 148], ["Recurring", 12], ["Customer", 70], ["Total", 230],
];

type HeroChip = { cellIdx: number; ic: string; label: string; amber?: boolean };
const HERO_CHIPS: HeroChip[] = HERO_CELLS.flatMap((c, cellIdx) => {
  const chips: HeroChip[] = [];
  if (c.pending) chips.push({ cellIdx, ic: "amber", label: c.pending, amber: true });
  c.svc?.forEach(([ic, label]) => chips.push({ cellIdx, ic, label }));
  if (c.cake) chips.push({ cellIdx, ic: "cake", label: "1 Birthday" });
  return chips;
});

const HERO_IC_CLASS: Record<string, string> = {
  sun: s.icSun, moon: s.icMoon, combo: s.icCombo, meet: s.icMeet, cake: s.icCake,
};

function HeroCalendarAnimation() {
  const [statVals, setStatVals] = useState<number[]>(() => HERO_STATS.map(() => 0));
  const [chipsIn, setChipsIn]   = useState<boolean[]>(() => HERO_CHIPS.map(() => false));
  const [sweep, setSweep]       = useState<{ on: boolean; left: number }>({ on: false, left: 0 });

  useEffect(() => {
    const COUNT = HERO_CHIPS.length;
    const COUNT_DUR = 900;
    const period = 250 + COUNT * 70 + 1400 + 1400;
    let raf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function cycle() {
      setStatVals(HERO_STATS.map(() => 0));
      setChipsIn(HERO_CHIPS.map(() => false));
      setSweep({ on: false, left: 0 });

      const start = performance.now();
      const countup = (now: number) => {
        const k = Math.min(1, (now - start) / COUNT_DUR);
        const e = 1 - Math.pow(1 - k, 3);
        setStatVals(HERO_STATS.map(([, target]) => Math.round(target * e)));
        if (k < 1) raf = requestAnimationFrame(countup);
      };
      raf = requestAnimationFrame(countup);

      HERO_CHIPS.forEach((_, i) => {
        timers.push(setTimeout(() => {
          setChipsIn(prev => { const next = [...prev]; next[i] = true; return next; });
        }, 250 + i * 70));
      });

      timers.push(setTimeout(() => {
        const s0 = performance.now();
        const sw = (now: number) => {
          const k = Math.min(1, (now - s0) / 700);
          setSweep({ on: k < 1, left: k * 100 });
          if (k < 1) raf = requestAnimationFrame(sw);
        };
        raf = requestAnimationFrame(sw);
      }, 250 + COUNT * 70 + 1400));
    }

    cycle();
    const id = setInterval(cycle, period);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      clearInterval(id);
    };
  }, []);

  let chipCursor = 0;

  return (
    <div className={s.adminCal}>
      <div className={s.adminCalHead}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div>
            <div className={s.adminCalTitle}>May 2026</div>
            <div className={s.adminCalSub}>Bookings &amp; upcoming schedule</div>
          </div>
          <div className={s.adminStats}>
            {HERO_STATS.map(([label], i) => (
              <div key={label} className={`${s.adminStat} ${i === 3 ? s.adminStatTotal : ""}`}>
                <span className={s.adminStatL}>{label}</span>
                <span className={s.adminStatV}>{statVals[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.adminNewBtn}>+ New booking</div>
      </div>

      <div className={s.adminWeekdays}>
        <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
      </div>

      <div className={s.adminGrid}>
        {HERO_CELLS.map((c, cellIdx) => {
          const chips: React.ReactNode[] = [];
          if (c.pending) {
            const ci = chipCursor++;
            chips.push(
              <div key={`p${cellIdx}`} className={`${s.adminChip} ${s.adminChipAmber} ${chipsIn[ci] ? s.adminChipIn : ""}`}>
                <span className={s.adminChipIc} />{c.pending}
              </div>,
            );
          }
          c.svc?.forEach(([ic, label], j) => {
            const ci = chipCursor++;
            chips.push(
              <div key={`s${cellIdx}-${j}`} className={`${s.adminChip} ${chipsIn[ci] ? s.adminChipIn : ""}`}>
                <span className={`${s.adminChipIc} ${HERO_IC_CLASS[ic] ?? ""}`} />{label}
              </div>,
            );
          });
          if (c.cake) {
            const ci = chipCursor++;
            chips.push(
              <div key={`c${cellIdx}`} className={`${s.adminChip} ${chipsIn[ci] ? s.adminChipIn : ""}`}>
                <span className={`${s.adminChipIc} ${s.icCake}`} />1 Birthday
              </div>,
            );
          }
          return (
            <div key={cellIdx} className={`${s.adminCell} ${c.off ? s.adminCellOff : ""} ${c.today ? s.adminCellToday : ""}`}>
              <div className={s.adminCellTop}>
                <span className={s.adminDay}>{c.d}</span>
                {c.full && <span className={s.adminFull}>Full</span>}
              </div>
              {chips}
            </div>
          );
        })}
        <div className={s.adminSweep} style={{ opacity: sweep.on ? 1 : 0, left: `${sweep.left}%` }} />
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
/* ─────────────────────────────────────────────────────────────
   Category band header
   ───────────────────────────────────────────────────────────── */
function CategoryHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className={`rev ${s.cat}`}>
      <div className={s.catInner}>
        <h2 className={s.catTitle}>{title}</h2>
        <p className={s.catDesc}>{desc}</p>
      </div>
    </div>
  );
}

export default function FeaturesClient() {
  return (
    <>
      <Reveal />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] text-white px-[clamp(22px,4vw,56px)] pt-[104px] md:pt-[136px] pb-16 md:pb-[88px]">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -right-[180px] -bottom-[260px] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,168,0,.16),transparent_66%)]" aria-hidden />

        <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 md:grid-cols-[minmax(0,1.02fr)_minmax(380px,1.04fr)] gap-12 md:gap-[60px] items-center">
          <div className="rev">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
              🐾 Built for how pet care actually works
            </div>
            <h1 className="text-white [font-size:clamp(2.3rem,4.6vw,3.5rem)] max-w-[14ch]">
              One system for the way your daycare{" "}
              <span className="squig !text-gold">
                really runs.
                <svg viewBox="0 0 180 12" preserveAspectRatio="none">
                  <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7" />
                </svg>
              </span>
            </h1>
            <p className="mt-5 mb-7 max-w-[50ch] text-white/80 text-[clamp(1.02rem,1.6vw,1.2rem)] leading-relaxed">
              Your services, your pricing, your approvals, your dog bus, your team. Genera brings bookings, payments, routes, records, staff and compliance into one operating system — built by a licensed daycare.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <BookDemoButton slug={FOUNDING_100_FORM_SLUG} className="btn btn-gold btn-lg">{FOUNDING_100_CTA_LABEL}</BookDemoButton>
              <BookDemoButton slug={BOOK_DEMO_FORM_SLUG} className="btn btn-outline-w btn-lg">Book a Demo</BookDemoButton>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-6">
              {PROOF_CHIPS.map(chip => (
                <span key={chip} className="border border-white/20 bg-white/10 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white/80">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual — admin calendar in browser chrome + floating phone */}
          <div className={`rev d2 ${s.heroVisual}`} aria-hidden="true">
            <div className={`${s.browserChrome} ${s.heroBrowser}`}>
              <div className={s.chromeBar}>
                <div className={s.chromeDots}>
                  <span className={`${s.chromeDot} ${s.dot1}`} />
                  <span className={`${s.chromeDot} ${s.dot2}`} />
                  <span className={`${s.chromeDot} ${s.dot3}`} />
                </div>
                <span className={s.chromeUrl}>app.generasoftware.com / calendar</span>
              </div>
              <HeroCalendarAnimation />
            </div>
            <div className={`${s.heroFloat} max-md:hidden`}>
              <div className={s.heroFloatScreen}>
                <Image
                  src="/mockup-screens/features/mobile-daily-schedule.png"
                  alt="Genera mobile daily schedule"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky feature nav ───────────────────────────────── */}
      <FeatureNav />

      {/* ════════ CATEGORY 1 — Set up your business ════════ */}
      <div className="bg-white px-[clamp(22px,4vw,56px)]">
        <div className="max-w-[1200px] mx-auto">
          <CategoryHeader
            title="Set up your business"
            desc="Define your limits, your branding and your alerts before a single booking comes in."
          />

          {/* Capacity & DEFRA */}
          <article id="capacity" className={`rev ${s.feat}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Capacity &amp; DEFRA</span>
                <span className={s.featOnly}>Only on Genera</span>
              </div>
              <h3 className={s.featTitle}>Stay within your licensed limits. Always.</h3>
              <p className={s.featLead}>
                Set the maximum dogs per service before bookings open. Genera enforces your DEFRA-licensed capacity so you never accidentally exceed your permitted numbers — something no other pet software does.
              </p>
              <ul className={s.bullets}>
                <li>Caps per service tied to your licensed dog limit</li>
                <li>Waitlist requests when capacity is reached</li>
                <li>Stay DEFRA-compliant without counting manually</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              <CapacityAnimation />
            </div>
          </article>

          {/* Customisation & Alerts */}
          <article id="brand" className={`rev ${s.feat} ${s.featFlip}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Customisation &amp; Alerts</span>
              </div>
              <h3 className={s.featTitle}>Your portal. Your alerts. Your way of working.</h3>
              <p className={s.featLead}>
                Before customers book, set the experience around your business: your daycare branding, your customer portal and the alerts admins need to see.
              </p>
              <ul className={s.bullets}>
                <li>Custom customer portal branding and background</li>
                <li>Admin notification controls for customer actions</li>
                <li>New customers, bookings, memberships and direct-debit alerts</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              {/* sm: = 640px — at smaller sizes one phone is enough */}
              <div className={s.twoCol}>
                <Phone>
                  <Image src="/mockup-screens/business-customising.png" alt="Business customisation" fill className="object-cover object-top" />
                </Phone>
                <Phone>
                  <NotificationAnimation />
                </Phone>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* ════════ CATEGORY 2 — Bookings & your day ════════ */}
      <div className="bg-cream px-[clamp(22px,4vw,56px)]">
        <div className="max-w-[1200px] mx-auto">
          <CategoryHeader
            title="Bookings & your day"
            desc="Controlled self-serve bookings, a clear daily run sheet, and a portal customers actually use."
          />

          {/* Bookings */}
          <article id="bookings" className={`rev ${s.feat}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Bookings</span>
              </div>
              <h3 className={s.featTitle}>Clients can request. You stay in control.</h3>
              <p className={s.featLead}>
                Genera treats bookings as controlled self-serve. Customers reduce the admin, but owners still decide what gets confirmed.
              </p>
              <ul className={s.bullets}>
                <li>Pending approvals for bookings and memberships</li>
                <li>Quick admin bookings without the back and forth</li>
                <li>Recurring bookings for regular daycare clients</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              <div className={s.twoPhones}>
                <Phone>
                  <Image src="/mockup-screens/features/mobile-add-booking-recurring.png" alt="Quick recurring admin booking" fill className="object-cover object-top" />
                </Phone>
                <Phone>
                  <BookingsPendingAnimation />
                </Phone>
              </div>
            </div>
          </article>

          {/* Daily Schedule */}
          <article id="daily-schedule" className={`rev ${s.feat} ${s.featFlip}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Daily Schedule</span>
              </div>
              <h3 className={s.featTitle}>Know exactly who&apos;s in today.</h3>
              <p className={s.featLead}>
                Once bookings are in, the daily schedule becomes the control room. See the day&apos;s dogs, services, collections and drop-offs without digging around.
              </p>
              <ul className={s.bullets}>
                <li>See every booking for the day</li>
                <li>Spot unassigned collections and drop-offs</li>
                <li>Create bookings from the same screen</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              <div className={s.singlePhone}>
                <Phone phoneClass={s.phoneDaily}>
                  <DailyScheduleAnimation />
                </Phone>
              </div>
            </div>
          </article>

          {/* Customer Portal */}
          <article id="portal" className={`rev ${s.feat}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Customer Portal</span>
              </div>
              <h3 className={s.featTitle}>Customers book, request memberships and update pet details.</h3>
              <p className={s.featLead}>
                Give customers a branded place to manage their pets and request the services they need, while every important action still comes back to your team for approval.
              </p>
              <ul className={s.bullets}>
                <li>Membership requests from the customer portal</li>
                <li>Pet profile details held in one place</li>
                <li>Branded portal with your daycare details</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              <div className={s.portalPhones}>
                <Phone>
                  <CustomerPortalMembershipAnimation />
                </Phone>
                <Phone>
                  <CustomerPortalBookingAnimation />
                </Phone>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* ════════ CATEGORY 3 — Money & records ════════ */}
      <div className="bg-white px-[clamp(22px,4vw,56px)]">
        <div className="max-w-[1200px] mx-auto">
          <CategoryHeader
            title="Money & records"
            desc="See who's paid, who hasn't, and keep every dog's history exactly where you need it."
          />

          {/* Payments */}
          <article id="payments" className={`rev ${s.feat}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Payments</span>
              </div>
              <h3 className={s.featTitle}>Every payment route, without losing track.</h3>
              <p className={s.featLead}>
                Financial visibility, not just &quot;payments supported&quot;. See who has paid, who has not, and stop spending Sunday night on invoicing.
              </p>
              <ul className={s.bullets}>
                <li>Finance dashboard for invoiced, paid and outstanding</li>
                <li>Stripe, GoCardless and bank-transfer options</li>
                <li>Bulk invoice raising and status tracking</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              <div className={s.singlePhone}>
                <Phone phoneClass={s.phonePayment}>
                  <PaymentsAnimation />
                </Phone>
              </div>
            </div>
          </article>

          {/* Dog Records */}
          <article id="records" className={`rev ${s.feat} ${s.featFlip}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Dog Records &amp; Compliance</span>
              </div>
              <h3 className={s.featTitle}>Every dog detail, ready when you need it.</h3>
              <p className={s.featLead}>
                Pet status, memberships, custom prices, behavioural notes and incident logs. Practical records that help the business run, not fluffy extras.
              </p>
              <ul className={s.bullets}>
                <li>Dog list with active, trial, dormant and custom-price filters</li>
                <li>Membership and pricing status visible at a glance</li>
                <li>Behavioural, logistic and health records kept together</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              <DogRecordsAnimation />
            </div>
          </article>
        </div>
      </div>

      {/* ════════ CATEGORY 4 — On the road & the team ════════ */}
      <div className="bg-cream px-[clamp(22px,4vw,56px)] pb-12 md:pb-20">
        <div className="max-w-[1200px] mx-auto">
          <CategoryHeader
            title="On the road & the team"
            desc="Plan the dog bus and keep staff days, holiday and sick records in the same place."
          />

          {/* Routing */}
          <article id="routing" className={`rev ${s.feat}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Routing</span>
              </div>
              <h3 className={s.featTitle}>Plan the dog bus without rebuilding it every morning.</h3>
              <p className={s.featLead}>
                Routing as a practical transport workflow: set up route groups, assign pets and drivers, then check the pickup run on the map.
              </p>
              <ul className={s.bullets}>
                <li>Build default routes for regular pickup runs</li>
                <li>Assign dogs, drivers and stop order in one view</li>
                <li>Open the route map when the team needs the full picture</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              <div className={s.singlePhone}>
                <Phone phoneClass={s.phoneRoute}>
                  <RoutingAnimation />
                </Phone>
              </div>
            </div>
          </article>

          {/* Staff */}
          <article id="staff" className={`rev ${s.feat} ${s.featFlip}`}>
            <div className={s.featCopy}>
              <div className={s.featKicker}>
                <span className={s.featEyebrow}>Staff</span>
              </div>
              <h3 className={s.featTitle}>Staff days, holiday and sick records in one place.</h3>
              <p className={s.featLead}>
                Log time off, track allowances and keep payroll-ready staff records in the same system as everything else.
              </p>
              <ul className={s.bullets}>
                <li>Log holiday, sick day and day-in-lieu entries</li>
                <li>Track holiday allowance and remaining balances</li>
                <li>Keep salary and staff records ready for month end</li>
              </ul>
            </div>
            <div className={s.featVisual}>
              <div className={s.singlePhone}>
                <Phone phoneClass={s.phoneStaff}>
                  <StaffAnimation />
                </Phone>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="bg-forest-dark px-8 py-[86px] text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="text-heading-mid !text-white">
            Run the daycare you already built — without rebuilding your admin every week.
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-white/80 leading-relaxed">
            Bookings, payments, routes, dog records, staff and compliance in one system built around real pet care operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookDemoButton slug={FOUNDING_100_FORM_SLUG} className="btn btn-gold btn-lg">{FOUNDING_100_CTA_LABEL}</BookDemoButton>
            <BookDemoButton slug={BOOK_DEMO_FORM_SLUG} className="btn btn-outline-w btn-lg">Book a Demo</BookDemoButton>
          </div>
        </div>
      </section>
    </>
  );
}
