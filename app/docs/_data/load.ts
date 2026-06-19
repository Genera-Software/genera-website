import "server-only";
import { cache } from "react";
import { getPublicSupabase } from "@/lib/supabase/server";
import {
  SECTIONS,
  buildSearchIndex,
  type DocSection,
  type DocItem,
  type DocImage,
  type SearchEntry,
} from "./sections";

/* Loads the Help Centre from Supabase (help_centre_sections +
   help_centre_subsections), mapping rows back into the DocSection shape the
   pages render. Falls back to the code-defined SECTIONS if the DB is empty or
   unavailable, so /docs never breaks. Wrapped in React cache() to dedupe the
   query across the layout + page in a single request. */

type SubRow = {
  title: string;
  route: string | null;
  what_it_does: string | null;
  how_to_use: string[] | null;
  items: unknown;
  images: unknown;
  sort_order: number;
};

type SectionRow = {
  slug: string;
  num: number;
  title: string;
  tagline: string | null;
  intro: string | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number;
  help_centre_subsections: SubRow[] | null;
};

function mapSubsection(sub: SubRow): DocSection["subsections"][number] {
  const howToUse = Array.isArray(sub.how_to_use) ? sub.how_to_use : [];
  const items = Array.isArray(sub.items) ? (sub.items as DocItem[]) : [];
  const images = Array.isArray(sub.images) ? (sub.images as DocImage[]) : [];
  return {
    title: sub.title,
    route: sub.route ?? undefined,
    whatItDoes: sub.what_it_does ?? undefined,
    howToUse: howToUse.length ? howToUse : undefined,
    items: items.length ? items : undefined,
    images: images.length ? images : undefined,
  };
}

function mapSection(row: SectionRow): DocSection {
  const subs = [...(row.help_centre_subsections ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  return {
    slug: row.slug,
    num: row.num,
    title: row.title,
    tagline: row.tagline ?? "",
    intro: row.intro ?? undefined,
    image: row.image_url ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    subsections: subs.map(mapSubsection),
  };
}

export const getDocSections = cache(async (): Promise<DocSection[]> => {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("help_centre_sections")
      .select(
        "slug, num, title, tagline, intro, image_url, image_alt, sort_order, help_centre_subsections(title, route, what_it_does, how_to_use, items, images, sort_order)",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return SECTIONS;
    return (data as unknown as SectionRow[]).map(mapSection);
  } catch {
    return SECTIONS;
  }
});

export async function getDocSection(
  slug: string,
): Promise<DocSection | undefined> {
  const sections = await getDocSections();
  return sections.find((s) => s.slug === slug);
}

export async function getDocSearchIndex(): Promise<SearchEntry[]> {
  return buildSearchIndex(await getDocSections());
}

/** Lightweight, serialisable nav list for the client sidebar. */
export async function getDocNav() {
  const sections = await getDocSections();
  return sections.map(({ slug, num, title, tagline }) => ({
    slug,
    num,
    title,
    tagline,
  }));
}
