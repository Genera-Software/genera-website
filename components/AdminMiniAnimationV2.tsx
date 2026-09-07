"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   Genera admin, animated — v2.

   Built against the live app (Genera Demo, 7 Sep 2026) rather than
   the docs. The frame is the real chrome; the loop walks the views
   a real week actually passes through, including the two screens
   that carry walkers, groomers and boarders: the service list and
   the service-provider calendar.

   v1 (components/AdminMiniAnimation.tsx) is untouched.
   ============================================================ */

const CANVAS_W = 1200;
const CANVAS_H = 680;
const SIDEBAR_W = 150;
const TOPBAR_H = 44;
const DURATION_MS = 27000;

type ViewKey =
  | "monthly"
  | "services"
  | "daily"
  | "schedule"
  | "provider"
  | "boarding"
  | "routes"
  | "messages"
  | "forecast";

/* Ordered the way you actually move through the week: the month,
   then today, then the week, then one person's week, then the
   stays. Logistics, then talking to owners, then the money. */
const VIEW_ORDER: ViewKey[] = [
  "monthly",
  "daily",
  "schedule",
  "provider",
  "boarding",
  "routes",
  "messages",
  "services",
  "forecast",
];

/* Views that sit under the Dashboard's Monthly/Daily/Schedule/Map toggle. */
const DASH_VIEWS: ViewKey[] = ["monthly", "daily", "schedule"];

type ServiceKey =
  | "daycare"
  | "sleepover"
  | "walk"
  | "groom"
  | "swim"
  | "meet";

const SERVICE_LABEL: Record<ServiceKey, string> = {
  daycare: "Daycare",
  sleepover: "Sleepover",
  walk: "Walk",
  groom: "Groom",
  swim: "Swim",
  meet: "Meet & Greet",
};

function useLoop(duration: number, paused: boolean) {
  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (paused) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      setT(((now - startRef.current) % duration) / duration);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, paused]);
  return t;
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const money = (n: number) =>
  "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── icons ────────────────────────────────────────────────── */
type IconProps = { className?: string; color?: string };

