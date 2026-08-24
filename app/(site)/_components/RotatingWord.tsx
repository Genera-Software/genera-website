"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["daycare", "walkers", "sitters", "groomer", "trainers"];
// Extra copy of the first word at the end lets the stack keep rolling
// forward through the loop point instead of snapping backward.
const DISPLAY = [...WORDS, WORDS[0]];
const INTERVAL_MS = 2200;
const TRANSITION_MS = 500;

/**
 * Vertically rolls through WORDS, one at a time, inside a fixed-height
 * window sized to a single line of text. Width is left to the widest
 * word (flex-col shrink-to-fit) so nothing else on the line reflows.
 */
export default function RotatingWord() {
  const [step, setStep] = useState(0);
  const [animated, setAnimated] = useState(true);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion.current) return;

    const id = setInterval(() => setStep((s) => s + 1), INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Once we've rolled onto the duplicated first word, wait for the
  // transition to finish, then jump back to step 0 with no transition.
  useEffect(() => {
    if (step !== WORDS.length) return;
    const timeout = setTimeout(() => {
      setAnimated(false);
      setStep(0);
    }, TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [step]);

  useEffect(() => {
    if (animated) return;
    const raf = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(raf);
  }, [animated]);

  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-bottom">
      <span
        className="flex flex-col"
        style={{
          transform: `translateY(-${step}em)`,
          transition: animated
            ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1)`
            : "none",
        }}
      >
        {DISPLAY.map((word, i) => (
          <span key={`${word}-${i}`} className="block leading-none">
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
