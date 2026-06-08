"use client";

import { useEffect, useRef, useState } from "react";

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
  const remainingSpots = Math.max(totalSpots - claimedSpots, 0);
  const progressPct =
    totalSpots > 0
      ? Math.min(100, Math.round((claimedSpots / totalSpots) * 100))
      : 0;

  const [displayRemaining, setDisplayRemaining] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = numberRef.current;
    if (!node) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setDisplayRemaining(remainingSpots);
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
        setDisplayRemaining(Math.round(eased * remainingSpots));
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
  }, [remainingSpots, progressPct]);

  return (
    <>
      <p className="relative z-10 text-eyebrow uppercase tracking-widest text-gold-soft md:text-sm">
        Spots remaining
      </p>
      <div
        ref={numberRef}
        className="relative z-10 mt-1 font-massilia text-figure-lg font-bold leading-none text-gold md:mt-2 md:text-display tabular-nums"
        aria-label={`${remainingSpots} spots remaining`}
      >
        {displayRemaining}
      </div>
      <p className="relative z-10 mb-4 text-fine text-white/70 md:mb-5 md:text-base">
        out of {totalSpots} founding members
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
        {claimedSpots} {claimedSpots === 1 ? "spot" : "spots"} claimed so far
      </p>
    </>
  );
}
