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

const BODY = `
<p>Last updated: 25 May 2026</p>

<h2>Who we are</h2>
<p>Genera Software Ltd ("Genera", "we", "us", "our") is a software company registered in England and Wales (Company No. 15009675), with registered address at C/O Mjf Accountancy, 47 Booker Avenue, Liverpool, England, L18 4QZ. We build and manage software products and websites for pet care and service businesses.</p>
<p>For questions about this policy, contact us at <a href="mailto:hello@generasoftware.com">hello@generasoftware.com</a>.</p>

<h2>What information we collect</h2>
<ul>
  <li><strong>Contact information</strong> — name, email address, phone number, when you fill in our contact form or enquire about our services</li>
  <li><strong>Business information</strong> — company name, website, industry, when you become or enquire about becoming a client</li>
  <li><strong>Usage data</strong> — pages visited, time on site, browser type, via cookies and analytics tools</li>
  <li><strong>Communications</strong> — emails, messages and any information you share when corresponding with us</li>
</ul>

<h2>How we use your information</h2>
<p>We use your personal data to:</p>
<ul>
  <li>Respond to enquiries and provide our services</li>
  <li>Manage your client account and deliver the software or website we've agreed to build</li>
  <li>Send service-related updates (not marketing, unless you've opted in)</li>
  <li>Improve our website and understand how people use it</li>
  <li>Meet our legal and contractual obligations</li>
</ul>
<p><strong>Our lawful basis</strong> under UK GDPR:</p>
<ul>
  <li><strong>Contract</strong> — processing needed to deliver our services to you</li>
  <li><strong>Legitimate interests</strong> — responding to enquiries, improving our services</li>
  <li><strong>Consent</strong> — for marketing emails (you can withdraw at any time)</li>
  <li><strong>Legal obligation</strong> — where required by law</li>
</ul>

<h2>Who we share your data with</h2>
<p>We do not sell your personal data. We may share it with:</p>
<ul>
  <li><strong>Service providers</strong> — tools we use to operate our business (e.g. email platforms, project management, analytics), bound by data processing agreements</li>
  <li><strong>Hosting providers</strong> — our website and client platforms are hosted on secure third-party infrastructure</li>
  <li><strong>Legal authorities</strong> — if required by law</li>
</ul>

<h2>How long we keep your data</h2>
<ul>
  <li>Enquiry / contact data: 12 months if no contract is entered into</li>
  <li>Client data: for the duration of the contract and 6 years afterwards (for legal and tax purposes)</li>
  <li>Analytics data: as per our analytics provider's retention settings</li>
</ul>

<h2>Your rights</h2>
<p>Under UK GDPR, you have the right to access, correct, erase, restrict or object to our processing of your data, request data portability, and withdraw consent at any time where processing is based on consent.</p>
<p>To exercise any of these rights, email <a href="mailto:hello@generasoftware.com">hello@generasoftware.com</a>. We will respond within 30 days. If you are unhappy with how we have handled your data, you can complain to the <strong>Information Commissioner's Office (ICO)</strong> at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</p>

<h2>Transfers outside the UK</h2>
<p>Some of our service providers may process data outside the UK. Where this happens, we ensure appropriate safeguards are in place, such as UK adequacy decisions or standard contractual clauses.</p>

<h2>Changes to this policy</h2>
<p>We may update this policy from time to time. The "last updated" date at the top will reflect any changes.</p>
`;

export default function PrivacyPolicyPage() {
  return (
    <>
      <Reveal />

      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Legal</p>
          <h1 className="mt-2 text-white">Privacy Policy</h1>
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
