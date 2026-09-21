import Image from "next/image";

/* ============================================================
   "Businesses already on board": the scrolling strip of customer
   logos under a hero. The markup is the homepage's, lifted so the
   per-vertical landing pages show the same strip. Rows come from
   the trust_logos table (edited at /admin/logos); an empty list
   renders nothing rather than an empty band.
   ============================================================ */

export type TrustLogo = { id: string; name: string; logo_url: string | null };

export default function TrustBar({ logos }: { logos: TrustLogo[] }) {
  if (logos.length === 0) return null;

  return (
    <div
      aria-label="Businesses using Genera"
      className="overflow-x-hidden overflow-y-visible border-y-2 border-teal-mid bg-teal-soft py-4 md:py-8"
    >
      <p className="mb-2 text-center font-caveat text-body-lg text-forest md:text-mini-h">
        Businesses already on board
      </p>
      <div className="overflow-y-visible">
        <div className="flex w-max animate-[var(--animate-scroll-x)] gap-2 md:gap-4">
          {[...logos, ...logos].map((logo, i) =>
            logo.logo_url ? (
              <span key={`${logo.id}-${i}`} className="relative mt-1.5 shrink-0 pt-7 md:mt-2 md:pt-8">
                <span className="flex h-9 items-center justify-center rounded-full border-2 border-teal-mid bg-white px-3.5 md:h-11 md:px-4">
                  <span className="whitespace-nowrap text-eyebrow font-semibold text-forest md:text-fine">
                    {logo.name}
                  </span>
                </span>
                <span className="absolute -top-3 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center overflow-hidden rounded-full border-2 border-teal-mid bg-white md:-top-4 md:h-14 md:w-14">
                  <Image
                    src={logo.logo_url}
                    alt={logo.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </span>
              </span>
            ) : (
              <span key={`${logo.id}-${i}`} className="relative mt-1.5 shrink-0 pt-7 md:mt-2 md:pt-8">
                <span className="flex h-9 items-center justify-center whitespace-nowrap rounded-full border-2 border-teal-mid bg-white px-3.5 text-eyebrow font-semibold text-forest md:h-11 md:px-4 md:text-fine">
                  {logo.name}
                </span>
                <span className="absolute -top-3 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border-2 border-teal-mid bg-white font-massilia text-eyebrow font-bold text-forest md:-top-4 md:h-14 md:w-14 md:text-fine">
                  {logo.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((word) => word[0]?.toUpperCase())
                    .join("")}
                </span>
              </span>
            ),
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 px-6 font-caveat text-meta text-forest md:mt-6 md:text-body-lg">
        <span className="tracking-widest text-gold">★★★★★</span>
        <span>Trusted by pet businesses across the UK</span>
      </div>
    </div>
  );
}
