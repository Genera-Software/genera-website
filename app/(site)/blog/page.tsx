import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import { createMetadata } from "@/lib/seo";
import { FOUNDING_100_CTA_LABEL } from "@/lib/cta";
import { getPublicSupabase } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  ...createMetadata({
    title: "Dog Daycare Business Blog and Pet Care Software Advice",
    description:
      "Read practical dog daycare business advice, pet care operations guidance and software tips from the team behind Genera.",
    path: "/blog",
  }),
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const supabase = getPublicSupabase();
  const nowIso = new Date().toISOString();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, category, author_name, published_at, read_time_minutes, cover_image_url",
    )
    .eq("is_published", true)
    .or(`published_at.is.null,published_at.lte.${nowIso}`)
    .order("published_at", { ascending: false, nullsFirst: false });

  return (
    <>
      <Reveal />

      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Blog</p>
          <h1 className="mt-2 text-white">
            Insights from the <em className="text-gold">front line</em> of pet
            care
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-white/80">
            Practical advice, industry commentary, and lessons learned from 15
            years of running a real pet business.
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="bg-cream px-8 py-22">
        {posts && posts.length > 0 ? (
          <div className="mx-auto grid max-w-[1160px] gap-7 md:grid-cols-2">
            {posts.map((p, i) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className={`rev d${(i % 6) + 1} group flex flex-col overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-[0_8px_24px_rgba(0,62,69,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,62,69,0.12)]`}
              >
                {p.cover_image_url ? (
                  <div className="relative h-52 w-full overflow-hidden bg-cream-dark">
                    <Image
                      src={p.cover_image_url}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 580px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-gold-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
                      {p.category}
                    </span>
                  </div>
                ) : (
                  <div className="flex h-32 items-end bg-gradient-to-br from-forest-mid to-forest-dark p-7">
                    <span className="rounded-full bg-gold-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
                      {p.category}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7">
                  <h2 className="mb-3 font-massilia text-xl font-bold leading-none text-forest md:text-mini-h">
                    {p.title}
                  </h2>
                  <p className="mb-5 text-ink-soft">{p.excerpt}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-cream-dark pt-4 text-sm">
                    <div className="flex flex-wrap items-center gap-2 text-ink-soft">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-forest font-bold text-white">
                        {p.author_name.charAt(0)}
                      </span>
                      <span className="font-medium text-forest">
                        {p.author_name}
                      </span>
                      <span className="h-3 w-px bg-cream-dark" />
                      <span>{formatDate(p.published_at)}</span>
                      <span className="h-3 w-px bg-cream-dark" />
                      <span>{p.read_time_minutes} min read</span>
                    </div>
                    <span className="text-forest transition-transform group-hover:translate-x-1">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-[860px] text-center text-ink-soft">
            New posts are on the way. Subscribe via email to be notified.
          </p>
        )}
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
