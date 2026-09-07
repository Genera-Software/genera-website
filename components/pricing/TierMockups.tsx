// Sample-data mockups for the /pricing tier walkthrough.
//
// Hand-drawn approximations of the real admin screens, not screenshots: a screenshot goes
// stale the moment the UI moves, and a real one would leak a customer's dogs and takings
// onto a public page. Every panel carries a "Sample data" chip so nobody reads £9,210 as a
// claim about their own business.
//
// Presentational only — no props, no state. Ported from the app's own pricing page and
// retoned to this site's palette (cream-dark borders, forest/gold accents).

/** Chrome shared by all three panels: traffic lights, a title, and the sample-data chip. */
function MockShell({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="m-0 overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-[0_18px_40px_-24px_rgba(0,62,69,0.35)]">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-cream-dark bg-cream px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-teal-mid" />
          <span className="h-2.5 w-2.5 rounded-full bg-cream-dark" />
          <span className="h-2.5 w-2.5 rounded-full bg-cream-dark" />
        </span>
        <span className="text-fine font-bold text-forest">{title}</span>
        {meta && <span className="text-eyebrow text-ink-soft">{meta}</span>}
        <span className="ml-auto rounded-full bg-gold-light px-2 py-0.5 text-[0.625rem] font-extrabold uppercase tracking-wider text-[#8A5A00]">
          Sample data
        </span>
      </figcaption>
      {children}
    </figure>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex-1 rounded-xl border border-cream-dark bg-white p-3">
      <p className="text-[0.6875rem] font-semibold text-ink-soft">{label}</p>
      <p
        className="mt-1 font-massilia text-[1.375rem] font-bold leading-none"
        style={{ color: tone || "#003E45" }}
      >
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const BOOKINGS = [
  {
    initials: "BR",
    name: "Bramble",
    detail: "Daycare · 08:00–17:00",
    status: "Accepted",
    avatar: ["#E6F4EA", "#065F46"],
    pill: ["#E6F4EA", "#065F46"],
  },
  {
    initials: "NA",
    name: "Nala",
    detail: "Daycare · half day",
    status: "Pending",
    avatar: ["#EDE9FE", "#6D28D9"],
    pill: ["#FEF3C7", "#92400E"],
  },
  {
    initials: "OT",
    name: "Otis",
    detail: "Sleepover · 2 nights",
    status: "Accepted",
    avatar: ["#E0F2FE", "#0369A1"],
    pill: ["#E6F4EA", "#065F46"],
  },
];

export function BookingsMockup() {
  return (
    <MockShell title="Bookings · Tuesday">
      <div className="grid gap-2.5 bg-cream p-4">
        <div className="flex gap-2.5">
          <Stat label="In today" value="18" />
          <Stat label="Awaiting approval" value="3" />
          <Stat label="Unbilled" value="£640" />
        </div>
        <div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
          {BOOKINGS.map((row, i) => (
            <div
              key={row.name}
              className={`flex items-center gap-3 px-3.5 py-2.5 ${
                i > 0 ? "border-t border-cream-dark" : ""
              }`}
            >
              <span
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-extrabold"
                style={{ background: row.avatar[0], color: row.avatar[1] }}
              >
                {row.initials}
              </span>
              <span className="text-[0.8125rem] font-bold text-forest">
                {row.name}
              </span>
              <span className="truncate text-eyebrow text-ink-soft">
                {row.detail}
              </span>
              <span
                className="ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-bold"
                style={{ background: row.pill[0], color: row.pill[1] }}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MockShell>
  );
}

/* -------------------------------------------------------------------------- */

const REVENUE = [
  { label: "Daycare", width: "100%", color: "#003E45", amount: "£5,120" },
  { label: "Sleepover", width: "62%", color: "#0E6E77", amount: "£3,180" },
  { label: "Dog walk", width: "28%", color: "#FFA800", amount: "£1,430" },
  { label: "Grooming", width: "12%", color: "#FFD98A", amount: "£620" },
];

export function FinanceMockup() {
  return (
    <MockShell title="Finance · Dashboard" meta="May 2026">
      <div className="grid gap-2.5 bg-cream p-4">
        <div className="flex flex-wrap gap-2.5">
          <Stat label="Invoiced" value="£9,210" />
          <Stat label="Paid" value="£7,940" tone="#065F46" />
          <Stat label="Outstanding" value="£1,270" tone="#92400E" />
        </div>
        <div className="rounded-xl border border-cream-dark bg-white p-3.5">
          <p className="mb-3 text-eyebrow font-bold text-forest">
            Revenue by service
          </p>
          <div className="grid gap-[9px]">
            {REVENUE.map((row) => (
              <div key={row.label} className="flex items-center gap-2.5">
                <span className="shrink-0 basis-[74px] text-[0.6875rem] font-semibold text-ink-soft">
                  {row.label}
                </span>
                <span className="h-[9px] flex-1 overflow-hidden rounded-full bg-cream-dark">
                  <span
                    className="block h-full"
                    style={{ width: row.width, background: row.color }}
                  />
                </span>
                <span className="shrink-0 basis-[52px] text-right text-[0.6875rem] font-bold text-forest">
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockShell>
  );
}

/* -------------------------------------------------------------------------- */

const STOPS = [
  { n: 1, name: "Bramble", road: "Mill Lane", time: "07:40", done: true },
  { n: 2, name: "Nala", road: "Fox Hollow", time: "07:55", done: true },
  { n: 3, name: "Otis", road: "Church Rd", time: "08:10", done: false },
  { n: 4, name: "Pepper", road: "Barn Close", time: "08:25", done: false },
];

const MAP_PINS: [number, number, number, string][] = [
  [70, 168, 1, "#10B981"],
  [170, 140, 2, "#10B981"],
  [300, 148, 3, "#FFA800"],
  [420, 78, 4, "#FFA800"],
  [560, 46, 5, "#FFA800"],
];

export function RoutesMockup() {
  return (
    <MockShell title="Routes · Morning collection" meta="Dog Bus 1 · Dave">
      <div className="grid grid-cols-1 gap-2.5 bg-cream p-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
          {/* h-full so the map fills whatever height the taller stops card sets. */}
          <div className="relative h-full min-h-[224px] bg-teal-soft">
            <svg viewBox="0 0 640 200" className="block h-full w-full" aria-hidden>
              <g stroke="#C2E2E6" strokeWidth="8">
                <path d="M0 62 H640" />
                <path d="M0 148 H640" />
                <path d="M150 0 V200" />
                <path d="M330 0 V200" />
                <path d="M500 0 V200" />
              </g>
              <path
                d="M70 168 L170 140 L300 148 L420 78 L560 46"
                fill="none"
                stroke="#003E45"
                strokeWidth="3"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />
              {MAP_PINS.map(([cx, cy, n, fill]) => (
                <g key={n}>
                  <circle cx={cx} cy={cy} r="13" fill={fill} />
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#fff"
                  >
                    {n}
                  </text>
                </g>
              ))}
            </svg>
            <div className="absolute bottom-2.5 right-2.5 rounded-xl border border-cream-dark bg-white/95 px-3 py-[7px] text-[0.6875rem] font-bold text-forest">
              Live · 2 of 8 collected · ETA 08:45
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
          <div className="border-b border-cream-dark px-3 py-2.5 text-eyebrow font-bold text-forest">
            Stops
          </div>
          {STOPS.map((stop, i) => (
            <div
              key={stop.name}
              className={`flex items-center gap-2 px-3 py-2 ${
                i > 0 ? "border-t border-cream-dark" : ""
              }`}
            >
              <span
                className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[0.625rem] font-extrabold text-white"
                style={{ background: stop.done ? "#10B981" : "#FFA800" }}
              >
                {stop.n}
              </span>
              <span className="min-w-0">
                <span className="block text-eyebrow font-bold text-forest">
                  {stop.name}
                </span>
                <span className="block text-[0.6875rem] text-ink-soft">
                  {stop.road}
                </span>
              </span>
              <span className="ml-auto text-[0.6875rem] font-semibold text-ink-soft">
                {stop.time}
              </span>
            </div>
          ))}
          <div className="border-t border-cream-dark px-3 py-[7px] text-[0.6875rem] text-ink-soft/70">
            4 more stops
          </div>
        </div>
      </div>
    </MockShell>
  );
}

export const TIER_MOCKUPS = {
  bookings: BookingsMockup,
  finance: FinanceMockup,
  routes: RoutesMockup,
} as const;
