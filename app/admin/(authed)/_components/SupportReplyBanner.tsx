"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { UnreadReply } from "@/app/api/admin/support-replies/route";

/** Tickets listed by name before the rest collapse into "and N more". */
const MAX_LISTED = 3;

/** Quiet enough to leave running all day, quick enough to feel live. */
const POLL_MS = 45_000;

/** "just now" / "14m ago" / "3h ago" / "2d ago" — enough to tell a reply that
    landed while you were working from one that has sat since yesterday. */
function timeAgo(iso: string) {
  const mins = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 60000),
  );
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function ReplyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20.5l1.6-4.8A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />
    </svg>
  );
}

/**
 * Sits above every admin page so a customer reply cannot slip past unnoticed —
 * the sidebar count alone never said *what* had come in, and a reply arriving
 * mid-session never announced itself at all.
 *
 * Polls rather than rendering on the server: the admin shell is a layout, so a
 * server-rendered banner would go stale the moment you navigated between pages
 * (including onto the very ticket you just opened, which marks it read).
 */
export default function SupportReplyBanner() {
  const [tickets, setTickets] = useState<UnreadReply[]>([]);
  const pathname = usePathname();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/support-replies", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = (await res.json()) as { tickets?: UnreadReply[] };
      setTickets(json.tickets ?? []);
    } catch {
      // Offline or mid-deploy — keep whatever we last showed.
    }
  }, []);

  // Re-checks on navigation too, so opening a ticket (which marks its replies
  // read) drops it from the banner straight away.
  useEffect(() => {
    void load();
  }, [load, pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, POLL_MS);
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  if (tickets.length === 0) return null;

  const listed = tickets.slice(0, MAX_LISTED);
  const extra = tickets.length - listed.length;

  return (
    <div
      role="status"
      className="mb-6 flex flex-wrap items-start gap-3 rounded-2xl border border-gold bg-gold/15 px-5 py-4"
    >
      <span className="mt-0.5 text-ink" aria-hidden>
        <ReplyIcon />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">
          {tickets.length === 1
            ? "A customer replied to a support ticket"
            : `${tickets.length} support tickets have new customer replies`}
        </p>
        <ul className="mt-1.5 flex flex-col gap-1 text-sm text-ink-soft">
          {listed.map((t) => (
            <li key={t.id} className="truncate">
              <Link
                href={`/admin/support/${t.id}`}
                className="font-semibold text-forest underline-offset-2 hover:underline"
              >
                #{t.ref} {t.subject}
              </Link>
              <span className="ml-2 whitespace-nowrap text-xs">
                {t.who} · {timeAgo(t.at)}
              </span>
            </li>
          ))}
        </ul>
        {extra > 0 && (
          <p className="mt-1.5 text-sm text-ink-soft">
            and {extra} more ticket{extra === 1 ? "" : "s"} waiting.
          </p>
        )}
      </div>
      <Link
        href="/admin/support"
        className="shrink-0 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-forest/90"
      >
        Go to tickets
      </Link>
    </div>
  );
}
