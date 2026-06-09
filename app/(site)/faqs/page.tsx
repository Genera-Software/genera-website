import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import { createMetadata } from "@/lib/seo";
import { FOUNDING_100_CTA_LABEL } from "@/lib/cta";
import { getPublicSupabase } from "@/lib/supabase/server";
import FaqAccordion, { type FaqItem } from "./_components/FaqAccordion";

export const revalidate = 60;

export const metadata: Metadata = {
  ...createMetadata({
    title: "Dog Daycare Software FAQs for Pet Businesses",
    description:
      "Find answers about Genera dog daycare software, including the Founding 100, online bookings, invoicing, client records, data security, support and setup.",
    path: "/faqs",
  }),
};

export default async function FaqsPage() {
  const supabase = getPublicSupabase();
  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer_html")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  const items: FaqItem[] = (data ?? []).map((row) => ({
    id: row.id,
    q: row.question,
    a: row.answer_html,
  }));

  return (
    <>
      <Reveal />

      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 pt-32 pb-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
            🐾 Frequently Asked Questions
          </div>
          <h1 className="mt-2 text-[clamp(1.75rem,3.2vw,2.4rem)] font-bold leading-tight text-white">
            Everything you need to know about{" "}
            <span className="squig">
              Genera
              <svg viewBox="0 0 180 12" preserveAspectRatio="none">
                <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7" />
              </svg>
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-white/80">
            Got questions? We have got answers. If you cannot find what you are
            looking for, drop us an email and we will get back to you within
            one working day.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="bg-cream px-8 py-22">
        <div className="rev mx-auto max-w-[860px]">
          {items.length > 0 ? (
            <FaqAccordion items={items} />
          ) : (
            <p className="text-center text-ink-soft">
              FAQs are coming soon. In the meantime, drop us a line at{" "}
              <a
                href="mailto:info@generasoftware.com"
                className="font-semibold text-forest underline decoration-gold underline-offset-2"
              >
                info@generasoftware.com
              </a>
              .
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-dark px-8 py-22 text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="text-heading-mid !text-white">Still have questions?</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/80">
            We are a small team and we read every message. Get in touch and we
            will help you figure out if Genera is right for your business.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <BookDemoButton className="btn btn-gold btn-lg">
              {FOUNDING_100_CTA_LABEL}
            </BookDemoButton>
            <a
              href="mailto:info@generasoftware.com?subject=Question%20about%20Genera"
              className="btn btn-forest btn-lg"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
