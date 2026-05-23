import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import { createMetadata } from "@/lib/seo";
import { FOUNDING_100_CTA_LABEL } from "@/lib/cta";
import { getPublicSupabase } from "@/lib/supabase/server";

export const revalidate = 60;

type Params = { slug: string };

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getPublicSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, slug, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!post) return { title: "Post not found" };

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover_image_url ?? undefined,
  });
}

export async function generateStaticParams() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }
  try {
    const supabase = getPublicSupabase();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("is_published", true);
    return (data ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const supabase = getPublicSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select(
      "title, excerpt, body_html, category, author_name, published_at, read_time_minutes, cover_image_url",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .maybeSingle();

  if (!post) notFound();

  return (
    <>
      <Reveal />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-6 pt-28 pb-16 text-white md:px-8 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-[820px]">
          <Link
            href="/blog"
            className="mb-6 flex w-fit items-center gap-2 text-sm font-semibold text-gold-soft transition-colors hover:text-gold"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All posts
          </Link>

          <span className="rounded-full bg-gold-light/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
            {post.category}
          </span>
          <h1 className="mt-4 text-white md:text-[length:inherit]">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-bold text-forest-dark">
              {post.author_name.charAt(0)}
            </span>
            <span className="font-semibold text-white">{post.author_name}</span>
            <span className="h-3 w-px bg-white/30" />
            <span>{formatDate(post.published_at)}</span>
            <span className="h-3 w-px bg-white/30" />
            <span>{post.read_time_minutes} min read</span>
          </div>
        </div>
      </section>

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="bg-cream">
          <div className="mx-auto -mt-10 max-w-[1000px] px-6 md:-mt-16 md:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-[0_18px_40px_rgba(0,62,69,0.16)]">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 1000px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <section className="bg-cream px-6 py-16 md:px-8 md:py-24">
        <article
          className="rev mx-auto max-w-[720px] font-agenda text-body-lg leading-[1.75] text-ink-soft [&_a]:font-semibold [&_a]:text-forest [&_a]:underline [&_a]:decoration-gold [&_a]:underline-offset-2 hover:[&_a]:text-forest-mid [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-5 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-massilia [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-[var(--leading-title)] [&_h2]:text-forest [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-massilia [&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-[var(--leading-title)] [&_h3]:text-forest [&_img]:my-6 [&_img]:rounded-2xl [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_strong]:font-bold [&_strong]:text-forest [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.body_html }}
        />
      </section>

      {/* CTA */}
      <section className="bg-forest-dark px-8 py-22 text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="!text-white">Want to see Genera in action?</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/80">
            Apply for the Founding 100 today and see how Genera can transform
            the way you run your pet business.
          </p>
          <BookDemoButton className="btn btn-gold btn-lg mt-6">
            {FOUNDING_100_CTA_LABEL}
          </BookDemoButton>
        </div>
      </section>
    </>
  );
}
