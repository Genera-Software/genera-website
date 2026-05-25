import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Terms of Service | Genera Software",
    description:
      "The terms and conditions governing use of Genera Software's website and services.",
    path: "/terms-of-service",
  }),
};

export default function TermsOfServicePage() {
  return (
    <>
      <Reveal />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Legal</p>
          <h1 className="mt-2 text-white">Terms of Service</h1>
          <p className="mx-auto mt-5 max-w-[600px] text-white/80">
            Last updated: 25 May 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-cream px-8 py-20">
        <div className="mx-auto max-w-[860px] prose prose-genera">

          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
            Genera Software Ltd&apos;s services and website at{" "}
            <a href="https://generasoftware.com">generasoftware.com</a>. By
            using our services or website, you agree to these Terms.
          </p>

          <h2>About us</h2>
          <p>
            Genera Software Ltd is registered in England and Wales (Company
            No. 15009675), registered address C/O Mjf Accountancy, 47 Booker
            Avenue, Liverpool, England, L18 4QZ. Contact:{" "}
            <a href="mailto:hello@generasoftware.com">
              hello@generasoftware.com
            </a>
            .
          </p>

          <hr />

          <h2>Our services</h2>
          <p>
            Genera Software designs, builds and manages software products,
            websites, and digital tools for businesses &mdash; primarily in the
            pet care and service sector. The specific scope of work, timelines
            and fees for any client engagement are set out in a separate written
            agreement (a proposal, statement of work, or contract) between you
            and Genera Software.
          </p>

          <hr />

          <h2>Use of this website</h2>
          <p>
            You may use generasoftware.com for lawful purposes only. You agree
            not to:
          </p>
          <ul>
            <li>
              Use the site in any way that violates applicable UK or
              international law
            </li>
            <li>
              Transmit any unsolicited or unauthorised advertising or
              promotional material
            </li>
            <li>
              Attempt to gain unauthorised access to any part of the site or
              its infrastructure
            </li>
            <li>Use the site to harm, harass or impersonate others</li>
          </ul>

          <hr />

          <h2>Intellectual property</h2>
          <p>
            All content on this website &mdash; including text, graphics,
            logos, images and code &mdash; is the property of Genera Software
            Ltd or its licensors and is protected by copyright law.
          </p>
          <p>
            The &ldquo;Powered by Genera&rdquo; badge and Genera logo are
            trademarks of Genera Software Ltd. Clients may display the badge on
            their Genera-built websites as permitted under their client
            agreement. You may not otherwise reproduce, distribute or modify
            our brand assets without written permission.
          </p>

          <hr />

          <h2>Client work</h2>
          <p>
            Where Genera Software has been engaged to build a website or
            software product for your business:
          </p>
          <ul>
            <li>
              Ownership of the final deliverable transfers to you upon receipt
              of full payment, unless otherwise agreed in writing
            </li>
            <li>
              We retain the right to showcase completed work in our portfolio
              unless you request otherwise in writing
            </li>
            <li>
              Any third-party tools, platforms or licences incorporated into
              your project remain subject to their own terms
            </li>
            <li>
              We are not liable for third-party service outages, platform
              changes, or integrations outside our direct control
            </li>
          </ul>

          <hr />

          <h2>Limitation of liability</h2>
          <p>To the fullest extent permitted by law:</p>
          <ul>
            <li>
              Genera Software&apos;s total liability for any claim arising from
              use of our services or website is limited to the fees paid by you
              in the three months preceding the claim
            </li>
            <li>
              We are not liable for indirect, consequential or economic losses,
              including lost profits or business interruption
            </li>
            <li>
              We make no guarantees about the availability, accuracy or fitness
              for purpose of the website
            </li>
          </ul>
          <p>
            Nothing in these Terms limits liability for death or personal
            injury caused by negligence, fraud, or anything else that cannot be
            excluded by law.
          </p>

          <hr />

          <h2>Governing law</h2>
          <p>
            These Terms are governed by the laws of England and Wales. Any
            disputes shall be subject to the exclusive jurisdiction of the
            courts of England and Wales.
          </p>

          <hr />

          <h2>Changes to these Terms</h2>
          <p>
            We may update these Terms at any time. The &ldquo;last
            updated&rdquo; date will reflect changes. Continued use of the site
            after changes constitutes acceptance.
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
