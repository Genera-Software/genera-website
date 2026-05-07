import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { createMetadata } from "@/lib/seo";
import { REGISTER_URL } from "@/lib/urls";
import FaqAccordion, { type Faq } from "./_components/FaqAccordion";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Dog Daycare Software FAQs for Pet Businesses",
    description:
      "Find answers about Genera dog daycare software, including free trials, online bookings, invoicing, client records, data security, support and setup.",
    path: "/faqs",
  }),
};

const FAQS: Faq[] = [
  {
    q: "Is Genera really free?",
    a: (
      <p>
        Right now, yes — completely. We are currently onboarding our{" "}
        <strong>Founding One Hundred</strong>: the first 100 pet businesses to
        join Genera get 3 months completely free, with no credit card required
        and no commitment. You also get one-on-one onboarding support, priority
        access to new features, and locked-in founding member pricing that
        stays with you forever. After your free period, pricing is simple and
        transparent — and founding members always pay less than anyone who
        joins after. Spots are limited, so if you are reading this, now is the
        time.
      </p>
    ),
  },
  {
    q: "What features are included?",
    a: (
      <p>
        Everything: bookings, client management, pet records, invoicing, route
        planning, staff management, and more. All features are included from
        the start — there are no locked tiers or premium upgrades. You get the
        full platform.
      </p>
    ),
  },
  {
    q: "Is my data safe?",
    a: (
      <p>
        Absolutely. Genera is fully GDPR compliant and uses enterprise-grade
        encryption to protect your data. Everything is stored securely in the
        cloud with regular backups. We take data security as seriously as you
        take the dogs in your care.
      </p>
    ),
  },
  {
    q: "Can I import my existing data?",
    a: (
      <p>
        Yes. We can help you migrate your existing client and pet data into
        Genera. Whether you are coming from spreadsheets, another system, or
        paper records, just get in touch and we will walk you through the
        process step by step.
      </p>
    ),
  },
  {
    q: "Do I need to download anything?",
    a: (
      <p>
        No. Genera is fully cloud-based. You can access it from any device with
        a web browser — desktop, laptop, tablet, or phone. There is nothing to
        install, no updates to manage, and no compatibility issues to worry
        about.
      </p>
    ),
  },
  {
    q: "Is there a limit on how many pets or clients I can add?",
    a: (
      <p>
        No limits at all. Add as many pets, clients, bookings, and staff
        members as you need. Whether you are a solo dog walker with 10 clients
        or a daycare with 200, Genera scales with you.
      </p>
    ),
  },
  {
    q: "What if I need help?",
    a: (
      <p>
        Our UK-based support team is here for you. Email us anytime at{" "}
        <a
          href="mailto:info@generasoftware.com"
          className="font-semibold text-forest underline decoration-gold underline-offset-2 hover:text-forest-mid"
        >
          info@generasoftware.com
        </a>{" "}
        and we will get back to you within one working day. We also welcome
        feature requests — we are building Genera with the industry, not just
        for it.
      </p>
    ),
  },
  {
    q: "How is Genera different from other pet business software?",
    a: (
      <p>
        Genera was built inside a real pet business — Duncan&apos;s Dog Co —
        over 15 years. Every feature exists because we needed it ourselves. We
        are DEFRA aligned and offer a generous 3-month free trial so you can
        experience the full platform before committing.
      </p>
    ),
  },
  {
    q: "Can my clients book online?",
    a: (
      <p>
        Yes. Genera includes a client-facing booking portal where your
        customers can view availability, book sessions, and manage their own
        details — 24/7. You set the capacity limits and approval rules, so you
        stay in control.
      </p>
    ),
  },
  {
    q: "Does Genera handle invoicing?",
    a: (
      <p>
        Yes. You can generate invoices in bulk, set up recurring billing cycles
        (weekly, fortnightly, or monthly), auto-charge cards, and send
        automatic payment reminders. No more Sunday evening invoice dread.
      </p>
    ),
  },
];

export default function FaqsPage() {
  return (
    <>
      <Reveal />

      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Frequently Asked Questions</p>
          <h1 className="mt-2 text-white">
            Everything you need to know about <em className="text-gold">Genera</em>
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
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-dark px-8 py-22 text-center text-white">
        <div className="rev mx-auto max-w-[760px]">
          <h2 className="!text-white">Still have questions?</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-white/80">
            We are a small team and we read every message. Get in touch and we
            will help you figure out if Genera is right for your business.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={REGISTER_URL}
              className="btn btn-gold btn-lg"
            >
              Start 3-Month Free Trial
            </a>
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
