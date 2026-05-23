"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ServiceKey = "daycare" | "sleepover" | "combo" | "meet";

const SERVICES: Record<ServiceKey, { name: string }> = {
  daycare: { name: "Daycare" },
  sleepover: { name: "Sleepover" },
  combo: { name: "Daycare + Sleepover" },
  meet: { name: "Meet & Greet" },
};

type Cell = {
  d: number;
  off?: boolean;
  today?: boolean;
  full?: boolean;
  pending?: number;
  birthday?: number;
  services?: Array<[ServiceKey, number]>;
};

const CELLS: Cell[] = [
  { d: 27, off: true },
  { d: 28, off: true },
  { d: 29, off: true },
  { d: 30, off: true },
  { d: 1, services: [["daycare", 2]] },
  { d: 2, services: [["sleepover", 1]] },
  { d: 3, services: [["sleepover", 1]] },
  { d: 4, services: [["daycare", 6]] },
  { d: 5, services: [["daycare", 24]], full: true },
  { d: 6, services: [["daycare", 27]] },
  { d: 7, services: [["daycare", 27]] },
  { d: 8, services: [["daycare", 24]], full: true },
  { d: 9, services: [["sleepover", 3]], birthday: 1 },
  { d: 10, services: [["sleepover", 3]] },
  { d: 11, services: [["daycare", 18]] },
  { d: 12, services: [["daycare", 18]] },
  { d: 13, services: [["daycare", 17]], today: true },
  { d: 14, services: [["daycare", 17]] },
  { d: 15, services: [["daycare", 17]] },
  { d: 16, pending: 2 },
  { d: 17, services: [["meet", 1]] },
  { d: 18, services: [["daycare", 15]] },
  { d: 19, services: [["daycare", 13]] },
  { d: 20, services: [["combo", 2]] },
  { d: 21, services: [["daycare", 15]] },
  { d: 22, services: [["daycare", 17]] },
  { d: 23, services: [["sleepover", 2]] },
  { d: 24, services: [["sleepover", 2]] },
  { d: 25, services: [["daycare", 8]] },
  { d: 26, services: [["daycare", 17]] },
  { d: 27, services: [["daycare", 17]] },
  { d: 28, services: [["daycare", 16]] },
  { d: 29, services: [["combo", 1]] },
  { d: 30, services: [["sleepover", 5]] },
  { d: 31, services: [["sleepover", 5]] },
];

const TOTALS = (() => {
  let admin = 0;
  let customer = 0;
  const recurring = 12;
  CELLS.forEach((cell) => {
    if (cell.off || !cell.services) return;
    const sum = cell.services.reduce((a, [, n]) => a + n, 0);
    const c = Math.round(sum * 0.32);
    customer += c;
    admin += sum - c;
  });
  return { admin, customer, recurring, total: admin + customer };
})();

const DURATION_MS = 12000;

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
      const elapsed = (now - startRef.current) % duration;
      setT(elapsed / duration);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, paused]);

  return t;
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

type IconProps = { className?: string; color?: string };

