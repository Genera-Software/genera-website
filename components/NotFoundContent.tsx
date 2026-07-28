import Image from "next/image";
import Link from "next/link";

const HELPFUL_LINKS = [
  {
    href: "/features",
    label: "Features",
    blurb: "Bookings, invoicing, routes and more.",
  },
  {
    href: "/faqs",
    label: "FAQs",
    blurb: "The questions we get asked most.",
  },
  {
    href: "/blog",
    label: "Blog",
    blurb: "Tips for running a pet business.",
  },
  {
    href: "/contact",
    label: "Contact",
    blurb: "Talk to a real human, fast.",
  },
] as const;

/**
 * Body of the 404 page, without any site chrome — the root `not-found.tsx`
 * wraps it in Navbar/Footer, while `(site)/not-found.tsx` inherits those from
 * the site layout.
 */
export default function NotFoundContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 pt-32 pb-20 text-white md:pb-24">
        <div className="mx-auto grid max-w-[1000px] items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="text-center md:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
              🐾 Error 404
            </div>

            {/* "404" with the paw logo standing in for the zero. */}
            <div className="flex items-end justify-center gap-2 md:justify-start">
              <span className="font-massilia text-[clamp(4.5rem,13vw,7.5rem)] font-extrabold leading-none text-gold">
                4
              </span>
              <Image
                src="/images/genera-svg.svg"
                alt="0"
                width={120}
                height={120}
                className="h-[clamp(3.5rem,10vw,5.9rem)] w-auto animate-wobble"
                priority
              />
              <span className="font-massilia text-[clamp(4.5rem,13vw,7.5rem)] font-extrabold leading-none text-gold">
                4
              </span>
            </div>

            <h1 className="mt-4 text-[clamp(1.75rem,3.2vw,2.4rem)] font-bold leading-tight text-white">
              This page has{" "}
              <span className="squig">
                run off
                <svg viewBox="0 0 180 12" preserveAspectRatio="none">
                  <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7" />
                </svg>
              </span>{" "}
              with the ball
            </h1>
            <p className="mx-auto mt-5 max-w-[520px] text-white/80 md:mx-0">
              We could not find what you were looking for. The link may be out
              of date, or the page may have moved to a new home.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/" className="btn btn-gold btn-lg">
                Back to Home
              </Link>
              <Link href="/contact" className="btn btn-outline-w btn-lg">
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <Image
              src="/images/confused.png"
              alt="An illustration of a person shrugging, looking confused"
              width={308}
              height={471}
              className="h-auto w-[180px] animate-illust-float drop-shadow-[0_24px_40px_rgba(0,0,0,0.28)] md:w-[240px]"
            />
          </div>
        </div>
      </section>

      {/* Where to next */}
      <section className="bg-cream px-8 py-20">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center">
            <span className="eyebrow">Try one of these</span>
            <h2 className="text-heading-mid">Where would you like to go?</h2>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {HELPFUL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-2xl border-2 border-teal-mid bg-white px-6 py-5 transition-all hover:-translate-y-1 hover:border-forest hover:shadow-[0_12px_32px_rgba(0,62,69,0.12)]"
              >
                <span className="font-massilia text-mini-h font-bold text-forest">
                  {link.label}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <p className="mt-1 text-meta text-ink-soft">{link.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
