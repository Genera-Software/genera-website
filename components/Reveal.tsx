"use client";

import { useEffect } from "react";

/**
 * Mounts an IntersectionObserver that toggles the `in` class on every
 * element with `.rev`. Mirrors the original homepage's scroll-reveal
 * behavior so we keep the staggered fade-up animation across pages.
 *
 * Drop <Reveal /> once at the top of any page that uses .rev classes.
 */
export default function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rev");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
