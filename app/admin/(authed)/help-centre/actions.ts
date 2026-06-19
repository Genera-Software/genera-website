"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import { deleteFromBucket, uploadToBucket } from "@/lib/admin/upload";

const BUCKET = "website-images" as const;
const FOLDER = "docs";

type SubsectionUpdate =
  Database["public"]["Tables"]["help_centre_subsections"]["Update"];

type DocItem = { label: string; desc: string };
type DocImage = {
  src: string;
  alt: string;
  caption?: string;
  placeholder?: boolean;
};

function bool(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true";
}

/** Revalidate every public docs route (layout fetches nav/search; pages fetch
    sections), so edits show within the next request. */
function revalidateDocs() {
  revalidatePath("/docs", "layout");
}

/** Collect bucket-hosted image URLs from an images jsonb value. */
function bucketUrls(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return (images as DocImage[])
    .map((im) => im?.src)
    .filter(
      (src): src is string =>
        typeof src === "string" &&
        src.includes(`/storage/v1/object/public/${BUCKET}/`),
    );
}

async function deleteBucketUrls(urls: string[]) {
  for (const url of urls) {
    await deleteFromBucket(url, BUCKET);
  }
}

/* ───────────────────────────── Sections ───────────────────────────── */

const SectionSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes"),
  num: z.coerce.number().int().min(0).max(100000).default(0),
  title: z.string().trim().min(1, "Title is required").max(120),
  tagline: z.string().trim().max(200).default(""),
  intro: z.string().trim().max(2000).optional(),
  image_alt: z.string().trim().max(300).optional(),
  is_published: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
  remove_image: z.boolean().default(false),
});

function parseSection(fd: FormData) {
  return SectionSchema.parse({
    slug: fd.get("slug") ?? "",
    num: fd.get("num") ?? 0,
    title: fd.get("title") ?? "",
    tagline: fd.get("tagline") ?? "",
    intro: (fd.get("intro") as string) || undefined,
    image_alt: (fd.get("image_alt") as string) || undefined,
    is_published: bool(fd.get("is_published")),
    sort_order: fd.get("sort_order") ?? 0,
    remove_image: bool(fd.get("remove_image")),
  });
}

export async function createSection(formData: FormData) {
  const data = parseSection(formData);
  const supabase = getAdminSupabase();

  const file = formData.get("image_file");
  let image_url: string | null = null;
  if (file instanceof File && file.size > 0) {
    image_url = await uploadToBucket(file, BUCKET, FOLDER);
  }

  const { error } = await supabase.from("help_centre_sections").insert({
    slug: data.slug,
    num: data.num,
    title: data.title,
    tagline: data.tagline,
    intro: data.intro ?? null,
    image_url,
    image_alt: data.image_alt ?? null,
    is_published: data.is_published,
    sort_order: data.sort_order,
  });
  if (error) throw new Error(error.message);

  revalidateDocs();
  redirect("/admin/help-centre");
}

export async function updateSection(id: string, formData: FormData) {
  const data = parseSection(formData);
  const supabase = getAdminSupabase();

  const { data: existing } = await supabase
    .from("help_centre_sections")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const file = formData.get("image_file");
  let image_url: string | null | undefined = undefined;
  if (file instanceof File && file.size > 0) {
    image_url = await uploadToBucket(file, BUCKET, FOLDER);
    if (existing?.image_url) await deleteFromBucket(existing.image_url, BUCKET);
  } else if (data.remove_image && existing?.image_url) {
    await deleteFromBucket(existing.image_url, BUCKET);
    image_url = null;
  }

  const update: Database["public"]["Tables"]["help_centre_sections"]["Update"] =
    {
      slug: data.slug,
      num: data.num,
      title: data.title,
      tagline: data.tagline,
      intro: data.intro ?? null,
      image_alt: data.image_alt ?? null,
      is_published: data.is_published,
      sort_order: data.sort_order,
    };
  if (image_url !== undefined) update.image_url = image_url;

  const { error } = await supabase
    .from("help_centre_sections")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidateDocs();
  redirect("/admin/help-centre");
}

export async function deleteSection(id: string) {
  const supabase = getAdminSupabase();

  // Gather images to clean up: the hero + every subsection gallery.
  const { data: sec } = await supabase
    .from("help_centre_sections")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();
  const { data: subs } = await supabase
    .from("help_centre_subsections")
    .select("images")
    .eq("section_id", id);

  const { error } = await supabase
    .from("help_centre_sections")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  const urls: string[] = [];
  if (sec?.image_url) urls.push(...bucketUrls([{ src: sec.image_url }]));
  for (const s of subs ?? []) urls.push(...bucketUrls(s.images));
  await deleteBucketUrls(urls);

  revalidateDocs();
  revalidatePath("/admin/help-centre");
}

export async function moveSection(id: string, direction: "up" | "down") {
  await swapSortOrder("help_centre_sections", id, direction);
  revalidateDocs();
  revalidatePath("/admin/help-centre");
}

/* ──────────────────────────── Subsections ──────────────────────────── */

const ItemSchema = z.object({
  label: z.string().trim().max(200),
  desc: z.string().trim().max(1000),
});

const ImageMetaSchema = z.object({
  src: z.string().trim().max(2000).default(""),
  alt: z.string().trim().max(400).default(""),
  caption: z.string().trim().max(600).default(""),
  placeholder: z.boolean().default(false),
  // Index of an uploaded file in the FormData (image_file_<n>), or null.
  fileIndex: z.number().int().nullable().default(null),
});

const SubsectionSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  route: z.string().trim().max(200).optional(),
  what_it_does: z.string().trim().max(4000).optional(),
  how_to_use: z.array(z.string().trim().max(1500)).default([]),
  items: z.array(ItemSchema).default([]),
  images_meta: z.array(ImageMetaSchema).default([]),
  is_published: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
});

