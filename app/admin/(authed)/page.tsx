import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";
import {
  fetchHeadlineMetrics,
  loadGACredentials,
  type HeadlineMetrics,
} from "@/lib/analytics/ga-client";
import type {
  SupportTicketCategory,
  SupportTicketStatus,
} from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const WEBSITE_STREAM_ID = "14828593193";

const STATUS_BADGE: Record<SupportTicketStatus, string> = {
  new: "bg-amber-50 text-amber-700",
  in_progress: "bg-sky-50 text-sky-700",
  completed: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABEL: Record<SupportTicketStatus, string> = {
  new: "New",
  in_progress: "In progress",
  completed: "Completed",
};

const CATEGORY_LABEL: Record<SupportTicketCategory, string> = {
  technical: "Technical",
  billing: "Billing",
  feature_request: "Feature",
  account: "Account",
  other: "Other",
};

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-GB").format(n);
}

function formatPercentage(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-AU", {
    month: "short",
    day: "numeric",
  });
}

function changeClass(n: number) {
  if (n > 0) return "text-emerald-700";
  if (n < 0) return "text-red-600";
  return "text-ink-soft";
}

async function loadAnalytics(): Promise<{
  metrics: HeadlineMetrics | null;
  error: string | null;
}> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const creds = loadGACredentials();
  if (!propertyId || !creds) {
    return { metrics: null, error: "GA not configured" };
  }
  try {
    const metrics = await fetchHeadlineMetrics(
      propertyId,
      creds,
      WEBSITE_STREAM_ID,
    );
    return { metrics, error: null };
  } catch (err) {
    const e = err as { details?: string; message?: string };
    return {
      metrics: null,
      error: e?.details || e?.message || "Unable to load analytics",
    };
  }
}

