import Link from "next/link";
import type { ReactNode } from "react";

export default function PageHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink"
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
          <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-ink lg:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-ink-soft">{description}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
