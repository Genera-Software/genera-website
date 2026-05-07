"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LOGIN_URL, REGISTER_URL } from "@/lib/urls";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/our-story", label: "Our Story" },
  { href: "/blog", label: "Blog" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
] as const;

const PAW_LOGO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/genera-paw-fixed_92730de9.png";

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        className={`sticky top-0 z-[100] bg-forest px-8 transition-shadow duration-300 ${
          stuck ? "shadow-[0_4px_24px_rgba(0,0,0,0.18)]" : ""
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1160px] items-center gap-8">
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
            <span className="flex flex-col leading-[1.1]">
              <span className="font-poppins text-[1.1rem] font-extrabold tracking-[0.125rem] text-white">
                GENERA
              </span>
              <span className="text-[0.62rem] tracking-[0.5px] text-white/60">
                A Better Breed of Software
              </span>
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-[20px] px-3 py-1.5 text-[0.9rem] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="ml-4 hidden items-center gap-2 md:flex">
            <Link
              href={LOGIN_URL}
              className="rounded-full px-3 py-1.5 text-[0.85rem] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Login
            </Link>
            <Link
              href={REGISTER_URL}
              className="inline-flex items-center rounded-full bg-gold px-5 py-2 font-poppins text-[0.85rem] font-bold text-ink shadow-[0_4px_14px_rgba(255,168,0,0.35)] transition-shadow hover:shadow-[0_6px_22px_rgba(255,168,0,0.5)]"
            >
              Start Free Trial
            </Link>
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
        </div>
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
            className="border-b border-white/10 py-3 font-poppins text-[1.35rem] font-bold text-white/85 hover:text-gold"
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={REGISTER_URL}
            className="btn btn-gold btn-lg"
            onClick={() => setOpen(false)}
          >
            Start Free Trial
          </Link>
          <Link
            href={LOGIN_URL}
            className="btn btn-outline-w btn-lg"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <a
            href="mailto:info@generasoftware.com?subject=I%27d%20like%20to%20know%20more%20about%20Genera"
            className="btn btn-outline-w btn-lg"
            onClick={() => setOpen(false)}
          >
            Book a Demo
          </a>
        </div>
      </div>
    </>
  );
}
