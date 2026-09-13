"use client";

import Image from "next/image";
import { useEffect, useState, type ComponentType } from "react";
import {
  BanknotesIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  HomeSolidIcon,
  MoonIcon,
  PawPrintIcon,
  PlusIcon,
  SunIcon,
  TruckIcon,
  UserIcon,
} from "./icons";

/* ============================================================
   The owner portal, as a dog owner sees it on their phone.

   Rebuilt from the Genera app's client home, bottom nav and
   portal-theme CSS, so the only invented thing is the data.
   Branding behaves the way it does in the product: the daycare's
   colour fills the bottom nav, the active tab stays amber, and
   the logo and name sit in the frosted top bar.

   The phone screen is laid out at a real 390×844 and scaled down
   with --s, so every size inside it reads like the device.
   ============================================================ */

const PET_PHOTO = "/daycare/dog1.jpg";

/* Duncan's Dog Co is real (the founders' own daycare). The other three
   are made up, to show the same portal wearing another daycare's name,
   logo and colour. */
type Brand = { name: string; colour: string; Logo: ComponentType };
const BRANDS: Brand[] = [
  { name: "Duncan's Dog Co", colour: "#111111", Logo: DuncansLogo },
  { name: "Hound Haven", colour: "#1f5c45", Logo: HoundHavenLogo },
  { name: "Harbour Hounds", colour: "#1e3a8a", Logo: HarbourHoundsLogo },
  { name: "Plum Tree Pups", colour: "#6b2152", Logo: PlumTreePupsLogo },
];

const CYCLE_MS = 3200;

/* September 2026, Monday first. Milo is in Mon, Wed and Thu, with a
   sleepover on top of Friday the 25th. */
type Day = { d: number; inMonth: boolean; icons?: Array<"sun" | "moon"> };
const TODAY = 13;
const SELECTED = 16;
const DAYS: Day[] = [
  { d: 31, inMonth: false },
  ...Array.from({ length: 30 }, (_, i): Day => {
    const d = i + 1;
    const dow = d % 7; // 1 Sep 2026 is a Tuesday → 0 = Mon … 6 = Sun
    if (d === 25) return { d, inMonth: true, icons: ["sun", "moon"] };
    return { d, inMonth: true, icons: [0, 2, 3].includes(dow) ? ["sun"] : undefined };
  }),
  ...[1, 2, 3, 4].map((d) => ({ d, inMonth: false })),
];

function dayClass(day: Day) {
  if (!day.inMonth) return "bg-gray-50 text-gray-400";
  if (day.d === SELECTED)
    return "z-10 bg-[#ffa800] font-bold text-forest ring-2 ring-inset ring-[#ffa800]/80";
  if (day.d === TODAY) return "bg-[#fff4de] font-bold text-forest";
  return "bg-white text-forest";
}

const TABS: Array<{ label: string; Icon: ComponentType<{ className?: string }>; active?: boolean }> = [
  { label: "Home", Icon: HomeSolidIcon, active: true },
  { label: "Pets", Icon: PawPrintIcon },
  { label: "Billing", Icon: BanknotesIcon },
  { label: "Chat", Icon: ChatBubbleLeftRightIcon },
  { label: "Profile", Icon: UserIcon },
];

