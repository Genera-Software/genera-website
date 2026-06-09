import Image from "next/image";
import Link from "next/link";
import ConsentPreferencesLink from "@/components/ConsentPreferencesLink";
import { FOUNDING_100_CTA_LABEL, FOUNDING_100_SECTION_URL } from "@/lib/cta";

const PAW_LOGO = "/images/genera-svg.svg";

const PRODUCT_LINKS = [
  { href: "/features", label: "Features" },
  { href: FOUNDING_100_SECTION_URL, label: FOUNDING_100_CTA_LABEL },
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Blog" },
];

const COMPANY_LINKS = [
  { href: "/our-story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
  { href: "/badge-kit", label: "Badge Kit" },
  { href: "mailto:info@generasoftware.com", label: "Email Us" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/gdpr", label: "GDPR" },
];

export default function Footer() {
  return (
    <footer className="bg-forest-dark px-8 pt-16 text-white/70">
      <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-2.5">
            <Image
              src={PAW_LOGO}
              alt="Genera"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-massilia text-lg font-extrabold tracking-[2px] text-white">
              GENERA
            </span>
          </div>
          <p className="mb-7 max-w-[280px] text-fine leading-[1.85] text-white/50">
            Software built by pet business owners, for pet business owners.
          </p>
          <div className="flex gap-2.5">
            <a
              href="https://www.instagram.com/generadogsoftware/?hl=en"
              aria-label="Instagram"
              className="grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-white/15 bg-white/5 transition-colors hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white/70">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@genera.dog"
              aria-label="TikTok"
              className="grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-white/15 bg-white/5 transition-colors hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white/70">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61555766818481"
              aria-label="Facebook"
              className="grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-white/15 bg-white/5 transition-colors hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white/70">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        <FooterColumn title="Product" links={PRODUCT_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />
      </div>

      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 py-5">
        <p className="text-xs text-white/35">
          © 2026 Genera Software Ltd. Built with love by{" "}
          <a href="https://www.duncansdogco.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white/70 transition-colors">Duncan&apos;s Dog Co</a>.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-eyebrow tracking-wide text-white/50">
            GDPR Compliant
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-eyebrow tracking-wide text-white/50">
            DEFRA Aligned
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-eyebrow tracking-wide text-white/50">
            UK-Based Support
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-5 text-eyebrow font-bold uppercase tracking-[0.22em] text-white/55">
        {title}
      </p>
      <ul className="flex list-none flex-col gap-3">
        {links.map((l) => (
          <li key={`${title}-${l.label}`}>
            <Link
              href={l.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
        {title === "Legal" && (
          <li>
            <ConsentPreferencesLink />
          </li>
        )}
      </ul>
    </div>
  );
}
