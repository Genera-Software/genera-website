"use client";

import { useEffect, useRef, useState } from "react";
import { FOUNDING_100_APPLICATIONS_OPEN } from "@/lib/cta";

type Props = {
  totalSpots: number;
  claimedSpots: number;
};

const DURATION_MS = 1600;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function FoundingSpotsStats({
  totalSpots,
  claimedSpots,
}: Props) {
  const open = FOUNDING_100_APPLICATIONS_OPEN;
  // Open: how many spots are left to take. Closed: how many founding members there are —
  // a "spots remaining" countdown beside "applications have closed" reads as a live offer.
  const headlineFigure = open
    ? Math.max(totalSpots - claimedSpots, 0)
    : claimedSpots;
  const progressPct =
    totalSpots > 0
      ? Math.min(100, Math.round((claimedSpots / totalSpots) * 100))
      : 0;

  const [displayFigure, setDisplayFigure] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = numberRef.current;
    if (!node) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setDisplayFigure(headlineFigure);
      setDisplayProgress(progressPct);
      return;
    }

    let raf = 0;
    let hasAnimated = false;

    const animate = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION_MS);
        const eased = easeOutCubic(t);
        setDisplayFigure(Math.round(eased * headlineFigure));
        setDisplayProgress(eased * progressPct);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate();
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [headlineFigure, progressPct]);

  return (
    <>
      <p className="relative z-10 text-eyebrow uppercase tracking-widest text-gold-soft md:text-sm">
        {open ? "Spots remaining" : "Founding members"}
      </p>
      <div
        ref={numberRef}
        className="relative z-10 mt-1 font-massilia text-figure-lg font-bold leading-none text-gold md:mt-2 md:text-display tabular-nums"
        aria-label={
          open
            ? `${headlineFigure} spots remaining`
            : `${headlineFigure} founding members of ${totalSpots}`
        }
      >
        {displayFigure}
      </div>
      <p className="relative z-10 mb-4 text-fine text-white/70 md:mb-5 md:text-base">
        out of {totalSpots} founding {open ? "members" : "spots"}
      </p>
      <div
        className="relative z-10 h-[7px] w-full overflow-hidden rounded-full bg-white/10 md:h-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPct}
      >
        <div
          className="h-full rounded-full bg-gold"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      <p className="relative z-10 mt-2 text-fine text-white/60 md:text-sm">
        {open
          ? `${claimedSpots} ${claimedSpots === 1 ? "spot" : "spots"} claimed so far`
          : "The round is now closed"}
      </p>
    </>
  );
}
