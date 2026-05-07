import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const routes = [
  { path: "/", priority: 1 },
  { path: "/features", priority: 0.9 },
  { path: "/blog", priority: 0.7 },
  { path: "/our-story", priority: 0.7 },
  { path: "/faqs", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, priority }) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified,
    changeFrequency: path === "/blog" ? "weekly" : "monthly",
    priority,
  }));
}

