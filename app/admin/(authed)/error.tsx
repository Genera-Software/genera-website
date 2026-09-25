"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-teal-mid bg-white px-8 py-14 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-cream text-2xl">
        ⚠️
      </div>
      <h1 className="font-massilia text-section-h font-bold text-forest">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-[440px] text-meta text-ink-soft">
        This page failed to load. Try again — if the problem sticks around, the
        reference below will help us track it down.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-ink-soft/70">
          {error.digest}
        </p>
      ) : null}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-gold px-5 py-2 font-massilia text-sm font-bold text-ink shadow-[0_4px_14px_rgba(255,168,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,168,0,0.45)] transition-shadow"
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="rounded-lg border border-teal-mid px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-cream"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
