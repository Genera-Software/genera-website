import type { Metadata } from "next";
import Sidebar from "./_components/Sidebar";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function loadBadges(): Promise<Record<string, number>> {
  try {
    const supabase = getAdminSupabase();
    const [ticketsRes, submissionsRes] = await Promise.all([
      supabase
        .from("support_tickets")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("form_submissions")
        .select("id", { count: "exact", head: true })
        .is("read_at", null),
    ]);
    return {
      "/admin/support": ticketsRes.count ?? 0,
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
  const badges = await loadBadges();
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Sidebar badges={badges} />
      <div className="lg:pl-64">
        <main className="px-4 pb-12 pt-20 lg:px-8 lg:pt-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
