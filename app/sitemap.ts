import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPublicSupabase } from "@/lib/supabase/server";

export const revalidate = 3600;

const staticRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/our-story", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faqs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ path, priority, changeFrequency }) => ({
      url: new URL(path, SITE_URL).toString(),
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = getPublicSupabase();
    const nowIso = new Date().toISOString();
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at")
      .eq("is_published", true)
      .or(`published_at.is.null,published_at.lte.${nowIso}`);

    if (posts) {
      postEntries = posts.map((p) => ({
        url: new URL(`/blog/${p.slug}`, SITE_URL).toString(),
        lastModified: p.updated_at
          ? new Date(p.updated_at)
          : p.published_at
            ? new Date(p.published_at)
            : lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      }));
    }
  } catch {
    // Supabase env missing or query failed — fall back to static sitemap only.
  }

  return [...staticEntries, ...postEntries];
}

