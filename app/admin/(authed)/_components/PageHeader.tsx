import Link from "next/link";
import type { ReactNode } from "react";
import Paw from "@/components/Paw";

export default function PageHeader({
  title,
  eyebrow,
  description,
  action,
  back,
}: {
  title: string;
  /** Script line above the title, in the site's Caveat eyebrow style. */
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-ink-soft hover:text-forest"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="mb-1.5 inline-flex items-center gap-1.5 font-caveat text-xl font-bold leading-none text-forest">
              <Paw className="h-[0.9em] w-[0.9em] text-gold" />
              {eyebrow}
            </p>
          )}
          <h1 className="font-massilia text-2xl font-bold leading-tight tracking-tight text-forest-dark lg:text-[2rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
