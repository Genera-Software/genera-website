import { getAdminSupabase } from "@/lib/supabase/admin";
import {
  BADGES_BY_ID,
  isIgnoredBadgeHost,
  BADGE_IGNORED_HOST_OR_FILTER,
} from "@/lib/badges";
import PageHeader from "../_components/PageHeader";

export const dynamic = "force-dynamic";

type EventRow = {
  badge_id: string;
  kind: "powered" | "book";
  referer_host: string | null;
  created_at: string;
};

const WINDOW = 5000; // most recent events to aggregate

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function topCounts<T extends string>(
  rows: { key: T }[],
): { key: T; count: number }[] {
  const map = new Map<T, number>();
  for (const r of rows) map.set(r.key, (map.get(r.key) ?? 0) + 1);
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function BadgeTrackingPage() {
  let events: EventRow[] = [];
  let totalAll = 0;
  let tableMissing = false;

  try {
    const supabase = getAdminSupabase();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [countRes, ignoredCountRes, eventsRes] = await Promise.all([
      supabase
        .from("badge_events")
        .select("id", { count: "exact", head: true }),
      // All-time count of impressions from Genera's own domains / local dev,
      // so we can subtract them from the all-time total.
      supabase
        .from("badge_events")
        .select("id", { count: "exact", head: true })
        .or(BADGE_IGNORED_HOST_OR_FILTER),
      supabase
        .from("badge_events")
        .select("badge_id, kind, referer_host, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(WINDOW),
    ]);

    if (countRes.error || eventsRes.error) {
      tableMissing = true;
    } else {
      totalAll = Math.max(0, (countRes.count ?? 0) - (ignoredCountRes.count ?? 0));
      events = ((eventsRes.data ?? []) as EventRow[]).filter(
        (e) => !isIgnoredBadgeHost(e.referer_host),
      );
    }
  } catch {
    tableMissing = true;
  }

  const last30 = events.length;
  const last7 = events.filter(
    (e) =>
      new Date(e.created_at).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).length;
  const uniqueSites = new Set(
    events.map((e) => e.referer_host).filter(Boolean),
  ).size;

  const bySite = topCounts(
    events.map((e) => ({ key: e.referer_host ?? "(unknown / direct)" })),
  );
  const byBadge = topCounts(events.map((e) => ({ key: e.badge_id })));
  const byKind = topCounts(events.map((e) => ({ key: e.kind })));
  const recent = events.slice(0, 30);

  return (
    <div>
      <PageHeader
        title="Badge tracking"
        description="Cookie-free impressions for the “Powered by Genera” and “Book with Genera” badges customers embed on their own sites. Counts every badge load over the last 30 days. Genera’s own domains and local development are excluded."
      />

      {tableMissing ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">No badge data yet.</p>
          <p className="mt-1">
            If you have not run it already, apply the{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">
              badge_events
            </code>{" "}
            migration (<code className="rounded bg-amber-100 px-1.5 py-0.5">supabase db push</code>),
            then impressions will appear here as customers load the badges.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Stat label="Impressions (all time)" value={totalAll} accent />
            <Stat label="Last 30 days" value={last30} />
            <Stat label="Last 7 days" value={last7} />
            <Stat label="Sites showing it" value={uniqueSites} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel
              title="Top sites"
              subtitle="Where the badge is being shown (last 30 days)"
              empty={bySite.length === 0}
            >
              <ul className="divide-y divide-cream-dark">
                {bySite.slice(0, 12).map((row) => (
                  <BarRow
                    key={row.key}
                    label={row.key}
                    count={row.count}
                    max={bySite[0]?.count ?? 1}
                  />
                ))}
              </ul>
            </Panel>

            <Panel
              title="By badge"
              subtitle="Which styles get loaded most"
              empty={byBadge.length === 0}
            >
              <ul className="divide-y divide-cream-dark">
                {byBadge.slice(0, 12).map((row) => (
                  <BarRow
                    key={row.key}
                    label={BADGES_BY_ID[row.key]?.label ?? row.key}
                    count={row.count}
                    max={byBadge[0]?.count ?? 1}
                  />
                ))}
              </ul>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
            <Panel title="By type" empty={byKind.length === 0}>
              <ul className="divide-y divide-cream-dark">
                {byKind.map((row) => (
                  <BarRow
                    key={row.key}
                    label={row.key === "book" ? "Book with Genera" : "Powered by Genera"}
                    count={row.count}
                    max={byKind[0]?.count ?? 1}
                  />
                ))}
              </ul>
            </Panel>

            <Panel title="Recent impressions" empty={recent.length === 0}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-ink-soft">
                      <th className="pb-2 pr-4 font-semibold">When</th>
                      <th className="pb-2 pr-4 font-semibold">Site</th>
                      <th className="pb-2 font-semibold">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-dark">
                    {recent.map((e, i) => (
                      <tr key={`${e.created_at}-${i}`}>
                        <td className="py-2 pr-4 whitespace-nowrap text-ink-soft">
                          {formatDateTime(e.created_at)}
                        </td>
                        <td className="py-2 pr-4 text-ink">
                          {e.referer_host ?? "(unknown)"}
                        </td>
                        <td className="py-2 text-ink-soft">
                          {BADGES_BY_ID[e.badge_id]?.label ?? e.badge_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-teal-mid bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </p>
      <p
        className={`mt-2 font-massilia text-3xl font-bold ${
          accent ? "text-forest" : "text-ink"
        }`}
      >
        {value.toLocaleString("en-GB")}
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  empty,
  children,
}: {
  title: string;
  subtitle?: string;
  empty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-teal-mid bg-white p-5">
      <h2 className="font-massilia text-lg font-bold text-ink">{title}</h2>
      {subtitle && <p className="mb-3 text-xs text-ink-soft">{subtitle}</p>}
      {empty ? (
        <p className="py-6 text-center text-sm text-ink-soft">No data yet.</p>
      ) : (
        children
      )}
    </section>
  );
}

function BarRow({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max(4, Math.round((count / max) * 100)) : 0;
  return (
    <li className="py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm text-ink" title={label}>
          {label}
        </span>
        <span className="shrink-0 font-massilia text-sm font-bold text-forest">
          {count.toLocaleString("en-GB")}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-dark">
        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}
