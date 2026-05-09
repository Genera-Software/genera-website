"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  {
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
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed left-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal-mid bg-white shadow-sm lg:hidden"
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
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-forest-dark text-white transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-forest-mid/50 px-5">
          <Link
            href="/admin"
            className="font-poppins text-lg font-extrabold text-white"
          >
            Genera <span className="text-gold">CMS</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-soft/70 hover:bg-forest hover:text-white lg:hidden"
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

        <nav className="flex flex-col gap-1 p-4">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold/15 text-gold-soft"
                    : "text-cream hover:bg-forest hover:text-white"
                }`}
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
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg border border-forest-mid/50 px-3 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-forest hover:text-white"
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
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
