"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import BookDemoButton from "@/components/BookDemoButton";
import StartTrialLink from "@/components/StartTrialLink";
import { BOOK_DEMO_FORM_SLUG } from "@/lib/cta";
import {
  CONTACT_TOPICS,
  DOGS_PER_DAY,
  MESSAGE_MAX,
  MESSAGE_MIN,
  type ContactTopic,
} from "@/lib/contact";

const GENERAL_EMAIL = "info@generasoftware.com";
const SUPPORT_EMAIL = "help@generasoftware.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─────────────────────────────────────────────────────────────
   Small pieces
   ───────────────────────────────────────────────────────────── */
function Glyph({ children, className = "h-5 w-5" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ICON = {
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </>
  ),
  mail: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  send: (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  copy: (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  arrow: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
};

function Tile({ tone, children, className = "h-11 w-11" }: { tone: [string, string]; children: ReactNode; className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl text-white ${className}`}
      style={{
        background: `linear-gradient(135deg, ${tone[0]}, ${tone[1]})`,
        boxShadow: `0 8px 18px -8px ${tone[1]}, inset 0 1px 0 rgba(255,255,255,0.35)`,
      }}
    >
      {children}
    </span>
  );
}

/* An email address you can copy with one tap. */
function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <a href={`mailto:${email}`} className="min-w-0 break-all font-massilia font-bold text-forest underline decoration-gold decoration-2 underline-offset-4 hover:text-forest-mid">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${email}`}
        className={`inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold transition-colors ${
          copied ? "bg-emerald-50 text-emerald-700" : "bg-cream-dark text-ink-soft hover:bg-teal-soft hover:text-forest"
        }`}
      >
        <Glyph className="h-3.5 w-3.5">{copied ? ICON.check : ICON.copy}</Glyph>
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </span>
  );
}

/* The time where the team is — rendered after mount so it's the viewer's
   now, not the server's build time. */
function SurreyClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return <span className="text-ink-soft">Surrey, United Kingdom</span>;
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);
  const weekday = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short" }).format(now);
  const weekend = weekday === "Sat" || weekday === "Sun";
  return (
    <span className="text-ink-soft">
      It&apos;s <b className="font-semibold text-forest">{time}</b> in Surrey
      {weekend ? " — it's the weekend, so we'll reply on Monday." : "."}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   The form
   ───────────────────────────────────────────────────────────── */
type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(v: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please tell us your name.";
  if (!v.email.trim()) e.email = "We'll need an email to reply to.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email doesn't look quite right.";
  if (v.message.trim().length < MESSAGE_MIN) e.message = "Tell us a little more — a sentence or two is plenty.";
  return e;
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[16px] text-ink shadow-[0_1px_2px_rgba(0,62,69,0.04)] outline-none transition placeholder:text-gray-400 focus:border-forest focus:ring-4 focus:ring-teal-soft";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-2 text-[14px] font-semibold text-forest">
        {label}
        {optional && <span className="text-[12px] font-normal text-ink-soft">optional</span>}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} role="alert" className="mt-1.5 block text-[13px] font-medium text-rose-600">
          {error}
        </span>
      )}
    </div>
  );
}

