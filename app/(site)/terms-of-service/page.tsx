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

const BODY = `
<p>Last updated: 25 May 2026</p>
<p>These Terms of Service ("Terms") govern your use of Genera Software Ltd's services and website at <a href="https://generasoftware.com">generasoftware.com</a>. By using our services or website, you agree to these Terms.</p>

<h2>About us</h2>
<p>Genera Software Ltd is registered in England and Wales (Company No. 15009675), registered address C/O Mjf Accountancy, 47 Booker Avenue, Liverpool, England, L18 4QZ. Contact: <a href="mailto:hello@generasoftware.com">hello@generasoftware.com</a>.</p>

<h2>Our services</h2>
<p>Genera Software designs, builds and manages software products, websites, and digital tools for businesses — primarily in the pet care and service sector. The specific scope of work, timelines and fees for any client engagement are set out in a separate written agreement between you and Genera Software.</p>

<h2>Use of this website</h2>
<p>You may use generasoftware.com for lawful purposes only. You agree not to:</p>
<ul>
  <li>Use the site in any way that violates applicable UK or international law</li>
  <li>Transmit any unsolicited or unauthorised advertising or promotional material</li>
  <li>Attempt to gain unauthorised access to any part of the site or its infrastructure</li>
  <li>Use the site to harm, harass or impersonate others</li>
</ul>

<h2>Intellectual property</h2>
<p>All content on this website — including text, graphics, logos, images and code — is the property of Genera Software Ltd or its licensors and is protected by copyright law.</p>
<p>The "Powered by Genera" badge and Genera logo are trademarks of Genera Software Ltd. Clients may display the badge on their Genera-built websites as permitted under their client agreement. You may not otherwise reproduce, distribute or modify our brand assets without written permission.</p>

<h2>Client work</h2>
<ul>
  <li>Ownership of the final deliverable transfers to you upon receipt of full payment, unless otherwise agreed in writing</li>
  <li>We retain the right to showcase completed work in our portfolio unless you request otherwise in writing</li>
  <li>Any third-party tools, platforms or licences incorporated into your project remain subject to their own terms</li>
  <li>We are not liable for third-party service outages, platform changes, or integrations outside our direct control</li>
</ul>

<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, Genera Software's total liability for any claim is limited to the fees paid by you in the three months preceding the claim. We are not liable for indirect, consequential or economic losses, including lost profits or business interruption.</p>
<p>Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, or anything else that cannot be excluded by law.</p>

<h2>Governing law</h2>
<p>These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

<h2>Changes to these Terms</h2>
<p>We may update these Terms at any time. The "last updated" date will reflect changes. Continued use of the site after changes constitutes acceptance.</p>
`;

export default function TermsOfServicePage() {
  return (
    <>
      <Reveal />

      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Legal</p>
          <h1 className="mt-2 text-white">Terms of Service</h1>
        </div>
      </section>

      <section className="bg-cream px-6 py-16 md:px-8 md:py-24">
        <article
          className="rev mx-auto max-w-[720px] font-niveau text-body-lg leading-[1.75] text-ink-soft [&_a]:font-semibold [&_a]:text-forest [&_a]:underline [&_a]:decoration-gold [&_a]:underline-offset-2 hover:[&_a]:text-forest-mid [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-massilia [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-[var(--leading-title)] [&_h2]:text-forest [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-massilia [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-forest [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_strong]:font-bold [&_strong]:text-forest [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: BODY }}
        />
      </section>
    </>
  );
}