export default function BrandedAppShowcase() {
  const [brand, setBrand] = useState(0);
  const [picked, setPicked] = useState(false);

  // Walk through the daycares until someone picks one themselves.
  useEffect(() => {
    if (picked) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setBrand((b) => (b + 1) % BRANDS.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [picked]);

  const current = BRANDS[brand];

  return (
    <div className="relative mx-auto flex w-full max-w-[580px] flex-col items-center">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[4%] top-[6%] bottom-[18%] rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-teal-soft"
      />

      <div className="relative">
        <Phone brand={current} />

        {/* On the owner's home screen */}
        <div
          aria-hidden
          className="absolute top-[16%] -left-[122px] hidden -rotate-6 animate-[var(--animate-illust-float)] sm:block"
        >
          <div className="flex w-[104px] flex-col items-center rounded-2xl bg-white/90 px-3 pt-3 pb-2.5 shadow-[0_12px_30px_rgba(0,62,69,0.16)] ring-1 ring-black/5 backdrop-blur">
            <BrandMark brand={current} className="h-[60px] w-[60px] rounded-[15px]" />
            <span
              key={current.name}
              className="mt-1.5 text-center text-[11px] leading-tight font-medium text-ink motion-safe:animate-[brandIn_0.5s_ease_both]"
            >
              {current.name}
            </span>
          </div>
          <span className="mt-2 block text-center font-caveat text-lg leading-none text-forest">
            on their
            <br />
            home screen
          </span>
        </div>

        {/* Photo drop from the day */}
        <div
          aria-hidden
          className="absolute -right-[150px] bottom-[21%] hidden rotate-3 animate-[var(--animate-illust-float)] [animation-delay:1.4s] sm:block"
        >
          <div className="flex w-[212px] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
            <span className="relative h-12 w-12 shrink-0">
              <Image
                src={PET_PHOTO}
                alt=""
                fill
                sizes="48px"
                className="rounded-xl object-cover object-top"
              />
              <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#ffa800] px-1 text-[10px] font-bold text-forest ring-2 ring-white">
                3
              </span>
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[13px] leading-tight font-semibold text-forest">
                New photos of Milo
              </span>
              <span className="mt-0.5 block text-[12px] leading-tight text-gray-500">
                From today at daycare
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex items-center gap-3 rounded-full border border-cream-dark bg-white py-2 pr-3 pl-4 shadow-[0_4px_14px_rgba(0,62,69,0.06)]">
        <span className="font-caveat text-lg leading-none text-forest">Try another daycare</span>
        <div
          role="group"
          aria-label="Preview the app as another daycare"
          className="flex items-center gap-2"
        >
          {BRANDS.map((b, i) => (
            <button
              key={b.name}
              type="button"
              aria-label={b.name}
              title={b.name}
              aria-pressed={i === brand}
              onClick={() => {
                setPicked(true);
                setBrand(i);
              }}
              className={`cursor-pointer rounded-full ring-2 ring-offset-2 transition ${
                i === brand ? "ring-gold" : "ring-transparent hover:ring-teal-mid"
              }`}
            >
              <BrandMark brand={b} className="h-7 w-7 rounded-full" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Phone({ brand }: { brand: Brand }) {
  return (
    <div
      role="img"
      aria-label={`The ${brand.name} owner app on a phone: a booking calendar for September, a confirmed daycare day for Milo, and a bottom menu in the daycare's brand colour.`}
      className="relative rounded-[46px] bg-[#101418] p-[9px] shadow-[0_30px_60px_rgba(0,62,69,0.28),inset_0_0_0_1.5px_rgba(255,255,255,0.08)] [--s:0.74] sm:[--s:0.8]"
    >
      <div
        aria-hidden
        className="relative overflow-hidden rounded-[38px] bg-white"
        style={{ width: "calc(390px * var(--s))", height: "calc(844px * var(--s))" }}
      >
        <div
          className="absolute top-0 left-0 h-[844px] w-[390px] origin-top-left text-left"
          style={{ transform: "scale(var(--s))" }}
        >
          <StatusBar />

          {/* Frosted top bar: the daycare's logo and name */}
          <div className="absolute inset-x-0 top-0 z-40 flex items-center gap-[11px] border-b border-black/5 bg-white/70 px-[18px] pt-[54px] pb-[9px] backdrop-blur-lg">
            <BrandMark brand={brand} className="h-[45px] w-[45px] rounded-[13px]" />
            <span
              key={brand.name}
              className="truncate text-[18px] font-semibold tracking-tight text-forest motion-safe:animate-[brandIn_0.5s_ease_both]"
            >
              {brand.name}
            </span>
            <span className="ml-auto flex gap-[9px]">
              <span className="relative grid h-[45px] w-[45px] place-items-center rounded-[13px] bg-white/70 text-forest ring-1 ring-black/5">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
                <span className="absolute -top-[5px] -right-[5px] grid h-[19px] min-w-[19px] place-items-center rounded-full bg-rose-500 px-[5px] text-[11px] font-bold text-white ring-2 ring-white">
                  1
                </span>
              </span>
              <span className="grid h-[45px] w-[45px] place-items-center rounded-[13px] bg-white/70 text-forest ring-1 ring-black/5">
                <EllipsisHorizontalIcon className="h-6 w-6" />
              </span>
            </span>
          </div>

          {/* Home */}
          <div className="absolute inset-x-0 top-0 px-[18px] pt-[122px]">
            <div className="font-massilia text-[22px] font-semibold tracking-tight text-forest">
              Welcome, Amanda
            </div>

            <div className="mt-[6px] flex items-center justify-between gap-3 border-b border-gray-100 pb-[16px]">
              <div className="min-w-0">
                <div className="font-massilia text-[27px] leading-tight font-bold tracking-tight text-forest">
                  September 2026
                </div>
                <div className="mt-[4px] text-[14.5px] leading-snug font-medium text-gray-500">
                  Plan your bookings and review your schedule.
                </div>
              </div>
              <div className="flex shrink-0 items-center rounded-[13px] bg-gray-100/60 p-[4px] text-gray-500">
                <span className="grid place-items-center rounded-[9px] p-[9px]">
                  <ChevronLeftIcon className="h-[22px] w-[22px]" />
                </span>
                <span className="grid place-items-center rounded-[9px] p-[9px]">
                  <ChevronRightIcon className="h-[22px] w-[22px]" />
                </span>
              </div>
            </div>

            <div className="mt-[14px] flex w-full items-center justify-center gap-2 rounded-[13px] bg-[#ffa800] px-4 py-[12px] text-[15.5px] font-semibold text-forest shadow-lg shadow-[#ffa800]/20">
              <PlusIcon className="h-[22px] w-[22px]" />
              Create a booking
            </div>

            <div className="mt-[14px] overflow-hidden rounded-[18px] bg-white shadow-xl ring-1 shadow-gray-200/50 ring-gray-100">
              <div className="grid grid-cols-7 border-b border-gray-100 py-[10px] text-center text-[10.5px] font-bold tracking-wider text-gray-400 uppercase">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-100">
                {DAYS.map((day, i) => (
                  <div
                    key={i}
                    className={`flex h-[50px] flex-col items-center justify-center ${dayClass(day)}`}
                  >
                    <span className="text-[15px] leading-none">{day.d}</span>
                    {day.icons && (
                      <span className="mt-[5px] flex gap-[2px]">
                        {day.icons.map((icon) =>
                          icon === "sun" ? (
                            <SunIcon key={icon} className="h-[11px] w-[11px] text-amber-600" />
                          ) : (
                            <MoonIcon key={icon} className="h-[11px] w-[11px] text-indigo-700" />
                          ),
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-[22px] flex items-center gap-2 font-massilia text-[19px] font-bold text-forest">
              <ClockIcon className="h-[22px] w-[22px] text-[#ffa800]" />
              Bookings for 16 Sep
            </div>

            <div className="mt-[12px] overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-[0_1px_2px_rgba(28,25,23,.05),0_1px_3px_rgba(28,25,23,.05)]">
              <div className="flex items-center gap-3 border-b border-[#f1efed] bg-[#faf9f7] px-4 py-[14px]">
                <span className="relative h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full">
                  <Image src={PET_PHOTO} alt="" fill sizes="42px" className="object-cover object-top" />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-[#1c1917]">Milo</span>
                  <span className="flex items-center gap-1.5 text-[13px] text-[#78716c]">
                    <SunIcon className="h-[13px] w-[13px] text-amber-600" />
                    Daycare
                  </span>
                </span>
              </div>
              <BookingRow Icon={CalendarDaysIcon} label="Date" value="Wed 16 Sep · 08:00" />
              <BookingRow Icon={TruckIcon} label="Transport" value="Collection & drop-off" />
              <div className="flex items-center justify-between gap-[14px] px-4 py-[11px]">
                <span className="inline-flex items-center gap-[7px] text-[13px] text-[#78716c]">
                  <CheckCircleIcon className="h-[15px] w-[15px]" />
                  Status
                </span>
                <span className="inline-flex items-center gap-[5px] rounded-full bg-[#ecfdf5] px-[10px] py-[3px] text-[12px] font-bold text-[#047857]">
                  <CheckCircleIcon className="h-[13px] w-[13px]" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Content scrolls under the nav; fade it so the bar reads cleanly */}
          <span className="absolute inset-x-0 bottom-0 z-30 h-[150px] bg-gradient-to-t from-white via-white/90 to-transparent" />

          {/* Floating bottom nav, filled with the brand colour */}
          <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[46px]">
            <div
              className="w-full overflow-hidden rounded-full border transition-colors duration-700"
              style={{ background: brand.colour, borderColor: "rgba(255,255,255,.14)" }}
            >
              <div className="flex items-stretch justify-around gap-1 px-2 py-1.5">
                {TABS.map(({ label, Icon, active }) => (
                  <div
                    key={label}
                    className={`flex flex-1 flex-col items-center justify-center gap-[3px] rounded-full px-2 py-[7px] text-[11px] ${
                      active ? "bg-[#ffa800] text-forest" : "text-white/70"
                    }`}
                  >
                    <Icon className={`h-[22px] w-[22px] ${active ? "" : "text-white/60"}`} />
                    <span className="leading-none font-medium tracking-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <span className="absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

/* A daycare's logo on its brand colour — the top bar, the home-screen
   icon and the picker all use it. Keyed so a swap fades the new logo in. */
function BrandMark({ brand, className }: { brand: Brand; className: string }) {
  const { Logo } = brand;
  return (
    <span
      className={`block shrink-0 overflow-hidden ring-1 ring-black/5 transition-colors duration-700 ${className}`}
      style={{ background: brand.colour }}
    >
      <span
        key={brand.name}
        className="block h-full w-full motion-safe:animate-[brandIn_0.5s_ease_both]"
      >
        <Logo />
      </span>
    </span>
  );
}

/* ── Daycare logos ─────────────────────────────────────────── */

function DuncansLogo() {
  return (
    <Image
      src="/images/duncans-dog-co-logo.png"
      alt=""
      width={104}
      height={104}
      className="block h-full w-full object-cover"
    />
  );
}

/* The paw from the site's eyebrow glyph, drawn at (x, y) and `size` px. */
function Paw({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 24})`} fill={fill}>
      <circle cx="5.5" cy="11" r="2.2" />
      <circle cx="9.5" cy="6" r="2.2" />
      <circle cx="14.5" cy="6" r="2.2" />
      <circle cx="18.5" cy="11" r="2.2" />
      <path d="M12 11.5c-3 0-5.5 2.5-5.5 5.5 0 1.5 1 3 2.5 3.5 1 0 2-.5 3-.5s2 .5 3 .5c1.5-.5 2.5-2 2.5-3.5 0-3-2.5-5.5-5.5-5.5z" />
    </g>
  );
}

function HoundHavenLogo() {
  return (
    <svg viewBox="0 0 64 64" className="block h-full w-full">
      <rect width="64" height="64" fill="#1f5c45" />
      <path
        d="M13 31 32 15l19 16"
        fill="none"
        stroke="#f4efe3"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 28v18a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V28"
        fill="none"
        stroke="#f4efe3"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <Paw x={23} y={27} size={18} fill="#ffc857" />
    </svg>
  );
}

function HarbourHoundsLogo() {
  return (
    <svg viewBox="0 0 64 64" className="block h-full w-full">
      <rect width="64" height="64" fill="#1e3a8a" />
      <g fill="#ffffff">
        <circle cx="19" cy="23" r="5" />
        <circle cx="19" cy="31" r="5" />
        <circle cx="45" cy="23" r="5" />
        <circle cx="45" cy="31" r="5" />
        <rect x="19" y="22.5" width="26" height="9" rx="2" />
      </g>
      <path
        d="M14 44q4.5-4 9 0t9 0 9 0 9 0"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlumTreePupsLogo() {
  return (
    <svg viewBox="0 0 64 64" className="block h-full w-full">
      <rect width="64" height="64" fill="#f8e7ef" />
      <path d="M32 19v-6" stroke="#3f6212" strokeWidth="3" strokeLinecap="round" />
      <path d="M33 15c3-5 9-6.5 13.5-4.5-2 5.5-8.5 7.5-13.5 4.5z" fill="#65a30d" />
      <circle cx="32" cy="36" r="17" fill="#6b2152" />
      <Paw x={23} y={27} size={18} fill="#f8e7ef" />
    </svg>
  );
}

function BookingRow({
  Icon,
  label,
  value,
}: {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-[14px] border-b border-[#f1efed] px-4 py-[11px]">
      <span className="inline-flex items-center gap-[7px] text-[13px] text-[#78716c]">
        <Icon className="h-[15px] w-[15px]" />
        {label}
      </span>
      <span className="text-right text-[13.5px] font-semibold text-[#44403c]">{value}</span>
    </div>
  );
}

function StatusBar() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 z-50 flex h-[54px] items-center justify-between px-[34px] pt-[6px] text-[16px] font-semibold text-black">
        <span>9:41</span>
        <span className="flex items-center gap-[6px]">
          <svg viewBox="0 0 18 12" className="h-[12px] w-[18px]" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
            <rect x="10" y="3" width="3" height="9" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </svg>
          <svg viewBox="0 0 17 12" className="h-[12px] w-[17px]" fill="currentColor">
            <path d="M8.5 2.3c2.3 0 4.4.9 6 2.4l1.1-1.1A10 10 0 0 0 8.5.7 10 10 0 0 0 1.4 3.6l1.1 1.1a8.4 8.4 0 0 1 6-2.4Zm0 3.3c1.4 0 2.7.5 3.7 1.4l1.1-1.1a7 7 0 0 0-9.6 0l1.1 1.1c1-.9 2.3-1.4 3.7-1.4Zm0 3.3c.6 0 1.1.2 1.5.6L8.5 11 7 9.5c.4-.4.9-.6 1.5-.6Z" />
          </svg>
          <svg viewBox="0 0 27 13" className="h-[13px] w-[27px]">
            <rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4" />
            <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
            <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45" />
          </svg>
        </span>
      </div>
      <span className="absolute top-[11px] left-1/2 z-50 h-[35px] w-[122px] -translate-x-1/2 rounded-full bg-black" />
    </>
  );
}
