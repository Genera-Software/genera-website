"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LOGIN_URL } from "@/lib/urls";
import { searchDocs, type SearchEntry } from "../_data/sections";
import SectionIcon from "./SectionIcon";

type NavEntry = { slug: string; num: number; title: string; tagline: string };

export default function DocsShell({
  nav,
  children,
}: {
  nav: NavEntry[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile drawer
  const [q, setQ] = useState("");

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const results = useMemo(() => searchDocs(q), [q]);
  const searching = q.trim().length > 0;

  // After clicking a result, reset the box back to the nav and close drawer.
  const handleResultClick = () => {
    setQ("");
    setOpen(false);
  };

  const isActive = (slug: string) => pathname === `/docs/${slug}`;

  const SidebarBody = (
    <>
      <SearchBox q={q} setQ={setQ} />
      <div className="mt-4">
        {searching ? (
          <SearchResults
            results={results}
            query={q}
            onNavigate={handleResultClick}
          />
        ) : (
          <SectionNav nav={nav} isActive={isActive} pathname={pathname} />
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-teal-mid/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
          <button
            type="button"
            aria-label="Toggle sections"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-forest hover:bg-teal-soft lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-5 w-5"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          <Link
            href="/docs"
            className="flex min-w-0 shrink items-center gap-2 sm:gap-2.5"
          >
            <Image
              src="/images/genera-svg.svg"
              alt="Genera"
              width={32}
              height={32}
              className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8"
              priority
            />
            <span className="flex min-w-0 items-baseline gap-2 leading-none">
              <span className="font-massilia text-body-lg font-extrabold tracking-[0.08em] text-forest">
                GENERA
              </span>
              <span className="hidden rounded-full bg-gold-light px-2 py-0.5 font-massilia text-[0.72rem] font-bold tracking-wide text-forest min-[420px]:inline-block">
                HELP CENTRE
              </span>
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden rounded-full px-3 py-1.5 text-meta font-medium text-ink-soft transition-colors hover:bg-cream-dark hover:text-forest sm:inline-flex"
            >
              ← Main site
            </Link>
            <Link
              href={LOGIN_URL}
              className="inline-flex items-center rounded-full bg-forest px-3.5 py-2 font-massilia text-fine font-bold whitespace-nowrap text-white shadow-[0_4px_14px_rgba(0,62,69,0.18)] transition-shadow hover:shadow-[0_6px_22px_rgba(0,62,69,0.3)] sm:px-4"
            >
              <span className="sm:hidden">Open app</span>
              <span className="hidden sm:inline">Open the app</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + content ─────────────────────────────── */}
      <div className="mx-auto flex max-w-[1240px] gap-8 px-4 sm:px-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-[270px] shrink-0 lg:block">
          <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-7 pr-1">
            {SidebarBody}
          </div>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close sections"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-forest-dark/40 backdrop-blur-sm"
            />
            <div className="absolute top-16 bottom-0 left-0 flex w-[290px] max-w-[85vw] flex-col overflow-y-auto border-r border-teal-mid/60 bg-white p-5 shadow-2xl">
              {SidebarBody}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="mt-5 border-t border-teal-mid/60 px-3 pt-4 text-meta font-medium text-ink-soft transition-colors hover:text-forest"
              >
                ← Back to main site
              </Link>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="min-w-0 flex-1 py-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}

function SectionNav({
  nav,
  isActive,
  pathname,
}: {
  nav: NavEntry[];
  isActive: (slug: string) => boolean;
  pathname: string;
}) {
  return (
    <nav className="flex flex-col gap-1">
      <Link
        href="/docs"
        className={`rounded-xl px-3 py-2 font-massilia text-[0.95rem] font-bold transition-colors ${
          pathname === "/docs"
            ? "bg-forest text-white"
            : "text-forest hover:bg-teal-soft"
        }`}
      >
        Overview
      </Link>

      <div className="mt-3 mb-1 px-3 text-eyebrow font-semibold tracking-[0.14em] text-ink-soft/70 uppercase">
        Sections
      </div>

      {nav.map((s) => {
        const active = isActive(s.slug);
        return (
          <Link
            key={s.slug}
            href={`/docs/${s.slug}`}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
              active ? "bg-forest text-white" : "text-ink hover:bg-teal-soft"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                active
                  ? "bg-white/15 text-gold"
                  : "bg-cream-dark text-forest group-hover:bg-white"
              }`}
            >
              <SectionIcon slug={s.slug} className="h-[18px] w-[18px]" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-massilia text-[0.95rem] font-bold">
                {s.title}
              </span>
              <span
                className={`text-[0.72rem] ${
                  active ? "text-white/70" : "text-ink-soft"
                }`}
              >
                {s.tagline}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function SearchResults({
  results,
  query,
  onNavigate,
}: {
  results: SearchEntry[];
  query: string;
  onNavigate: () => void;
}) {
  const term = query.trim();
  if (results.length === 0) {
    return (
      <p className="px-3 py-2 text-meta text-ink-soft">
        No matches. Try another word, or{" "}
        <a
          href="mailto:info@generasoftware.com"
          className="font-semibold text-forest underline decoration-gold underline-offset-2"
        >
          email us
        </a>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-1 px-3 text-eyebrow font-semibold tracking-[0.14em] text-ink-soft/70 uppercase">
        {results.length} result{results.length === 1 ? "" : "s"}
      </div>
      {results.map((r) => (
        <Link
          key={`${r.sectionSlug}-${r.anchor}`}
          href={`/docs/${r.sectionSlug}?q=${encodeURIComponent(term)}#${r.anchor}`}
          onClick={onNavigate}
          className="group rounded-xl px-3 py-2 transition-colors hover:bg-teal-soft"
        >
          <span className="flex items-center gap-2">
            <SectionIcon
              slug={r.sectionSlug}
              className="h-3.5 w-3.5 shrink-0 text-forest"
            />
            <span className="truncate font-massilia text-[0.9rem] font-bold text-ink group-hover:text-forest">
              {r.subTitle}
            </span>
          </span>
          <span className="mt-0.5 block pl-[1.375rem] text-[0.72rem] text-ink-soft">
            <span className="font-semibold text-forest">{r.sectionTitle}</span>
            {r.route ? <span className="text-ink-soft"> · {r.route}</span> : null}
          </span>
        </Link>
      ))}
    </div>
  );
}

function SearchBox({
  q,
  setQ,
}: {
  q: string;
  setQ: (v: string) => void;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-soft"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" />
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the docs…"
        aria-label="Search the docs"
        className="w-full rounded-full border border-teal-mid bg-cream py-2 pr-9 pl-9 text-meta text-ink outline-none transition-colors focus:border-forest focus:bg-white"
      />
      {q && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQ("")}
          className="absolute top-1/2 right-2.5 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-dark hover:text-forest"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            className="h-3 w-3"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
