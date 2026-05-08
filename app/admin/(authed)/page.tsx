import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = getAdminSupabase();
  const [logosRes, blogRes, faqsRes, spotsRes] = await Promise.all([
    supabase.from("trust_logos").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id, is_published", { count: "exact" }),
    supabase.from("faqs").select("id", { count: "exact", head: true }),
    supabase
      .from("founding_spots")
      .select("total_spots, claimed_spots")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  const totalLogos = logosRes.count ?? 0;
  const totalFaqs = faqsRes.count ?? 0;
  const totalPosts = blogRes.count ?? 0;
  const publishedPosts =
    blogRes.data?.filter((p) => p.is_published).length ?? 0;
  const draftPosts = totalPosts - publishedPosts;
  const totalSpots = spotsRes.data?.total_spots ?? 100;
  const claimedSpots = spotsRes.data?.claimed_spots ?? 0;
  const remainingSpots = Math.max(totalSpots - claimedSpots, 0);

  const tiles = [
    {
      label: "Trust logos",
      value: totalLogos,
      href: "/admin/logos",
      hint: "Logos shown on the landing page",
    },
    {
      label: "Founding spots remaining",
      value: remainingSpots,
      href: "/admin/founding-spots",
      hint: `${claimedSpots} of ${totalSpots} claimed`,
    },
    {
      label: "Blog posts",
      value: totalPosts,
      href: "/admin/blog",
      hint: `${publishedPosts} published · ${draftPosts} draft`,
    },
    {
      label: "FAQs",
      value: totalFaqs,
      href: "/admin/faqs",
      hint: "Questions on the FAQs page",
    },
  ];

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium text-ink-soft">Welcome back</p>
        <h1 className="mt-1 font-poppins text-3xl font-extrabold tracking-tight text-ink">
          Genera CMS
        </h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group block rounded-2xl border border-teal-mid bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {tile.label}
            </p>
            <p className="mt-3 font-poppins text-3xl font-extrabold text-ink">
              {tile.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{tile.hint}</p>
            <p className="mt-4 text-sm font-semibold text-forest group-hover:text-forest">
              Manage →
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-teal-mid bg-white p-6">
        <h2 className="font-poppins text-xl font-bold text-ink">
          Quick links
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/admin/blog/new"
              className="block rounded-lg border border-teal-mid px-4 py-3 text-sm font-medium text-ink hover:border-gold hover:bg-gold-light"
            >
              + Write a new blog post
            </Link>
          </li>
          <li>
            <Link
              href="/admin/faqs/new"
              className="block rounded-lg border border-teal-mid px-4 py-3 text-sm font-medium text-ink hover:border-gold hover:bg-gold-light"
            >
              + Add a new FAQ
            </Link>
          </li>
          <li>
            <Link
              href="/admin/logos/new"
              className="block rounded-lg border border-teal-mid px-4 py-3 text-sm font-medium text-ink hover:border-gold hover:bg-gold-light"
            >
              + Add a trust logo
            </Link>
          </li>
          <li>
            <Link
              href="/admin/founding-spots"
              className="block rounded-lg border border-teal-mid px-4 py-3 text-sm font-medium text-ink hover:border-gold hover:bg-gold-light"
            >
              Update spots remaining
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
