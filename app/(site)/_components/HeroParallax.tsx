"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps the hero illustration so it tilts on mousemove — preserves the
 * original homepage's parallax effect. Pauses the bobbing animation
 * while the user hovers, restores it on mouse-leave.
 */
export default function HeroParallax({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const hero = wrap?.closest("section") as HTMLElement | null;
    const img = wrap?.querySelector("img") as HTMLImageElement | null;
    if (!wrap || !hero || !img) return;

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      img.style.animationPlayState = "paused";
      img.style.transform = `translateY(-5px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
    };
    const onLeave = () => {
      img.style.animationPlayState = "running";
      img.style.transform = "";
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none mx-auto mt-3 flex w-full max-w-[320px] justify-center"
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