function jsonField<T>(fd: FormData, key: string, fallback: T): T {
  const raw = fd.get(key);
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseSubsection(fd: FormData) {
  return SubsectionSchema.parse({
    title: fd.get("title") ?? "",
    route: (fd.get("route") as string) || undefined,
    what_it_does: (fd.get("what_it_does") as string) || undefined,
    how_to_use: jsonField<string[]>(fd, "how_to_use", []).filter(
      (s) => s.trim().length > 0,
    ),
    items: jsonField<DocItem[]>(fd, "items", []).filter(
      (it) => it.label.trim() || it.desc.trim(),
    ),
    images_meta: jsonField<unknown[]>(fd, "images_meta", []),
    is_published: bool(fd.get("is_published")),
    sort_order: fd.get("sort_order") ?? 0,
  });
}

/** Resolve the final images jsonb: upload any new files, keep existing src. */
async function resolveImages(
  fd: FormData,
  metas: z.infer<typeof ImageMetaSchema>[],
): Promise<DocImage[]> {
  const out: DocImage[] = [];
  for (const m of metas) {
    let src = m.src;
    if (m.fileIndex !== null) {
      const file = fd.get(`image_file_${m.fileIndex}`);
      if (file instanceof File && file.size > 0) {
        src = await uploadToBucket(file, BUCKET, FOLDER);
      }
    }
    // Skip empty, non-placeholder rows entirely.
    if (!src && !m.placeholder) continue;
    const img: DocImage = { src, alt: m.alt };
    if (m.caption) img.caption = m.caption;
    if (m.placeholder) img.placeholder = true;
    out.push(img);
  }
  return out;
}

export async function createSubsection(sectionId: string, formData: FormData) {
  const data = parseSubsection(formData);
  const supabase = getAdminSupabase();
  const images = await resolveImages(formData, data.images_meta);

  const { error } = await supabase.from("help_centre_subsections").insert({
    section_id: sectionId,
    title: data.title,
    route: data.route ?? null,
    what_it_does: data.what_it_does ?? null,
    how_to_use: data.how_to_use,
    items: data.items,
    images,
    is_published: data.is_published,
    sort_order: data.sort_order,
  });
  if (error) throw new Error(error.message);

  revalidateDocs();
  redirect(`/admin/help-centre/${sectionId}/edit`);
}

export async function updateSubsection(id: string, formData: FormData) {
  const data = parseSubsection(formData);
  const supabase = getAdminSupabase();

  const { data: existing } = await supabase
    .from("help_centre_subsections")
    .select("section_id, images")
    .eq("id", id)
    .maybeSingle();

  const images = await resolveImages(formData, data.images_meta);

  // Delete any previously-uploaded bucket images that are no longer referenced.
  const keep = new Set(images.map((im) => im.src));
  const orphans = bucketUrls(existing?.images).filter((url) => !keep.has(url));
  await deleteBucketUrls(orphans);

  const update: SubsectionUpdate = {
    title: data.title,
    route: data.route ?? null,
    what_it_does: data.what_it_does ?? null,
    how_to_use: data.how_to_use,
    items: data.items,
    images,
    is_published: data.is_published,
    sort_order: data.sort_order,
  };

  const { error } = await supabase
    .from("help_centre_subsections")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidateDocs();
  if (existing?.section_id) {
    redirect(`/admin/help-centre/${existing.section_id}/edit`);
  }
  redirect("/admin/help-centre");
}

export async function deleteSubsection(id: string) {
  const supabase = getAdminSupabase();
  const { data: existing } = await supabase
    .from("help_centre_subsections")
    .select("section_id, images")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("help_centre_subsections")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  await deleteBucketUrls(bucketUrls(existing?.images));

  revalidateDocs();
  if (existing?.section_id) {
    revalidatePath(`/admin/help-centre/${existing.section_id}/edit`);
  }
}

export async function moveSubsection(id: string, direction: "up" | "down") {
  const supabase = getAdminSupabase();
  const { data: row } = await supabase
    .from("help_centre_subsections")
    .select("id, section_id, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!row) return;

  // Swap only within the same section.
  const q = supabase
    .from("help_centre_subsections")
    .select("id, sort_order")
    .eq("section_id", row.section_id);
  const { data: neighbor } =
    direction === "up"
      ? await q
          .lt("sort_order", row.sort_order)
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle()
      : await q
          .gt("sort_order", row.sort_order)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle();
  if (!neighbor) return;

  await supabase
    .from("help_centre_subsections")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", row.id);
  await supabase
    .from("help_centre_subsections")
    .update({ sort_order: row.sort_order })
    .eq("id", neighbor.id);

  revalidateDocs();
  revalidatePath(`/admin/help-centre/${row.section_id}/edit`);
}

/* ───────────────────────────── helpers ───────────────────────────── */

async function swapSortOrder(
  table: "help_centre_sections",
  id: string,
  direction: "up" | "down",
) {
  const supabase = getAdminSupabase();
  const { data: row } = await supabase
    .from(table)
    .select("id, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!row) return;

  const q = supabase.from(table).select("id, sort_order");
  const { data: neighbor } =
    direction === "up"
      ? await q
          .lt("sort_order", row.sort_order)
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle()
      : await q
          .gt("sort_order", row.sort_order)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle();
  if (!neighbor) return;

  await supabase
    .from(table)
    .update({ sort_order: neighbor.sort_order })
    .eq("id", row.id);
  await supabase
    .from(table)
    .update({ sort_order: row.sort_order })
    .eq("id", neighbor.id);
}
