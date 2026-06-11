import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SECTIONS,
  getSection,
  subAnchor,
  type DocSubsection,
} from "../_data/sections";
import SectionIcon from "../_components/SectionIcon";
import { LightboxProvider, ZoomableImage } from "../_components/Lightbox";

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const s = getSection(section);
  if (!s) return { title: "Not found" };
  return {
    title: s.title,
    description: s.intro ?? s.tagline,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const s = getSection(section);
  if (!s) notFound();

  const idx = SECTIONS.findIndex((x) => x.slug === s.slug);
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;

  return (
    <LightboxProvider>
    <article className="mx-auto max-w-[820px]">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-fine text-ink-soft">
        <Link href="/docs" className="hover:text-forest">
          Help Centre
        </Link>
        <span>/</span>
        <span className="font-semibold text-forest">{s.title}</span>
      </nav>

      {/* Header */}
      <header className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-soft text-forest">
          <SectionIcon slug={s.slug} className="h-7 w-7" />
        </span>
        <div>
          <p className="font-massilia text-fine font-bold tracking-wide text-gold">
            SECTION {String(s.num).padStart(2, "0")}
          </p>
          <h1 className="mt-0.5 text-[clamp(2rem,4.5vw,2.9rem)] text-ink">
            {s.title}
          </h1>
        </div>
      </header>

      {s.intro && (
        <p className="mt-5 text-body-lg leading-relaxed text-ink-soft">
          {s.intro}
        </p>
      )}

      {/* Screenshot */}
      {s.image && (
        <figure className="mt-7 overflow-hidden rounded-2xl border border-teal-mid bg-white shadow-[0_14px_40px_rgba(0,62,69,0.12)]">
          <ZoomableImage
            src={s.image}
            alt={s.imageAlt ?? `${s.title} screenshot`}
            width={1600}
            height={1000}
            imgClassName="h-auto w-full"
            sizes="(max-width: 820px) 100vw, 820px"
          />
        </figure>
      )}

      {/* Subsections */}
      <div className="mt-10 flex flex-col gap-6">
        {s.subsections.map((sub, i) => (
          <Subsection key={i} sub={sub} />
        ))}
      </div>

      {/* Prev / next */}
      <nav className="mt-14 grid gap-3 border-t border-teal-mid pt-7 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="group rounded-2xl border border-teal-mid bg-white p-4 transition-colors hover:border-forest"
          >
            <span className="text-fine text-ink-soft">← Previous</span>
            <span className="mt-1 block font-massilia text-[1.1rem] font-bold text-forest">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/docs/${next.slug}`}
            className="group rounded-2xl border border-teal-mid bg-white p-4 text-right transition-colors hover:border-forest sm:col-start-2"
          >
            <span className="text-fine text-ink-soft">Next →</span>
            <span className="mt-1 block font-massilia text-[1.1rem] font-bold text-forest">
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
    </LightboxProvider>
  );
}

function Subsection({ sub }: { sub: DocSubsection }) {
  return (
    <section
      id={subAnchor(sub.title)}
      className="scroll-mt-24 rounded-2xl border border-teal-mid bg-white p-6 transition-shadow target:border-gold target:shadow-[0_0_0_3px_var(--color-gold-soft)] sm:p-7"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="!text-[1.45rem] text-ink">{sub.title}</h2>
        {sub.route && (
          <code className="rounded-full bg-cream-dark px-2.5 py-1 font-mono text-[0.8rem] text-forest">
            {sub.route}
          </code>
        )}
      </div>

      {sub.whatItDoes && (
        <p className="mt-3 text-meta leading-relaxed text-ink-soft">
          <span className="font-semibold text-forest">What it does — </span>
          {sub.whatItDoes}
        </p>
      )}

      {sub.items && sub.items.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2.5">
          {sub.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span className="text-meta leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">{it.label}</span>
                {" — "}
                {it.desc}
              </span>
            </li>
          ))}
        </ul>
      )}

      {sub.howToUse && sub.howToUse.length > 0 && (
        <div className="mt-5">
          <p className="mb-2.5 font-massilia text-fine font-bold tracking-wide text-forest uppercase">
            How to use it
          </p>
          <ul className="flex flex-col gap-2.5">
            {sub.howToUse.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-soft text-forest">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M5 12l5 5L20 6" />
                  </svg>
                </span>
                <span className="text-meta leading-relaxed text-ink">
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sub.images && sub.images.length > 0 && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {sub.images.map((img, i) => (
            <figure key={i} className="flex flex-col">
              {img.placeholder ? (
                <div className="flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-teal-mid bg-cream-dark/40 px-4 text-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 text-ink-soft/60"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span className="text-fine font-semibold text-ink-soft">
                    Screenshot coming soon
                  </span>
                </div>
              ) : (
                <ZoomableImage
                  src={img.src}
                  alt={img.alt}
                  width={1006}
                  height={1856}
                  imgClassName="h-auto w-full"
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="overflow-hidden rounded-xl border border-teal-mid bg-cream"
                />
              )}
              {img.caption && (
                <figcaption className="mt-2 text-fine leading-relaxed text-ink-soft">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
