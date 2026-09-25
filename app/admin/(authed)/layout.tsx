import type { Metadata } from "next";
import Sidebar from "./_components/Sidebar";
import SupportReplyBanner from "./_components/SupportReplyBanner";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/admin/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function loadBadges(): Promise<Record<string, number>> {
  try {
    const supabase = getAdminSupabase();
    const [ticketsRes, repliesRes, submissionsRes] = await Promise.all([
      supabase.from("support_tickets").select("id").eq("status", "new"),
      supabase
        .from("support_ticket_messages")
        .select("ticket_id")
        .eq("direction", "inbound")
        .is("read_at", null),
      supabase
        .from("form_submissions")
        .select("id", { count: "exact", head: true })
        .is("read_at", null),
    ]);

    // A ticket that is both new and has an unread reply should still count once,
    // so the badge reads as "tickets needing attention".
    const needsAttention = new Set<string>();
    for (const t of ticketsRes.data ?? []) needsAttention.add(t.id);
    for (const m of repliesRes.data ?? []) needsAttention.add(m.ticket_id);

    return {
      "/admin/support": needsAttention.size,
      "/admin/forms": submissionsRes.count ?? 0,
    };
  } catch {
    return {};
  }
}

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative check. The middleware redirects unauthenticated requests
  // already, but this re-verifies the session server-side for every admin page.
  const user = await requireAdminUser();
  const badges = await loadBadges();
  return (
    <div className="admin-shell min-h-screen bg-cream text-ink">
      <Sidebar badges={badges} userEmail={user.email} />
      <div className="relative lg:pl-64">
        {/* A light teal wash behind the page header, like the site's light
            sections — fades out before the content gets going. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-teal-soft/70 to-transparent"
        />
        <main className="relative px-4 pb-12 pt-20 lg:px-10 lg:pt-10">
          {/* Pages opt out of the reading-width cap with data-full-width. */}
          <div className="mx-auto max-w-6xl has-[[data-full-width]]:max-w-none">
            {/* Unread customer replies, surfaced on every admin page — the
                sidebar count on its own was too easy to walk past. */}
            <SupportReplyBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
