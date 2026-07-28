"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

/**
 * Root error boundary. Deliberately self-contained (no Navbar / Footer /
 * providers) so it still renders when the failure came from one of those.
 */
export default function Error({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-20 text-center text-white">
      <Link
        href="/"
        aria-label="Genera home"
        className="mb-10 flex items-center gap-2.5"
      >
        <Image
          src="/images/genera-svg.svg"
          alt="Genera paw logo"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
        />
        <span className="font-massilia text-body-lg font-extrabold tracking-[0.125rem] text-white">
          GENERA
        </span>
      </Link>

      <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
        🐾 Something went wrong
      </div>

      <h1 className="text-[clamp(1.75rem,3.2vw,2.4rem)] font-bold leading-tight text-white">
        We have dropped the lead on this one
      </h1>
      <p className="mx-auto mt-5 max-w-[520px] text-white/80">
        An unexpected error stopped this page from loading. Give it another go,
        and if it keeps happening we would love to hear about it.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-gold btn-lg">
          Try Again
        </button>
        <Link href="/" className="btn btn-outline-w btn-lg">
          Back to Home
        </Link>
      </div>

      <p className="mt-8 text-fine text-white/60">
        Still stuck? Email{" "}
        <a
          href="mailto:info@generasoftware.com?subject=Website%20error"
          className="font-semibold text-gold-soft underline underline-offset-2"
        >
          info@generasoftware.com
        </a>
        {error.digest ? (
          <>
            {" "}
            and quote reference{" "}
            <span className="font-mono text-white/80">{error.digest}</span>
          </>
        ) : null}
        .
      </p>
    </div>
  );
}
