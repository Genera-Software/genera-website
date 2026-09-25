"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminFormStatusButton } from "./AdminBusyButton";

type NavItem = {
  kind: "item";
  href: string;
  label: string;
  icon: React.ReactNode;
};
type NavHeading = { kind: "heading"; label: string };
type NavEntry = NavItem | NavHeading;

const NAV: NavEntry[] = [
  {
    kind: "item",
    href: "/admin",
    label: "Dashboard",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/analytics",
    label: "Analytics",
    icon: (
      <>
        <line x1="3" y1="20" x2="21" y2="20" />
        <rect x="6" y="11" width="3" height="7" rx="0.5" />
        <rect x="11" y="6" width="3" height="12" rx="0.5" />
        <rect x="16" y="14" width="3" height="4" rx="0.5" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/badges",
    label: "Badge Kit",
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M9 21l3-2 3 2" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/forms",
    label: "Forms",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/support",
    label: "Support",
    icon: (
      <>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </>
    ),
  },
  { kind: "heading", label: "Content" },
  {
    kind: "item",
    href: "/admin/founding-spots",
    label: "Founding Spots",
    icon: (
      <>
        <path d="M12 2 4 6v6c0 5 3.4 9.5 8 10 4.6-.5 8-5 8-10V6l-8-4Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/logos",
    label: "Trust Logos",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="m3 14 5-5 4 4 5-5 4 4" />
        <circle cx="9" cy="9" r="1.5" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: (
      <>
        <path d="M3 21c3 0 7-1 7-8V5H3v7h4c0 3-1.5 5-4 5v4Z" />
        <path d="M14 21c3 0 7-1 7-8V5h-7v7h4c0 3-1.5 5-4 5v4Z" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/blog",
    label: "Blog",
    icon: (
      <>
        <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4Z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/faqs",
    label: "FAQs",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/our-story",
    label: "Our Story",
    icon: (
      <>
        <path d="M12 6v15" />
        <path d="M5 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H5z" />
        <path d="M19 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z" />
      </>
    ),
  },
  {
    kind: "item",
    href: "/admin/help-centre",
    label: "Help Centre",
    icon: (
      <>
        <path d="M2 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2Z" />
        <path d="M22 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22Z" />
      </>
    ),
  },
  { kind: "heading", label: "Settings" },
  {
    kind: "item",
    href: "/admin/users",
    label: "Admin users",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </>
    ),
  },
];

export default function Sidebar({
  badges = {},
  userEmail,
}: {
  badges?: Record<string, number>;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed left-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white shadow-[0_6px_22px_rgba(0,40,48,0.25)] lg:hidden"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-forest-dark/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col overflow-hidden bg-gradient-to-b from-forest to-forest-dark text-white transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* The site hero's soft gold shape, kept faint. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/[0.07]"
        />

        {/* Brand lockup, as in the site's navbar. */}
        <div className="relative flex h-20 shrink-0 items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/images/genera-svg.svg"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] object-contain"
            />
            <span className="flex flex-col leading-none">
              <span className="font-massilia text-base font-extrabold tracking-[0.125rem] text-white">
                GENERA
              </span>
              <span className="mt-1 text-[11px] tracking-[0.5px] text-white/55">
                Content studio
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <nav className="relative flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4">
          {NAV.map((entry, i) => {
            if (entry.kind === "heading") {
              return (
                <p
                  key={`h-${i}`}
                  className="mt-4 px-4 pb-1 pt-1 font-caveat text-base font-bold text-gold-soft/70"
                >
                  {entry.label}
                </p>
              );
            }
            const active =
              entry.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(entry.href);
            const badge = badges[entry.href] ?? 0;
            return (
              <Link
                key={entry.href}
                href={entry.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white font-semibold text-forest shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={active ? "text-forest" : "text-white/60"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {entry.icon}
                </svg>
                <span className="flex-1">{entry.label}</span>
                {badge > 0 && (
                  <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold leading-none text-ink">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative shrink-0 border-t border-white/10 px-3 pb-4 pt-3">
          {userEmail && (
            <Link
              href="/admin/account"
              title={`${userEmail} — manage your account`}
              className="mb-2 block truncate px-4 text-[11px] text-white/50 hover:text-white"
            >
              Signed in as <span className="underline">{userEmail}</span>
            </Link>
          )}
          <form action="/admin/logout" method="post">
            <AdminFormStatusButton
              type="submit"
              variant="ghostWide"
              pendingLabel="Signing out…"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </AdminFormStatusButton>
          </form>
        </div>
      </aside>
    </>
  );
}