const SunIcon = ({ className, color = "#d97706" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <circle cx="8" cy="8" r="2.6" fill={color} />
    <g stroke={color} strokeWidth="1.3" strokeLinecap="round">
      <path d="M8 1.6v1.5M8 13v1.4M14.4 8H13M3 8H1.6M12.5 3.5l-1 1M5.5 11.5l-1 1M12.5 12.5l-1-1M5.5 4.5l-1-1" />
    </g>
  </svg>
);
const MoonIcon = ({ className, color = "#3730a3" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M11.5 11A5 5 0 1 1 5 4.5a4 4 0 0 0 6.5 6.5Z" fill={color} />
  </svg>
);
const ComboIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <circle cx="5.5" cy="8" r="2.8" fill="#d97706" />
    <path
      d="M14 9.5A3.5 3.5 0 1 1 9.5 5a2.8 2.8 0 0 0 4.5 4.5Z"
      fill="#3730a3"
    />
  </svg>
);
const MeetIcon = ({ className, color = "#0284c7" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path
      d="M3 11V6a2 2 0 0 1 2-2h4l3 3v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
      stroke={color}
      strokeWidth="1.3"
      fill="none"
    />
    <path d="M9 4v3h3" stroke={color} strokeWidth="1.3" fill="none" />
  </svg>
);
const CakeIcon = ({ className, color = "#ec4899" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path
      d="M3 12h10v-3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3Z"
      fill={color}
      opacity="0.25"
    />
    <path
      d="M3 12h10v-3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3Z"
      stroke={color}
      strokeWidth="1.2"
      fill="none"
    />
    <path
      d="M6 4.5v2M8 4v2M10 4.5v2"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);
const ClockIcon = ({ className, color = "#b45309" }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <circle
      cx="8"
      cy="8"
      r="5.4"
      stroke={color}
      strokeWidth="1.3"
      fill="none"
    />
    <path
      d="M8 5v3.2L10.2 10"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);
const ChevronLeft = ({ className }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path
      d="M10 3.5 5.5 8 10 12.5"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ChevronRight = ({ className }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path
      d="M6 3.5 10.5 8 6 12.5"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const PlusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path
      d="M8 3.5v9M3.5 8h9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
const CalIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect
      x="2.5"
      y="3.5"
      width="11"
      height="10"
      rx="1.6"
      stroke="currentColor"
      strokeWidth="1.3"
      fill="none"
    />
    <path
      d="M2.5 6.5h11M5.5 2v3M10.5 2v3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

function ServiceIcon({
  kind,
  className,
}: {
  kind: ServiceKey;
  className?: string;
}) {
  if (kind === "sleepover") return <MoonIcon className={className} />;
  if (kind === "combo") return <ComboIcon className={className} />;
  if (kind === "meet") return <MeetIcon className={className} />;
  return <SunIcon className={className} />;
}

function Chip({
  p,
  delay,
  bg,
  ring,
  text,
  icon,
  label,
}: {
  p: number;
  delay: number;
  bg: string;
  ring: string;
  text: string;
  icon: React.ReactNode;
  label: string;
}) {
  const cp = Math.max(0, Math.min(1, (p - 0.35 - delay * 0.15) / 0.55));
  const op = easeOut(cp);
  return (
    <div
      className={`flex items-center gap-1.5 rounded-md px-1.5 py-[3px] text-[10.5px] font-semibold ${bg} ${text} ring-1 ${ring} truncate`}
      style={{
        opacity: op,
        transform: `translateY(${(1 - op) * 4}px) scale(${0.92 + 0.08 * op})`,
        transformOrigin: "left center",
      }}
    >
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}

function MiniAdminDevice({ t }: { t: number }) {
  const cellPhase = (idx: number) => {
    const stagger = 0.45 / 35;
    const start = 0.05 + idx * stagger;
    const end = start + 0.1;
    if (t < start) return 0;
    if (t > end) return 1;
    return easeOut((t - start) / (end - start));
  };

  const sweep = t > 0.86 ? easeInOut((t - 0.86) / 0.14) : 0;

  const counterPhase = Math.min(1, Math.max(0, (t - 0.05) / 0.5));
  const counter = easeOut(counterPhase);

  const todayIdx = CELLS.findIndex((c) => c.today);
  const fullCellIdx = CELLS.findIndex((c, i) => c.full && i > 7);

  const cursor = useMemo(() => {
    const gridX = 0,
      gridY = 90,
      cellW = 137,
      cellH = 94;
    const pos = (i: number) => ({
      x: gridX + (i % 7) * cellW + cellW * 0.55,
      y: gridY + Math.floor(i / 7) * cellH + cellH * 0.55,
    });
    const a = { x: 880, y: 510 };
    const b = pos(todayIdx);
    const c = pos(fullCellIdx);
    if (t < 0.5) return { ...a, opacity: 0 };
    if (t < 0.62) {
      const k = easeInOut((t - 0.5) / 0.12);
      return {
        x: a.x + (b.x - a.x) * k,
        y: a.y + (b.y - a.y) * k,
        opacity: 1,
      };
    }
    if (t < 0.72) return { ...b, opacity: 1 };
    if (t < 0.82) {
      const k = easeInOut((t - 0.72) / 0.1);
      return {
        x: b.x + (c.x - b.x) * k,
        y: b.y + (c.y - b.y) * k,
        opacity: 1,
      };
    }
    if (t < 0.88) return { ...c, opacity: 1 };
    return { ...c, opacity: Math.max(0, 1 - (t - 0.88) / 0.06) };
  }, [t, todayIdx, fullCellIdx]);

  return (
    <div
      className="relative overflow-hidden bg-white"
      style={{ width: 960, height: 560 }}
    >
      {/* shine sweep */}
      <div className="anim-device-shine pointer-events-none" />

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-100 px-5 pb-3 pt-3.5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="min-w-0 shrink-0">
            <div className="text-forest text-[18px] font-extrabold leading-none tracking-tight">
              May 2026
            </div>
            <div className="mt-1 text-[10.5px] font-medium text-stone-500">
              Bookings &amp; upcoming schedule
            </div>
          </div>

          <div className="flex items-stretch divide-x divide-stone-200 rounded-xl bg-white px-1 py-1 shadow-sm ring-1 ring-stone-100">
            {[
              { l: "Admin", v: TOTALS.admin, bold: false },
              { l: "Recurring", v: TOTALS.recurring, bold: false },
              { l: "Customer", v: TOTALS.customer, bold: false },
              { l: "Total", v: TOTALS.total, bold: true },
            ].map((s) => (
              <div
                key={s.l}
                className="flex flex-col justify-center px-2.5 py-0.5"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
                    {s.l}
                  </span>
                  <span
                    className={`anim-tabular text-forest text-[13px] ${s.bold ? "font-black" : "font-bold"}`}
                  >
                    {Math.round(s.v * counter)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="inline-flex items-center rounded-xl bg-stone-100 p-0.5">
            <button
              className="text-forest rounded-md bg-white p-1 shadow-sm"
              title="Fit to screen"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.5 3.5h3v3M6.5 12.5h-3v-3M12.5 3.5l-3.5 3.5M3.5 12.5l3.5-3.5" />
              </svg>
            </button>
            <button className="rounded-md p-1 text-stone-500" title="Expand">
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.5 6.5v-3h3M12.5 9.5v3h-3M3.5 3.5l3.5 3.5M12.5 12.5l-3.5-3.5" />
              </svg>
            </button>
          </div>
          <div className="inline-flex items-center rounded-xl bg-white p-0.5 ring-1 ring-stone-100">
            <button className="rounded-md p-1 text-stone-500">
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="text-forest anim-tabular whitespace-nowrap px-2.5 text-[11px] font-bold">
              May 2026
            </span>
            <button className="rounded-md p-1 text-stone-500">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <button className="bg-forest flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm">
            <PlusIcon className="h-2.5 w-2.5" /> New booking
          </button>
          <div className="ml-1 inline-flex items-center rounded-xl bg-stone-100 p-0.5 text-stone-500">
            <button
              className="text-forest rounded-md bg-white px-1.5 py-1 shadow-sm"
              title="Monthly"
            >
              <CalIcon className="h-3 w-3" />
            </button>
            <button className="rounded-md px-1.5 py-1" title="Daily">
              <ClockIcon className="h-3 w-3" color="#78716c" />
            </button>
            <button className="rounded-md px-1.5 py-1" title="Route map">
              <svg viewBox="0 0 16 16" className="h-3 w-3">
                <path
                  d="M5.5 2 2 4v10l3.5-2 5 2 3.5-2V2l-3.5 2-5-2Zm0 0v10m5-8v10"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="none"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50 text-center text-[10.5px] font-bold uppercase tracking-wider text-stone-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-1.5">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div
        className="relative grid grid-cols-7 grid-rows-5 gap-px bg-stone-200"
        style={{ height: 470 }}
      >
        {CELLS.map((cell, i) => {
          const p = cellPhase(i);
          const isToday = !!cell.today;
          return (
            <div
              key={i}
              className={`relative px-2 py-1.5 ${cell.off ? "bg-stone-50" : isToday ? "bg-amber-50/60" : "bg-white"}`}
              style={{ minWidth: 0 }}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`anim-tabular text-[13px] ${cell.off ? "font-medium text-stone-400" : isToday ? "text-forest font-extrabold" : "font-semibold text-stone-700"}`}
                >
                  {cell.d}
                </span>
                {cell.full && (
                  <span
                    className="inline-flex items-center rounded-full bg-red-50 px-1.5 py-[1px] text-[9px] font-bold text-red-600 ring-1 ring-inset ring-red-600/10"
                    style={{
                      opacity: Math.max(0, (p - 0.4) / 0.6),
                      transform: `scale(${0.7 + 0.3 * Math.max(0, (p - 0.4) / 0.6)})`,
                      transformOrigin: "right center",
                    }}
                  >
                    Full
                  </span>
                )}
              </div>

              {isToday && p > 0.95 && (
                <div className="anim-today-pulse pointer-events-none absolute inset-1 rounded-md" />
              )}

              {!cell.off && (
                <div className="mt-1.5 space-y-1">
                  {cell.pending && (
                    <Chip
                      p={p}
                      delay={0}
                      bg="bg-amber-50/80"
                      ring="ring-amber-100"
                      text="text-amber-700"
                      icon={<ClockIcon className="h-3 w-3" />}
                      label={`${cell.pending} Pending`}
                    />
                  )}
                  {cell.services &&
                    cell.services.map(([kind, n], idx) => {
                      const s = SERVICES[kind];
                      return (
                        <Chip
                          key={idx}
                          p={p}
                          delay={idx * 0.2}
                          bg="bg-stone-50"
                          ring="ring-stone-200/80"
                          text="text-stone-700"
                          icon={
                            <ServiceIcon kind={kind} className="h-3 w-3" />
                          }
                          label={`${n} ${s.name.replace("Daycare + Sleepover", "Combo")}${n > 1 && kind !== "combo" ? "s" : ""}`}
                        />
                      );
                    })}
                  {cell.birthday && (
                    <Chip
                      p={p}
                      delay={0.5}
                      bg="bg-yellow-50"
                      ring="ring-yellow-100"
                      text="text-pink-700"
                      icon={<CakeIcon className="h-3 w-3" />}
                      label={`${cell.birthday} Birthday`}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Reset sweep overlay */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: `${sweep * 100}%`,
            top: 0,
            height: 470,
            width: "14%",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.0) 100%)",
            opacity: sweep > 0 && sweep < 1 ? 1 : 0,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Cursor */}
      <div
        className="anim-cursor-dot pointer-events-none absolute"
        style={{ left: cursor.x, top: cursor.y, opacity: cursor.opacity }}
      >
        <svg viewBox="0 0 18 18" width="18" height="18">
          <path
            d="M2 1.5 14.5 8 8.7 9.5 7 15.5 2 1.5Z"
            fill="#1f2937"
            stroke="white"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function AdminMiniAnimation() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);
  const t = useLoop(DURATION_MS, !visible);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const W = el.clientWidth;
      setScale(W / 960);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        }
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
      style={{ aspectRatio: "960 / 560" }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <MiniAdminDevice t={t} />
      </div>
    </div>
  );
}
