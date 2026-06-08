import "server-only";
import Link from "next/link";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { existsSync, readFileSync } from "node:fs";
import PageHeader from "../_components/PageHeader";

const STREAMS = [
  {
    key: "website",
    label: "Website",
    domain: "www.generasoftware.com",
    streamId: "14828593193",
  },
  {
    key: "app",
    label: "App",
    domain: "app.generasoftware.com",
    streamId: "14841974706",
  },
] as const;

type StreamKey = (typeof STREAMS)[number]["key"];

function isStreamKey(value: string | undefined): value is StreamKey {
  return value === "website" || value === "app";
}

export const dynamic = "force-dynamic";

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
  project_id?: string;
};

type AnalyticsData = {
  websiteTraffic: {
    totalUsers: number;
    newUsers: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    usersChange: number;
    newUsersChange: number;
    sessionsChange: number;
    pageViewsChange: number;
    bounceRateChange: number;
  };
  trafficSources: {
    source: string;
    users: number;
    percentage: number;
    change: number;
  }[];
  topReferrers: {
    source: string;
    medium: string;
    users: number;
    sessions: number;
  }[];
  topPages: {
    page: string;
    views: number;
    users: number;
    bounceRate: number;
  }[];
  deviceBreakdown: { device: string; percentage: number }[];
  geographicData: { country: string; percentage: number }[];
  message?: string;
  error?: string;
};

const EMPTY_ANALYTICS: AnalyticsData = {
  websiteTraffic: {
    totalUsers: 0,
    newUsers: 0,
    sessions: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: "0m 0s",
    usersChange: 0,
    newUsersChange: 0,
    sessionsChange: 0,
    pageViewsChange: 0,
    bounceRateChange: 0,
  },
  trafficSources: [],
  topReferrers: [],
  topPages: [],
  deviceBreakdown: [],
  geographicData: [],
};

let cachedClient: BetaAnalyticsDataClient | null = null;

function normalizePrivateKey(key: string | undefined): string {
  if (!key) return "";
  return key.replace(/\\n/g, "\n");
}

function loadServiceAccountCredentials(): ServiceAccountCredentials | null {
  const envClientEmail = process.env.GA_CLIENT_EMAIL;
  const envPrivateKey = normalizePrivateKey(process.env.GA_PRIVATE_KEY);
  const envProjectId = process.env.GA_PROJECT_ID;

  if (envClientEmail && envPrivateKey) {
    return {
      client_email: envClientEmail,
      private_key: envPrivateKey,
      project_id: envProjectId,
    };
  }

  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credsPath && existsSync(credsPath)) {
    const fileCreds = JSON.parse(
      readFileSync(credsPath, "utf-8"),
    ) as ServiceAccountCredentials;
    fileCreds.private_key = normalizePrivateKey(fileCreds.private_key);
    return fileCreds;
  }

  return null;
}

function getAnalyticsClient(creds: ServiceAccountCredentials) {
  if (!cachedClient) {
    cachedClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: creds.client_email,
        private_key: creds.private_key,
      },
      projectId: creds.project_id,
      // REST transport — Turbopack mangles @grpc/grpc-js so its error frames
      // come back with code/details = undefined. REST is a 1:1 substitute.
      fallback: "rest",
    });
  }
  return cachedClient;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-GB").format(num);
}

function formatPercentage(num: number): string {
  return `${num >= 0 ? "+" : ""}${num.toFixed(1)}%`;
}

const EXCLUDE_ADMIN_FILTER = {
  notExpression: {
    filter: {
      fieldName: "pagePath",
      stringFilter: {
        matchType: "BEGINS_WITH" as const,
        value: "/admin",
      },
    },
  },
};

function buildStreamFilter(streamId: string) {
  return {
    andGroup: {
      expressions: [
        EXCLUDE_ADMIN_FILTER,
        {
          filter: {
            fieldName: "streamId",
            stringFilter: {
              matchType: "EXACT" as const,
              value: streamId,
            },
          },
        },
      ],
    },
  };
}

