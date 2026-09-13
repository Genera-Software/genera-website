"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Testimonial } from "@/lib/testimonials";
import VideoModal from "./VideoModal";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.9-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

/** Headshot, name and business. When the testimonial has a video the
    headshot becomes a play button and a "Watch" link appears; both open
    the same popup. Without a video it's a plain, static byline. */
export default function TestimonialAuthor({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  const { name, role, business, image, video } = testimonial;
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const firstName = name.split(" ")[0];
  const videoTitle = `${name}, ${business}, on Genera`;

  const avatar = (
    <Image
      src={image}
      alt={video ? "" : name}
      width={128}
      height={128}
      sizes="64px"
      className="h-full w-full object-cover"
    />
  );

  return (
    <div className="flex items-center gap-4">
      {video ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Play video: ${videoTitle}`}
          className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-[3px] ring-gold ring-offset-2 ring-offset-white transition-transform hover:scale-105 md:h-16 md:w-16"
        >
          {avatar}
          <span className="absolute inset-0 grid place-items-center bg-forest/35 text-white transition-colors group-hover:bg-forest/50">
            <PlayIcon className="h-5 w-5 translate-x-px drop-shadow md:h-6 md:w-6" />
          </span>
        </button>
      ) : (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-[3px] ring-teal-mid ring-offset-2 ring-offset-white md:h-16 md:w-16">
          {avatar}
        </span>
      )}

      <div className="min-w-0">
        <p className="font-massilia text-base font-bold leading-tight text-ink md:text-lg">
          {name}
        </p>
        <p className="mt-0.5 text-meta leading-snug text-ink-soft">
          {role ? `${role}, ${business}` : business}
        </p>
        {video && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-1.5 inline-flex items-center gap-1.5 font-massilia text-meta font-bold text-forest underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
          >
            <PlayIcon className="h-3.5 w-3.5" />
            Watch {firstName}&apos;s story
          </button>
        )}
      </div>

      {open && video && (
        <VideoModal video={video} title={videoTitle} onClose={close} />
      )}
    </div>
  );
}