const SunIcon = ({ className, color = "#E8A33D" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <circle cx="8" cy="8" r="2.6" fill={color} />
    <g stroke={color} strokeWidth="1.3" strokeLinecap="round">
      <path d="M8 1.6v1.5M8 13v1.4M14.4 8H13M3 8H1.6M12.5 3.5l-1 1M5.5 11.5l-1 1M12.5 12.5l-1-1M5.5 4.5l-1-1" />
    </g>
  </svg>
);
const MoonIcon = ({ className, color = "#4338CA" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M11.5 11A5 5 0 1 1 5 4.5a4 4 0 0 0 6.5 6.5Z" fill={color} />
  </svg>
);
const WalkIcon = ({ className, color = "#15803d" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <circle cx="9.2" cy="2.9" r="1.5" fill={color} />
    <path
      d="M8.8 5.2 7 7.4l1.9 1.6.6 4.4M8.9 9 6.4 11l-.9 2.4M10.7 6.4l2 1.1"
      stroke={color}
      strokeWidth="1.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ScissorsIcon = ({ className, color = "#DC2F5A" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <g stroke={color} strokeWidth="1.35" fill="none" strokeLinecap="round">
      <path d="M4.2 3 11 11.4M11.8 3 5 11.4" />
      <circle cx="4.1" cy="12.6" r="1.5" />
      <circle cx="11.9" cy="12.6" r="1.5" />
    </g>
  </svg>
);
const SwimIcon = ({ className, color = "#0891b2" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <circle cx="11" cy="4.4" r="1.4" fill={color} />
    <path
      d="M2.5 8.2c1.4-1 2.4-1 3.8 0M9.7 8.2c1.4-1 2.4-1 3.8 0M2.5 11.4c1.4-1 2.4-1 3.8 0M9.7 11.4c1.4-1 2.4-1 3.8 0M4.6 7.4 8 5.6l2.2 1.6"
      stroke={color}
      strokeWidth="1.3"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
const MeetIcon = ({ className, color = "#0284c7" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M3 11V6a2 2 0 0 1 2-2h4l3 3v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" stroke={color} strokeWidth="1.3" fill="none" />
    <path d="M9 4v3h3" stroke={color} strokeWidth="1.3" fill="none" />
  </svg>
);

const VanIcon = ({ className, color = "#fff" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path
      d="M1.5 5.5a1 1 0 0 1 1-1h5.5v6H2.5a1 1 0 0 1-1-1v-4Zm6.5-1h2.6l3.4 2.6v2.9H8v-5.5Z"
      fill={color}
    />
    <circle cx="5" cy="12" r="1.5" fill={color} />
    <circle cx="11.4" cy="12" r="1.5" fill={color} />
  </svg>
);

function ServiceIcon({ kind, className }: { kind: ServiceKey; className?: string }) {
  if (kind === "sleepover") return <MoonIcon className={className} />;
  if (kind === "walk") return <WalkIcon className={className} />;
  if (kind === "groom") return <ScissorsIcon className={className} />;
  if (kind === "swim") return <SwimIcon className={className} />;
  if (kind === "meet") return <MeetIcon className={className} />;
  return <SunIcon className={className} />;
}

/* ── interaction layer ────────────────────────────────────
   A pointer walks each screen, hovers a row and clicks
   something, numbers count up, and a wipe carries each view in.
   Coordinates are canvas space, 1200 x 680. */
type Beat = { at: number; x: number; y: number; click?: boolean };

const CURSOR: Record<ViewKey, Beat[]> = {
  monthly: [
    { at: 0.10, x: 1090, y: 72 },
    { at: 0.30, x: 257, y: 118, click: true },
    { at: 0.58, x: 240, y: 316, click: true },
    { at: 0.86, x: 700, y: 460 },
  ],
  services: [
    { at: 0.10, x: 980, y: 72 },
    { at: 0.34, x: 420, y: 218 },
    { at: 0.58, x: 420, y: 392 },
    { at: 0.84, x: 1144, y: 392, click: true },
  ],
  daily: [
    { at: 0.10, x: 1000, y: 72 },
    { at: 0.36, x: 430, y: 345 },
    { at: 0.62, x: 430, y: 512 },
    { at: 0.86, x: 1012, y: 512, click: true },
  ],
  schedule: [
    { at: 0.10, x: 1020, y: 72 },
    { at: 0.40, x: 300, y: 330, click: true },
    { at: 0.70, x: 640, y: 420 },
    { at: 0.92, x: 900, y: 330 },
  ],
  provider: [
    { at: 0.10, x: 900, y: 60 },
    { at: 0.40, x: 300, y: 300, click: true },
    { at: 0.70, x: 640, y: 380 },
    { at: 0.92, x: 960, y: 300 },
  ],
  boarding: [
    { at: 0.10, x: 1040, y: 72 },
    { at: 0.36, x: 620, y: 240 },
    { at: 0.64, x: 500, y: 435, click: true },
    { at: 0.90, x: 500, y: 590 },
  ],
  routes: [
    { at: 0.10, x: 1080, y: 72 },
    { at: 0.36, x: 250, y: 300 },
    { at: 0.62, x: 520, y: 600, click: true },
    { at: 0.90, x: 900, y: 430 },
  ],
  messages: [
    { at: 0.10, x: 1020, y: 72 },
    { at: 0.36, x: 300, y: 214 },
    { at: 0.60, x: 300, y: 313 },
    { at: 0.86, x: 1146, y: 644, click: true },
  ],
  forecast: [
    { at: 0.10, x: 400, y: 400 },
    { at: 0.32, x: 1057, y: 72, click: true },
    { at: 0.62, x: 520, y: 430 },
    { at: 0.90, x: 1000, y: 330 },
  ],
};

/* Measured row bands in canvas space, so the row under the
   pointer is the one that lights up. */
const ROW_BANDS: Partial<Record<ViewKey, Array<[number, number]>>> = {
  services: Array.from({ length: 9 }, (_, i) => [131 + i * 58, 131 + (i + 1) * 58] as [number, number]),
  daily: [
    [326, 363],
    [363, 400],
    [400, 437],
    [457, 494],
    [494, 531],
    [551, 588],
    [608, 645],
  ],
  boarding: Array.from({ length: 7 }, (_, i) => [306 + i * 51.5, 306 + (i + 1) * 51.5] as [number, number]),
  messages: Array.from({ length: 6 }, (_, i) => [192 + i * 49.5, 192 + (i + 1) * 49.5] as [number, number]),
};

function cursorAt(view: ViewKey, p: number) {
  const beats = CURSOR[view];
  if (!beats?.length) return { x: 0, y: 0, opacity: 0, clicking: 0 };
  if (p < beats[0].at - 0.08) return { ...beats[0], opacity: 0, clicking: 0 };
  let a = beats[0];
  let b = beats[beats.length - 1];
  for (let i = 0; i < beats.length - 1; i++) {
    if (p >= beats[i].at && p <= beats[i + 1].at) {
      a = beats[i];
      b = beats[i + 1];
      break;
    }
  }
  const span = Math.max(0.0001, b.at - a.at);
  const k = easeInOut(clamp01((p - a.at) / span));
  const x = a.x + (b.x - a.x) * k;
  const y = a.y + (b.y - a.y) * k;
  // A click blooms just after the pointer lands on a clicking beat.
  let clicking = 0;
  for (const bt of beats) {
    if (!bt.click) continue;
    const d = p - bt.at;
    if (d >= 0 && d < 0.09) clicking = Math.max(clicking, 1 - d / 0.09);
  }
  const fade = p > 0.95 ? clamp01((1 - p) / 0.05) : 1;
  return { x, y, opacity: fade, clicking };
}

/* Which list row the pointer is resting on, so rows light up
   under it the way they would if you were really using it. */
function hoverRow(view: ViewKey, p: number) {
  const bands = ROW_BANDS[view];
  if (!bands) return -1;
  const c = cursorAt(view, p);
  if (c.opacity < 0.5) return -1;
  for (let i = 0; i < bands.length; i++) {
    if (c.y >= bands[i][0] && c.y < bands[i][1]) return i;
  }
  return -1;
}

const easeInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

/* Numbers roll up rather than appearing fully formed. */
function countUp(target: number, p: number, from = 0.02, dur = 0.35) {
  return Math.round(target * easeOut(clamp01((p - from) / dur)));
}

function Cursor({ view, p }: { view: ViewKey; p: number }) {
  const c = cursorAt(view, p);
  if (c.opacity <= 0) return null;
  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{ left: c.x, top: c.y, opacity: c.opacity }}
    >
      {c.clicking > 0 ? (
        <span
          className="absolute rounded-full bg-[#0C3A3F]/25"
          style={{
            width: 34 * (1 - c.clicking) + 8,
            height: 34 * (1 - c.clicking) + 8,
            left: -(34 * (1 - c.clicking) + 8) / 2 + 4,
            top: -(34 * (1 - c.clicking) + 8) / 2 + 4,
            opacity: c.clicking * 0.8,
          }}
        />
      ) : null}
      <svg viewBox="0 0 18 18" width="20" height="20" className="relative drop-shadow">
        <path
          d="M2 1.5 14.5 8 8.7 9.5 7 15.5 2 1.5Z"
          fill="#1f2937"
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* A soft wipe carries each view in, so screens hand over
   rather than cutting. */
function EnterWipe({ p }: { p: number }) {
  if (p > 0.16) return null;
  const k = clamp01(p / 0.16);
  return (
    <div
      className="pointer-events-none absolute inset-y-0 z-20"
      style={{
        left: `${k * 118 - 18}%`,
        width: "18%",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)",
        opacity: k < 0.9 ? 1 : (1 - k) * 10,
      }}
    />
  );
}

const TONE: Record<ServiceKey, string> = {
  daycare: "border-l-amber-400 bg-amber-50/80",
  sleepover: "border-l-indigo-500 bg-indigo-50/80",
  walk: "border-l-emerald-500 bg-emerald-50/80",
  groom: "border-l-rose-500 bg-rose-50/80",
  swim: "border-l-cyan-500 bg-cyan-50/80",
  meet: "border-l-sky-500 bg-sky-50/80",
};

/* ── chrome ───────────────────────────────────────────────── */
const navGlyph: Record<string, React.ReactNode> = {
  Dashboard: <path d="M2.5 6.5 8 2l5.5 4.5V13a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V6.5Z" />,
  Bookings: (
    <>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
    </>
  ),
  Owners: (
    <>
      <circle cx="8" cy="6" r="2.4" />
      <path d="M3.5 13.5a4.5 4.5 0 0 1 9 0" />
    </>
  ),
  Messages: <path d="M2.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6l-3 3v-3h-.5Z" />,
  Pets: (
    <>
      <ellipse cx="5" cy="6" rx="1.4" ry="1.8" />
      <ellipse cx="11" cy="6" rx="1.4" ry="1.8" />
      <path d="M8 8.5c2 0 3.4 1.5 3.4 2.9 0 1.1-1 1.7-2.2 1.7H6.8c-1.2 0-2.2-.6-2.2-1.7C4.6 10 6 8.5 8 8.5Z" />
    </>
  ),
  Reports: (
    <>
      <rect x="3" y="2.5" width="10" height="11" rx="1.5" />
      <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" />
    </>
  ),
  Team: (
    <>
      <circle cx="6" cy="6" r="2" />
      <path d="M2.5 13a3.5 3.5 0 0 1 7 0M11 4.3a2 2 0 0 1 0 3.9M11.5 13a3.6 3.6 0 0 0-1.2-2.6" />
    </>
  ),
  Routes: (
    <>
      <rect x="1.5" y="5" width="8" height="6" rx="1" />
      <path d="M9.5 7h2.5L14 9v2H9.5z" />
      <circle cx="4.5" cy="12" r="1.2" />
      <circle cx="11.5" cy="12" r="1.2" />
    </>
  ),
  Finance: (
    <>
      <rect x="2" y="4" width="12" height="8" rx="1.5" />
      <circle cx="8" cy="8" r="1.8" />
    </>
  ),
  Settings: (
    <>
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.8v1.6M8 12.6v1.6M14.2 8h-1.6M3.4 8H1.8M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7 3.6 3.6" />
    </>
  ),
  Switch: <path d="M2.5 5.5h9l-2-2M13.5 10.5h-9l2 2" />,
  Profile: (
    <>
      <circle cx="8" cy="5.6" r="2.3" />
      <path d="M3.6 13.2a4.4 4.4 0 0 1 8.8 0" />
    </>
  ),
  Schedule: (
    <>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3M6 9.5h4" />
    </>
  ),
};

function Glyph({ name, className = "h-3.5 w-3.5" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} shrink-0`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {navGlyph[name]}
    </svg>
  );
}

function PawLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <ellipse cx="9" cy="9" rx="3" ry="3.8" fill="#FFA800" />
      <ellipse cx="16" cy="6.6" rx="3" ry="4" fill="#FFA800" />
      <ellipse cx="23" cy="9" rx="3" ry="3.8" fill="#FFA800" />
      <path
        d="M16 13.5c4.2 0 7.5 3.2 7.5 6.3 0 2.4-2.1 3.7-4.7 3.7h-5.6c-2.6 0-4.7-1.3-4.7-3.7 0-3.1 3.3-6.3 7.5-6.3Z"
        fill="#FFA800"
      />
    </svg>
  );
}

const NAV: Array<{ label: string; badge?: number }> = [
  { label: "Dashboard" },
  { label: "Bookings", badge: 8 },
  { label: "Owners" },
  { label: "Messages" },
  { label: "Pets" },
  { label: "Reports" },
  { label: "Team" },
  { label: "Routes" },
];

function NavItem({ label, active, badge }: { label: string; active: boolean; badge?: number }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2.5 py-[6px] text-[11px] ${
        active ? "bg-[#FFA800] font-bold text-[#0C3A3F]" : "font-medium text-white/65"
      }`}
    >
      <Glyph name={label} />
      <span className="truncate">{label}</span>
      {badge ? (
        <span className="ml-auto rounded-full bg-red-500 px-1.5 text-[9px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function AdminSidebar({ active, sub }: { active: string; sub?: string }) {
  return (
    <div className="flex shrink-0 flex-col bg-[#0C3A3F] py-3" style={{ width: SIDEBAR_W }}>
      <div className="mb-4 flex flex-col items-center gap-1">
        <PawLogo />
        <span className="text-[10px] font-extrabold tracking-[0.18em] text-[#FFA800]">GENERA</span>
      </div>
      <div className="flex flex-col gap-[3px] px-2.5">
        {NAV.map((n) => (
          <NavItem key={n.label} label={n.label} active={n.label === active} badge={n.badge} />
        ))}
      </div>
      <div className="mx-2.5 my-2.5 border-t border-white/10" />
      <div className="flex flex-col gap-[3px] px-2.5">
        <NavItem label="Finance" active={active === "Finance" && !sub} />
        {["Billing", "Plans & Pricing", "Daycare Finance"].map((s) => (
          <div
            key={s}
            className={`ml-4 rounded-md px-2 py-[4px] text-[10px] ${
              sub === s ? "bg-[#FFA800] font-bold text-[#0C3A3F]" : "font-medium text-white/45"
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-1.5 px-2.5">
        <div className="flex items-center gap-2 text-[10px] font-medium text-white/55">
          <Glyph name="Switch" /> Switch Portal
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium text-white/55">
          <Glyph name="Settings" /> Settings
        </div>
      </div>
    </div>
  );
}

/* The service provider gets a portal with almost nothing in it. */
function ProviderSidebar() {
  return (
    <div className="flex shrink-0 flex-col bg-[#0C3A3F] py-3" style={{ width: SIDEBAR_W }}>
      <div className="mb-5 flex flex-col items-center gap-1">
        <PawLogo />
        <span className="text-[10px] font-extrabold tracking-[0.18em] text-[#FFA800]">GENERA</span>
      </div>
      <div className="flex flex-col gap-[3px] px-2.5">
        <NavItem label="Schedule" active />
        <NavItem label="Profile" active={false} />
      </div>
      <div className="mt-auto flex flex-col gap-1.5 px-2.5">
        <div className="flex items-center gap-2 text-[10px] font-medium text-white/55">
          <Glyph name="Switch" /> Switch to Admin Portal
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium text-white/55">
          <Glyph name="Profile" /> Sign out
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div
      className="flex shrink-0 items-center gap-3 border-b border-stone-200 bg-white px-4"
      style={{ height: TOPBAR_H }}
    >
      <div className="flex flex-1 items-center gap-2 text-[11.5px] text-stone-400">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" strokeLinecap="round" />
        </svg>
        Search pets and customers...
      </div>
      <div className="relative">
        <svg viewBox="0 0 16 16" className="h-4 w-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M4 6.5a4 4 0 0 1 8 0c0 3 1.2 4 1.2 4H2.8s1.2-1 1.2-4Z" />
          <path d="M6.6 13a1.6 1.6 0 0 0 2.8 0" />
        </svg>
        <span className="absolute -right-1.5 -top-1 rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
          17
        </span>
      </div>
      <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-stone-100 text-[9px] font-bold text-stone-500">
          JM
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-bold text-stone-800">Jess M.</div>
          <div className="text-[9.5px] text-stone-400">Fernlea Dog Co</div>
        </div>
      </div>
    </div>
  );
}

function Pills({
  items,
  active,
  gold,
}: {
  items: string[];
  active: string;
  gold?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl bg-white p-1 ring-1 ring-stone-200">
      {items.map((l) => (
        <span
          key={l}
          className={`rounded-lg px-2.5 py-1 text-[11px] ${
            l === active
              ? gold
                ? "bg-[#FFA800] font-bold text-[#0C3A3F]"
                : "bg-[#0C3A3F] font-bold text-white"
              : "font-semibold text-stone-500"
          }`}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

/* ── 1. Monthly ───────────────────────────────────────────── */
type Cell = {
  d: number;
  off?: boolean;
  today?: boolean;
  bookings?: number;
  services?: Array<[ServiceKey, number]>;
};

const CELLS: Cell[] = [
  { d: 31, off: true },
  { d: 1, bookings: 15, services: [["daycare", 12], ["walk", 3]] },
  { d: 2, bookings: 6, services: [["daycare", 4], ["groom", 2]] },
  { d: 3, bookings: 5, services: [["sleepover", 3], ["swim", 2]] },
  { d: 4, bookings: 18, services: [["daycare", 16], ["groom", 2]] },
  { d: 5, bookings: 9, services: [["walk", 6], ["groom", 3]] },
  { d: 6, bookings: 4, services: [["sleepover", 4]] },
  { d: 7, bookings: 23, today: true, services: [["daycare", 17], ["walk", 6]] },
  { d: 8, bookings: 21, services: [["daycare", 18], ["groom", 3]] },
  { d: 9, bookings: 20, services: [["daycare", 17], ["walk", 3]] },
  { d: 10, bookings: 8, services: [["groom", 5], ["swim", 3]] },
  { d: 11, bookings: 19, services: [["daycare", 15], ["walk", 4]] },
  { d: 12, bookings: 7, services: [["walk", 5], ["meet", 1]] },
  { d: 13, bookings: 4, services: [["sleepover", 4]] },
  { d: 14, bookings: 22, services: [["daycare", 17], ["walk", 5]] },
  { d: 15, bookings: 19, services: [["daycare", 16], ["groom", 3]] },
  { d: 16, bookings: 20, services: [["daycare", 17], ["swim", 3]] },
  { d: 17, bookings: 9, services: [["groom", 6], ["walk", 3]] },
  { d: 18, bookings: 18, services: [["daycare", 14], ["walk", 4]] },
  { d: 19, bookings: 6, services: [["walk", 4], ["groom", 2]] },
  { d: 20, bookings: 5, services: [["sleepover", 5]] },
  { d: 21, bookings: 21, services: [["daycare", 16], ["walk", 5]] },
  { d: 22, bookings: 18, services: [["daycare", 15], ["groom", 3]] },
  { d: 23, bookings: 20, services: [["daycare", 17], ["walk", 3]] },
  { d: 24, bookings: 8, services: [["groom", 5], ["swim", 3]] },
  { d: 25, bookings: 17, services: [["daycare", 14], ["walk", 3]] },
  { d: 26, bookings: 6, services: [["walk", 5], ["meet", 1]] },
  { d: 27, bookings: 4, services: [["sleepover", 4]] },
  { d: 28, bookings: 22, services: [["daycare", 17], ["walk", 5]] },
  { d: 29, bookings: 19, services: [["daycare", 16], ["groom", 3]] },
  { d: 30, bookings: 20, services: [["daycare", 17], ["swim", 3]] },
  { d: 1, off: true },
  { d: 2, off: true },
  { d: 3, off: true },
  { d: 4, off: true },
];

function MonthlyView({ p }: { p: number }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-3">
      <div className="grid shrink-0 grid-cols-7 rounded-t-lg border border-stone-200 bg-stone-50 text-center text-[9.5px] font-bold uppercase tracking-wider text-stone-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-1.5">
            {d}
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-5 gap-px rounded-b-lg border-x border-b border-stone-200 bg-stone-200">
        {CELLS.map((cell, i) => {
          const k = easeOut(clamp01((p - (0.02 + i * (0.26 / 35))) / 0.12));
          return (
            <div
              key={i}
              className={`relative min-w-0 overflow-hidden px-1.5 py-1 ${
                cell.off ? "bg-stone-50" : cell.today ? "bg-amber-50" : "bg-white"
              }`}
            >
              <div className="flex items-baseline justify-between gap-1">
                <span
                  className={`anim-tabular text-[11.5px] ${
                    cell.off
                      ? "font-medium text-stone-300"
                      : cell.today
                        ? "font-extrabold text-[#0C3A3F]"
                        : "font-semibold text-stone-700"
                  }`}
                >
                  {cell.d}
                </span>
                {!cell.off && cell.bookings ? (
                  <span
                    className="shrink-0 rounded-full bg-stone-100 px-1.5 text-[8px] font-semibold text-stone-500"
                    style={{ opacity: k }}
                  >
                    {cell.bookings} Bookings
                  </span>
                ) : null}
              </div>
              {cell.today && p > 0.6 ? (
                <span className="anim-today-pulse pointer-events-none absolute inset-0.5 rounded-md" />
              ) : null}
              {!cell.off && (
                <div className="mt-1 space-y-[3px]">
                  {cell.services?.map(([kind, n], idx) => {
                    const o = easeOut(clamp01(k - idx * 0.2));
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1 truncate text-[9.5px] font-semibold text-stone-700"
                        style={{ opacity: o, transform: `translateY(${(1 - o) * 3}px)` }}
                      >
                        <ServiceIcon kind={kind} className="h-2.5 w-2.5 shrink-0" />
                        <span className="truncate">
                          {n} {SERVICE_LABEL[kind]}
                          {n > 1 && kind !== "meet" ? "s" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex shrink-0 items-center gap-3 text-[9px] font-semibold text-stone-500">
        <span className="uppercase tracking-wider text-stone-400">Services</span>
        {(["daycare", "walk", "groom", "swim", "sleepover", "meet"] as ServiceKey[]).map((k) => (
          <span key={k} className="flex items-center gap-1">
            <ServiceIcon kind={k} className="h-2.5 w-2.5" /> {SERVICE_LABEL[k]}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 2. Services & pricing ────────────────────────────────── */
const SERVICES_ROWS: Array<{
  kind: ServiceKey;
  name: string;
  price: string;
  puppy?: string;
  tiered: boolean;
  approval: boolean;
  cap: string;
  slot?: string;
  closed?: string;
}> = [
  { kind: "walk", name: "60 Min Pack Walk", price: "£16.00", puppy: "£16.00", tiered: false, approval: false, cap: "8 / day", slot: "60 min" },
  { kind: "walk", name: "Solo Walk", price: "£22.00", puppy: "£22.00", tiered: false, approval: false, cap: "Unlimited", slot: "30 min" },
  { kind: "daycare", name: "Daycare", price: "£32.00", puppy: "£28.00", tiered: true, approval: false, cap: "24 / day" },
  { kind: "daycare", name: "Half Day Daycare", price: "£22.00", puppy: "£20.00", tiered: true, approval: false, cap: "24 / day" },
  { kind: "groom", name: "Full Groom", price: "£55.00", puppy: "£45.00", tiered: false, approval: false, cap: "6 / day", slot: "90 min" },
  { kind: "groom", name: "Nail Clipping", price: "£12.00", puppy: "£12.00", tiered: false, approval: false, cap: "10 / day", slot: "15 min" },
  { kind: "swim", name: "Hydro Swim", price: "£38.00", puppy: "£38.00", tiered: false, approval: true, cap: "1 / day", slot: "45 min" },
  { kind: "sleepover", name: "Boarding", price: "£42.00", tiered: true, approval: true, cap: "12 / day" },
  { kind: "meet", name: "Puppy Class", price: "£18.00", puppy: "£18.00", tiered: false, approval: false, cap: "8 / day", slot: "60 min", closed: "Wed" },
];

function Tick({ on }: { on: boolean }) {
  return on ? (
    <span className="text-[12px] font-bold text-emerald-600">✓</span>
  ) : (
    <span className="text-stone-300">—</span>
  );
}

function ServicesView({ p }: { p: number }) {
  const hovered = hoverRow("services", p);
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-3">
      <div className="grid shrink-0 grid-cols-[1.5fr_0.9fr_0.6fr_0.7fr_0.8fr_0.6fr_0.6fr_0.5fr] gap-x-2 border-b border-stone-200 pb-1.5 text-[8.5px] font-bold uppercase tracking-wide text-stone-400">
        <span>Service name</span>
        <span>Price</span>
        <span className="text-center">Tiered</span>
        <span className="text-center">Approval</span>
        <span className="text-center">Daily capacity</span>
        <span className="text-center">Timeslot</span>
        <span className="text-center">Closed</span>
        <span className="text-center">Status</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-around">
        {SERVICES_ROWS.map((r, i) => {
          const k = easeOut(clamp01((p - 0.03 - i * 0.045) / 0.25));
          return (
            <div
              key={r.name}
              className={`grid grid-cols-[1.5fr_0.9fr_0.6fr_0.7fr_0.8fr_0.6fr_0.6fr_0.5fr] items-center gap-x-2 rounded border-b border-stone-100 py-1.5 transition-colors ${
                hovered === i ? "bg-amber-50/70" : ""
              }`}
              style={{ opacity: k, transform: `translateY(${(1 - k) * 4}px)` }}
            >
              <span className="flex items-center gap-1.5 truncate text-[11px] font-semibold text-stone-800">
                <ServiceIcon kind={r.kind} className="h-3 w-3 shrink-0" />
                {r.name}
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-bold text-[#0C3A3F]">{r.price}</span>
                {r.puppy ? (
                  <span className="block text-[8.5px] text-stone-400">Puppy {r.puppy}</span>
                ) : null}
              </span>
              <span className="text-center">
                <Tick on={r.tiered} />
              </span>
              <span className="text-center">
                <Tick on={r.approval} />
              </span>
              <span className="text-center text-[10px] font-semibold text-stone-600">{r.cap}</span>
              <span className="text-center">
                {r.slot ? (
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-amber-100">
                    {r.slot}
                  </span>
                ) : (
                  <span className="text-stone-300">—</span>
                )}
              </span>
              <span className="text-center text-[9.5px] font-semibold text-stone-600">
                {r.closed ?? <span className="text-stone-300">—</span>}
              </span>
              <span className="flex justify-center">
                <span className="flex h-3.5 w-6 items-center rounded-full bg-emerald-500 px-0.5">
                  <span className="ml-auto h-2.5 w-2.5 rounded-full bg-white" />
                </span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 shrink-0 text-[9.5px] font-semibold text-stone-500">
        Every service sets its own price, capacity, slot length and closed days.
      </div>
    </div>
  );
}

/* ── 3. Daily run sheet ───────────────────────────────────── */
const DAILY_STATS: Array<[string, string, ServiceKey | null]> = [
  ["Pets", "23", "daycare"],
  ["Unassigned", "0", null],
  ["Sleepovers", "4", "sleepover"],
  ["Other services", "9", "groom"],
  ["Meet & Greet", "1", "meet"],
  ["Drivers", "3", null],
];

const DAILY_ROWS: Array<{ group: string; kind: ServiceKey; pet: string; owner: string; wk: number }> = [
  { group: "Daycare", kind: "daycare", pet: "Bramble", owner: "Amanda R.", wk: 3 },
  { group: "Daycare", kind: "daycare", pet: "Nala", owner: "Carole F.", wk: 5 },
  { group: "Daycare", kind: "daycare", pet: "Otis", owner: "Tom H.", wk: 3 },
  { group: "60 Min Pack Walk", kind: "walk", pet: "Pepper", owner: "Sam T.", wk: 4 },
  { group: "60 Min Pack Walk", kind: "walk", pet: "Milo", owner: "Priya N.", wk: 2 },
  { group: "Full Groom", kind: "groom", pet: "Bailey", owner: "Ruth E.", wk: 1 },
  { group: "Boarding", kind: "sleepover", pet: "Rex", owner: "Dev A.", wk: 2 },
];

function DailyView({ p }: { p: number }) {
  let lastGroup = "";
  const hovered = hoverRow("daily", p);
  return (
    <div className="flex min-h-0 flex-1 gap-3 px-4 pb-3">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="grid shrink-0 grid-cols-3 gap-2">
          {DAILY_STATS.map(([l, v, kind], i) => (
            <div
              key={l}
              className={`rounded-xl px-2.5 py-2 ring-1 ${
                i === 0 ? "bg-white ring-[#FFA800]" : "bg-white ring-stone-200"
              }`}
              style={{ opacity: easeOut(clamp01((p - 0.02 - i * 0.03) / 0.18)) }}
            >
              <div className="flex items-center gap-1.5">
                {kind ? (
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-stone-100">
                    <ServiceIcon kind={kind} className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-stone-100 text-[9px] font-bold text-stone-500">
                    ·
                  </span>
                )}
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-stone-400">{l}</span>
              </div>
              <div className="mt-0.5 text-[17px] font-extrabold leading-none text-[#0C3A3F]">
                {countUp(parseInt(v, 10), p, 0.02, 0.3)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white ring-1 ring-stone-200">
          <div className="grid shrink-0 grid-cols-[1.6fr_1.2fr_0.7fr_1fr_0.9fr] gap-2 border-b border-stone-100 px-3 py-1.5 text-[8.5px] font-bold uppercase tracking-wide text-stone-400">
            <span>Name</span>
            <span>Owner</span>
            <span className="text-center">Wk bookings</span>
            <span>Service</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            {DAILY_ROWS.map((r, i) => {
              const k = easeOut(clamp01((p - 0.08 - i * 0.05) / 0.25));
              const header = r.group !== lastGroup;
              lastGroup = r.group;
              return (
                <div key={r.pet} style={{ opacity: k }}>
                  {header ? (
                    <div className="bg-stone-50 px-3 py-[3px] text-[8.5px] font-bold uppercase tracking-wider text-stone-500">
                      {r.group}
                    </div>
                  ) : null}
                  <div
                    className={`grid grid-cols-[1.6fr_1.2fr_0.7fr_1fr_0.9fr] items-center gap-2 border-b border-stone-100 px-3 py-1 transition-colors ${
                      hovered === i ? "bg-amber-50/70" : ""
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
                      <span className="truncate text-[11px] font-bold text-stone-800">{r.pet}</span>
                    </span>
                    <span className="truncate text-[10.5px] text-stone-600">{r.owner}</span>
                    <span className="text-center">
                      <span className="rounded-full bg-stone-100 px-1.5 text-[9.5px] font-bold text-stone-600">
                        {r.wk}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 truncate text-[10.5px] font-semibold text-stone-700">
                      <ServiceIcon kind={r.kind} className="h-3 w-3 shrink-0" />
                      {SERVICE_LABEL[r.kind]}
                    </span>
                    <span className="flex justify-end gap-2 text-[9.5px] font-semibold text-stone-400">
                      Day Note <span className="text-stone-500">Edit</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex w-[190px] shrink-0 flex-col rounded-xl bg-white p-2.5 ring-1 ring-stone-200">
        <div className="mb-1.5 text-center text-[10px] font-bold text-[#0C3A3F]">September 2026</div>
        <div className="grid grid-cols-7 gap-y-1 text-center text-[8px] font-bold text-stone-400">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-y-1.5 text-center text-[9.5px] font-semibold text-stone-600">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
            <span
              key={d}
              className={
                d === 7
                  ? "mx-auto grid h-4 w-4 place-items-center rounded-full bg-[#FFA800] text-[9px] font-bold text-[#0C3A3F]"
                  : ""
              }
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-auto rounded-lg bg-[#0C3A3F]/5 px-2 py-1.5 text-[9px] font-semibold leading-snug text-[#0C3A3F]">
          Today&apos;s run sheet, grouped by the service each dog is booked in for.
        </div>
      </div>
    </div>
  );
}

/* ── 4. Schedule (whole business, week) ───────────────────── */
const WEEK_DAYS = [
  { d: "Mon", n: 7, today: true },
  { d: "Tue", n: 8 },
  { d: "Wed", n: 9 },
  { d: "Thu", n: 10 },
  { d: "Fri", n: 11 },
  { d: "Sat", n: 12 },
  { d: "Sun", n: 13 },
];
const WEEK_ALLDAY: Array<Array<[ServiceKey, string]>> = [
  [["daycare", "Daycare 17"], ["sleepover", "Sleepover 2"]],
  [["daycare", "Daycare 18"]],
  [["daycare", "Daycare 17"], ["sleepover", "Sleepover 3"]],
  [["daycare", "Daycare 14"]],
  [["daycare", "Daycare 15"], ["sleepover", "Sleepover 2"]],
  [["sleepover", "Sleepover 4"]],
  [["sleepover", "Sleepover 4"]],
];
const WEEK_TIMED: Array<{ day: number; kind: ServiceKey; label: string; top: number; h: number }> = [
  { day: 0, kind: "walk", label: "Pack Walk", top: 13, h: 7 },
  { day: 0, kind: "groom", label: "Full Groom", top: 27, h: 10 },
  { day: 1, kind: "walk", label: "Pack Walk", top: 13, h: 7 },
  { day: 1, kind: "groom", label: "Nail Clip", top: 34, h: 4 },
  { day: 1, kind: "swim", label: "Hydro Swim", top: 55, h: 6 },
  { day: 2, kind: "walk", label: "Pack Walk", top: 13, h: 7 },
  { day: 2, kind: "groom", label: "Full Groom", top: 41, h: 10 },
  { day: 3, kind: "groom", label: "Full Groom", top: 20, h: 10 },
  { day: 3, kind: "walk", label: "Solo Walk", top: 48, h: 4 },
  { day: 4, kind: "walk", label: "Pack Walk", top: 13, h: 7 },
  { day: 4, kind: "meet", label: "Puppy Class", top: 62, h: 7 },
  { day: 5, kind: "groom", label: "Full Groom", top: 27, h: 10 },
  { day: 6, kind: "walk", label: "Solo Walk", top: 34, h: 4 },
];

function ScheduleView({ p }: { p: number }) {
  const HOURS = ["6 am", "8 am", "10 am", "12 pm", "2 pm", "4 pm", "6 pm", "8 pm"];
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-3">
      <div className="grid shrink-0 grid-cols-[38px_repeat(7,1fr)] gap-1.5">
        <span />
        {WEEK_DAYS.map((d) => (
          <div key={d.n} className="pb-1 text-center">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-stone-400">{d.d}</div>
            <div
              className={`mx-auto mt-0.5 grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${
                d.today ? "bg-[#FFA800] text-[#0C3A3F]" : "text-stone-700"
              }`}
            >
              {d.n}
            </div>
          </div>
        ))}
      </div>

      <div className="grid shrink-0 grid-cols-[38px_repeat(7,1fr)] items-start gap-1.5 border-y border-stone-200 py-1">
        <span className="pt-1 text-right text-[7.5px] font-bold uppercase leading-tight text-stone-400">
          All day
        </span>
        {WEEK_ALLDAY.map((chips, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {chips.map(([kind, label], j) => (
              <span
                key={j}
                className={`flex items-center gap-1 truncate rounded border-l-[3px] px-1 py-0.5 text-[9px] font-semibold text-stone-700 ${TONE[kind]}`}
                style={{ opacity: easeOut(clamp01((p - 0.03 - i * 0.02 - j * 0.02) / 0.2)) }}
              >
                <ServiceIcon kind={kind} className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">{label}</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[38px_repeat(7,1fr)] gap-1.5 pt-1">
        <div className="flex flex-col justify-between text-right text-[8.5px] font-semibold text-stone-400">
          {HOURS.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {WEEK_DAYS.map((_, day) => (
          <div key={day} className="relative rounded-lg bg-white ring-1 ring-stone-200">
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <span
                key={g}
                className="absolute inset-x-0 border-t border-stone-100"
                style={{ top: `${(g / 7) * 100}%` }}
              />
            ))}
            {WEEK_TIMED.filter((b) => b.day === day).map((b, i) => {
              const k = easeOut(clamp01((p - 0.1 - day * 0.03 - i * 0.02) / 0.28));
              return (
                <div
                  key={i}
                  className={`absolute inset-x-0.5 overflow-hidden rounded border-l-[3px] px-1 py-0.5 ${TONE[b.kind]}`}
                  style={{ top: `${b.top}%`, height: `${b.h}%`, opacity: k }}
                >
                  <div className="flex items-center gap-1 truncate text-[8.5px] font-bold leading-tight text-stone-800">
                    <ServiceIcon kind={b.kind} className="h-2 w-2 shrink-0" />
                    <span className="truncate">{b.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 5. Service provider week ──────────────────────────────
   A groomer signs into their own portal and sees their own
   service only. No daycare, no boarding, no admin. */
const PROVIDER_BLOCKS: Array<{ day: number; label: string; pet: string; time: string; top: number; h: number }> = [
  { day: 0, label: "Full Groom", pet: "Milo", time: "09:00", top: 13, h: 11 },
  { day: 0, label: "Nail Clip", pet: "Bailey", time: "11:00", top: 27, h: 5 },
  { day: 0, label: "Full Groom", pet: "Nala", time: "13:30", top: 43, h: 11 },
  { day: 1, label: "Full Groom", pet: "Otis", time: "09:30", top: 16, h: 11 },
  { day: 1, label: "Puppy Trim", pet: "Pepper", time: "12:00", top: 33, h: 8 },
  { day: 1, label: "Nail Clip", pet: "Rex", time: "14:30", top: 50, h: 5 },
  { day: 2, label: "Full Groom", pet: "Bramble", time: "09:00", top: 13, h: 11 },
  { day: 2, label: "Full Groom", pet: "Poppy", time: "11:30", top: 30, h: 11 },
  { day: 2, label: "Nail Clip", pet: "Tilly", time: "14:00", top: 47, h: 5 },
  { day: 3, label: "Puppy Trim", pet: "Daisy", time: "10:00", top: 20, h: 8 },
  { day: 3, label: "Full Groom", pet: "Milo", time: "13:00", top: 40, h: 11 },
  { day: 4, label: "Full Groom", pet: "Rex", time: "09:30", top: 16, h: 11 },
  { day: 4, label: "Nail Clip", pet: "Nala", time: "12:00", top: 33, h: 5 },
  { day: 4, label: "Full Groom", pet: "Otis", time: "14:30", top: 50, h: 11 },
  { day: 5, label: "Full Groom", pet: "Pepper", time: "10:00", top: 20, h: 11 },
];

function ProviderView({ p }: { p: number }) {
  const HOURS = ["6 am", "8 am", "10 am", "12 pm", "2 pm", "4 pm", "6 pm", "8 pm"];
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-3">
      <div className="mb-1.5 flex shrink-0 items-center gap-2 rounded-lg bg-rose-50/70 px-3 py-1.5 ring-1 ring-rose-100">
        <ScissorsIcon className="h-3.5 w-3.5" />
        <span className="text-[10.5px] font-bold text-stone-800">Grooming</span>
        <span className="text-[9.5px] text-stone-500">
          You only see the service you are assigned to. 15 appointments this week.
        </span>
      </div>

      <div className="grid shrink-0 grid-cols-[38px_repeat(7,1fr)] gap-1.5">
        <span />
        {WEEK_DAYS.map((d) => (
          <div key={d.n} className="pb-1 text-center">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-stone-400">{d.d}</div>
            <div
              className={`mx-auto mt-0.5 grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${
                d.today ? "bg-[#FFA800] text-[#0C3A3F]" : "text-stone-700"
              }`}
            >
              {d.n}
            </div>
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[38px_repeat(7,1fr)] gap-1.5 border-t border-stone-200 pt-1">
        <div className="flex flex-col justify-between text-right text-[8.5px] font-semibold text-stone-400">
          {HOURS.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {WEEK_DAYS.map((_, day) => (
          <div key={day} className="relative rounded-lg bg-white ring-1 ring-stone-200">
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <span
                key={g}
                className="absolute inset-x-0 border-t border-stone-100"
                style={{ top: `${(g / 7) * 100}%` }}
              />
            ))}
            {PROVIDER_BLOCKS.filter((b) => b.day === day).map((b, i) => {
              const k = easeOut(clamp01((p - 0.05 - day * 0.035 - i * 0.03) / 0.3));
              return (
                <div
                  key={i}
                  className="absolute inset-x-0.5 overflow-hidden rounded border-l-[3px] border-l-rose-500 bg-rose-50/85 px-1 py-0.5"
                  style={{ top: `${b.top}%`, height: `${b.h}%`, opacity: k, transform: `translateY(${(1 - k) * 4}px)` }}
                >
                  <div className="truncate text-[8.5px] font-bold leading-tight text-stone-800">{b.label}</div>
                  {b.h > 6 ? (
                    <>
                      <div className="truncate text-[8px] font-semibold text-stone-500">{b.time}</div>
                      <div className="truncate text-[8px] text-stone-500">{b.pet}</div>
                    </>
                  ) : (
                    <div className="truncate text-[8px] font-semibold text-stone-500">
                      {b.time} · {b.pet}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 6. Boarding, the monthly summary ─────────────────────── */
const NIGHTS = [2, 3, 3, 4, 4, 5, 5, 4, 3, 3, 4, 6, 6, 5, 4, 4, 5, 5, 6, 7, 7, 6, 5, 4, 4, 5, 6, 6, 5, 4];
const STAYS: Array<{ dog: string; owner: string; arr: string; dep: string; nights: number; transport: string }> = [
  { dog: "Rex", owner: "Amanda R.", arr: "Tue 1 Sept", dep: "Sat 5 Sept", nights: 4, transport: "Both" },
  { dog: "Bramble", owner: "Carole F.", arr: "Fri 4 Sept", dep: "Mon 7 Sept", nights: 3, transport: "Drop off" },
  { dog: "Nala", owner: "Tom H.", arr: "Sat 12 Sept", dep: "Sat 19 Sept", nights: 7, transport: "Both" },
  { dog: "Otis", owner: "Ruth E.", arr: "Sun 20 Sept", dep: "Wed 23 Sept", nights: 3, transport: "Collect" },
  { dog: "Pepper", owner: "Sam T.", arr: "Mon 21 Sept", dep: "Fri 25 Sept", nights: 4, transport: "Both" },
  { dog: "Milo", owner: "Priya N.", arr: "Fri 25 Sept", dep: "Mon 28 Sept", nights: 3, transport: "Drop off" },
  { dog: "Poppy", owner: "Dev A.", arr: "Sat 26 Sept", dep: "Wed 30 Sept", nights: 4, transport: "Both" },
];

function BoardingView({ p }: { p: number }) {
  const max = Math.max(...NIGHTS);
  const hovered = hoverRow("boarding", p);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3">
      <div className="grid shrink-0 grid-cols-4 gap-2">
        {[
          ["Stays", "18"],
          ["Nights booked", "96"],
          ["Peak night", "7"],
          ["In / out", "18 / 17"],
        ].map(([l, v], i) => (
          <div
            key={l}
            className="rounded-xl bg-white px-3 py-2 ring-1 ring-stone-200"
            style={{ opacity: easeOut(clamp01((p - 0.02 - i * 0.04) / 0.18)) }}
          >
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-stone-400">{l}</div>
            <div className="mt-0.5 text-[18px] font-extrabold leading-none text-[#0C3A3F]">
              {v.includes("/")
                ? v
                : countUp(parseInt(v, 10), p, 0.02, 0.32)}
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 rounded-xl bg-white p-2.5 ring-1 ring-stone-200">
        <div className="text-[10px] font-bold text-[#0C3A3F]">Dogs on site overnight</div>
        <div className="text-[8.5px] text-stone-500">
          A dog counts on every night of its stay except the night it goes home.
        </div>
        <div className="mt-1.5 flex h-[52px] items-end gap-[3px]">
          {NIGHTS.map((n, i) => {
            const k = easeOut(clamp01((p - 0.08 - i * 0.012) / 0.25));
            return (
              <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
                <div
                  className={`w-full rounded-t-sm ${n === max ? "bg-[#FFA800]" : "bg-indigo-300"}`}
                  style={{ height: `${(n / max) * 44 * k}px` }}
                />
                <span className="text-[6.5px] font-semibold text-stone-400">{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white ring-1 ring-stone-200">
        <div className="grid shrink-0 grid-cols-[1.1fr_1.1fr_1.1fr_1.1fr_0.7fr_0.9fr_0.9fr] gap-2 border-b border-stone-100 px-3 py-1.5 text-[8.5px] font-bold uppercase tracking-wide text-stone-400">
          <span>Dog</span>
          <span>Owner</span>
          <span>Arrives</span>
          <span>Departs</span>
          <span className="text-center">Nights</span>
          <span>Transport</span>
          <span className="text-right">Status</span>
        </div>
        {STAYS.map((s, i) => {
          const k = easeOut(clamp01((p - 0.2 - i * 0.06) / 0.25));
          return (
            <div
              key={s.dog}
              className={`grid flex-1 grid-cols-[1.1fr_1.1fr_1.1fr_1.1fr_0.7fr_0.9fr_0.9fr] items-center gap-2 border-b border-stone-100 px-3 transition-colors ${
                hovered === i ? "bg-amber-50/70" : ""
              }`}
              style={{ opacity: k }}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
                <span className="truncate text-[11px] font-bold text-stone-800">{s.dog}</span>
              </span>
              <span className="truncate text-[10.5px] text-stone-600">{s.owner}</span>
              <span className="flex items-center gap-1 truncate text-[10.5px] font-semibold text-emerald-700">
                ▲ {s.arr}
              </span>
              <span className="flex items-center gap-1 truncate text-[10.5px] font-semibold text-orange-600">
                ▼ {s.dep}
              </span>
              <span className="flex items-center justify-center gap-1 text-[10.5px] font-bold text-stone-700">
                <MoonIcon className="h-2.5 w-2.5" />
                {s.nights}
              </span>
              <span className="truncate text-[10px] font-semibold text-stone-600">{s.transport}</span>
              <span className="flex justify-end">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  Confirmed
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 7. Day Routes ────────────────────────────────────────
   The planning board rather than the live map. It reads the same
   whether you run one round yourself or four with drivers, which
   the map does not. */
const ROUNDS: Array<{
  name: string;
  colour: string;
  driver: string;
  pets: Array<{ name: string; kind: ServiceKey; when: string }>;
}> = [
  {
    name: "Morning Round 1",
    colour: "#12A594",
    driver: "Jess M.",
    pets: [
      { name: "Bramble", kind: "daycare", when: "07:40" },
      { name: "Nala", kind: "daycare", when: "07:55" },
      { name: "Otis", kind: "walk", when: "08:10" },
      { name: "Pepper", kind: "daycare", when: "08:25" },
      { name: "Daisy", kind: "walk", when: "08:40" },
      { name: "Ziggy", kind: "daycare", when: "08:55" },
    ],
  },
  {
    name: "Morning Round 2",
    colour: "#7C6CF0",
    driver: "Sam T.",
    pets: [
      { name: "Milo", kind: "groom", when: "08:00" },
      { name: "Bailey", kind: "daycare", when: "08:20" },
      { name: "Poppy", kind: "walk", when: "08:35" },
      { name: "Ralph", kind: "daycare", when: "08:50" },
      { name: "Luna", kind: "groom", when: "09:05" },
    ],
  },
];

const UNASSIGNED = [
  { name: "Rex", kind: "sleepover" as ServiceKey },
  { name: "Tilly", kind: "walk" as ServiceKey },
];

function RoutesView({ p }: { p: number }) {
  const optimised = p > 0.66;
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3">
      <div
        className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-stone-200"
        style={{ opacity: easeOut(clamp01(p / 0.14)) }}
      >
        <Pills items={["Morning Pickups", "Evening Dropoffs"]} active="Morning Pickups" />
        <span className="rounded-lg bg-stone-50 px-2.5 py-1 text-[10.5px] font-semibold text-stone-600 ring-1 ring-stone-200">
          07 / 09 / 2026
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-stone-500">
          <span className="flex h-3.5 w-6 items-center rounded-full bg-emerald-500 px-0.5">
            <span className="ml-auto h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          Show service
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-stone-600 ring-1 ring-stone-200">
            Reset to default
          </span>
          <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-stone-600 ring-1 ring-stone-200">
            + Add route
          </span>
          <span className="rounded-lg bg-[#FFA800] px-2.5 py-1 text-[10px] font-bold text-[#0C3A3F]">
            Save day routes
          </span>
        </span>
      </div>

      <div className="flex min-h-0 flex-1 gap-2.5">
        <div className="flex w-[176px] shrink-0 flex-col gap-1.5 rounded-xl bg-white p-2.5 ring-1 ring-stone-200">
          <div className="text-[8.5px] font-bold uppercase tracking-wider text-stone-400">
            Not on a route
          </div>
          {UNASSIGNED.map((u, i) => (
            <div
              key={u.name}
              className="flex items-center gap-1.5 rounded-lg bg-stone-50 px-2 py-1.5 ring-1 ring-stone-200"
              style={{ opacity: easeOut(clamp01((p - 0.06 - i * 0.05) / 0.2)) }}
            >
              <span className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
              <span className="truncate text-[10.5px] font-bold text-stone-700">{u.name}</span>
              <ServiceIcon kind={u.kind} className="ml-auto h-3 w-3 shrink-0" />
            </div>
          ))}
          <div className="mt-auto rounded-lg bg-[#0C3A3F]/5 px-2 py-1.5 text-[8.5px] font-semibold leading-snug text-[#0C3A3F]">
            Drag a dog onto a round, or let Optimise order the stops for you.
          </div>
        </div>

        {ROUNDS.map((r, ri) => (
          <div
            key={r.name}
            className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white ring-1 ring-stone-200"
            style={{
              borderTop: `4px solid ${r.colour}`,
              opacity: easeOut(clamp01((p - 0.08 - ri * 0.07) / 0.24)),
            }}
          >
            <div className="flex items-center gap-1.5 px-2.5 pt-2">
              <span className="text-[12px] font-extrabold text-[#0C3A3F]">{r.name}</span>
              <span className="ml-auto text-[9px] font-semibold text-stone-400">
                {r.pets.length} stops
              </span>
            </div>

            <div className="px-2.5 pt-1.5">
              <div className="text-[8px] font-bold uppercase tracking-wider text-stone-400">
                Assigned driver
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 rounded-lg bg-stone-50 px-2 py-1.5 ring-1 ring-stone-200">
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white"
                  style={{ background: r.colour }}
                >
                  {r.driver.charAt(0)}
                </span>
                <span className="truncate text-[10.5px] font-bold text-stone-700">{r.driver}</span>
                <span className="ml-auto text-[9px] text-stone-400">⌄</span>
              </div>
            </div>

            <div className="mt-1.5 px-2.5 text-[8px] font-bold uppercase tracking-wider text-stone-400">
              Assigned pets
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-1 px-2.5 pt-1">
              {r.pets.map((pet, i) => {
                const k = easeOut(clamp01((p - 0.14 - ri * 0.05 - i * 0.04) / 0.24));
                return (
                  <div
                    key={pet.name}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1.5 ring-1 ring-stone-200"
                    style={{ opacity: k }}
                  >
                    <span className="w-3 text-[9px] font-bold text-stone-400">{i + 1}</span>
                    <span className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10.5px] font-bold text-stone-800">
                        {pet.name}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-stone-500">
                        <ServiceIcon kind={pet.kind} className="h-2.5 w-2.5" />
                        {SERVICE_LABEL[pet.kind]}
                      </span>
                    </span>
                    <span
                      className="shrink-0 rounded bg-stone-50 px-1.5 py-0.5 text-[9px] font-bold text-stone-600 ring-1 ring-stone-200 transition-colors"
                      style={optimised ? { background: "#ECFDF5", color: "#047857" } : undefined}
                    >
                      {pet.when}
                    </span>
                    <span className="shrink-0 text-[10px] leading-none text-stone-300">⠿</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-2">
              <span
                className="rounded-lg px-2.5 py-1 text-[10px] font-bold ring-1 transition-colors"
                style={
                  optimised
                    ? { background: "#ECFDF5", color: "#047857", boxShadow: "inset 0 0 0 1px #A7F3D0" }
                    : { background: "#FFF7E6", color: "#B45309", boxShadow: "inset 0 0 0 1px #FDE7BD" }
                }
              >
                {optimised ? "✓ Optimised" : "✦ Optimise"}
              </span>
              <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-stone-600 ring-1 ring-stone-200">
                Map
              </span>
              <span className="ml-auto rounded-lg bg-[#0C3A3F] px-2.5 py-1 text-[10px] font-bold text-white">
                Save
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 8. Messages ──────────────────────────────────────────── */
const THREADS = [
  { who: "Amanda R.", sub: "Milo · later pickup?", unread: 2, t: "08:12", live: true },
  { who: "Carole F.", sub: "Bailey · groom moved to Thu", t: "07:58" },
  { who: "Sam T. · Driver", sub: "Round 1, today only", t: "07:41" },
  { who: "Tom H.", sub: "Rex · 7 nights confirmed", t: "Yest" },
  { who: "Ruth E.", sub: "Nala · vaccination sent", t: "Yest" },
  { who: "Priya N. · Driver", sub: "Round 2 running late", t: "Mon" },
];
const BUBBLES: Array<{ me?: boolean; text: string; at: string }> = [
  { text: "Morning! Is Milo ok to stay a bit later today?", at: "08:04" },
  { me: true, text: "Of course. We will put him on the 5pm round.", at: "08:06" },
  { text: "Amazing, thank you. Same for Thursday if that works?", at: "08:09" },
  { me: true, text: "Booked in, and I have made Thursday recurring so you do not have to ask again.", at: "08:11" },
];

function MessagesView({ p }: { p: number }) {
  const hovered = hoverRow("messages", p);
  return (
    <div className="flex min-h-0 flex-1 gap-2.5 px-4 pb-3">
      <div className="flex w-[262px] shrink-0 flex-col gap-1 overflow-hidden rounded-xl bg-white p-2 ring-1 ring-stone-200">
        <div className="flex items-center gap-1.5 rounded-lg bg-stone-50 px-2 py-1.5 text-[10px] text-stone-400 ring-1 ring-stone-200">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" strokeLinecap="round" />
          </svg>
          Search conversations by customer
        </div>
        {THREADS.map((t, i) => (
          <div
            key={t.who}
            className={`rounded-lg px-2 py-1.5 ring-1 transition-colors ${
              i === 0
                ? "bg-teal-50/70 ring-teal-200"
                : hovered === i
                  ? "bg-amber-50/70 ring-amber-200"
                  : "bg-white ring-stone-100"
            }`}
            style={{ opacity: easeOut(clamp01((p - 0.03 - i * 0.04) / 0.2)) }}
          >
            <div className="flex items-center gap-1.5">
              {t.live ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> : null}
              <span className="truncate text-[10.5px] font-bold text-stone-800">{t.who}</span>
              <span className="ml-auto shrink-0 text-[8.5px] font-medium text-stone-400">{t.t}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[9.5px] text-stone-500">{t.sub}</span>
              {t.unread ? (
                <span className="ml-auto shrink-0 rounded-full bg-[#FFA800] px-1.5 text-[8px] font-bold text-[#0C3A3F]">
                  {t.unread}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col rounded-xl bg-white ring-1 ring-stone-200">
        <div className="flex shrink-0 items-center gap-2 border-b border-stone-100 px-3 py-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-teal-100 text-[9px] font-bold text-teal-800">
            AR
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-stone-800">Amanda R.</div>
            <div className="text-[9px] text-stone-400">Milo, Cockapoo · Daycare Mon, Wed, Thu</div>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Seen
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 px-3 py-2">
          {BUBBLES.map((b, i) => (
            <div
              key={i}
              className={`flex flex-col ${b.me ? "items-end" : "items-start"}`}
              style={{ opacity: easeOut(clamp01((p - 0.12 - i * 0.09) / 0.2)) }}
            >
              <div
                className={`max-w-[74%] px-3 py-1.5 text-[11px] leading-snug ${
                  b.me
                    ? "rounded-2xl rounded-br-sm bg-[#0C3A3F] font-medium text-white"
                    : "rounded-2xl rounded-bl-sm bg-stone-100 text-stone-700"
                }`}
              >
                {b.text}
              </div>
              <span className="mt-0.5 px-1 text-[8.5px] text-stone-400">{b.at}</span>
            </div>
          ))}
          {p > 0.62 ? (
            <div className="flex items-center gap-1 self-start rounded-full bg-stone-100 px-3 py-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-stone-400"
                  style={{ opacity: 0.3 + 0.7 * Math.abs(Math.sin(p * 16 - i * 0.6)) }}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 border-t border-stone-100 px-3 py-2">
          <div className="flex-1 rounded-full bg-stone-50 px-3 py-1.5 text-[10.5px] text-stone-400 ring-1 ring-stone-200">
            Write a reply...
          </div>
          <span
            className="rounded-full bg-[#FFA800] px-3 py-1.5 text-[10.5px] font-bold text-[#0C3A3F] transition-transform"
            style={{ transform: p > 0.86 && p < 0.95 ? "scale(0.93)" : "scale(1)" }}
          >
            Send
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── 9. Forecast ──────────────────────────────────────────── */
const F_ROWS: Array<{ m: string; bookings: number; confirmed: number; member: number; change: string }> = [
  { m: "September 2026", bookings: 48, confirmed: 2783, member: 1760, change: "REST OF MONTH" },
  { m: "October 2026", bookings: 55, confirmed: 3253, member: 1760, change: "—" },
  { m: "November 2026", bookings: 57, confirmed: 3368, member: 1760, change: "+2%" },
  { m: "December 2026", bookings: 58, confirmed: 3521, member: 1760, change: "+3%" },
  { m: "January 2027", bookings: 54, confirmed: 3212, member: 1760, change: "-6%" },
  { m: "February 2027", bookings: 52, confirmed: 3108, member: 1760, change: "-2%" },
];
const F_SPLIT: Array<[ServiceKey, string, string, number]> = [
  ["daycare", "Daycare", "£14,120.00", 47],
  ["groom", "Full Groom", "£6,125.00", 21],
  ["walk", "Pack Walks", "£5,560.00", 19],
  ["sleepover", "Boarding", "£4,000.00", 13],
];
const F_MAX = 5600;

function ForecastView({ p }: { p: number }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3">
      <div
        className="shrink-0 rounded-xl bg-[#1C1C1A] px-4 py-2.5"
        style={{ opacity: easeOut(clamp01(p / 0.15)) }}
      >
        <div className="grid grid-cols-3 divide-x divide-white/10">
          {[
            ["Projected over 6 months", "£29,805.00", "324 bookings · 22 dogs"],
            ["Typical month", "£5,052.40", "Average across 5 full months"],
            ["Busiest month", "£5,281.00", "December 2026"],
          ].map(([l, v, n], i) => (
            <div key={l} className={i === 0 ? "pr-4" : "px-4"}>
              <div className="text-[8.5px] font-bold uppercase tracking-wider text-white/50">{l}</div>
              <div className="mt-0.5 text-[20px] font-extrabold leading-none text-white">{v}</div>
              <div className="mt-0.5 text-[9px] font-medium text-white/50">{n}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white/85"
            style={{ width: `${64.6 * easeOut(clamp01((p - 0.08) / 0.3))}%` }}
          />
        </div>
        <div className="mt-1.5 flex gap-4 text-[9px] font-semibold text-white/70">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-white/85" /> Confirmed bookings £19,245.00
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-white/35" /> Memberships £10,560.00
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-2">
        <div className="flex min-w-0 flex-1 flex-col rounded-xl bg-white p-2.5 ring-1 ring-stone-200">
          <div className="flex shrink-0 items-baseline gap-2">
            <span className="text-[10.5px] font-bold text-[#0C3A3F]">Revenue by month</span>
            <span className="text-[8.5px] text-stone-500">
              Dashed line marks the £5,052.40 monthly average
            </span>
          </div>
          <div className="relative mt-1.5 flex min-h-0 flex-1 gap-1.5">
            <div className="flex w-7 shrink-0 flex-col justify-between pb-3.5 text-right text-[8px] font-semibold text-stone-400">
              {["£6k", "£4.5k", "£3k", "£1.5k", "£0"].map((y) => (
                <span key={y}>{y}</span>
              ))}
            </div>
            <div className="relative min-w-0 flex-1">
              <div
                className="absolute inset-x-0 border-t-2 border-dashed border-[#FFA800]"
                style={{ bottom: `calc(14px + ${(5052 / F_MAX) * 100}% * 0.86)` }}
              />
              <div className="absolute inset-x-0 top-0 bottom-3.5 flex gap-2">
                {F_ROWS.map((r, i) => {
                  const k = easeOut(clamp01((p - 0.12 - i * 0.045) / 0.3));
                  return (
                    /* column is full height, so the segment percentages have
                       something to resolve against */
                    <div key={r.m} className="flex min-w-0 flex-1 flex-col-reverse">
                      <div
                        className="w-full rounded-b-sm bg-[#2A2A28]"
                        style={{ height: `${(r.confirmed / F_MAX) * 100 * k}%` }}
                      />
                      <div
                        className="w-full rounded-t-sm bg-[#8A8A84]"
                        style={{ height: `${(r.member / F_MAX) * 100 * k}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex gap-2">
                {F_ROWS.map((r) => (
                  <span key={r.m} className="min-w-0 flex-1 text-center text-[8.5px] font-semibold text-stone-500">
                    {r.m.slice(0, 3)} {r.m.slice(-2)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-[268px] shrink-0 flex-col gap-2">
          <div className="flex flex-1 flex-col rounded-xl bg-white p-2.5 ring-1 ring-stone-200">
            <div className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
              Where it comes from
            </div>
            <div className="mb-1 text-[8.5px] text-stone-500">
              Booking revenue by service over the period
            </div>
            {F_SPLIT.map(([kind, label, val, pct], i) => {
              const k = easeOut(clamp01((p - 0.2 - i * 0.06) / 0.25));
              return (
                <div key={label} className="flex-1 border-t border-stone-100 pt-1.5" style={{ opacity: k }}>
                  <div className="flex items-baseline gap-1.5 text-[10.5px]">
                    <ServiceIcon kind={kind} className="h-3 w-3 shrink-0" />
                    <span className="font-semibold text-stone-700">{label}</span>
                    <span className="ml-auto font-bold text-[#0C3A3F]">{val}</span>
                    <span className="w-7 text-right text-[9px] font-semibold text-stone-400">{pct}%</span>
                  </div>
                  <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-[#14807A]" style={{ width: `${pct * 2.1 * k}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-0.5 rounded-xl bg-white p-2.5 ring-1 ring-stone-200">
            <div className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Month by month</div>
            {F_ROWS.slice(0, 4).map((r, i) => (
              <div
                key={r.m}
                className="flex items-baseline gap-2 border-t border-stone-100 pt-1 text-[9.5px]"
                style={{ opacity: easeOut(clamp01((p - 0.3 - i * 0.04) / 0.2)) }}
              >
                <span className="w-12 truncate font-semibold text-stone-500">{r.m.slice(0, 3)}</span>
                <span className="anim-tabular font-bold text-stone-800">
                  {money(r.confirmed + r.member)}
                </span>
                <span
                  className={`ml-auto font-bold ${
                    r.change.startsWith("+") ? "text-emerald-600" : "text-stone-400"
                  }`}
                >
                  {r.change === "REST OF MONTH" ? "rest of month" : r.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── device ───────────────────────────────────────────────── */
type Meta = {
  h: string;
  sub: string;
  nav: string;
  side: string;
  sub2?: string;
  stats?: boolean;
  dashPill?: string;
  extra?: "routes" | "week" | "horizons" | "msgtabs" | "boarding" | "services";
};

const META: Record<ViewKey, Meta> = {
  monthly: { h: "September 2026", sub: "Bookings & upcoming schedule", nav: "‹ Sept 2026 ›", side: "Dashboard", stats: true, dashPill: "Monthly" },
  services: { h: "Services", sub: "Everything you offer, priced and capped", nav: "", side: "Finance", sub2: "Plans & Pricing", extra: "services" },
  daily: { h: "Daily Schedule", sub: "Today, 7 September 2026", nav: "‹ 7 Sept ›", side: "Dashboard", dashPill: "Daily" },
  schedule: { h: "Schedule", sub: "Weekly view, click a date to open that day", nav: "‹ Sep 7 – Sep 13 ›", side: "Dashboard", dashPill: "Schedule", extra: "week" },
  provider: { h: "Schedule", sub: "Your grooming appointments", nav: "‹ Sep 7 – Sep 13 ›", side: "", extra: "week" },
  boarding: { h: "Monthly Summary", sub: "Boarding across September", nav: "‹ September 2026 ›", side: "Bookings", extra: "boarding" },
  routes: { h: "Day Routes", sub: "Plan today's pickups and drop-offs", nav: "", side: "Routes", extra: "routes" },
  messages: { h: "Messages", sub: "Chat with your customers. Drivers join on the days they drive.", nav: "", side: "Messages", extra: "msgtabs" },
  forecast: { h: "Revenue Forecast", sub: "What is already in the diary", nav: "", side: "Finance", sub2: "Daycare Finance", extra: "horizons" },
};

function Device({ t }: { t: number }) {
  const seg = 1 / VIEW_ORDER.length;
  const idx = Math.min(VIEW_ORDER.length - 1, Math.floor(t / seg));
  const view = VIEW_ORDER[idx];
  const local = (t - idx * seg) / seg;
  const fade = local < 0.05 ? local / 0.05 : local > 0.95 ? (1 - local) / 0.05 : 1;
  const m = META[view];
  const isProvider = view === "provider";

  return (
    <div className="relative flex overflow-hidden bg-white" style={{ width: CANVAS_W, height: CANVAS_H }}>
      <div className="anim-device-shine pointer-events-none" />
      {isProvider ? <ProviderSidebar /> : <AdminSidebar active={m.side} sub={m.sub2} />}

      <div className="flex min-w-0 flex-1 flex-col bg-[#FAFAF9]">
        {isProvider ? (
          <div
            className="flex shrink-0 items-center gap-3 border-b border-stone-200 bg-white px-4"
            style={{ height: TOPBAR_H }}
          >
            <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-[10.5px] font-bold text-stone-600">Today</span>
            <span className="text-[12px] font-extrabold text-[#0C3A3F]">Sep 7 – Sep 13</span>
            <div className="ml-auto flex items-center gap-2 border-l border-stone-200 pl-3">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-rose-100 text-[9px] font-bold text-rose-700">
                PN
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-stone-800">Priya N.</div>
                <div className="text-[9.5px] text-stone-400">Groomer</div>
              </div>
            </div>
          </div>
        ) : (
          <TopBar />
        )}

        {!isProvider && (
          <div className="flex shrink-0 flex-wrap items-center gap-2.5 px-4 py-2.5">
            <div className="shrink-0">
              <div className="text-[16px] font-extrabold leading-none text-[#0C3A3F]">{m.h}</div>
              <div className="mt-1 text-[9.5px] font-medium text-stone-500">{m.sub}</div>
            </div>

            {m.stats ? (
              <div className="flex items-stretch divide-x divide-stone-200 rounded-xl bg-white px-1 py-1 ring-1 ring-stone-100">
                {[
                  ["Admin", 88],
                  ["Recurring", 20],
                  ["Customer", 31],
                  ["Total", 139],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex items-center gap-1.5 px-2.5">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-stone-400">{l}</span>
                    <span className="anim-tabular text-[12px] font-bold text-[#0C3A3F]">
                      {countUp(v as number, local)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="ml-auto flex items-center gap-2">
              {m.extra === "horizons" ? (
                <>
                  <Pills
                    items={["1 month", "3 months", "6 months", "12 months"]}
                    active={local > 0.36 ? "12 months" : "6 months"}
                  />
                  <span className="rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-stone-600 ring-1 ring-stone-200">
                    Export CSV
                  </span>
                </>
              ) : m.extra === "msgtabs" ? (
                <Pills items={["New message", "Broadcast", "History"]} active="New message" />
              ) : m.extra === "routes" ? (
                <>
                  <Pills items={["List", "Map"]} active="List" />
                  <Pills items={["Day Routes", "Default Routes", "Tracking"]} active="Day Routes" gold />
                </>
              ) : m.extra === "services" ? (
                <>
                  <Pills items={["Services", "Memberships", "Custom Day Rate", "Charge Rates"]} active="Services" />
                  <span className="rounded-xl bg-[#FFA800] px-3 py-1.5 text-[11px] font-bold text-[#0C3A3F]">
                    + Add Service
                  </span>
                </>
              ) : m.extra === "boarding" ? (
                <>
                  <span className="rounded-xl bg-white px-2.5 py-1.5 text-[11px] font-bold text-stone-600 ring-1 ring-stone-200">
                    Boarding (multi-day)
                  </span>
                  <span className="rounded-xl bg-white px-2.5 py-1.5 text-[11px] font-bold text-stone-600 ring-1 ring-stone-200">
                    {m.nav}
                  </span>
                </>
              ) : (
                <>
                  {m.extra === "week" ? <Pills items={["Week", "Day"]} active="Week" /> : null}
                  {m.nav ? (
                    <span className="rounded-xl bg-white px-2.5 py-1.5 text-[11px] font-bold text-stone-600 ring-1 ring-stone-200">
                      {m.nav}
                    </span>
                  ) : null}
                  <span className="rounded-xl bg-[#FFA800] px-3 py-1.5 text-[11px] font-bold text-[#0C3A3F]">
                    + Create booking
                  </span>
                </>
              )}
            </div>

            {m.dashPill ? (
              <div className="w-full">
                <Pills items={["Monthly", "Daily", "Schedule", "Map"]} active={m.dashPill} gold />
              </div>
            ) : null}
          </div>
        )}

        <div className="relative flex min-h-0 flex-1 flex-col" style={{ opacity: fade }}>
          <EnterWipe p={local} />
          {view === "monthly" && <MonthlyView p={local} />}
          {view === "services" && <ServicesView p={local} />}
          {view === "daily" && <DailyView p={local} />}
          {view === "schedule" && <ScheduleView p={local} />}
          {view === "provider" && <ProviderView p={local} />}
          {view === "boarding" && <BoardingView p={local} />}
          {view === "routes" && <RoutesView p={local} />}
          {view === "messages" && <MessagesView p={local} />}
          {view === "forecast" && <ForecastView p={local} />}
        </div>
        <Cursor view={view} p={local} />
      </div>
    </div>
  );
}

export default function AdminMiniAnimationV2() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState<number | null>(null);
  const loopT = useLoop(DURATION_MS, !visible || pinned !== null);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    if (!v) return;
    const i = VIEW_ORDER.indexOf(v as ViewKey);
    if (i >= 0) setPinned((i + 0.62) / VIEW_ORDER.length);
  }, []);

  const t = pinned ?? loopT;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w) setScale(w / CANVAS_W);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        <Device t={t} />
      </div>
    </div>
  );
}
