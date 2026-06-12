"use client";

/* ─────────────────────────────────────────────────────────────
   Search-term highlighter.

   When a docs page is opened from a search result, the URL carries
   the searched term as `?q=…` (added in DocsShell). This component
   reads that term, wraps every matching word in the article in a
   <mark>, and scrolls the first match inside the targeted section
   into view with a brief flash — so e.g. searching "cancellation"
   lands you on the word, not just the section card.

   It runs purely on the rendered DOM (no need to thread the query
   through the server-rendered content), and cleans up its marks
   whenever the route or term changes.
   ───────────────────────────────────────────────────────────── */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const HL_CLASS = "docs-search-hl";
const MARK_STYLE =
  "background:var(--color-gold-light);color:var(--color-ink);" +
  "border-radius:3px;padding:0 2px;box-decoration-break:clone;" +
  "-webkit-box-decoration-break:clone;";

export default function SearchHighlighter() {
  const pathname = usePathname();
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    clearHighlights(article);
    if (q.length < 2) return;

    const marks = highlight(article, q);
    if (marks.length === 0) return;

    // Prefer the first match inside the section named in the hash;
    // fall back to the first match anywhere on the page.
    const hash = safeHash();
    const targetSection = hash ? document.getElementById(hash) : null;
    const focus =
      (targetSection?.querySelector<HTMLElement>(`mark.${HL_CLASS}`)) ??
      marks[0];

    // Let the browser's hash scroll settle first, then refine onto the word.
    const raf = requestAnimationFrame(() => {
      focus.scrollIntoView({ behavior: "smooth", block: "center" });
      flash(focus);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearHighlights(article);
    };
  }, [pathname, q]);

  return null;
}

function safeHash(): string {
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ""));
  } catch {
    return window.location.hash.replace(/^#/, "");
  }
}

/** Briefly ring the focused match so the eye catches it after scrolling. */
function flash(el: HTMLElement) {
  el.style.transition = "outline-color 0.4s ease";
  el.style.outline = "2px solid var(--color-gold)";
  el.style.outlineOffset = "2px";
  window.setTimeout(() => {
    el.style.outlineColor = "transparent";
  }, 1500);
}

/** Unwrap every <mark> we previously inserted, restoring plain text. */
function clearHighlights(root: Element) {
  root.querySelectorAll(`mark.${HL_CLASS}`).forEach((m) => {
    const parent = m.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(m.textContent ?? ""), m);
    parent.normalize();
  });
}

/** Wrap each case-insensitive occurrence of `term` in a <mark>. */
function highlight(root: Element, term: string): HTMLElement[] {
  const needle = term.toLowerCase();
  const marks: HTMLElement[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const value = node.nodeValue;
      if (!value || !value.toLowerCase().includes(needle)) {
        return NodeFilter.FILTER_REJECT;
      }
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "MARK") {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) textNodes.push(current as Text);

  for (const node of textNodes) {
    const value = node.nodeValue ?? "";
    const lower = value.toLowerCase();
    const frag = document.createDocumentFragment();
    let cursor = 0;
    let idx = lower.indexOf(needle, cursor);

    while (idx !== -1) {
      if (idx > cursor) {
        frag.appendChild(document.createTextNode(value.slice(cursor, idx)));
      }
      const mark = document.createElement("mark");
      mark.className = HL_CLASS;
      mark.style.cssText = MARK_STYLE;
      mark.textContent = value.slice(idx, idx + term.length);
      frag.appendChild(mark);
      marks.push(mark);
      cursor = idx + term.length;
      idx = lower.indexOf(needle, cursor);
    }

    if (cursor < value.length) {
      frag.appendChild(document.createTextNode(value.slice(cursor)));
    }
    node.parentNode?.replaceChild(frag, node);
  }

  return marks;
}
