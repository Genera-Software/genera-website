"use client";

import { useState } from "react";

/* Copy-anchor button shown beside each subsection heading. Copies a clean,
   shareable link to that subsection (origin + pathname + #anchor, dropping any
   ?q= search query) so support can paste a direct link to a specific topic.
   Also updates the address-bar hash so the page scrolls/highlights on reload. */
export default function CopyLinkButton({
  anchor,
  title,
}: {
  anchor: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${anchor}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fall back to a
      // temporary textarea + execCommand so the copy still works.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* give up silently */
      }
      document.body.removeChild(ta);
    }
    history.replaceState(null, "", `#${anchor}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy link to "${title}"`}
      title={copied ? "Link copied" : "Copy link to this section"}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-soft/60 opacity-0 transition-all hover:bg-teal-soft hover:text-forest focus-visible:opacity-100 group-hover/heading:opacity-100"
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-forest"
        >
          <path d="M5 12l5 5L20 6" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )}
    </button>
  );
}
