import "server-only";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { existsSync, readFileSync } from "node:fs";

export type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
  project_id?: string;
};

let cachedClient: BetaAnalyticsDataClient | null = null;

export function normalizePrivateKey(key: string | undefined): string {
  if (!key) return "";
  return key.replace(/\\n/g, "\n");
}

export function loadGACredentials(): ServiceAccountCredentials | null {
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

export function getGAClient(creds: ServiceAccountCredentials) {
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

export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
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

export function buildStreamFilter(streamId: string) {
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

export type HeadlineMetrics = {
  users: number;
  sessions: number;
  usersChange: number;
  sessionsChange: number;
};

export async function fetchHeadlineMetrics(
  propertyId: string,
  creds: ServiceAccountCredentials,
  streamId: string,
): Promise<HeadlineMetrics> {
  const client = getGAClient(creds);
  const property = `properties/${propertyId}`;
  const filter = buildStreamFilter(streamId);
  const metrics = [{ name: "activeUsers" }, { name: "sessions" }];

  const [current] = await client.runReport({
    property,
    dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
    metrics,
    dimensionFilter: filter,
  });
  const [previous] = await client.runReport({
    property,
    dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }],
    metrics,
    dimensionFilter: filter,
  });

  function read(rows: typeof current.rows): { users: number; sessions: number } {
    if (!rows || rows.length === 0 || !rows[0]?.metricValues) {
      return { users: 0, sessions: 0 };
    }
    return {
      users: parseInt(rows[0].metricValues[0]?.value || "0", 10),
      sessions: parseInt(rows[0].metricValues[1]?.value || "0", 10),
    };
  }

  const c = read(current.rows);
  const p = read(previous.rows);

  return {
    users: c.users,
    sessions: c.sessions,
    usersChange: calculateChange(c.users, p.users),
    sessionsChange: calculateChange(c.sessions, p.sessions),
  };
}
