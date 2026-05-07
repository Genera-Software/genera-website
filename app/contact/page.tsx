import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import { REGISTER_URL } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Contact — Genera Software",
  description:
    "Book a demo, ask a question, or just say hello. We're a small team and we read every message.",
};

export default function ContactPage() {
  return (
    <>
      <Reveal />

      {/* Page hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 py-24 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Get in Touch</p>
          <h1 className="mt-2 text-white">
            Book a demo. Ask a question. Or just{" "}
            <em className="text-gold">say hello.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-white/80">
            We are a small team and we read every message. Whether you want a
            walkthrough of Genera, have a question about pricing, or just want
            to chat about running a pet business, we are here.
          </p>
        </div>
      </section>

      {/* Contact card */}
      <section className="bg-cream px-8 py-22">
        <div className="mx-auto max-w-[860px]">
          <div className="rev rounded-3xl border border-cream-dark bg-white p-10 text-center shadow-[0_24px_60px_rgba(0,62,69,0.08)] md:p-14">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-forest text-gold">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2>Drop us an email</h2>
            <p className="mx-auto mt-3 max-w-[520px] text-ink-soft">
              Whether you want a demo, have a question, or just want to know
              more about Genera — we are here. We reply within one working day.
            </p>
            <a
              href="mailto:info@generasoftware.com"
              className="mt-6 inline-block font-poppins text-xl font-bold text-forest underline decoration-gold decoration-2 underline-offset-4 hover:text-forest-mid"
            >
              info@generasoftware.com
            </a>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <BookDemoButton className="btn btn-gold btn-lg">
                Book a Demo
              </BookDemoButton>
              <a
                href={REGISTER_URL}
                className="btn btn-outline-d btn-lg"
              >
                Start Free Trial
              </a>
            </div>
          </div>

          {/* Info strip */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Response time",
                value: "Within one working day",
                icon: (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </>
                ),
              },
              {
                label: "Based in",
                value: "Surrey, United Kingdom",
                icon: (
                  <>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </>
                ),
              },
              {
                label: "Phone",
                value: "Available on request",
                icon: (
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 5.59 5.59l.91-.91a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2.09z" />
                ),
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-4 rounded-2xl border border-cream-dark bg-white p-5"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-soft text-forest">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {s.icon}
                  </svg>
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    {s.label}
                  </div>
                  <div className="font-poppins font-bold text-forest">
                    {s.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