function ContactForm({
  topic,
  setTopic,
  nameRef,
}: {
  topic: ContactTopic;
  setTopic: (t: ContactTopic) => void;
  nameRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [size, setSize] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(0);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const errors = validate({ name, email, message });
  const show = (k: keyof Errors) => (submitted || touched[k] ? errors[k] : undefined);
  const current = CONTACT_TOPICS.find(t => t.key === topic)!;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, name, email, business, size, message, website, startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setServerError(json.error || "We couldn't send that just now.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setServerError("We couldn't reach our server.");
      setStatus("error");
    }
  }

  function reset() {
    setMessage("");
    setSubmitted(false);
    setTouched({});
    setStatus("idle");
    startedAt.current = Date.now();
  }

  if (status === "sent") {
    const first = name.trim().split(/\s+/)[0];
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="flex min-h-[520px] flex-col items-center justify-center text-center outline-none motion-safe:animate-[chatIn_0.45s_ease-out_both]"
      >
        <span className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <span className="absolute inset-0 rounded-full ring-4 ring-emerald-100 motion-safe:animate-ping [animation-iteration-count:1]" />
          <Glyph className="h-10 w-10">{ICON.check}</Glyph>
        </span>
        <div className="mt-6 font-massilia text-[1.7rem] font-bold text-forest">Message sent{first ? `, ${first}` : ""}!</div>
        <div className="mt-2 max-w-[42ch] text-[1.02rem] leading-relaxed text-ink-soft">
          Thanks for getting in touch. We&apos;ll reply to <b className="font-semibold text-forest">{email}</b> within one working day.
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/features" className="btn btn-outline-d">Explore the features</Link>
          <button type="button" onClick={reset} className="btn btn-forest">Send another message</button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* What's it about? */}
      <fieldset>
        <legend className="mb-2.5 text-[14px] font-semibold text-forest">What&apos;s it about?</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map(t => {
            const active = t.key === topic;
            return (
              <label
                key={t.key}
                className={`cursor-pointer rounded-full border-2 px-3.5 py-2 text-[14px] font-semibold transition focus-within:ring-4 focus-within:ring-teal-soft ${
                  active
                    ? "border-forest bg-forest text-white shadow-[0_6px_16px_-6px_rgba(0,62,69,0.5)]"
                    : "border-cream-dark bg-white text-forest hover:border-teal-mid hover:bg-teal-soft/50"
                }`}
              >
                <input
                  type="radio"
                  name="topic"
                  value={t.key}
                  checked={active}
                  onChange={() => setTopic(t.key)}
                  className="sr-only"
                />
                {t.label}
              </label>
            );
          })}
        </div>
        <span className="mt-2 block text-[13.5px] text-ink-soft">{current.hint}</span>
        {topic === "account" && (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#FFD98A] bg-gold-light/60 p-3.5 text-[14px] leading-snug text-ink motion-safe:animate-[chatIn_0.3s_ease-out_both]">
            <Glyph className="mt-0.5 h-5 w-5 shrink-0 text-[#b87900]">{ICON.lifebuoy}</Glyph>
            <span>
              Already using Genera? The quickest route is{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-forest underline decoration-gold decoration-2 underline-offset-2">{SUPPORT_EMAIL}</a>{" "}
              or the{" "}
              <Link href="/docs" className="font-semibold text-forest underline decoration-gold decoration-2 underline-offset-2">help centre</Link>
              {" "}— but you&apos;re welcome to write here too.
            </span>
          </div>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Your name" error={show("name")}>
          <input
            ref={nameRef}
            id="contact-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, name: true }))}
            aria-invalid={Boolean(show("name"))}
            aria-describedby={show("name") ? "contact-name-error" : undefined}
            className={`${inputBase} ${show("name") ? "border-rose-300" : "border-cream-dark"}`}
            placeholder="Jess Smith"
          />
        </Field>
        <Field id="contact-email" label="Email" error={show("email")}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            aria-invalid={Boolean(show("email"))}
            aria-describedby={show("email") ? "contact-email-error" : undefined}
            className={`${inputBase} ${show("email") ? "border-rose-300" : "border-cream-dark"}`}
            placeholder="you@yourdaycare.co.uk"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-business" label="Business name" optional>
          <input
            id="contact-business"
            name="business"
            autoComplete="organization"
            value={business}
            onChange={e => setBusiness(e.target.value)}
            className={`${inputBase} border-cream-dark`}
            placeholder="Happy Paws Daycare"
          />
        </Field>
        <fieldset>
          <legend className="mb-1.5 flex items-baseline gap-2 text-[14px] font-semibold text-forest">
            Dogs a day <span className="text-[12px] font-normal text-ink-soft">optional</span>
          </legend>
          <div className="grid grid-cols-4 gap-1.5">
            {DOGS_PER_DAY.map(opt => {
              const active = size === opt;
              return (
                <label
                  key={opt}
                  className={`cursor-pointer rounded-xl border-2 py-[11px] text-center text-[13.5px] font-semibold transition focus-within:ring-4 focus-within:ring-teal-soft ${
                    active ? "border-gold bg-gold-light text-forest" : "border-cream-dark bg-white text-ink-soft hover:border-teal-mid"
                  }`}
                >
                  <input
                    type="radio"
                    name="size"
                    value={opt}
                    checked={active}
                    onChange={() => setSize(opt)}
                    onClick={() => active && setSize("")}
                    className="sr-only"
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <Field id="contact-message" label="Message" error={show("message")}>
        <div className="relative">
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={MESSAGE_MAX}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, message: true }))}
            aria-invalid={Boolean(show("message"))}
            aria-describedby={show("message") ? "contact-message-error" : "contact-message-count"}
            className={`${inputBase} min-h-[150px] resize-y pb-8 ${show("message") ? "border-rose-300" : "border-cream-dark"}`}
            placeholder={current.placeholder}
          />
          <span
            id="contact-message-count"
            className={`pointer-events-none absolute right-3 bottom-2.5 text-[12px] tabular-nums ${
              message.length > MESSAGE_MAX * 0.9 ? "text-amber-700" : "text-gray-400"
            }`}
          >
            {message.length.toLocaleString("en-GB")}/{MESSAGE_MAX.toLocaleString("en-GB")}
          </span>
        </div>
      </Field>

      {/* Bot trap: hidden from people and screen readers, irresistible to scripts. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
      </div>

      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-[14px] leading-snug text-rose-800">
          <Glyph className="mt-0.5 h-5 w-5 shrink-0">{ICON.mail}</Glyph>
          <span>
            {serverError} Please try again, or email us at{" "}
            <a href={`mailto:${GENERAL_EMAIL}`} className="font-semibold underline underline-offset-2">{GENERAL_EMAIL}</a>.
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" disabled={sending} className="btn btn-gold btn-lg disabled:cursor-wait disabled:opacity-80">
          {sending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/25 border-t-ink" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              Send message
              <Glyph className="h-4 w-4">{ICON.send}</Glyph>
            </>
          )}
        </button>
        <span className="text-[13.5px] text-ink-soft">We reply within one working day.</span>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default function ContactClient({
  showBookDemo,
  trialDays,
}: {
  showBookDemo: boolean;
  trialDays: number;
}) {
  const [topic, setTopic] = useState<ContactTopic>("questions");
  const nameRef = useRef<HTMLInputElement>(null);

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: "How long is the free trial, and do I need a card?",
      a: `Every plan starts with a ${trialDays}-day free trial and no card. You set up the Direct Debit when you decide to stay.`,
    },
    {
      q: "Is there a contract or a setup fee?",
      a: "No. No setup fee and no contract — change or cancel any time.",
    },
    {
      q: "Can you bring my owners and pets across?",
      a: "Yes. Fill in the owner import template and upload it — pets, contacts and vet details land with them.",
    },
    {
      q: "Do you take a cut of what my customers pay me?",
      a: "No. The plan is the only thing we bill you for — no commission on your invoices and no per-booking fee.",
    },
  ];

  return (
    <>
      <Reveal />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-[clamp(22px,4vw,56px)] pt-[104px] pb-16 text-white md:pt-[136px] md:pb-24">
        <div className="pointer-events-none absolute -right-[180px] -bottom-[260px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,168,0,.16),transparent_66%)]" aria-hidden />
        <div className="pointer-events-none absolute -top-[200px] -left-[160px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.07),transparent_66%)]" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[1160px]">
          <div className="rev mx-auto max-w-[800px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-gold/50 bg-white/10 px-3.5 py-1 font-caveat text-body-lg font-bold text-gold-soft md:px-4 md:py-1.5">
              🐾 Get in touch
            </div>
            <h1 className="text-white [font-size:clamp(2.3rem,4.6vw,3.5rem)]">
              Start a free trial. Ask a question. Or just{" "}
              <span className="squig !text-gold">
                say hello.
                <svg viewBox="0 0 180 12" preserveAspectRatio="none">
                  <path d="M2,9 Q22,2 45,8 Q68,14 90,7 Q112,0 135,8 Q157,14 178,7" />
                </svg>
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-[56ch] text-[clamp(1.02rem,1.6vw,1.2rem)] leading-relaxed text-white/80">
              We&apos;re a small team who built Genera from our own daycare, and we read every message.
            </p>
          </div>

          <div className="rev d2 mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <StartTrialLink className="btn btn-gold btn-lg justify-center" />
            {showBookDemo && (
              <BookDemoButton slug={BOOK_DEMO_FORM_SLUG} className="btn btn-outline-w btn-lg justify-center">
                Book a Demo
              </BookDemoButton>
            )}
          </div>
        </div>
      </section>

      {/* ── Form + details ───────────────────────────────────── */}
      <section className="relative bg-cream px-[clamp(22px,4vw,56px)] py-14 md:py-22">
        <div className="mx-auto grid max-w-[1160px] items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <div className="rev min-w-0 rounded-3xl border border-cream-dark bg-white p-6 shadow-[0_24px_60px_rgba(0,62,69,0.08)] md:p-10">
            <p className="eyebrow">Send us a message</p>
            <h2 className="text-section-h md:text-[2.2rem]">We&apos;d love to hear from you.</h2>
            <p className="mt-2 mb-8 max-w-[52ch] text-meta leading-relaxed text-ink-soft md:text-base">
              A real person reads every message — tell us a little about your setting and we&apos;ll come back to you properly.
            </p>
            <ContactForm topic={topic} setTopic={setTopic} nameRef={nameRef} />
          </div>

          <aside className="rev d2 min-w-0 space-y-5 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-cream-dark bg-white shadow-[0_18px_40px_rgba(0,62,69,0.06)]">
              <div className="relative h-52">
                <Image
                  src="/images/duncan-jess.jpg"
                  alt="Duncan and Jess, the founders of Genera"
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover object-[center_12%]"
                />
                <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-4 font-caveat text-xl font-bold text-white">Duncan &amp; Jess, the founders</span>
              </div>
              <div className="p-5">
                <div className="font-massilia text-lg font-bold text-forest">Talk to the people who built it</div>
                <div className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
                  Genera started in our own daycare. You&apos;ll be talking to people who know what a wet Tuesday in November looks like.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-cream-dark bg-white p-5 shadow-[0_18px_40px_rgba(0,62,69,0.06)]">
              <ul className="space-y-4">
                <li className="flex items-start gap-3.5">
                  <Tile tone={["#19A7B6", "#00606E"]} className="h-10 w-10"><Glyph className="h-[18px] w-[18px]">{ICON.mail}</Glyph></Tile>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold tracking-wider text-ink-soft uppercase">General enquiries</span>
                    <CopyEmail email={GENERAL_EMAIL} />
                  </span>
                </li>
                <li className="flex items-start gap-3.5">
                  <Tile tone={["#F0906F", "#C65A44"]} className="h-10 w-10"><Glyph className="h-[18px] w-[18px]">{ICON.lifebuoy}</Glyph></Tile>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold tracking-wider text-ink-soft uppercase">Customer support</span>
                    <CopyEmail email={SUPPORT_EMAIL} />
                  </span>
                </li>
                <li className="flex items-start gap-3.5">
                  <Tile tone={["#72B57C", "#3F7F4B"]} className="h-10 w-10"><Glyph className="h-[18px] w-[18px]">{ICON.clock}</Glyph></Tile>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold tracking-wider text-ink-soft uppercase">Response time</span>
                    <span className="block font-massilia font-bold text-forest">Within one working day</span>
                  </span>
                </li>
                <li className="flex items-start gap-3.5">
                  <Tile tone={["#F5B940", "#CC8200"]} className="h-10 w-10"><Glyph className="h-[18px] w-[18px]">{ICON.pin}</Glyph></Tile>
                  <span className="min-w-0 text-[0.95rem] leading-snug">
                    <span className="block text-[12px] font-semibold tracking-wider text-ink-soft uppercase">Based in</span>
                    <span className="block font-massilia font-bold text-forest">Surrey, United Kingdom</span>
                    <SurreyClock />
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Quick answers ────────────────────────────────────── */}
      <section className="bg-white px-[clamp(22px,4vw,56px)] py-14 md:py-22">
        <div className="mx-auto max-w-[820px]">
          <div className="rev text-center">
            <p className="eyebrow">Quick answers</p>
            <h2 className="text-section-h md:text-section-h-lg">Before you write…</h2>
          </div>
          <div className="rev d1 mt-8 space-y-3">
            {faqs.map(f => (
              <details key={f.q} className="group rounded-2xl border border-cream-dark bg-cream open:bg-white open:shadow-[0_12px_28px_rgba(0,62,69,0.08)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-massilia text-[1.05rem] font-bold text-forest [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-forest ring-1 ring-cream-dark transition-transform group-open:rotate-45 group-open:bg-gold group-open:ring-gold">
                    <Glyph className="h-4 w-4">{ICON.plus}</Glyph>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[1rem] leading-relaxed text-ink-soft">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="rev mt-6 text-center">
            <Link href="/faqs" className="inline-flex items-center gap-2 font-massilia font-bold text-forest hover:text-gold">
              More answers in our FAQs <Glyph className="h-4 w-4">{ICON.arrow}</Glyph>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
