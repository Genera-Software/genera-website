import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createMetadata({
    title: "GDPR & Data Protection | Genera Software",
    description:
      "Genera Software's commitment to GDPR and UK data protection law. Your rights, our obligations, and how to contact us.",
    path: "/gdpr",
  }),
};

const BODY = `
<p>Last updated: 25 May 2026</p>
<p>Genera Software Ltd is committed to protecting your personal data and complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

<h2>Data Controller</h2>
<p>Genera Software Ltd is the <strong>Data Controller</strong> for personal data collected via this website and during client engagements.</p>
<ul>
  <li><strong>Company No.:</strong> 15009675</li>
  <li><strong>Registered address:</strong> C/O Mjf Accountancy, 47 Booker Avenue, Liverpool, England, L18 4QZ</li>
  <li><strong>Contact:</strong> <a href="mailto:hello@generasoftware.com">hello@generasoftware.com</a></li>
  <li><strong>ICO Registration No.:</strong> [Add when registered]</li>
</ul>

<h2>Data Processor obligations</h2>
<p>Where Genera Software builds and manages software or websites that collect personal data on behalf of a client, we act as a <strong>Data Processor</strong> on that client's behalf. In this capacity:</p>
<ul>
  <li>We only process personal data as instructed by the client (Data Controller)</li>
  <li>We have appropriate technical and organisational security measures in place</li>
  <li>We do not share or use that data for our own purposes</li>
  <li>We support clients in meeting their own GDPR obligations, such as responding to subject access requests</li>
  <li>We enter into a Data Processing Agreement (DPA) with all clients whose platforms handle personal data</li>
</ul>
<p>If you are a client and need a DPA, please contact <a href="mailto:hello@generasoftware.com">hello@generasoftware.com</a>.</p>

<h2>Your rights under UK GDPR</h2>
<p>You have the following rights regarding your personal data:</p>
<ul>
  <li><strong>Access</strong> — request a copy of the data we hold about you</li>
  <li><strong>Rectification</strong> — ask us to correct inaccurate or incomplete data</li>
  <li><strong>Erasure</strong> — request deletion of your data where there is no legal basis to keep it</li>
  <li><strong>Restriction</strong> — ask us to pause processing in certain circumstances</li>
  <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
  <li><strong>Objection</strong> — object to processing based on legitimate interests</li>
  <li><strong>Withdraw consent</strong> — opt out of any consent-based processing at any time</li>
</ul>
<p>To exercise any right, email <a href="mailto:hello@generasoftware.com">hello@generasoftware.com</a> with your name and the right you wish to exercise. We will respond within <strong>30 days</strong>.</p>

<h2>Data security</h2>
<ul>
  <li>Encrypted data storage and transmission (HTTPS/TLS)</li>
  <li>Access controls limiting who can view personal data</li>
  <li>Regular review of third-party tools and their data practices</li>
  <li>Secure deletion of data when no longer needed</li>
</ul>

<h2>Complaints</h2>
<p>If you believe we have mishandled your personal data, you have the right to complain to the <strong>Information Commissioner's Office (ICO)</strong>:</p>
<ul>
  <li>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a></li>
  <li>Helpline: 0303 123 1113</li>
</ul>
<p>We would always appreciate the chance to resolve concerns directly first — please email <a href="mailto:hello@generasoftware.com">hello@generasoftware.com</a>.</p>
`;

export default function GdprPage() {
  return (
    <>
      <Reveal />

      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Legal</p>
          <h1 className="mt-2 text-white">GDPR &amp; Data Protection</h1>
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
