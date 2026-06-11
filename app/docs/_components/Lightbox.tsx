"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LightboxTarget = { src: string; alt: string };

const LightboxContext = createContext<(img: LightboxTarget) => void>(() => {});

function MagnifierIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

/** Wraps the docs content and renders a single shared lightbox overlay. */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<LightboxTarget | null>(null);
  const open = useCallback((img: LightboxTarget) => setActive(img), []);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close]);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-cream transition-colors hover:bg-white/25"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full max-w-5xl flex-col items-center"
          >
            {/* Plain img so the real aspect ratio is preserved with no letterboxing. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[88vh] w-auto max-w-full rounded-lg shadow-2xl"
            />
          </figure>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

/** A Next.js image that opens the shared lightbox when clicked. */
export function ZoomableImage({
  src,
  alt,
  width,
  height,
  sizes,
  imgClassName,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  imgClassName?: string;
  className?: string;
}) {
  const open = useContext(LightboxContext);
  return (
    <button
      type="button"
      onClick={() => open({ src, alt })}
      aria-label={`Expand image: ${alt}`}
      className={`group relative block w-full cursor-zoom-in ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={imgClassName}
      />
      <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/55 text-cream opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <MagnifierIcon className="h-4 w-4" />
      </span>
    </button>
  );
}
