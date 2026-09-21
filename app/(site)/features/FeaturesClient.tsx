"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import StartTrialLink from "@/components/StartTrialLink";
import BrandedAppShowcase from "@/components/showcase/BrandedAppShowcase";
import LiveChatShowcase from "@/components/showcase/LiveChatShowcase";
import DeviceFrame from "@/components/showcase/DeviceFrame";
import FeatureIcon from "@/components/features/FeatureIcon";
import { featureCardStyle, featureGradient, type FeatureKey } from "@/lib/features";
import AdminMiniAnimationV2 from "@/components/AdminMiniAnimationV2";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  Bars3Icon,
  BellIcon,
  CalendarDaysIcon,
  CalendarDaysSolidIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  HomeSolidIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  StarSolidIcon,
  TagIcon,
  TagSolidIcon,
  UserIcon,
  UsersIcon,
  UsersSolidIcon,
} from "@/components/showcase/icons";
import { BOOK_DEMO_FORM_SLUG } from "@/lib/cta";
import s from "./features.module.css";

/* ─────────────────────────────────────────────────────────────
   The page ranks features by how hard they sell, most first:
   the three jobs that eat a daycare's week (bookings, invoicing,
   the Dog Bus) plus the owner app, then the day-to-day, then the
   back office. Nav order follows the page.

   Mock data uses one cast throughout — the same owners, dogs and
   staff as the landing page — and never a real person's name.

   The drawn screens (BookingsShowcase, CapacityAnimation, …) and the
   Feature split layout are named exports so the per-vertical landing
   pages (components/verticals) show the same screens rather than
   redrawing them. Keep them self-contained.
   ───────────────────────────────────────────────────────────── */
