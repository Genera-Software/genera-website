/*
 * Genera Software — Navbar
 * Brand: Teal (#003E45), Genera Gold (#FFA800), Poppins headings, Inter body
 * Logo: Real Genera paw icon image + "GENERA" bold + "A Better Breed of Software" tagline
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663478487775/BxxxoQYbhf7FnKvPttwktS/genera-paw-fixed_92730de9.png";

const APP_URL = "https://app.generasoftware.com/admin";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/founding-100", label: "Founding 100" },
  { href: "/our-story", label: "Our Story" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <nav className="container flex items-center justify-between h-16 lg:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src={LOGO_URL}
            alt="Genera paw logo"
            className="w-10 h-10 object-contain"
          />
          <div className="flex flex-col leading-none">
            <span
              className="text-forest text-lg tracking-wide"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}
            >
              GENERA
            </span>
            <span
              className="text-[9px] text-charcoal/50 tracking-wider hidden sm:block"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              A Better Breed of Software
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                  location === link.href
                    ? "text-forest"
                    : "text-charcoal/70 hover:text-forest"
                }`}
              >
                {link.label}
                {location === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gold text-forest text-sm font-bold rounded-lg hover:bg-gold-dark transition-all duration-200 shadow-sm hover:shadow-md"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start 3-Month Free Trial
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-charcoal"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 px-3 rounded-lg text-base font-medium transition-colors ${
                    location === link.href
                      ? "text-forest bg-gold-light"
                      : "text-charcoal hover:bg-light-grey"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-border flex flex-col gap-2">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 text-center bg-gold text-forest font-bold rounded-lg"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Start 3-Month Free Trial
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
