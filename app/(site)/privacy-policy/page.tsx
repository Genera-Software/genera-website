import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Privacy Policy | Genera Software",
    description:
      "How Genera Software collects, uses and protects your personal data. Read our full privacy policy.",
    path: "/privacy-policy",
  }),
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Reveal />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Legal</p>
          <h1 className="mt-2 text-white">Privacy Policy</h1>
          <p className="mx-auto mt-5 max-w-[600px] text-white/80">
            Last updated: 25 May 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-cream px-8 py-20">
        <div className="mx-auto max-w-[860px] prose prose-genera">

          <h2>Who we are</h2>
          <p>
            Genera Software Ltd (&ldquo;Genera&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a software
            company registered in England and Wales (Company No. 15009675),
            with registered address at C/O Mjf Accountancy, 47 Booker Avenue,
            Liverpool, England, L18 4QZ. We build and manage software products
            and websites for pet care and service businesses.
          </p>
          <p>
            For questions about this policy, contact us at{" "}
            <a href="mailto:hello@generasoftware.com">hello@generasoftware.com</a>.
          </p>

          <hr />

          <h2>What information we collect</h2>
          <p>We may collect the following personal data:</p>
          <ul>
            <li>
              <strong>Contact information</strong> &mdash; name, email address,
              phone number, when you fill in our contact form or enquire about
              our services
            </li>
            <li>
              <strong>Business information</strong> &mdash; company name,
              website, industry, when you become or enquire about becoming a
              client
            </li>
            <li>
              <strong>Usage data</strong> &mdash; pages visited, time on site,
              browser type, via cookies and analytics tools
            </li>
            <li>
              <strong>Communications</strong> &mdash; emails, messages and any
              information you share when corresponding with us
            </li>
          </ul>

          <hr />

          <h2>How we use your information</h2>
          <p>We use your personal data to:</p>
          <ul>
            <li>Respond to enquiries and provide our services</li>
            <li>
              Manage your client account and deliver the software or website
              we&apos;ve agreed to build
            </li>
            <li>
              Send service-related updates (not marketing, unless you&apos;ve
              opted in)
            </li>
            <li>Improve our website and understand how people use it</li>
            <li>Meet our legal and contractual obligations</li>
          </ul>

          <p>
            <strong>Our lawful basis</strong> under UK GDPR:
          </p>
          <ul>
            <li>
              <strong>Contract</strong> &mdash; processing needed to deliver
              our services to you
            </li>
            <li>
              <strong>Legitimate interests</strong> &mdash; responding to
              enquiries, improving our services
            </li>
            <li>
              <strong>Consent</strong> &mdash; for marketing emails (you can
              withdraw at any time)
            </li>
            <li>
              <strong>Legal obligation</strong> &mdash; where required by law
            </li>
          </ul>

          <hr />

          <h2>Who we share your data with</h2>
          <p>
            We do not sell your personal data. We may share it with:
          </p>
          <ul>
            <li>
              <strong>Service providers</strong> &mdash; tools we use to
              operate our business (e.g. email platforms, project management,
              analytics). These are bound by data processing agreements.
            </li>
            <li>
              <strong>Hosting providers</strong> &mdash; our website and client
              platforms are hosted on secure third-party infrastructure
            </li>
            <li>
              <strong>Legal authorities</strong> &mdash; if required by law
            </li>
          </ul>

          <hr />

          <h2>How long we keep your data</h2>
          <ul>
            <li>
              Enquiry / contact data: 12 months if no contract is entered into
            </li>
            <li>
              Client data: for the duration of the contract and 6 years
              afterwards (for legal and tax purposes)
            </li>
            <li>
              Analytics data: as per our analytics provider&apos;s retention
              settings
            </li>
          </ul>

          <hr />

          <h2>Your rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul>
            <li>
              <strong>Access</strong> the personal data we hold about you
            </li>
            <li>
              <strong>Correct</strong> inaccurate data
            </li>
            <li>
              <strong>Erase</strong> your data (in certain circumstances)
            </li>
            <li>
              <strong>Restrict</strong> or <strong>object</strong> to our
              processing
            </li>
            <li>
              <strong>Data portability</strong> &mdash; receive your data in a
              machine-readable format
            </li>
            <li>
              <strong>Withdraw consent</strong> at any time where processing is
              based on consent
            </li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:hello@generasoftware.com">
              hello@generasoftware.com
            </a>
            . We will respond within 30 days. If you are unhappy with how we
            have handled your data, you have the right to complain to the{" "}
            <strong>Information Commissioner&apos;s Office (ICO)</strong> at{" "}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              ico.org.uk
            </a>
            .
          </p>

          <hr />

          <h2>Transfers outside the UK</h2>
          <p>
            Some of our service providers may process data outside the UK.
            Where this happens, we ensure appropriate safeguards are in place,
            such as UK adequacy decisions or standard contractual clauses.
          </p>

          <hr />

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The &ldquo;last
            updated&rdquo; date at the top will reflect any changes. We
            recommend checking back periodically.
          </p>

          <hr />

          <p className="text-sm text-ink-soft">
            Genera Software Ltd &middot; Company No. 15009675 &middot; C/O Mjf
            Accountancy, 47 Booker Avenue, Liverpool, England, L18 4QZ
          </p>
        </div>
      </section>
    </>
  );
}
