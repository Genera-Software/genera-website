"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import { deleteFromBucket, uploadToBucket } from "@/lib/admin/upload";

type BlogPostUpdate = Database["public"]["Tables"]["blog_posts"]["Update"];

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const Schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => v ?? ""),
  excerpt: z.string().trim().max(500).default(""),
  body_html: z.string().default(""),
  author_name: z.string().trim().min(1).max(80).default("Genera"),
  category: z.string().trim().min(1).max(60).default("Insights"),
  read_time_minutes: z.coerce.number().int().min(1).max(120).default(3),
  is_published: z.coerce.boolean().default(false),
  published_at: z.string().trim().optional().nullable(),
  remove_cover: z.coerce.boolean().default(false),
});

function sanitizeSlug(input: string): string {
  return slugify(input, { lower: true, strict: true, trim: true });
}

function parse(fd: FormData) {
  return Schema.parse({
    title: fd.get("title") ?? "",
    slug: fd.get("slug") ?? "",
    excerpt: fd.get("excerpt") ?? "",
    body_html: fd.get("body_html") ?? "",
    author_name: fd.get("author_name") ?? "Genera",
    category: fd.get("category") ?? "Insights",
    read_time_minutes: fd.get("read_time_minutes") ?? 3,
    is_published:
      fd.get("is_published") === "on" || fd.get("is_published") === "true",
    published_at: (fd.get("published_at") as string | null) ?? null,
    remove_cover:
      fd.get("remove_cover") === "on" || fd.get("remove_cover") === "true",
  });
}

function revalidatePublicBlog(slug?: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
}

export async function createBlogPost(formData: FormData) {
  const data = parse(formData);
  const supabase = getAdminSupabase();

  let slug = data.slug ? sanitizeSlug(data.slug) : sanitizeSlug(data.title);
  if (!slug) throw new Error("Could not generate a slug — please fill the slug field");
  if (!slugRegex.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers, and dashes only");
  }

  const file = formData.get("cover_file");
  let cover_image_url: string | null = null;
  if (file instanceof File && file.size > 0) {
    cover_image_url = await uploadToBucket(file, "blog-images");
  }

  const publishedAt =
    data.is_published && !data.published_at
      ? new Date().toISOString()
      : data.published_at && data.published_at !== ""
        ? new Date(data.published_at).toISOString()
        : null;

  const { error } = await supabase.from("blog_posts").insert({
    slug,
    title: data.title,
    excerpt: data.excerpt,
    body_html: data.body_html,
    author_name: data.author_name,
    category: data.category,
    read_time_minutes: data.read_time_minutes,
    is_published: data.is_published,
    published_at: publishedAt,
    cover_image_url,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("A post with that slug already exists");
    }
    throw new Error(error.message);
  }

  revalidatePublicBlog(slug);
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const data = parse(formData);
  const supabase = getAdminSupabase();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("slug, cover_image_url, published_at, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!existing) throw new Error("Post not found");

  let slug = data.slug ? sanitizeSlug(data.slug) : existing.slug;
  if (!slugRegex.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers, and dashes only");
  }

  const file = formData.get("cover_file");
  let cover_image_url: string | null | undefined = undefined;
  if (file instanceof File && file.size > 0) {
    cover_image_url = await uploadToBucket(file, "blog-images");
    if (existing.cover_image_url) {
      await deleteFromBucket(existing.cover_image_url, "blog-images");
    }
  } else if (data.remove_cover && existing.cover_image_url) {
    await deleteFromBucket(existing.cover_image_url, "blog-images");
    cover_image_url = null;
  }

  const publishedAt =
    data.published_at && data.published_at !== ""
      ? new Date(data.published_at).toISOString()
      : data.is_published && !existing.published_at
        ? new Date().toISOString()
        : existing.published_at;

  const update: BlogPostUpdate = {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    body_html: data.body_html,
    author_name: data.author_name,
    category: data.category,
    read_time_minutes: data.read_time_minutes,
    is_published: data.is_published,
    published_at: publishedAt,
  };
  if (cover_image_url !== undefined) update.cover_image_url = cover_image_url;

  const { error } = await supabase.from("blog_posts").update(update).eq("id", id);
  if (error) {
    if (error.code === "23505") {
      throw new Error("A post with that slug already exists");
    }
    throw new Error(error.message);
  }

  revalidatePublicBlog(slug);
  if (existing.slug !== slug) revalidatePath(`/blog/${existing.slug}`);
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const supabase = getAdminSupabase();
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("slug, cover_image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.cover_image_url) {
    await deleteFromBucket(existing.cover_image_url, "blog-images");
  }

  revalidatePublicBlog(existing?.slug);
}

export async function togglePublish(id: string) {
  const supabase = getAdminSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("is_published, slug, published_at")
    .eq("id", id)
    .maybeSingle();
  if (!post) return;

  const next = !post.is_published;
  const { error } = await supabase
    .from("blog_posts")
    .update({
      is_published: next,
      published_at: next && !post.published_at ? new Date().toISOString() : post.published_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePublicBlog(post.slug);
}
