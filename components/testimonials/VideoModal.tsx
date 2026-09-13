"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { TestimonialVideo } from "@/lib/testimonials";

type Embed = { src: string; provider: "youtube" | "vimeo" | "instagram" };

/** YouTube/Vimeo/Instagram links become embeds (privacy-friendly where the
    provider offers it); anything else is treated as a direct video file and
    played with a native <video>. */
function toEmbed(url: string): Embed | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    let youtubeId: string | null = null;
    if (host === "youtu.be") youtubeId = u.pathname.slice(1);
    else if (host.endsWith("youtube.com") || host === "youtube-nocookie.com") {
      youtubeId =
        u.searchParams.get("v") ??
        u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ??
        null;
    }
    if (youtubeId) {
      return {
        provider: "youtube",
        src: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`,
      };
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const vimeoId = u.pathname.match(/(\d+)/)?.[1];
      if (vimeoId) {
        return {
          provider: "vimeo",
          src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&dnt=1`,
        };
      }
    }

    if (host === "instagram.com") {
      const postId = u.pathname.match(/^\/(?:p|reels?|tv)\/([\w-]+)/)?.[1];
      if (postId) {
        return {
          provider: "instagram",
          src: `https://www.instagram.com/p/${postId}/embed/`,
        };
      }
    }
  } catch {
    // Relative paths (/videos/foo.mp4) aren't valid absolute URLs — a file.
  }
  return null;
}

export default function VideoModal({
  video,
  title,
  onClose,
}: {
  video: TestimonialVideo;
  title: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const embed = toEmbed(video.url);
  const portrait = video.orientation === "portrait";

  // Esc to close, lock background scroll, and hand focus back to whatever
  // opened the modal when it goes away.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [onClose]);

  // Instagram's embed is a full post card (header, reel, caption), not a
  // bare player, so it gets a fixed white frame instead of a video ratio.
  const frameClass =
    embed?.provider === "instagram"
      ? "h-[min(85vh,760px)] w-[min(100%,420px)] bg-white"
      : portrait
        ? "aspect-[9/16] h-[min(85vh,760px)] max-w-full bg-black"
        : "aspect-video w-full max-w-5xl bg-black";

  // Portalled to <body>: cards sit inside .rev elements whose transform
  // would otherwise trap a position: fixed overlay inside the card.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-forest-dark/85 p-4 backdrop-blur-sm animate-[fadeInUp_0.25s_ease_both] sm:p-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative overflow-hidden rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] ${frameClass}`}
      >
        {embed ? (
          <iframe
            src={embed.src}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <video
            src={video.url}
            poster={video.poster}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}
      </div>
    </div>,
    document.body,
  );
}
