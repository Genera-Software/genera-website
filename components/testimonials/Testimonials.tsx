import Paw from "@/components/Paw";
import type { Testimonial } from "@/lib/testimonials";
import TestimonialAuthor from "./TestimonialAuthor";

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-gradient-to-b from-teal-soft to-cream px-6 py-13 md:px-8 md:py-22"
    >
      <Paw className="absolute left-[4%] top-[8%] hidden h-[4.5rem] w-[4.5rem] -rotate-12 animate-[var(--animate-wobble)] text-forest opacity-10 md:block" />

      <div className="mx-auto max-w-[1160px]">
        <div className="rev mb-10 text-center md:mb-16">
          <p className="eyebrow">In their own words</p>
          <h2 className="text-section-h md:text-section-h-lg">
            Don&apos;t just take our word for it.
          </h2>
          <p className="mx-auto mt-2 max-w-[560px] text-meta text-ink-soft md:mt-3 md:text-body-lg">
            From the people running the yard, the vans and the diary every day.
          </p>
        </div>

        <div
          className={`mx-auto grid gap-10 md:gap-8 ${
            testimonials.length > 1 ? "max-w-[1040px] md:grid-cols-2" : "max-w-[600px]"
          }`}
        >
          {testimonials.map((t, i) => (
            <figure
              key={t.id}
              className={`rev d${(i % 6) + 1} relative flex flex-col rounded-[22px_18px_24px_20px/20px_24px_18px_22px] border border-teal-mid/70 bg-white px-6 pb-6 pt-9 shadow-[0_8px_32px_rgba(0,62,69,0.07)] md:px-9 md:pb-8 md:pt-11`}
            >
              <span
                aria-hidden
                className="absolute -top-5 left-6 grid h-11 w-11 place-items-center rounded-full bg-gold text-forest shadow-[0_6px_18px_rgba(255,168,0,0.35)] md:left-9 md:h-12 md:w-12"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M9.6 6C6.5 7.3 4.5 10 4.5 13.4V18h5.8v-5.6H7.4c.1-2 1.2-3.5 3.2-4.4L9.6 6Zm9 0c-3.1 1.3-5.1 4-5.1 7.4V18h5.8v-5.6h-2.9c.1-2 1.2-3.5 3.2-4.4L18.6 6Z" />
                </svg>
              </span>

              <blockquote className="flex-1">
                <p className="font-massilia text-body-lg leading-snug text-ink md:text-[1.3rem] md:leading-[1.4]">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>

              <figcaption className="mt-6 border-t border-cream-dark pt-5 md:mt-8 md:pt-6">
                <TestimonialAuthor testimonial={t} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