export default async function AdminDashboard() {
  const supabase = getAdminSupabase();

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [
    analyticsRes,
    blogCountsRes,
    recentBlogRes,
    ticketCountsByStatusRes,
    recentTicketsRes,
    recentSubmissionsRes,
    submissions7dRes,
    formsListRes,
  ] = await Promise.all([
    loadAnalytics(),
    supabase.from("blog_posts").select("id, is_published"),
    supabase
      .from("blog_posts")
      .select("id, title, slug, is_published, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase.from("support_tickets").select("status"),
    supabase
      .from("support_tickets")
      .select("id, subject, category, status, account_email, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("form_submissions")
      .select("id, form_id, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("form_submissions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabase.from("forms").select("id, name, slug"),
  ]);

  const totalPosts = blogCountsRes.data?.length ?? 0;
  const publishedPosts =
    blogCountsRes.data?.filter((p) => p.is_published).length ?? 0;
  const draftPosts = totalPosts - publishedPosts;

  const statusCounts = (ticketCountsByStatusRes.data ?? []).reduce(
    (acc, t) => {
      const s = t.status as SupportTicketStatus;
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    },
    {} as Record<SupportTicketStatus, number>,
  );
  const newCount = statusCounts.new ?? 0;
  const inProgressCount = statusCounts.in_progress ?? 0;

  const submissions7d = submissions7dRes.count ?? 0;

  const formsById = new Map((formsListRes.data ?? []).map((f) => [f.id, f]));

  const analyticsMetrics = analyticsRes.metrics;

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium text-ink-soft">Welcome back</p>
        <h1 className="mt-1 font-poppins text-3xl font-extrabold tracking-tight text-ink">
          Genera CMS
        </h1>
      </header>

      {/* Top tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Analytics */}
        <Link
          href="/admin/analytics"
          className="group block rounded-2xl border border-teal-mid bg-white p-5 transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Visitors (30d)
          </p>
          {analyticsMetrics ? (
            <>
              <p className="mt-3 font-poppins text-3xl font-extrabold text-ink">
                {formatNumber(analyticsMetrics.users)}
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${changeClass(
                  analyticsMetrics.usersChange,
                )}`}
              >
                {formatPercentage(analyticsMetrics.usersChange)} vs prev 30d
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 font-poppins text-3xl font-extrabold text-ink-soft">
                —
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {analyticsRes.error ?? "Not available"}
              </p>
            </>
          )}
          <p className="mt-4 text-sm font-semibold text-forest">
            View analytics →
          </p>
        </Link>

        {/* Tickets */}
        <Link
          href={newCount ? "/admin/support?status=new" : "/admin/support"}
          className="group block rounded-2xl border border-teal-mid bg-white p-5 transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Open tickets
          </p>
          <p className="mt-3 font-poppins text-3xl font-extrabold text-ink">
            {newCount + inProgressCount}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {newCount} new · {inProgressCount} in progress
          </p>
          <p className="mt-4 text-sm font-semibold text-forest">
            View support →
          </p>
        </Link>

        {/* Form submissions */}
        <Link
          href="/admin/forms"
          className="group block rounded-2xl border border-teal-mid bg-white p-5 transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Form submissions (7d)
          </p>
          <p className="mt-3 font-poppins text-3xl font-extrabold text-ink">
            {formatNumber(submissions7d)}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Across {formsById.size} form{formsById.size === 1 ? "" : "s"}
          </p>
          <p className="mt-4 text-sm font-semibold text-forest">View forms →</p>
        </Link>

        {/* Blog */}
        <Link
          href="/admin/blog"
          className="group block rounded-2xl border border-teal-mid bg-white p-5 transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Blog posts
          </p>
          <p className="mt-3 font-poppins text-3xl font-extrabold text-ink">
            {totalPosts}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {publishedPosts} published · {draftPosts} draft
          </p>
          <p className="mt-4 text-sm font-semibold text-forest">Manage blog →</p>
        </Link>
      </div>

      {/* Two-column: recent tickets + recent submissions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent support tickets */}
        <section className="rounded-2xl border border-teal-mid bg-white">
          <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4">
            <h2 className="font-poppins text-lg font-bold text-ink">
              Recent tickets
            </h2>
            <Link
              href="/admin/support"
              className="text-xs font-semibold text-forest hover:underline"
            >
              See all →
            </Link>
          </div>
          {(recentTicketsRes.data ?? []).length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">
              No support tickets yet.
            </p>
          ) : (
            <ul className="divide-y divide-cream-dark">
              {(recentTicketsRes.data ?? []).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/admin/support/${t.id}`}
                    className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-cream"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {t.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {CATEGORY_LABEL[t.category as SupportTicketCategory] ??
                          t.category}
                        {t.account_email ? ` · ${t.account_email}` : ""} ·{" "}
                        {timeAgo(t.created_at)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_BADGE[t.status as SupportTicketStatus]
                      }`}
                    >
                      {STATUS_LABEL[t.status as SupportTicketStatus]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent form submissions */}
        <section className="rounded-2xl border border-teal-mid bg-white">
          <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4">
            <h2 className="font-poppins text-lg font-bold text-ink">
              Recent form submissions
            </h2>
            <Link
              href="/admin/forms"
              className="text-xs font-semibold text-forest hover:underline"
            >
              See all →
            </Link>
          </div>
          {(recentSubmissionsRes.data ?? []).length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">
              No form submissions yet.
            </p>
          ) : (
            <ul className="divide-y divide-cream-dark">
              {(recentSubmissionsRes.data ?? []).map((s) => {
                const form = formsById.get(s.form_id);
                const payload =
                  s.payload &&
                  typeof s.payload === "object" &&
                  !Array.isArray(s.payload)
                    ? (s.payload as Record<string, unknown>)
                    : {};
                const summary =
                  (typeof payload.email === "string" && payload.email) ||
                  (typeof payload.name === "string" && payload.name) ||
                  (typeof payload.full_name === "string" && payload.full_name) ||
                  "—";
                return (
                  <li key={s.id}>
                    <Link
                      href={
                        form
                          ? `/admin/forms/${s.form_id}/edit`
                          : "/admin/forms"
                      }
                      className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-cream"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {form?.name ?? "Unknown form"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-ink-soft">
                          {summary} · {timeAgo(s.created_at)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Recent blog posts */}
      <section className="mt-8 rounded-2xl border border-teal-mid bg-white">
        <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4">
          <h2 className="font-poppins text-lg font-bold text-ink">
            Recent blog posts
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog/new"
              className="text-xs font-semibold text-gold hover:underline"
            >
              + New post
            </Link>
            <Link
              href="/admin/blog"
              className="text-xs font-semibold text-forest hover:underline"
            >
              See all →
            </Link>
          </div>
        </div>
        {(recentBlogRes.data ?? []).length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ink-soft">
            No blog posts yet.
          </p>
        ) : (
          <ul className="divide-y divide-cream-dark">
            {(recentBlogRes.data ?? []).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/blog/${p.id}/edit`}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-cream"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      Updated {timeAgo(p.updated_at)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.is_published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-cream-dark text-ink-soft"
                    }`}
                  >
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
