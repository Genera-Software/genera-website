"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BookDemoButton from "@/components/BookDemoButton";
import { LOGIN_URL } from "@/lib/urls";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/founding100", label: "Founding 100" },
  { href: "/our-story", label: "Our Story" },
  { href: "/blog", label: "Blog" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
] as const;

const PAW_LOGO = "/images/genera-svg.svg";

/** How far the nav can slide upward before being fully tucked away (px). */
const HIDE_DISTANCE = 110;
/** Below this scrollY, the nav is always fully visible. */
const PIN_AT_TOP = 60;

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [offset, setOffset] = useState(0); // 0 = visible, -HIDE_DISTANCE = hidden
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        setStuck(y > 50);
        if (y < PIN_AT_TOP) {
          setOffset(0);
        } else {
          setOffset((prev) =>
            Math.max(-HIDE_DISTANCE, Math.min(0, prev - delta)),
          );
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        hamRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onHide = () => setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, [open]);

  return (
    <>
      <nav
        style={{
          transform: open ? "translateY(0)" : `translateY(${offset}px)`,
          opacity: open ? 1 : 1 + offset / HIDE_DISTANCE,
        }}
        className={`fixed top-3 right-0 left-0 z-[100] mx-auto flex h-[58px] w-[calc(100%-1rem)] max-w-[1160px] items-center gap-4 rounded-full bg-forest/85 pl-4 pr-2 backdrop-blur-md transition-shadow duration-300 ease-out md:top-4 md:h-[68px] md:w-[calc(100%-2rem)] md:gap-8 md:pl-6 md:pr-3 ${
          stuck
            ? "shadow-[0_14px_36px_rgba(0,0,0,0.3)]"
            : "shadow-[0_6px_22px_rgba(0,0,0,0.18)]"
        }`}
      >
        <Link
          href="/"
          aria-label="Genera home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <Image
            src={PAW_LOGO}
            alt="Genera paw logo"
            width={38}
            height={38}
            className="h-[38px] w-[38px] object-contain"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-massilia text-body-lg font-extrabold tracking-[0.125rem] text-white">
              GENERA
            </span>
            <span className="my-[5px] text-eyebrow tracking-[0.5px] text-white/60">
              A Better Breed of Software
            </span>
          </span>
        </Link>

        <div className="mx-auto hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-2.5 py-1.5 text-fine font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <BookDemoButton
            className="inline-flex items-center rounded-full bg-gold px-5 py-2 font-massilia text-fine font-bold text-ink shadow-[0_4px_14px_rgba(255,168,0,0.35)] transition-shadow hover:shadow-[0_6px_22px_rgba(255,168,0,0.5)]"
          >
            Join Genera
          </BookDemoButton>
        </div>

        <button
          ref={hamRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="ml-auto flex flex-col gap-[5px] p-1.5 md:hidden"
        >
          <span
            className={`block h-[2.5px] w-6 rounded bg-white transition-transform ${
              open ? "translate-y-[7.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2.5px] w-6 rounded bg-white transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2.5px] w-6 rounded bg-white transition-transform ${
              open ? "-translate-y-[7.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <div
        ref={menuRef}
        className={`fixed inset-0 z-[99] flex-col gap-2 bg-forest px-8 pt-20 pb-8 ${
          open ? "flex" : "hidden"
        } md:hidden`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute right-6 top-4 cursor-pointer border-none bg-transparent text-3xl font-light leading-none text-white"
        >
          ×
        </button>
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="border-b border-white/10 py-3 font-massilia text-mini-h font-bold text-white/85 hover:text-gold"
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-6 flex flex-col gap-3">
          <BookDemoButton
            className="btn btn-gold btn-lg"
            onClick={() => setOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