const BASE_METRICS = [
  { name: "activeUsers" },
  { name: "newUsers" },
  { name: "sessions" },
  { name: "screenPageViews" },
  { name: "bounceRate" },
  { name: "averageSessionDuration" },
];

type MetricsRow = {
  users: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgDuration: number;
};

type MetricRow = { metricValues?: { value?: string | null }[] | null };

function readMetrics(rows: MetricRow[] | null | undefined): MetricsRow {
  const empty = {
    users: 0,
    newUsers: 0,
    sessions: 0,
    pageViews: 0,
    bounceRate: 0,
    avgDuration: 0,
  };
  if (!rows || rows.length === 0 || !rows[0]?.metricValues) return empty;
  const v = rows[0].metricValues;
  return {
    users: parseInt(v[0]?.value || "0", 10),
    newUsers: parseInt(v[1]?.value || "0", 10),
    sessions: parseInt(v[2]?.value || "0", 10),
    pageViews: parseInt(v[3]?.value || "0", 10),
    bounceRate: parseFloat(v[4]?.value || "0") * 100,
    avgDuration: parseFloat(v[5]?.value || "0"),
  };
}

async function fetchAnalyticsData(
  propertyId: string,
  creds: ServiceAccountCredentials,
  streamId: string,
): Promise<AnalyticsData> {
  const client = getAnalyticsClient(creds);
  const property = `properties/${propertyId}`;
  const streamFilter = buildStreamFilter(streamId);

  const [currentResponse] = await client.runReport({
    property,
    dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
    metrics: BASE_METRICS,
    dimensionFilter: streamFilter,
  });

  const [previousResponse] = await client.runReport({
    property,
    dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }],
    metrics: BASE_METRICS,
    dimensionFilter: streamFilter,
  });

  const current = readMetrics(currentResponse.rows);
  const previous = readMetrics(previousResponse.rows);

  const [currentTrafficResponse] = await client.runReport({
    property,
    dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "activeUsers" }],
    dimensionFilter: streamFilter,
  });

  const [previousTrafficResponse] = await client.runReport({
    property,
    dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "activeUsers" }],
    dimensionFilter: streamFilter,
  });

  const sourceMap = new Map<string, { current: number; previous: number }>();
  for (const row of currentTrafficResponse.rows ?? []) {
    const source = row.dimensionValues?.[0]?.value || "Unknown";
    const users = parseInt(row.metricValues?.[0]?.value || "0", 10);
    const entry = sourceMap.get(source) ?? { current: 0, previous: 0 };
    entry.current += users;
    sourceMap.set(source, entry);
  }
  for (const row of previousTrafficResponse.rows ?? []) {
    const source = row.dimensionValues?.[0]?.value || "Unknown";
    const users = parseInt(row.metricValues?.[0]?.value || "0", 10);
    const entry = sourceMap.get(source) ?? { current: 0, previous: 0 };
    entry.previous += users;
    sourceMap.set(source, entry);
  }

  const totalUsers = current.users || 1;
  const trafficSources = Array.from(sourceMap.entries())
    .map(([source, data]) => ({
      source,
      users: data.current,
      percentage: Math.round((data.current / totalUsers) * 100),
      change: calculateChange(data.current, data.previous),
    }))
    .sort((a, b) => b.users - a.users);

  const [referrersResponse] = await client.runReport({
    property,
    dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
    metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 15,
    dimensionFilter: streamFilter,
  });

  const topReferrers = (referrersResponse.rows ?? [])
    .filter((row) => {
      const source = row.dimensionValues?.[0]?.value;
      return source && source !== "(direct)" && source !== "(not set)";
    })
    .map((row) => ({
      source: row.dimensionValues?.[0]?.value || "Unknown",
      medium: row.dimensionValues?.[1]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0", 10),
      sessions: parseInt(row.metricValues?.[1]?.value || "0", 10),
    }));

  const [topPagesResponse] = await client.runReport({
    property,
    dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "bounceRate" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
    dimensionFilter: streamFilter,
  });

  const topPages = (topPagesResponse.rows ?? []).map((row) => ({
    page: row.dimensionValues?.[0]?.value || "/",
    views: parseInt(row.metricValues?.[0]?.value || "0", 10),
    users: parseInt(row.metricValues?.[1]?.value || "0", 10),
    bounceRate: Math.round(
      parseFloat(row.metricValues?.[2]?.value || "0") * 100,
    ),
  }));

  const [deviceResponse] = await client.runReport({
    property,
    dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "activeUsers" }],
    dimensionFilter: streamFilter,
  });

  const deviceBreakdown = (deviceResponse.rows ?? [])
    .map((row) => ({
      device: row.dimensionValues?.[0]?.value || "Unknown",
      percentage: Math.round(
        (parseInt(row.metricValues?.[0]?.value || "0", 10) / totalUsers) * 100,
      ),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const [geographicResponse] = await client.runReport({
    property,
    dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
    dimensions: [{ name: "country" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: 10,
    dimensionFilter: streamFilter,
  });

  const geographicData = (geographicResponse.rows ?? [])
    .filter((row) => row.dimensionValues?.[0]?.value !== "(not set)")
    .map((row) => ({
      country: row.dimensionValues?.[0]?.value || "Unknown",
      percentage: Math.round(
        (parseInt(row.metricValues?.[0]?.value || "0", 10) / totalUsers) * 100,
      ),
    }));

  return {
    websiteTraffic: {
      totalUsers: current.users,
      newUsers: current.newUsers,
      sessions: current.sessions,
      pageViews: current.pageViews,
      bounceRate: Math.round(current.bounceRate),
      avgSessionDuration: formatDuration(current.avgDuration),
      usersChange: calculateChange(current.users, previous.users),
      newUsersChange: calculateChange(current.newUsers, previous.newUsers),
      sessionsChange: calculateChange(current.sessions, previous.sessions),
      pageViewsChange: calculateChange(current.pageViews, previous.pageViews),
      bounceRateChange: calculateChange(current.bounceRate, previous.bounceRate),
    },
    trafficSources,
    topReferrers,
    topPages,
    deviceBreakdown,
    geographicData,
    message:
      current.users > 0
        ? "Connected to Google Analytics."
        : "Analytics is connected. Data will appear here once your site receives traffic.",
  };
}

function changeClass(change: number): string {
  if (change > 0) return "text-emerald-700";
  if (change < 0) return "text-red-600";
  return "text-ink-soft";
}

function ChangeArrow({ change }: { change: number }) {
  const path =
    change > 0
      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      : change < 0
        ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
        : "M20 12H4";
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  change,
  iconColor,
  icon,
}: {
  label: string;
  value: string;
  change?: number;
  iconColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-teal-mid bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-lg p-2 ${iconColor}`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </svg>
        </div>
        {typeof change === "number" && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-semibold ${changeClass(change)}`}
          >
            <ChangeArrow change={change} />
            {formatPercentage(change)}
          </div>
        )}
      </div>
      <p className="font-massilia text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}

export default async function AnalyticsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ stream?: string }>;
}) {
  const { stream: streamRaw } = await searchParams;
  const stream: StreamKey = isStreamKey(streamRaw) ? streamRaw : "website";
  const activeStream = STREAMS.find((s) => s.key === stream)!;
  const propertyId = process.env.GA4_PROPERTY_ID;
  const creds = loadServiceAccountCredentials();

  let analytics: AnalyticsData;
  let configurationError: string | null = null;

  if (!propertyId || !creds) {
    configurationError =
      "Google Analytics is not configured. Set GA4_PROPERTY_ID and either GA_CLIENT_EMAIL + GA_PRIVATE_KEY, or GOOGLE_APPLICATION_CREDENTIALS, in your environment.";
    analytics = EMPTY_ANALYTICS;
  } else {
    try {
      analytics = await fetchAnalyticsData(
        propertyId,
        creds,
        activeStream.streamId,
      );
    } catch (err) {
      // gRPC errors stringify to "undefined undefined: undefined" through the
      // RSC boundary; pull `details` first since it carries the human message.
      const e = err as { details?: string; message?: string; code?: number };
      const detail =
        e?.details ||
        e?.message ||
        (err instanceof Error ? err.message : "") ||
        "Unknown error";
      console.error("[admin/analytics] GA Data API error:", err);
      analytics = {
        ...EMPTY_ANALYTICS,
        error: `Unable to fetch analytics data: ${detail}`,
      };
    }
  }

  const traffic = analytics.websiteTraffic;
  const pagesPerSession =
    traffic.sessions > 0
      ? Math.round((traffic.pageViews / traffic.sessions) * 10) / 10
      : 0;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description={`Last 30 days vs the previous 30 days for ${activeStream.domain}. Admin pages are excluded.`}
      />

      <nav className="-mt-3 mb-6 flex gap-1 border-b border-teal-mid">
        {STREAMS.map((s) => {
          const active = s.key === stream;
          return (
            <Link
              key={s.key}
              href={`/admin/analytics?stream=${s.key}`}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-forest text-forest"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {s.label}
              <span className="ml-2 text-xs font-normal text-ink-soft/70">
                {s.domain}
              </span>
            </Link>
          );
        })}
      </nav>

      {configurationError && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          {configurationError}
        </div>
      )}
      {analytics.error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {analytics.error}
        </div>
      )}
      {!configurationError && !analytics.error && analytics.message && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          {analytics.message}
        </div>
      )}

      {/* Website Traffic Overview */}
      <section className="mb-8">
        <h2 className="font-massilia text-xl font-bold text-ink">
          Website traffic overview
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Headline metrics, last 30 days vs previous 30 days.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total users"
            value={formatNumber(traffic.totalUsers)}
            change={traffic.usersChange}
            iconColor="bg-forest/10 text-forest"
            icon={
              <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </>
            }
          />
          <MetricCard
            label="New users"
            value={formatNumber(traffic.newUsers)}
            change={traffic.newUsersChange}
            iconColor="bg-emerald-100 text-emerald-700"
            icon={
              <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </>
            }
          />
          <MetricCard
            label="Sessions"
            value={formatNumber(traffic.sessions)}
            change={traffic.sessionsChange}
            iconColor="bg-gold/20 text-gold"
            icon={
              <>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </>
            }
          />
          <MetricCard
            label="Page views"
            value={formatNumber(traffic.pageViews)}
            change={traffic.pageViewsChange}
            iconColor="bg-blue-100 text-blue-700"
            icon={
              <>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </>
            }
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Bounce rate"
            value={`${traffic.bounceRate}%`}
            change={traffic.bounceRateChange}
            iconColor="bg-red-100 text-red-700"
            icon={
              <>
                <path d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </>
            }
          />
          <MetricCard
            label="Avg. session duration"
            value={traffic.avgSessionDuration}
            iconColor="bg-indigo-100 text-indigo-700"
            icon={
              <>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </>
            }
          />
          <MetricCard
            label="Pages per session"
            value={`${pagesPerSession}`}
            iconColor="bg-cyan-100 text-cyan-700"
            icon={
              <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </>
            }
          />
        </div>
      </section>

      {/* Traffic sources */}
      <section className="mb-8">
        <h2 className="font-massilia text-xl font-bold text-ink">
          Traffic sources
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Where visitors are coming from in the last 30 days.
        </p>

        <div className="mt-5 space-y-3">
          {analytics.trafficSources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-teal-mid bg-white px-5 py-8 text-center text-sm text-ink-soft">
              No traffic source data yet.
            </div>
          ) : (
            analytics.trafficSources.map((source, i) => (
              <div
                key={source.source}
                className="flex items-center justify-between rounded-2xl border border-teal-mid bg-white p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-dark font-massilia text-sm font-bold text-ink">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{source.source}</p>
                    <p className="text-xs text-ink-soft">
                      {formatNumber(source.users)} users · {source.percentage}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden w-32 sm:block">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-dark">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${changeClass(source.change)}`}
                  >
                    <ChangeArrow change={source.change} />
                    {formatPercentage(source.change)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Top referrers */}
      <section className="mb-8">
        <h2 className="font-massilia text-xl font-bold text-ink">
          Top referrers
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Specific sources sending traffic — Instagram, search engines, link
          shorteners, etc. (top 15, excluding direct).
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-teal-mid bg-white">
          {analytics.topReferrers.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-ink-soft">
              No referral data yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Medium</th>
                  <th className="px-5 py-3 text-right">Users</th>
                  <th className="px-5 py-3 text-right">Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {analytics.topReferrers.map((r) => (
                  <tr
                    key={`${r.source}-${r.medium}`}
                    className="hover:bg-cream"
                  >
                    <td className="px-5 py-3 align-middle font-medium text-ink">
                      {r.source}
                    </td>
                    <td className="px-5 py-3 align-middle text-ink-soft">
                      {r.medium}
                    </td>
                    <td className="px-5 py-3 text-right align-middle text-ink-soft">
                      {formatNumber(r.users)}
                    </td>
                    <td className="px-5 py-3 text-right align-middle text-ink-soft">
                      {formatNumber(r.sessions)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Top pages */}
      <section className="mb-8">
        <h2 className="font-massilia text-xl font-bold text-ink">Top pages</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Most visited pages on the public site.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-teal-mid bg-white">
          {analytics.topPages.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-ink-soft">
              No page data yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Page</th>
                  <th className="px-5 py-3 text-right">Views</th>
                  <th className="px-5 py-3 text-right">Users</th>
                  <th className="px-5 py-3 text-right">Bounce rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {analytics.topPages.map((p) => (
                  <tr key={p.page} className="hover:bg-cream">
                    <td className="px-5 py-3 align-middle">
                      <span className="font-medium text-ink">{p.page}</span>
                    </td>
                    <td className="px-5 py-3 text-right align-middle text-ink-soft">
                      {formatNumber(p.views)}
                    </td>
                    <td className="px-5 py-3 text-right align-middle text-ink-soft">
                      {formatNumber(p.users)}
                    </td>
                    <td className="px-5 py-3 text-right align-middle text-ink-soft">
                      {p.bounceRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Device + Geo */}
      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="font-massilia text-xl font-bold text-ink">
            Device breakdown
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            How visitors access the site.
          </p>
          <div className="mt-5 rounded-2xl border border-teal-mid bg-white p-5">
            {analytics.deviceBreakdown.length === 0 ? (
              <p className="text-sm text-ink-soft">No device data yet.</p>
            ) : (
              <ul className="space-y-3">
                {analytics.deviceBreakdown.map((d) => (
                  <li
                    key={d.device}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-forest" />
                      <span className="text-sm font-medium capitalize text-ink">
                        {d.device}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-3">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-cream-dark">
                        <div
                          className="h-full rounded-full bg-forest"
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm text-ink-soft">
                        {d.percentage}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-massilia text-xl font-bold text-ink">
            Top countries
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Where visitors are located.
          </p>
          <div className="mt-5 rounded-2xl border border-teal-mid bg-white p-5">
            {analytics.geographicData.length === 0 ? (
              <p className="text-sm text-ink-soft">No geographic data yet.</p>
            ) : (
              <ul className="space-y-3">
                {analytics.geographicData.map((c) => (
                  <li
                    key={c.country}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                      <span className="text-sm font-medium text-ink">
                        {c.country}
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-3">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-cream-dark">
                        <div
                          className="h-full rounded-full bg-gold"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm text-ink-soft">
                        {c.percentage}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