const NAV_ITEMS: Array<{ id: string; label: string; feature: FeatureKey }> = [
  { id: "bookings",       label: "Bookings", feature: "bookings" },
  { id: "owner-app",      label: "Owner app", feature: "ownerApp" },
  { id: "invoicing",      label: "Invoicing", feature: "payments" },
  { id: "routes",         label: "Routes", feature: "routes" },
  { id: "messages",       label: "Messages", feature: "messages" },
  { id: "capacity",       label: "Capacity", feature: "compliance" },
  { id: "daily-schedule", label: "Daily schedule", feature: "dailySchedule" },
  { id: "assessments",    label: "Assessments", feature: "assessments" },
  { id: "finance",        label: "Finance", feature: "finance" },
  { id: "records",        label: "Records", feature: "records" },
  { id: "team",           label: "Team", feature: "team" },
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
            <span
              aria-hidden
              className="mr-1.5 inline-block h-2 w-2 rounded-full align-[1px]"
              style={{ background: featureGradient(item.feature) }}
            />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animation clock — steps 0 … count-1 on a timer, but only while
   the mockup is on screen (a long page of always-on intervals
   burns battery for nothing). Reduced-motion visitors get the
   last step, so every sequence ends on its finished frame.
   ───────────────────────────────────────────────────────────── */
function useStepper(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running || reduced) return;
    const id = window.setInterval(() => setStep(n => (n + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [running, reduced, count, ms]);

  return [ref, reduced ? count - 1 : step] as const;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
const gbp = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");

type IconType = ComponentType<{ className?: string }>;

/* ─────────────────────────────────────────────────────────────
   Desktop frame
   ───────────────────────────────────────────────────────────── */
function BrowserChrome({ url, children }: { url: string; children: ReactNode }) {
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
   Phones — the same device and staging as the Branded owner app
   section: DeviceFrame's real 390×844 screen, a teal backdrop,
   and cards floating off the edge. Screens below are drawn at
   the sizes the app renders on a phone (its root font is 18px,
   so Tailwind's rem steps come out 12.5% larger than here —
   hence the px values).
   ───────────────────────────────────────────────────────────── */

/* Two phones side by side share a column, so they run smaller —
   until the row stacks, when only the second one shows. */
const PAIR_SCALE = "[--s:0.74] min-[921px]:[--s:0.5] xl:[--s:0.6]";

function DeviceStage({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex w-full max-w-[600px] justify-center py-2">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] top-[4%] bottom-[4%] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-teal-soft"
      />
      {children}
    </div>
  );
}

function FloatCard({ className, show = true, children }: { className: string; show?: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden
      // Visibility by width lives in globals.css (.showcase-float).
      className={`showcase-float absolute z-10 transition-[opacity,translate] duration-500 ${
        show ? "opacity-100" : "translate-y-2 opacity-0"
      } ${className}`}
    >
      <div className="animate-[var(--animate-illust-float)]">
        <div className="rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-xl">{children}</div>
      </div>
    </div>
  );
}

function FloatLine({ Icon, tone, title, sub }: { Icon: IconType; tone: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] leading-tight font-bold text-forest">{title}</span>
        <span className="mt-0.5 block text-[11.5px] leading-tight text-gray-500">{sub}</span>
      </span>
    </div>
  );
}

function PetPhoto({ src, size }: { src: string; size: number }) {
  return (
    <span className="relative shrink-0 overflow-hidden rounded-full ring-1 ring-black/5" style={{ width: size, height: size }}>
      <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover object-top" />
    </span>
  );
}

/* Content scrolls under the floating nav; fade it so the bar reads cleanly. */
function NavFade() {
  return <span className="absolute inset-x-0 bottom-0 z-30 h-[150px] bg-gradient-to-t from-[#f5f5f4] via-[#f5f5f4]/90 to-transparent" />;
}

/* The admin app: frosted header (menu, search, bell, messages,
   account) and the floating teal pill nav — Home, Pets, Bookings,
   Team. Finance and the rest live behind the menu. */
type AdminTab = "Home" | "Pets" | "Bookings" | "Team";
const ADMIN_TABS: Array<[AdminTab, IconType, IconType]> = [
  ["Home", HomeIcon, HomeSolidIcon],
  ["Pets", TagIcon, TagSolidIcon],
  ["Bookings", CalendarDaysIcon, CalendarDaysSolidIcon],
  ["Team", UsersIcon, UsersSolidIcon],
];

function AdminApp({ tab, children }: { tab?: AdminTab; children: ReactNode }) {
  return (
    <div className="absolute inset-0 bg-[#f5f5f4]">
      <div className="absolute inset-x-0 top-[144px] bottom-0 overflow-hidden px-[12px] pt-[20px]">{children}</div>
      <NavFade />

      <div className="absolute inset-x-0 top-0 z-40 border-b border-gray-100 bg-white/80 pt-[54px] backdrop-blur-md">
        <div className="flex h-[90px] items-center gap-[16px] px-[18px]">
          <Bars3Icon className="h-[27px] w-[27px] text-gray-500" />
          <span className="h-[27px] w-px bg-gray-200" />
          <span className="flex min-w-0 flex-1 items-center gap-[8px] text-[15.75px] font-medium text-gray-400">
            <MagnifyingGlassIcon className="h-[20px] w-[20px]" />
            Search…
          </span>
          <span className="flex items-center text-gray-400">
            <span className="relative grid h-[42px] w-[42px] place-items-center">
              <BellIcon className="h-[25px] w-[25px]" />
              <span className="absolute top-[8px] right-[9px] h-[9px] w-[9px] rounded-full bg-rose-500 ring-2 ring-white" />
            </span>
            <span className="grid h-[42px] w-[42px] place-items-center">
              <ChatBubbleLeftRightIcon className="h-[25px] w-[25px]" />
            </span>
            <span className="ml-[4px] grid h-[38px] w-[38px] place-items-center rounded-full border border-forest/10 bg-forest/10 text-forest">
              <UsersIcon className="h-[20px] w-[20px]" />
            </span>
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center px-[18px] pb-[46px]">
        <div className="w-full overflow-hidden rounded-full border border-white/10 bg-forest">
          <div className="flex items-stretch justify-around gap-1 px-2 py-1.5">
            {ADMIN_TABS.map(([label, Outline, Solid]) => {
              const active = label === tab;
              const Icon = active ? Solid : Outline;
              return (
                <span
                  key={label}
                  className={`flex flex-1 flex-col items-center justify-center gap-[3px] rounded-full px-2 py-[7px] text-[11px] ${
                    active ? "bg-white/10 text-[#FFA800]" : "text-white/60"
                  }`}
                >
                  <Icon className="h-[22px] w-[22px]" />
                  <span className="leading-none font-medium tracking-tight">{label}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* The driver app: no header, just the day's board and the white
   floating nav whose Pickups / Dropoffs cells switch the leg. */
const DRIVER_TABS: Array<[string, IconType]> = [
  ["Pickups", ArrowUpCircleIcon],
  ["Dropoffs", ArrowDownCircleIcon],
  ["Owners", UsersIcon],
  ["Chat", ChatBubbleLeftRightIcon],
  ["Schedule", CalendarDaysIcon],
  ["Profile", UserIcon],
];

function DriverApp({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 bg-[#f5f5f4]">
      <div className="absolute inset-x-0 top-[54px] bottom-0 overflow-hidden px-[14px] pt-[10px]">{children}</div>
      <NavFade />
      <div className="absolute inset-x-0 bottom-0 z-40 px-[14px] pb-[40px]">
        <div className="rounded-[18px] border border-stone-200 bg-white px-[12px] py-[8px] shadow-lg">
          <div className="grid grid-cols-6 items-center">
            {DRIVER_TABS.map(([label, Icon]) => (
              <span
                key={label}
                className={`flex min-h-[50px] flex-col items-center justify-center gap-[3px] text-[11px] font-semibold ${
                  label === "Pickups" ? "text-[#FFA800]" : "text-gray-500"
                }`}
              >
                <Icon className="h-[22px] w-[22px]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <div className="font-massilia text-[25px] leading-tight font-bold tracking-tight text-forest">{title}</div>
      {sub && <div className="mt-[3px] text-[14.5px] font-medium text-gray-500">{sub}</div>}
    </div>
  );
}

function Segmented({ items, active }: { items: string[]; active: string }) {
  return (
    <div className="flex gap-[4px] rounded-[13px] bg-white p-[4px] text-[13.5px] font-semibold text-gray-500 ring-1 ring-black/5">
      {items.map(t => (
        <span
          key={t}
          className={`flex-1 rounded-[10px] py-[8px] text-center ${t === active ? "bg-[#fff4de] text-forest ring-1 ring-amber-200" : ""}`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   1 · Bookings — a request arrives from the owner app, then the
   Pending queue clears one Accept at a time.
   ───────────────────────────────────────────────────────────── */
const REQUESTS = [
  { dog: "Milo",   owner: "Amanda R.", photo: "/daycare/dog1.jpg", service: "Daycare",              date: "Mon 5 Oct", ic: s.icSun },
  { dog: "Bailey", owner: "Carole F.", photo: "/daycare/dog2.jpg", service: "Full Groom",           date: "Thu 8 Oct", ic: s.icGroom },
  { dog: "Rex",    owner: "Tom H.",    photo: "/daycare/dog4.jpg", service: "Sleepover · 2 nights", date: "Fri 9 Oct", ic: s.icMoon },
];
const REQUEST_PRESS = [2, 4, 6];
const REQUEST_ACCEPT = [3, 5, 7];

export function BookingsShowcase() {
  const [ref, step] = useStepper(10, 1100);
  const arrived = step >= 1;
  const shown = REQUESTS.map((_, i) => i > 0 || arrived);
  const pending = REQUESTS.filter((_, i) => shown[i] && step < REQUEST_ACCEPT[i]).length;

  return (
    <DeviceStage>
      <div ref={ref} className="relative">
        <DeviceFrame
          label="The Genera admin app on a phone: the Bookings page's Pending tab, where owner requests are accepted one by one."
          className="-rotate-1"
        >
          <AdminApp tab="Bookings">
            <ScreenTitle title="Bookings" sub="Requests from your owner app" />
            <div className="mt-[14px]">
              <Segmented items={["All", `Pending ${pending}`, "Accepted"]} active={`Pending ${pending}`} />
            </div>
            <div className="mt-[14px] space-y-[10px]">
              {REQUESTS.map((r, i) => {
                if (!shown[i]) return null;
                const accepted = step >= REQUEST_ACCEPT[i];
                const pressed = !accepted && step >= REQUEST_PRESS[i];
                return (
                  <div
                    key={r.dog}
                    className={`rounded-[18px] bg-white p-[16px] shadow-sm ring-1 ring-gray-100 ${
                      i === 0 ? "motion-safe:animate-[chatIn_0.4s_ease-out_both]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-[12px]">
                      <PetPhoto src={r.photo} size={44} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16.5px] font-bold text-forest">{r.dog}</span>
                        <span className="block text-[13.5px] text-gray-500">{r.owner}</span>
                      </span>
                      <span
                        className={`rounded-full px-[10px] py-[3px] text-[12px] font-bold ring-1 transition-colors ${
                          accepted ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        {accepted ? "Accepted" : "Pending"}
                      </span>
                    </div>
                    <div className="mt-[10px] flex items-center gap-[8px] text-[13.5px] text-gray-600">
                      <span className={`${s.adminChipIc} ${r.ic}`} />
                      {r.service} · {r.date}
                    </div>
                    {!accepted && (
                      <div className="mt-[12px] grid grid-cols-2 gap-[8px] text-center text-[14px] font-semibold">
                        <span
                          className={`rounded-[13px] py-[10px] text-white transition-transform ${
                            pressed ? "scale-[0.96] bg-emerald-700" : "bg-emerald-600"
                          }`}
                        >
                          Accept
                        </span>
                        <span className="rounded-[13px] bg-rose-50 py-[10px] text-rose-600 ring-1 ring-rose-200">Decline</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </AdminApp>
        </DeviceFrame>

        <FloatCard className="top-[5%] -left-[140px] -rotate-3" show={arrived}>
          <div className="w-[200px]">
            <FloatLine Icon={BellIcon} tone="bg-[#FFF3CC] text-[#8A5A00]" title="New booking request" sub="Milo · Daycare, Mon 5 Oct" />
          </div>
        </FloatCard>
        <FloatCard className="-right-[124px] bottom-[24%] rotate-2">
          <div className="w-[178px]">
            <FloatLine Icon={CheckCircleIcon} tone="bg-emerald-50 text-emerald-600" title="Auto-accepted" sub="Nala · Daycare, Thu 8 Oct" />
          </div>
        </FloatCard>
      </div>
    </DeviceStage>
  );
}

/* ─────────────────────────────────────────────────────────────
   3 · Invoicing — raise the month's invoices, then watch them
   get paid: Direct Debit collects, a card payment lands, Xero
   picks both up. Statuses are the app's own labels.
   ───────────────────────────────────────────────────────────── */
type InvoiceStatus = "awaiting" | "dd" | "paid";
const INVOICE_PILL: Record<InvoiceStatus, [string, string]> = {
  awaiting: ["Awaiting payment", "bg-blue-50 text-blue-700 ring-blue-200"],
  dd:       ["Collecting by DD", "bg-sky-50 text-sky-700 ring-sky-200"],
  paid:     ["Paid",             "bg-emerald-50 text-emerald-700 ring-emerald-200"],
};
const INVOICES = [
  { ref: "DDC-000231", owner: "Amanda R.", pets: "Milo",   amount: 264, statusAt: (n: number): InvoiceStatus => (n >= 7 ? "paid" : n >= 5 ? "dd" : "awaiting") },
  { ref: "DDC-000232", owner: "Carole F.", pets: "Bailey", amount: 185, statusAt: (n: number): InvoiceStatus => (n >= 6 ? "paid" : "awaiting") },
  { ref: "DDC-000233", owner: "Tom H.",    pets: "Rex",    amount: 320, statusAt: (): InvoiceStatus => "awaiting" },
];

export function InvoicingShowcase() {
  const [ref, step] = useStepper(10, 950);
  const raised = step >= 3;

  return (
    <DeviceStage>
      <div ref={ref} className="relative">
        <DeviceFrame
          label="The Genera admin app on a phone: the month's invoices raised for every owner in one go, then marked paid as Direct Debit and card payments come in."
          className="-rotate-1"
        >
          <AdminApp>
            <ScreenTitle title="Raised Invoices" sub="September 2026" />
            <div className="mt-[14px]">
              <Segmented items={["Drafts", "Unpaid", "Paid", "All"]} active="All" />
            </div>

            {raised ? (
              <>
                <div className="mt-[14px] flex items-center gap-[10px] rounded-[16px] bg-emerald-50 px-[14px] py-[12px] text-[14px] leading-snug text-emerald-800 ring-1 ring-emerald-200 motion-safe:animate-[chatIn_0.35s_ease-out_both]">
                  <CheckCircleIcon className="h-[22px] w-[22px] shrink-0" />
                  <span>
                    <b className="font-semibold">Invoices successfully raised!</b>
                    <br />
                    23 owners · £4,860.00
                  </span>
                </div>
                <div className="mt-[10px] space-y-[10px]">
                  {INVOICES.map(inv => {
                    const status = inv.statusAt(step);
                    const [label, pill] = INVOICE_PILL[status];
                    const paid = status === "paid";
                    return (
                      <div
                        key={inv.ref}
                        className="rounded-[18px] bg-white p-[16px] shadow-sm ring-1 ring-gray-100 motion-safe:animate-[chatIn_0.35s_ease-out_both]"
                      >
                        <div className="flex items-start justify-between gap-[8px]">
                          <span>
                            <span className="block text-[16px] font-bold tracking-wide text-forest">{inv.ref}</span>
                            <span className="block text-[13.5px] text-gray-500">{inv.owner} · {inv.pets}</span>
                          </span>
                          <span className={`shrink-0 rounded-full px-[10px] py-[3px] text-[12px] font-semibold ring-1 transition-colors ${pill}`}>
                            {label}
                          </span>
                        </div>
                        <div className="mt-[12px] flex items-center justify-between border-t border-gray-100 pt-[10px]">
                          <span className="flex gap-[6px]">
                            {paid && (
                              <span className="rounded-full bg-sky-50 px-[8px] py-[2px] text-[11.5px] font-semibold text-sky-700">In Xero</span>
                            )}
                            {!paid && step >= 8 && inv.ref.endsWith("3") && (
                              <span className="rounded-full bg-gray-100 px-[8px] py-[2px] text-[11.5px] font-semibold text-gray-600">Opened 2 Oct</span>
                            )}
                          </span>
                          <span className="flex items-baseline gap-[8px]">
                            <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                              {paid ? "Paid" : "Outstanding"}
                            </span>
                            <span className="text-[18px] font-bold text-forest">£{inv.amount.toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="mt-[60px] text-center text-[14px] text-gray-400">No invoices for September yet</div>
            )}
          </AdminApp>

          {/* The raise-invoices sheet opens over everything, nav included */}
          {!raised && (
            <>
              <div className="absolute inset-0 z-[45] bg-black/30" />
              <div className="absolute inset-x-0 bottom-0 z-[46] rounded-t-[26px] bg-white px-[20px] pt-[12px] pb-[42px] shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
                <div className="mx-auto mb-[16px] h-[5px] w-[40px] rounded-full bg-gray-200" />
                <div className="text-[18px] font-bold text-forest">Who do you want to invoice?</div>
                <div className="mt-[14px] grid grid-cols-2 gap-[8px] text-[14px] font-semibold">
                  <span className="rounded-[13px] bg-[#fff4de] py-[11px] text-center text-forest ring-1 ring-amber-300">All owners</span>
                  <span className="rounded-[13px] py-[11px] text-center text-gray-500 ring-1 ring-gray-200">One owner</span>
                </div>
                <div className="mt-[10px] rounded-[13px] px-[14px] py-[11px] text-[14px] font-medium text-[#d98e00] ring-1 ring-gray-200">
                  01/09/2026 → 30/09/2026
                </div>
                <div
                  className={`mt-[16px] rounded-[13px] py-[14px] text-center text-[16px] font-bold text-forest transition-transform ${
                    step >= 1 ? "scale-[0.97] bg-[#e89a00]" : "bg-[#FFA800]"
                  }`}
                >
                  {step >= 2 ? "Raising…" : "Raise invoices"}
                </div>
              </div>
            </>
          )}
        </DeviceFrame>

        <FloatCard className="top-[24%] -right-[134px] rotate-2" show={step >= 7}>
          <div className="w-[200px]">
            <FloatLine Icon={CheckCircleIcon} tone="bg-emerald-50 text-emerald-600" title="Direct Debit collected" sub="£264.00 · Amanda R." />
          </div>
        </FloatCard>
        <FloatCard className="bottom-[22%] -left-[112px] -rotate-2" show={step >= 6}>
          <div className="w-[164px]">
            <FloatLine Icon={DocumentTextIcon} tone="bg-sky-50 text-sky-700" title="In Xero" sub="Synced with your books" />
          </div>
        </FloatCard>
      </div>
    </DeviceStage>
  );
}

/* ─────────────────────────────────────────────────────────────
   4 · Routes — the driver's morning board. Stops tick off in
   order with the app's "Picked up by …" stamp; the office sees
   the van move on Live Driver Tracking.
   ───────────────────────────────────────────────────────────── */
const ROUTE_STOPS = [
  { dog: "Milo",   photo: "/daycare/dog1.jpg", addr: "14 Effra Road",   collect: "7:50", done: "07:52", pin: [26, 60] },
  { dog: "Bailey", photo: "/daycare/dog2.jpg", addr: "3 Mantlet Close", collect: "8:02", done: "08:04", pin: [70, 44] },
  { dog: "Nala",   photo: "/daycare/dog3.jpg", addr: "27 Fox Hollow",   collect: "8:15", done: "08:14", pin: [112, 54] },
  { dog: "Otis",   photo: "/daycare/dog5.jpg", addr: "9 Church Road",   collect: "8:26", done: "08:27", pin: [150, 30] },
  { dog: "Pepper", photo: "/daycare/dog4.jpg", addr: "41 Barn Close",   collect: "8:40", done: "08:41", pin: [186, 18] },
] as const;

export function RoutesShowcase() {
  const [ref, step] = useStepper(8, 1000);
  const done = Math.min(step, ROUTE_STOPS.length);
  const van = ROUTE_STOPS[Math.max(0, done - 1)].pin;

  return (
    <DeviceStage>
      <div ref={ref} className="relative">
        <DeviceFrame
          label="The Genera driver app on a phone: the morning pickups board, with each dog ticked off as Sam collects them."
          className="rotate-1"
        >
          <DriverApp>
            <div className="flex items-end justify-between">
              <ScreenTitle title="Pickups" sub="Thu 1 Oct · Morning Route 1" />
              <span className="mb-[4px] rounded-full bg-teal-soft px-[10px] py-[4px] text-[12.5px] font-semibold text-forest">
                {done} of {ROUTE_STOPS.length}
              </span>
            </div>
            <div className="mt-[12px] h-[6px] overflow-hidden rounded-full bg-stone-200">
              <span
                className="block h-full rounded-full bg-emerald-500 transition-[width] duration-500"
                style={{ width: `${(done / ROUTE_STOPS.length) * 100}%` }}
              />
            </div>
            <div className="mt-[14px] space-y-[10px]">
              {ROUTE_STOPS.map((r, i) => {
                const isDone = i < done;
                return (
                  <div
                    key={r.dog}
                    className={`flex items-start gap-[12px] rounded-[18px] bg-white p-[14px] ring-1 transition-colors ${
                      i === done ? "ring-2 ring-amber-300" : "ring-stone-200"
                    }`}
                  >
                    <span
                      className={`mt-[2px] grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full border-2 transition-colors ${
                        isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-300 text-transparent"
                      }`}
                    >
                      <CheckIcon className="h-[16px] w-[16px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-[8px]">
                        <span className="flex items-center gap-[8px]">
                          <PetPhoto src={r.photo} size={26} />
                          <span className="text-[17px] font-bold text-forest">{r.dog}</span>
                        </span>
                        <span className="text-[12.5px] font-semibold text-gray-500">Collect {r.collect}</span>
                      </span>
                      <span className="mt-[3px] flex items-center gap-[4px] text-[13px] text-gray-500">
                        <MapPinIcon className="h-[14px] w-[14px]" />
                        {r.addr}
                      </span>
                      {isDone ? (
                        <span className="mt-[4px] block text-[12.5px] font-semibold text-emerald-700">
                          Picked up by Sam · {r.done}
                        </span>
                      ) : (
                        <span className="mt-[5px] inline-flex items-center gap-[5px] rounded-full bg-amber-50 px-[8px] py-[2px] text-[12px] font-semibold text-amber-800">
                          <span className={`${s.adminChipIc} ${s.icSun}`} /> Daycare · 9:00
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </DriverApp>
        </DeviceFrame>

        <FloatCard className="bottom-[9%] -left-[118px] -rotate-2">
          <div className="w-[214px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12.5px] font-bold text-forest">Live Driver Tracking</span>
              <span className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
              </span>
            </div>
            <svg viewBox="0 0 212 80" className="block h-[80px] w-full rounded-lg bg-teal-soft">
              <g stroke="#C2E2E6" strokeWidth="6">
                <path d="M0 26 H212" />
                <path d="M0 64 H212" />
                <path d="M48 0 V80" />
                <path d="M132 0 V80" />
              </g>
              <path
                d={`M${ROUTE_STOPS.map(r => r.pin.join(" ")).join(" L")}`}
                fill="none"
                stroke="#003E45"
                strokeWidth="2"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />
              {ROUTE_STOPS.map((r, i) => (
                <circle
                  key={r.dog}
                  cx={r.pin[0]}
                  cy={r.pin[1]}
                  r="5"
                  fill={i < done ? "#10B981" : "#9CA3AF"}
                  style={{ transition: "fill .4s" }}
                />
              ))}
              <circle cx={van[0]} cy={van[1]} r="9" fill="#FFA800" stroke="#fff" strokeWidth="2.5" style={{ transition: "cx .6s, cy .6s" }} />
            </svg>
            <div className="mt-1.5 text-[11px] text-gray-500">Sam · Morning Route 1</div>
          </div>
        </FloatCard>
        <FloatCard className="-right-[128px] bottom-[26%] rotate-2">
          <div className="w-[184px]">
            <FloatLine Icon={DocumentTextIcon} tone="bg-[#FFF3CC] text-[#8A5A00]" title="Collection notes" sub="Otis · key in the lockbox by the back gate" />
          </div>
        </FloatCard>
      </div>
    </DeviceStage>
  );
}

/* ─────────────────────────────────────────────────────────────
   7 · Daily schedule — the Dashboard's Daily view: the day's
   dogs arrive one by one, and a booking is added from the same
   screen.
   ───────────────────────────────────────────────────────────── */
const SCHED_DOGS = [
  { name: "Milo",   owner: "Amanda R.", photo: "/daycare/dog1.jpg", svc: "Daycare",    ic: s.icSun,   wks: "3 this wk" },
  { name: "Nala",   owner: "Ruth E.",   photo: "/daycare/dog3.jpg", svc: "Daycare",    ic: s.icSun,   wks: "2 this wk" },
  { name: "Rex",    owner: "Tom H.",    photo: "/daycare/dog4.jpg", svc: "Sleepover",  ic: s.icMoon,  wks: "1 this wk" },
  { name: "Bailey", owner: "Carole F.", photo: "/daycare/dog2.jpg", svc: "Full Groom", ic: s.icGroom, wks: "1 this wk" },
  { name: "Pepper", owner: "Priya N.",  photo: "/daycare/dog5.jpg", svc: "Daycare",    ic: s.icSun,   wks: "4 this wk" },
];

function DailyScheduleScreen({ count }: { count: number }) {
  return (
    <AdminApp tab="Home">
      <ScreenTitle title="Thursday 1 October" sub="Today's bookings, collections and drop-offs" />
      <div className="mt-[14px]">
        <Segmented items={["Monthly", "Daily", "Schedule", "Map"]} active="Daily" />
      </div>
      <div className="mt-[12px] flex gap-[6px] text-[13px] font-semibold">
        <span className="rounded-full bg-forest px-[12px] py-[6px] text-white">All pets {count}</span>
        <span className="rounded-full bg-white px-[12px] py-[6px] text-gray-600 ring-1 ring-gray-200">Collections 3</span>
        <span className="rounded-full bg-white px-[12px] py-[6px] text-gray-600 ring-1 ring-gray-200">Drop-offs 4</span>
      </div>
      <div className="mt-[12px] flex items-center justify-center gap-[8px] rounded-[13px] bg-[#FFA800] py-[12px] text-[15.5px] font-semibold text-forest shadow-lg shadow-[#ffa800]/20">
        <PlusIcon className="h-[20px] w-[20px]" />
        Create booking
      </div>
      <div className="mt-[12px] space-y-[8px]">
        {SCHED_DOGS.slice(0, count).map((dog, i) => (
          <div
            key={dog.name}
            className={`flex items-center gap-[12px] rounded-[18px] bg-white px-[14px] py-[12px] ring-1 ring-gray-100 ${
              i >= 2 ? "motion-safe:animate-[chatIn_0.4s_ease-out_both]" : ""
            }`}
          >
            <PetPhoto src={dog.photo} size={40} />
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-bold text-forest">{dog.name}</span>
              <span className="flex items-center gap-[6px] text-[13px] text-gray-500">
                <span className={`${s.adminChipIc} ${dog.ic}`} />
                {dog.svc} · {dog.owner}
              </span>
            </span>
            <span className="text-[12px] text-gray-400">{dog.wks}</span>
            <ChevronRightIcon className="h-[18px] w-[18px] text-gray-300" />
          </div>
        ))}
      </div>
    </AdminApp>
  );
}

export function DailyScheduleShowcase() {
  const [ref, step] = useStepper(6, 900);
  const count = Math.min(2 + step, SCHED_DOGS.length);
  return (
    <DeviceStage>
      <div ref={ref} className="relative">
        <DeviceFrame
          label="The Genera admin app on a phone: the Dashboard's Daily view, listing every dog booked in today."
          className="-rotate-1"
        >
          <DailyScheduleScreen count={count} />
        </DeviceFrame>
        <FloatCard className="-right-[128px] bottom-[20%] rotate-2" show={count === SCHED_DOGS.length}>
          <div className="w-[190px]">
            <FloatLine Icon={PlusIcon} tone="bg-[#FFF3CC] text-[#8A5A00]" title="Booking added" sub="Pepper · Daycare, today" />
          </div>
        </FloatCard>
      </div>
    </DeviceStage>
  );
}

/* ─────────────────────────────────────────────────────────────
   8 · Assessments — staff score a First Day in the app's
   assessment modal, hit Finalise & send, and the owner's
   branded report card replays with the new scores.
   ───────────────────────────────────────────────────────────── */
const ASSESS_NOTE = "Milo settled in beautifully and spent the morning playing with Bailey.";
const ASSESS_QUESTIONS = [
  { q: "How well did Milo integrate with the pack?", v: 5 },
  { q: "How did he get on with the team?",           v: 5 },
  { q: "Energy and play",                            v: 4 },
  { q: "Settling at rest time",                      v: 4 },
];
const ASSESS_NOTE_START = 6;
const ASSESS_STARS_START = 44;
const ASSESS_PRESS = 72;
const ASSESS_SENT = 76;
const ASSESS_REPORT = 78;

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-[3px]">
      {[1, 2, 3, 4, 5].map(n => (
        <StarSolidIcon key={n} className={`h-[20px] w-[20px] transition-colors ${n <= value ? "text-amber-400" : "text-gray-200"}`} />
      ))}
    </span>
  );
}

export function AssessmentsShowcase() {
  const [ref, step] = useStepper(120, 110);
  const typed = ASSESS_NOTE.slice(0, Math.max(0, (step - ASSESS_NOTE_START) * 2));
  const ratings = ASSESS_QUESTIONS.map((x, i) =>
    Math.min(x.v, Math.max(0, step - (ASSESS_STARS_START + i * 7))),
  );
  const sent = step >= ASSESS_SENT;
  // The owner's phone always shows a finished report card — the last one
  // sent — and replays it when this one goes out. At phone width it's the
  // only phone on screen, so it must never sit empty waiting for the send.
  const fresh = step >= ASSESS_REPORT;
  const k = fresh ? easeOut(clamp01((step - ASSESS_REPORT - 2) / 12)) : 1;
  const stampIn = !fresh || step >= ASSESS_REPORT + 2;
  const avg = ASSESS_QUESTIONS.reduce((a, x) => a + x.v, 0) / ASSESS_QUESTIONS.length;

  return (
    <DeviceStage>
      <div ref={ref} className="relative flex items-end justify-center gap-[22px]">
        {/* Staff: the assessment modal */}
        <div className="max-[920px]:hidden">
          <DeviceFrame
            label="A staff member scoring Milo's first day in the Genera assessment form."
            scale={PAIR_SCALE}
            statusBar="light"
            className="-rotate-2"
          >
            <div className="absolute inset-0 flex flex-col bg-[#f5f5f4]">
              <div className="shrink-0 bg-forest px-[20px] pt-[62px] pb-[18px] text-white">
                <div className="text-[20px] font-bold">Edit Assessment</div>
                <div className="mt-[2px] text-[14px] text-white/70">Rate each question to finalise</div>
              </div>
              <div className="min-h-0 flex-1 space-y-[14px] overflow-hidden px-[18px] pt-[16px]">
                <div className="flex items-center gap-[10px]">
                  <PetPhoto src="/daycare/dog1.jpg" size={36} />
                  <span className="text-[17px] font-bold text-forest">Milo</span>
                  <span className="rounded-full bg-amber-100 px-[10px] py-[3px] text-[12px] font-semibold text-amber-800">First Day</span>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-500">
                    Photos <span className="font-normal text-gray-400">optional</span>
                  </div>
                  <div className="mt-[6px] grid grid-cols-3 gap-[8px]">
                    <span className="relative aspect-square overflow-hidden rounded-[13px]">
                      <Image src="/daycare/dog1.jpg" alt="" fill sizes="110px" className="object-cover" />
                    </span>
                    <span className="relative aspect-square overflow-hidden rounded-[13px]">
                      <Image src="/daycare/dog2.jpg" alt="" fill sizes="110px" className="object-cover" />
                    </span>
                    <span className="grid aspect-square place-items-center rounded-[13px] border-2 border-dashed border-gray-300 text-[13px] font-semibold text-gray-400">
                      Add
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-500">
                    Message to owner <span className="font-normal text-gray-400">summary</span>
                  </div>
                  <div className="mt-[6px] min-h-[70px] rounded-[13px] bg-white p-[12px] text-[14.5px] leading-snug text-forest ring-1 ring-gray-200">
                    {typed}
                    {typed.length < ASSESS_NOTE.length && step >= ASSESS_NOTE_START && (
                      <span className="ml-px inline-block h-[1em] w-px translate-y-[2px] animate-pulse bg-forest" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="h-px flex-1 bg-gray-200" />
                  <span className="text-[11.5px] font-bold tracking-widest text-gray-400">QUESTIONS</span>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>
                {ASSESS_QUESTIONS.map((x, i) => (
                  <div key={x.q} className="rounded-[16px] bg-white px-[14px] py-[12px] ring-1 ring-black/5">
                    <div className="text-[14.5px] leading-tight font-semibold text-forest">{x.q}</div>
                    <div className="mt-[8px] flex items-center justify-between">
                      <Stars value={ratings[i]} />
                      <span className="text-[12.5px] text-gray-400">{ratings[i] ? `${ratings[i]}/5` : "Not rated"}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative z-40 flex shrink-0 gap-[10px] border-t border-gray-100 bg-white px-[18px] pt-[12px] pb-[34px]">
                <span className="flex-1 rounded-[13px] py-[12px] text-center text-[14.5px] font-semibold text-gray-600 ring-1 ring-gray-200">
                  Save as draft
                </span>
                <span
                  className={`flex-1 rounded-[13px] py-[12px] text-center text-[14.5px] font-bold text-white transition ${
                    sent ? "bg-emerald-600" : step >= ASSESS_PRESS ? "scale-[0.97] bg-forest-mid" : "bg-forest"
                  }`}
                >
                  {sent ? "Sent ✓" : "Finalise & send"}
                </span>
              </div>
            </div>
          </DeviceFrame>
        </div>

        {/* Owner: the branded report card */}
        <DeviceFrame
          label="Milo's owner reading the branded First Day report card from Duncan's Dog Co."
          scale={PAIR_SCALE}
          className="mb-[18px]"
        >
          <div className="absolute inset-0 overflow-hidden bg-white pt-[54px]">
            <div className="flex items-center gap-[10px] px-[20px] pt-[10px] pb-[14px]">
              <span className="h-[36px] w-[36px] overflow-hidden rounded-full">
                <Image src="/images/duncans-dog-co-logo.png" alt="" width={72} height={72} className="h-full w-full" />
              </span>
              <span>
                <span className="block text-[15px] font-bold text-ink">Duncan&apos;s Dog Co</span>
                <span className="block text-[12px] text-gray-500">South West London</span>
              </span>
            </div>

            <div key={fresh ? "sent" : "previous"} className="motion-safe:animate-[chatIn_0.45s_ease-out_both]">
              <div className="relative mx-[16px] rounded-[26px] bg-forest px-[20px] pt-[20px] pb-[28px] text-white">
                <div className="font-massilia text-[36px] leading-none font-bold text-[#FFA800]">First Day</div>
                <div className="mt-[10px] max-w-[78%] text-[16px] leading-snug">
                  <b>Milo</b> settled in beautifully on day one 🐾
                </div>
                <div className="mt-[12px] flex gap-[6px] text-[12px]">
                  <span className="rounded-full bg-white/15 px-[10px] py-[4px]">1 Oct 2026</span>
                  <span className="rounded-full bg-white/15 px-[10px] py-[4px]">First Day</span>
                </div>
                <span
                  className={`absolute -bottom-[26px] right-[18px] grid h-[74px] w-[74px] -rotate-[8deg] place-items-center rounded-full bg-[#FFA800] text-[14px] font-extrabold text-forest ring-[6px] ring-white transition-transform duration-300 ${
                    stampIn ? "scale-100" : "scale-0"
                  }`}
                >
                  1st Day
                </span>
              </div>
              <div className="relative mx-[16px] mt-[18px] h-[150px] overflow-hidden rounded-[20px]">
                <Image src="/daycare/dog1.jpg" alt="" fill sizes="360px" className="object-cover object-[center_30%]" />
              </div>
              <div className="mx-[16px] mt-[12px] grid grid-cols-2 gap-[8px]">
                {[
                  ["Average score", `${(avg * k).toFixed(1)}/5`],
                  ["Areas assessed", `${Math.round(4 * k)}`],
                  ["Top marks", `${Math.round(2 * k)}`],
                  ["Overall mood", "Happy"],
                ].map(([label, value]) => (
                  <span key={label} className="rounded-[14px] bg-cream px-[12px] py-[10px] ring-1 ring-cream-dark">
                    <span className="block text-[12px] text-gray-500">{label}</span>
                    <span className="block font-massilia text-[20px] font-bold text-forest">{value}</span>
                  </span>
                ))}
              </div>
              <div className="mx-[16px] mt-[12px] space-y-[8px]">
                {ASSESS_QUESTIONS.slice(0, 3).map(x => (
                  <div key={x.q} className="flex items-center gap-[8px] text-[13.5px] text-forest">
                    <CheckCircleIcon className="h-[20px] w-[20px] shrink-0 text-emerald-600" />
                    <span className="flex-1 leading-tight">{x.q}</span>
                    <b>{x.v}/5</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DeviceFrame>
      </div>
    </DeviceStage>
  );
}

/* ─────────────────────────────────────────────────────────────
   11 · Team — the Weekly Rota, and a holiday request approved
   straight into it: Priya's Friday turns to Holiday and the
   day's headcount drops.
   ───────────────────────────────────────────────────────────── */
type RotaCell = "in" | "off" | "hol";
const ROTA_DAYS = ["Mon 28", "Tue 29", "Wed 30", "Thu 1", "Fri 2"];
const ROTA: Array<{ name: string; role: string; days: RotaCell[] }> = [
  { name: "Jess",  role: "Manager", days: ["in", "in", "in", "in", "in"] },
  { name: "Sam",   role: "Driver",  days: ["in", "in", "off", "in", "in"] },
  { name: "Priya", role: "Handler", days: ["in", "off", "in", "in", "in"] },
  { name: "Dave",  role: "Driver",  days: ["off", "in", "in", "in", "in"] },
];
const ROTA_CELL: Record<RotaCell, [string, string]> = {
  in:  ["In",  "bg-forest text-white"],
  off: ["Off", "bg-stone-100 text-stone-400"],
  hol: ["Hol", "bg-amber-100 text-amber-800"],
};

export function TeamShowcase() {
  const [ref, step] = useStepper(7, 1000);
  const approved = step >= 3;
  const rota = ROTA.map(r =>
    r.name === "Priya" && approved ? { ...r, days: r.days.map((d, i) => (i === 4 ? "hol" : d)) as RotaCell[] } : r,
  );
  const headcount = ROTA_DAYS.map((_, i) => rota.filter(r => r.days[i] === "in").length);

  return (
    <DeviceStage>
      <div ref={ref} className="relative">
        <DeviceFrame
          label="The Genera admin app on a phone: the Weekly Rota, with a holiday request approved straight into it."
          className="rotate-1"
        >
          <AdminApp tab="Team">
            <ScreenTitle title="Weekly Rota" sub="28 Sep – 2 Oct" />

            <div className="mt-[14px] rounded-[18px] bg-white p-[12px] ring-1 ring-gray-100">
              <div className="grid grid-cols-[62px_repeat(5,1fr)] gap-[5px] text-center">
                <span />
                {ROTA_DAYS.map((d, i) => (
                  <span key={d} className="text-[11.5px] leading-tight font-semibold text-gray-500">
                    {d}
                    <span className={`block font-normal transition-colors ${i === 4 && approved ? "text-amber-700" : "text-gray-400"}`}>
                      {headcount[i]} in
                    </span>
                  </span>
                ))}
                {rota.map(r => (
                  <div key={r.name} className="contents">
                    <span className="self-center text-left">
                      <span className="block text-[13.5px] font-bold text-forest">{r.name}</span>
                      <span className="block text-[10.5px] text-gray-400">{r.role}</span>
                    </span>
                    {r.days.map((d, i) => {
                      const [label, cls] = ROTA_CELL[d];
                      return (
                        <span key={i} className={`rounded-[9px] py-[8px] text-[12px] font-semibold transition-colors duration-300 ${cls}`}>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-[10px] flex items-center justify-between border-t border-gray-100 pt-[8px] text-[12.5px] text-gray-500">
                <span>Week total</span>
                <b className="text-forest">{approved ? "140h" : "148h"}</b>
              </div>
            </div>

            <div className="mt-[16px] flex items-center justify-between">
              <span className="text-[16px] font-bold text-forest">Time off</span>
              <span className="flex gap-[6px] text-[12px] font-semibold">
                <span className="rounded-full bg-forest px-[10px] py-[3px] text-white">Pending {approved ? 0 : 1}</span>
                <span className="rounded-full bg-gray-100 px-[10px] py-[3px] text-gray-500">History</span>
              </span>
            </div>
            <div className="mt-[8px] rounded-[18px] bg-white p-[14px] ring-1 ring-gray-100">
              <div className="flex items-center gap-[8px]">
                <span className="text-[15px] font-bold text-forest">Priya N.</span>
                <span className="rounded-full bg-amber-100 px-[8px] py-[2px] text-[11.5px] font-semibold text-amber-800">Holiday</span>
                <span className="ml-auto text-[12.5px] text-gray-500">Fri 2 Oct · 1 day</span>
              </div>
              <div className="mt-[4px] text-[12.5px] text-gray-500">&ldquo;Sister&apos;s wedding&rdquo;</div>
              {approved ? (
                <div className="mt-[10px] flex items-center justify-between rounded-[13px] bg-emerald-50 px-[12px] py-[10px] text-[13px] font-semibold text-emerald-700 motion-safe:animate-[chatIn_0.35s_ease-out_both]">
                  <span className="flex items-center gap-[6px]">
                    <CheckIcon className="h-[16px] w-[16px]" /> Approved by Jess
                  </span>
                  <span className="font-normal text-emerald-800">11 of 25 days left</span>
                </div>
              ) : (
                <div className="mt-[10px] grid grid-cols-2 gap-[8px] text-center text-[14px] font-semibold">
                  <span
                    className={`rounded-[13px] py-[10px] text-white transition-transform ${
                      step >= 2 ? "scale-[0.96] bg-emerald-700" : "bg-emerald-600"
                    }`}
                  >
                    Accept
                  </span>
                  <span className="rounded-[13px] bg-rose-50 py-[10px] text-rose-600 ring-1 ring-rose-200">Decline</span>
                </div>
              )}
            </div>
          </AdminApp>
        </DeviceFrame>

        <FloatCard className="top-[5%] -left-[140px] -rotate-2" show={approved}>
          <div className="w-[196px]">
            <FloatLine Icon={CheckCircleIcon} tone="bg-emerald-50 text-emerald-600" title="Holiday approved" sub="Priya N. · Fri 2 Oct" />
          </div>
        </FloatCard>
        <FloatCard className="-right-[120px] bottom-[24%] rotate-2">
          <div className="w-[176px]">
            <div className="text-[11.5px] text-gray-500">Monthly salaries</div>
            <div className="font-massilia text-[20px] font-bold text-forest">£9,480</div>
            <div className="mt-1 flex gap-1 text-[10.5px] font-semibold">
              <span className="rounded-full bg-amber-50 px-1.5 py-px text-amber-700">3 hourly</span>
              <span className="rounded-full bg-emerald-50 px-1.5 py-px text-emerald-700">1 salaried</span>
            </div>
          </div>
        </FloatCard>
      </div>
    </DeviceStage>
  );
}

/* ─────────────────────────────────────────────────────────────
   6 · Capacity — daily caps count up service by service, save,
   then the calendar shows what a full day does: waitlist, not
   an overbooking.
   ───────────────────────────────────────────────────────────── */
const CAP_SERVICES = [
  { name: "Daycare",    max: 15 },
  { name: "Sleepover",  max: 8 },
  { name: "Full Groom", max: 6 },
  { name: "Dog Walk",   max: 10 },
  { name: "Swimming",   max: 4 },
];
const CAP_TOTAL = CAP_SERVICES.reduce((a, sv) => a + sv.max, 0);
const CAP_HOLD = 30;

export function CapacityAnimation() {
  const [ref, step] = useStepper(CAP_TOTAL + CAP_HOLD, 65);
  const vals = CAP_SERVICES.map((sv, i) => {
    const offset = CAP_SERVICES.slice(0, i).reduce((a, x) => a + x.max, 0);
    return Math.min(sv.max, Math.max(0, step - offset));
  });
  const allFull = step >= CAP_TOTAL;
  const showWaitlist = step >= CAP_TOTAL + 8;

  return (
    <BrowserChrome url="app.generasoftware.com / settings / services">
      <div ref={ref} className={s.capacityAnim}>
        {CAP_SERVICES.map((sv, i) => (
          <div key={sv.name} className={s.capRow}>
            <div>
              <div className={s.capLabel}>{sv.name}</div>
              <div className={s.capSub}>Maximum bookings per day</div>
            </div>
            <div className={`${s.capInput} ${vals[i] === sv.max ? s.capInputFilled : ""}`}>
              {vals[i] > 0 ? vals[i] : ""}
            </div>
          </div>
        ))}
        <div className={`${s.capFooter} flex-wrap gap-2`}>
          <span
            className={`mr-auto flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-900 ring-1 ring-amber-200 transition-opacity duration-300 ${
              showWaitlist ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="rounded-full bg-red-50 px-1.5 text-[10px] font-bold text-red-600 ring-1 ring-red-100">Full</span>
            Daycare, Fri 9 Oct · 2 waitlist requests
          </span>
          <div className={`${s.capSaveBtn} ${allFull ? s.capSaveBtnActive : ""}`}>
            {allFull ? "Saved ✓" : "Save"}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

/* ─────────────────────────────────────────────────────────────
   9 · Finance — the six-month Revenue Forecast: headline tiles
   count up, the monthly bars stack in, the average line lands.
   Series and colours follow the app's forecast chart.
   ───────────────────────────────────────────────────────────── */
const FORECAST = [
  { m: "Oct", confirmed: 6100, members: 1800, awaiting: 400 },
  { m: "Nov", confirmed: 6400, members: 1850, awaiting: 650 },
  { m: "Dec", confirmed: 7300, members: 1900, awaiting: 740 },
  { m: "Jan", confirmed: 5600, members: 1900, awaiting: 900 },
  { m: "Feb", confirmed: 5200, members: 1950, awaiting: 1250 },
  { m: "Mar", confirmed: 4700, members: 2000, awaiting: 1800 },
];
const FORECAST_TOTALS = FORECAST.map(f => f.confirmed + f.members + f.awaiting);
const FORECAST_SUM = FORECAST_TOTALS.reduce((a, n) => a + n, 0);
const FORECAST_AVG = FORECAST_SUM / FORECAST.length;
const FORECAST_PEAK = Math.max(...FORECAST_TOTALS);
const FORECAST_BUSIEST = FORECAST[FORECAST_TOTALS.indexOf(FORECAST_PEAK)].m;
const FORECAST_SCALE = 11000;
const SERIES = [
  { key: "confirmed", label: "Confirmed bookings", color: "#292524" },
  { key: "members",   label: "Memberships",        color: "#57534e" },
  { key: "awaiting",  label: "Awaiting approval",  color: "#a8a29e" },
] as const;

export function FinanceAnimation() {
  const [ref, step] = useStepper(72, 70);
  const k = easeOut(clamp01(step / 14));
  const avgIn = step >= 36;

  return (
    <BrowserChrome url="app.generasoftware.com / finance / forecast">
      <div ref={ref} className="bg-white p-4 text-left">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-massilia text-[16px] font-bold text-forest">Revenue Forecast</div>
            <div className="text-[11px] text-gray-500">What the diary is worth, from bookings already taken</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex rounded-lg bg-gray-100 p-0.5 text-[10.5px] font-semibold text-gray-500">
              {["1", "3", "6", "12"].map(n => (
                <span key={n} className={`rounded-md px-2 py-0.5 ${n === "6" ? "bg-white text-forest shadow-sm" : ""}`}>{n}m</span>
              ))}
            </span>
            <span className="rounded-lg px-2 py-1 text-[10.5px] font-semibold text-gray-600 ring-1 ring-gray-200">Export CSV</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-stone-800 p-3 text-white">
          {[
            ["Projected over 6 months", gbp(FORECAST_SUM * k), "1,284 bookings · 71 dogs"],
            ["Typical month", gbp(FORECAST_AVG * k), "Across the next six"],
            ["Busiest month", gbp(FORECAST_PEAK * k), FORECAST_BUSIEST === "Dec" ? "December" : FORECAST_BUSIEST],
          ].map(([label, value, sub]) => (
            <div key={label} className="min-w-0">
              <div className="truncate text-[9.5px] font-semibold tracking-wide text-white/60 uppercase">{label}</div>
              <div className="mt-0.5 font-massilia text-[19px] font-bold tabular-nums">{value}</div>
              <div className="truncate text-[10px] text-white/50">{sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-xl p-3 ring-1 ring-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] font-bold text-forest">Revenue by month</span>
            <span className="flex flex-wrap gap-3 text-[10px] text-gray-500">
              {SERIES.map(sr => (
                <span key={sr.key} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm" style={{ background: sr.color }} />
                  {sr.label}
                </span>
              ))}
            </span>
          </div>
          <div className="relative mt-3 flex h-[150px] items-end gap-3 border-b border-gray-200 px-1">
            <div
              className="absolute inset-x-0 border-t-2 border-dashed border-[#FFA800] transition-opacity duration-500"
              style={{ bottom: `${(FORECAST_AVG / FORECAST_SCALE) * 100}%`, opacity: avgIn ? 1 : 0 }}
            >
              <span className="absolute -top-4 right-0 text-[9.5px] font-semibold text-[#b87900]">
                Avg {gbp(FORECAST_AVG)}
              </span>
            </div>
            {FORECAST.map((f, i) => {
              const grow = easeOut(clamp01((step - 12 - i * 3) / 9));
              return (
                <div key={f.m} className="flex h-full flex-1 flex-col justify-end">
                  <div className="flex flex-col-reverse overflow-hidden rounded-t-md" style={{ height: `${(FORECAST_TOTALS[i] / FORECAST_SCALE) * 100 * grow}%` }}>
                    {SERIES.map(sr => (
                      <div key={sr.key} style={{ background: sr.color, flexGrow: f[sr.key], flexBasis: 0 }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-1.5 flex gap-3 px-1">
            {FORECAST.map(f => (
              <span key={f.m} className="flex-1 text-center text-[10px] font-semibold text-gray-500">{f.m}</span>
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

/* ─────────────────────────────────────────────────────────────
   10 · Records — a vaccination warning lands on the pet, then a
   new health record types itself into the log.
   ───────────────────────────────────────────────────────────── */
const RECORD_TYPES = {
  Behavioural: "bg-violet-50 text-violet-700 ring-violet-200",
  Logistic:    "bg-sky-50 text-sky-700 ring-sky-200",
  Health:      "bg-emerald-50 text-emerald-700 ring-emerald-200",
} as const;
const BASE_RECORDS: Array<{ type: keyof typeof RECORD_TYPES; detail: string; date: string }> = [
  { type: "Behavioural", detail: "Wary of new staff for the first ten minutes — let her come to you", date: "14/09/2026" },
  { type: "Logistic",    detail: "Lives on a school road — no collections between 8:20 and 9:00",  date: "02/09/2026" },
];
const TYPING_RECORD = "Bordetella booster booked with the vet for 12 Oct";
const RECORD_BANNER = 8;
const RECORD_TYPE_START = 26;

export function RecordsAnimation() {
  const [ref, step] = useStepper(RECORD_TYPE_START + TYPING_RECORD.length + 45, 60);
  const typedLen = Math.max(0, Math.min(TYPING_RECORD.length, step - RECORD_TYPE_START));
  const showNew = step >= RECORD_TYPE_START;
  const done = typedLen >= TYPING_RECORD.length;

  return (
    <BrowserChrome url="app.generasoftware.com / pets / nala">
      <div ref={ref} className={s.dogRecordsWrap}>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
            <Image src="/daycare/dog3.jpg" alt="" fill sizes="36px" className="object-cover" />
          </span>
          <span>
            <span className="block font-massilia text-[15px] font-bold text-forest">Nala</span>
            <span className="block text-[11px] text-gray-500">Ruth E. · Daycare Mon, Thu</span>
          </span>
          <span className="ml-auto hidden shrink-0 whitespace-nowrap rounded-lg bg-white p-0.5 text-[11px] font-semibold text-gray-500 ring-1 ring-gray-200 sm:flex">
            <span className="rounded-md bg-forest px-2 py-0.5 text-white">Pet Profile</span>
            <span className="px-2 py-0.5">Gallery</span>
          </span>
        </div>

        <div
          className={`mb-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 ring-1 ring-amber-200 transition-all duration-300 ${
            step >= RECORD_BANNER ? "opacity-100" : "-translate-y-1 opacity-0"
          }`}
        >
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span className="text-[12px] leading-snug">
            <b className="block font-semibold text-amber-800">Vaccination expiring within 4 weeks</b>
            <span className="text-amber-700">Bordetella expires on 22 Oct 2026.</span>
          </span>
        </div>

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
            </tr>
          </thead>
          <tbody>
            {BASE_RECORDS.map(r => (
              <tr key={r.type}>
                <td>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${RECORD_TYPES[r.type]}`}>{r.type}</span>
                </td>
                <td className={s.dogRecordDetail}>{r.detail}</td>
                <td className={s.dogRecordDate}>{r.date}</td>
              </tr>
            ))}
            {showNew && (
              <tr className={s.dogRecordNewRow}>
                <td>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${RECORD_TYPES.Health}`}>Health</span>
                </td>
                <td className={s.dogRecordDetail}>
                  {TYPING_RECORD.slice(0, typedLen)}
                  {!done && <span className={s.dogRecordCursor}>|</span>}
                </td>
                <td className={s.dogRecordDate}>{done ? "01/10/2026" : "—"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </BrowserChrome>
  );
}

/* ─────────────────────────────────────────────────────────────
   Layout pieces
   ───────────────────────────────────────────────────────────── */
export function CategoryHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className={`rev ${s.cat}`}>
      <div className={s.catInner}>
        <h2 className={s.catTitle}>{title}</h2>
        <p className={s.catDesc}>{desc}</p>
      </div>
    </div>
  );
}

/* Which plan includes it — the same split as /pricing. Grow's two
   extras are in Thrive too, so they read "Grow & Thrive". */
export type Plan = "every" | "grow" | "thrive";
const PLAN_BADGE: Record<Plan, [string, string]> = {
  every:  ["Every plan", ""],
  grow:   ["Grow & Thrive", s.featPlanGrow],
  thrive: ["Thrive", s.featPlanThrive],
};

export function Feature({
  id,
  feature,
  eyebrow,
  plan,
  onlyOnGenera,
  title,
  lead,
  bullets,
  flip,
  children,
}: {
  id: string;
  feature: FeatureKey;
  eyebrow: string;
  plan: Plan;
  onlyOnGenera?: boolean;
  title: ReactNode;
  lead: ReactNode;
  bullets: string[];
  flip?: boolean;
  children: ReactNode;
}) {
  const [planLabel, planClass] = PLAN_BADGE[plan];
  return (
    <article id={id} className={`rev ${s.feat} ${flip ? s.featFlip : ""}`}>
      <div className={s.featCopy}>
        <div className={s.featKicker}>
          <FeatureIcon feature={feature} size="sm" />
          <span className={s.featEyebrow}>{eyebrow}</span>
          <span className={`${s.featPlan} ${planClass}`}>{planLabel}</span>
          {onlyOnGenera && <span className={s.featOnly}>Only on Genera</span>}
        </div>
        <h3 className={s.featTitle}>{title}</h3>
        <p className={s.featLead}>{lead}</p>
        <ul className={s.bullets}>
          {bullets.map(b => <li key={b}>{b}</li>)}
        </ul>
      </div>
      <div className={s.featVisual}>{children}</div>
    </article>
  );
}

const EXTRAS: Array<{ feature: FeatureKey; title: string; body: string; badge: string; muted?: boolean }> = [
  {
    feature: "support",
    title: "Support that actually understands",
    body: "UK-based support from people who've run a daycare. You get a human who knows what a wet Tuesday in November looks like.",
    badge: "Every plan",
  },
  {
    feature: "essentials",
    title: "The small things that matter",
    body: "Closed days and bank holidays blocked on every calendar, price books for legacy and loyalty rates, and credits and deposits taken off the next invoice.",
    badge: "Every plan",
  },
  {
    feature: "marketing",
    title: "Marketing tools, on the way",
    body: "Filling quiet days and bringing lapsed owners back. Still in development — included in Thrive, and it appears in your account as it ships.",
    badge: "In development",
    muted: true,
  },
];

const band = "px-[clamp(22px,4vw,56px)]";

export default function FeaturesClient({
  showBookDemo,
}: {
  showBookDemo: boolean;
}) {
  return (
    <>
      <Reveal />

      {/* ── Hero: the whole admin, animated ─────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-[clamp(22px,4vw,56px)] pt-[104px] pb-14 text-white md:pt-[136px] md:pb-20">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -right-[180px] -bottom-[260px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,168,0,.16),transparent_66%)]" aria-hidden />
        <div className="pointer-events-none absolute -top-[200px] -left-[160px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.07),transparent_66%)]" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[1200px]">
          <div className="rev mx-auto max-w-[820px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
              🐾 Built for how pet care actually works
            </div>
            <h1 className="mx-auto max-w-[18ch] text-white [font-size:clamp(2.3rem,4.6vw,3.5rem)]">
              One system for the way your daycare{" "}
              <span className="squig !text-gold">
                really runs.
                <svg viewBox="0 0 180 12" preserveAspectRatio="none">
                  <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7" />
                </svg>
              </span>
            </h1>
            <p className="mx-auto mt-5 mb-7 max-w-[58ch] text-[clamp(1.02rem,1.6vw,1.2rem)] leading-relaxed text-white/80">
              Daycare, walking, grooming and boarding. Your services, your prices, your approvals, your Dog Bus, your team — and an app for owners with your name on it, all in one system built by a licensed daycare.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <StartTrialLink className="btn btn-gold btn-lg justify-center" />
              {showBookDemo && (
                <BookDemoButton slug={BOOK_DEMO_FORM_SLUG} className="btn btn-outline-w btn-lg justify-center">Book a Demo</BookDemoButton>
              )}
            </div>
          </div>

          {/* The admin, looping through a real week: month, day, week,
              one person's week, the stays, routes, messages, money. */}
          <div className="rev d2 relative mx-auto mt-10 max-w-[1080px] md:mt-14">
            <p className="mb-3 text-center font-caveat text-body-lg text-gold-soft md:text-xl">
              Your Monday morning, whatever you run
            </p>
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_28px_70px_rgba(0,20,24,0.45)] md:rounded-3xl md:shadow-[0_44px_110px_rgba(0,20,24,0.5)]">
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

      {/* ── Sticky feature nav ───────────────────────────────── */}
      <FeatureNav />

      {/* ════════ 1–4 · Why daycares switch ════════ */}
      <div className={`bg-white ${band}`}>
        <div className="max-w-[1200px] mx-auto">
          <CategoryHeader
            title="Why daycares switch"
            desc="Bookings, your own app, invoicing and the Dog Bus: the jobs that eat most of the week, handled first."
          />

          <Feature
            id="bookings"
            feature="bookings"
            eyebrow="Bookings"
            plan="every"
            title="Owners book themselves. You decide what's confirmed."
            lead="A 24/7 booking portal with your services, prices and rules built in. Requests land in one approval queue instead of your texts, DMs and voicemail — and nothing is confirmed until you say so, unless you've told it to auto-accept."
            bullets={[
              "One queue for every booking and membership request",
              "Auto-accept for the services you never need to check",
              "Recurring bookings written into the diary a year ahead",
              "Alerts for new bookings, new owners and membership requests",
            ]}
          >
            <BookingsShowcase />
          </Feature>

          <Feature
            id="owner-app"
            feature="ownerApp"
            eyebrow="Branded owner app"
            plan="every"
            flip
            title="Your own app, under your own name."
            lead="Owners add your portal to their home screen and it opens with your logo, your name and your colour. It's where they request bookings and memberships, keep their pet's details current and settle invoices — and every request still comes back to you."
            bullets={[
              "Your logo, name and brand colour, set once",
              "Booking and membership requests, recurring days and pet details",
              "Invoices, card payments and Direct Debit in the Billing tab",
              "Opens from the home screen — no app store, nothing to build",
            ]}
          >
            <BrandedAppShowcase />
          </Feature>

          <Feature
            id="invoicing"
            feature="payments"
            eyebrow="Invoicing & payments"
            plan="every"
            title="Invoices raise themselves. Direct Debit does the chasing."
            lead="Charges come off the bookings you actually took. Raise the month's invoices for every owner in one go, then let card payments and Direct Debit collect — with Xero kept in step if that's where your books live."
            bullets={[
              "Every owner invoiced from real bookings, in one run",
              "Card payments through Stripe, Direct Debit through GoCardless",
              "See who's opened, who's paid and what's still owed",
              "Credits and deposits taken off the next invoice automatically",
            ]}
          >
            <InvoicingShowcase />
          </Feature>

          <Feature
            id="routes"
            feature="routes"
            eyebrow="Routes & driver portal"
            plan="thrive"
            flip
            title="Plan the Dog Bus once. Drivers run it from their phone."
            lead="Drag dogs onto morning and evening routes, optimise the stop order, and give each driver a portal of their own. Every stop ticks off as they go, so you always know which dog is on which Dog Bus — and who last had them."
            bullets={[
              "Default routes for your regular runs, optimised in one tap",
              "A driver portal with collection times, notes and one-tap check-offs",
              "Live tracking, plus Google Maps, Waze and Apple Maps links",
            ]}
          >
            <RoutesShowcase />
          </Feature>
        </div>
      </div>

      {/* ════════ 5–8 · Running the day ════════ */}
      <div className={`bg-cream ${band}`}>
        <div className="max-w-[1200px] mx-auto">
          <CategoryHeader
            title="Running the day"
            desc="Talking to owners, staying inside your licence, knowing who's in, and how each dog is getting on."
          />

          <Feature
            id="messages"
            feature="messages"
            eyebrow="Messages"
            plan="thrive"
            title="Every conversation in one place."
            lead="Owners message you from their app, drivers join the thread on the days they drive, and your whole team works from one inbox. It replaces three WhatsApp accounts, a personal phone and a Facebook page nobody checks."
            bullets={[
              "Every reply signed by whoever sent it, with typing and read receipts",
              "Drivers join the owner's thread on the days they drive",
              "Broadcasts to every owner by push, with email for anyone who doesn't open it",
            ]}
          >
            <LiveChatShowcase />
          </Feature>

          <Feature
            id="capacity"
            feature="compliance"
            eyebrow="Capacity & DEFRA"
            plan="every"
            onlyOnGenera
            flip
            title="Stay inside your licence. Automatically."
            lead="Set a daily limit for each service and Genera holds you to it. Once a day is full, new bookings become waitlist requests for you to approve — so you never slip over your DEFRA-licensed numbers by accident."
            bullets={[
              "A daily cap for every service, tied to your licence",
              "Full days flagged on every calendar",
              "Waitlist requests instead of accidental overbooking",
            ]}
          >
            <CapacityAnimation />
          </Feature>

          <Feature
            id="daily-schedule"
            feature="dailySchedule"
            eyebrow="Daily schedule"
            plan="every"
            title="Know exactly who's in today."
            lead="The daily schedule is the control room: every dog, service, collection and drop-off for the day on one screen, with the booking button right there when someone rings."
            bullets={[
              "Every booking for the day, in one list",
              "Collections and drop-offs filtered out in a tap",
              "Create bookings from the same screen",
            ]}
          >
            <DailyScheduleShowcase />
          </Feature>

          <Feature
            id="assessments"
            feature="assessments"
            eyebrow="Assessments & report cards"
            plan="grow"
            flip
            title="Scored in the yard. Read on the sofa."
            lead="Pick a template — first day, development, behaviour, health or swim — rate each question on a phone while the dog's in front of you, add photos, and send the owner a branded report card instead of a vague text."
            bullets={[
              "Templates for first days, development, behaviour, health and swimming",
              "Star ratings, staff notes and photos, saved as a draft until you're ready",
              "A branded report card, emailed and kept in the owner's app",
            ]}
          >
            <AssessmentsShowcase />
          </Feature>
        </div>
      </div>

      {/* ════════ 9–11 · Running the business ════════ */}
      <div className={`bg-white ${band}`}>
        <div className="max-w-[1200px] mx-auto">
          <CategoryHeader
            title="Running the business"
            desc="The money, the records and the team behind them."
          />

          <Feature
            id="finance"
            feature="finance"
            eyebrow="Finance & forecast"
            plan="grow"
            title="Know exactly where the money is."
            lead="What you've invoiced, what's still owed, what the diary is worth for the next six months, and what your team costs to run — on one screen, without a spreadsheet."
            bullets={[
              "Invoiced, paid, outstanding and unbilled for any period",
              "A six-month forecast from the bookings already in the diary",
              "Salaries against revenue, so you know what the team costs",
            ]}
          >
            <FinanceAnimation />
          </Feature>

          <Feature
            id="records"
            feature="records"
            eyebrow="Pet records & compliance"
            plan="every"
            flip
            title="Every dog's details, ready when you need them."
            lead="Feeding notes, vet and emergency contacts, vaccinations, behaviour and incidents — kept against the dog, visible to anyone on your team, with a warning before a vaccination runs out."
            bullets={[
              "Behavioural, logistic and health records kept together",
              "Vaccination expiry warnings, with reminders when you choose",
              "A booking activity log of who changed what, and when",
            ]}
          >
            <RecordsAnimation />
          </Feature>

          <Feature
            id="team"
            feature="team"
            eyebrow="Team & rota"
            plan="every"
            title="Your team, sorted."
            lead="The weekly rota, time off and salaries — on every plan, whatever you pay. Know who's in, who's driving, and what everyone costs."
            bullets={[
              "A weekly rota with each day's headcount",
              "Holiday, sick and in-lieu requests with approvals and allowances",
              "Hourly and salaried pay, totalled for the month",
            ]}
          >
            <TeamShowcase />
          </Feature>
        </div>
      </div>

      {/* ════════ Also in the box ════════ */}
      <div className={`bg-cream ${band} pb-16 md:pb-24`}>
        <div className="max-w-[1200px] mx-auto">
          <CategoryHeader
            title="Also in the box"
            desc="The rest of what comes with Genera, and what's on the way."
          />
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
            {EXTRAS.map(({ feature, title, body, badge, muted }, i) => (
              <div
                key={title}
                className={`rev d${i + 1} rounded-2xl border border-cream-dark p-6 transition-colors hover:border-[color:var(--accent-edge)] md:p-7`}
                style={featureCardStyle(feature, "#fff")}
              >
                <div className="flex items-center justify-between gap-3">
                  <FeatureIcon feature={feature} />
                  <span className={`${s.featPlan} ${muted ? s.featPlanMuted : ""}`}>{badge}</span>
                </div>
                <h3 className="mt-4 font-massilia text-lg font-bold text-forest">{title}</h3>
                <p className="mt-2 text-meta leading-relaxed text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="bg-forest-dark px-8 py-[86px] text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="text-heading-mid !text-white">
            Run the daycare you already built — without rebuilding your admin every week.
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-white/80 leading-relaxed">
            Bookings, your own owner app, invoicing, routes, messages, records and the rota — in one system built around real pet care.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <StartTrialLink className="btn btn-gold btn-lg" />
            {showBookDemo && (
              <BookDemoButton slug={BOOK_DEMO_FORM_SLUG} className="btn btn-outline-w btn-lg">Book a Demo</BookDemoButton>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
