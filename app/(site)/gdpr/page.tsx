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

export default function GdprPage() {
  return (
    <>
      <Reveal />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Legal</p>
          <h1 className="mt-2 text-white">GDPR &amp; Data Protection</h1>
          <p className="mx-auto mt-5 max-w-[600px] text-white/80">
            Last updated: 25 May 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-cream px-8 py-20">
        <div className="mx-auto max-w-[860px] prose prose-genera">

          <p>
            Genera Software Ltd is committed to protecting your personal data
            and complying with the UK General Data Protection Regulation
            (UK GDPR) and the Data Protection Act 2018.
          </p>

          <hr />

          <h2>Data Controller</h2>
          <p>
            Genera Software Ltd is the <strong>Data Controller</strong> for
            personal data collected via this website and during client
            engagements.
          </p>
          <ul>
            <li>
              <strong>Company No.:</strong> 15009675
            </li>
            <li>
              <strong>Registered address:</strong> C/O Mjf Accountancy, 47
              Booker Avenue, Liverpool, England, L18 4QZ
            </li>
            <li>
              <strong>Contact:</strong>{" "}
              <a href="mailto:hello@generasoftware.com">
                hello@generasoftware.com
              </a>
            </li>
            <li>
              <strong>ICO Registration No.:</strong> [ICO REGISTRATION NUMBER]
            </li>
          </ul>

          <hr />

          <h2>Data Processor obligations</h2>
          <p>
            Where Genera Software builds and manages software or websites that
            collect personal data on behalf of a client, we act as a{" "}
            <strong>Data Processor</strong> on that client&apos;s behalf. In
            this capacity:
          </p>
          <ul>
            <li>
              We only process personal data as instructed by the client (Data
              Controller)
            </li>
            <li>
              We have appropriate technical and organisational security measures
              in place
            </li>
            <li>
              We do not share or use that data for our own purposes
            </li>
            <li>
              We support clients in meeting their own GDPR obligations, such as
              responding to subject access requests
            </li>
            <li>
              We enter into a Data Processing Agreement (DPA) with all clients
              whose platforms handle personal data
            </li>
          </ul>
          <p>
            If you are a client and need a DPA, please contact{" "}
            <a href="mailto:hello@generasoftware.com">
              hello@generasoftware.com
            </a>
            .
          </p>

          <hr />

          <h2>Your rights under UK GDPR</h2>
          <p>
            You have the following rights regarding your personal data:
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Right</th>
                  <th>What it means</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Access</td>
                  <td>Request a copy of the data we hold about you</td>
                </tr>
                <tr>
                  <td>Rectification</td>
                  <td>Ask us to correct inaccurate or incomplete data</td>
                </tr>
                <tr>
                  <td>Erasure</td>
                  <td>
                    Request deletion of your data where there is no legal basis
                    to keep it
                  </td>
                </tr>
                <tr>
                  <td>Restriction</td>
                  <td>Ask us to pause processing in certain circumstances</td>
                </tr>
                <tr>
                  <td>Portability</td>
                  <td>
                    Receive your data in a structured, machine-readable format
                  </td>
                </tr>
                <tr>
                  <td>Objection</td>
                  <td>Object to processing based on legitimate interests</td>
                </tr>
                <tr>
                  <td>Withdraw consent</td>
                  <td>
                    Opt out of any processing based on your consent at any time
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            To exercise any right, email{" "}
            <a href="mailto:hello@generasoftware.com">
              hello@generasoftware.com
            </a>{" "}
            with your name and the right you wish to exercise. We will respond
            within <strong>30 days</strong>.
          </p>

          <hr />

          <h2>Data security</h2>
          <p>
            We take security seriously. Measures we have in place include:
          </p>
          <ul>
            <li>Encrypted data storage and transmission (HTTPS/TLS)</li>
            <li>
              Access controls limiting who can view personal data
            </li>
            <li>
              Regular review of third-party tools and their data practices
            </li>
            <li>
              Secure deletion of data when no longer needed
            </li>
          </ul>

          <hr />

          <h2>Cookies and tracking</h2>
          <p>
            We use cookies on this website to help us understand how visitors
            use our site and to improve your experience. You can manage your
            cookie preferences at any time.
          </p>

          <hr />

          <h2>Complaints</h2>
          <p>
            If you believe we have mishandled your personal data, you have the
            right to lodge a complaint with the{" "}
            <strong>Information Commissioner&apos;s Office (ICO)</strong>:
          </p>
          <ul>
            <li>
              Website:{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
              >
                ico.org.uk
              </a>
            </li>
            <li>Helpline: 0303 123 1113</li>
          </ul>
          <p>
            We would always appreciate the chance to resolve concerns directly
            first &mdash; please email us at{" "}
            <a href="mailto:hello@generasoftware.com">
              hello@generasoftware.com
            </a>
            .
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
