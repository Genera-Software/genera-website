"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

type Category =
  | "technical"
  | "billing"
  | "feature_request"
  | "account"
  | "other";

type StepKey = "category" | "name" | "email" | "subject" | "description";

type StepDef =
  | {
      key: StepKey;
      eyebrow: string;
      label: string;
      hint?: string;
      type: "choice";
      choices: Array<{ value: Category; label: string }>;
    }
  | {
      key: StepKey;
      eyebrow: string;
      label: string;
      hint?: string;
      type: "text" | "email" | "textarea";
      placeholder: string;
    };

const STEPS: StepDef[] = [
  {
    key: "category",
    eyebrow: "Let's get you help",
    label: "What is this about?",
    hint: "Pick the closest match — you can fill in the details next.",
    type: "choice",
    choices: [
      { value: "technical", label: "Technical issue" },
      { value: "billing", label: "Billing" },
      { value: "feature_request", label: "Feature request" },
      { value: "account", label: "Account" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    key: "name",
    eyebrow: "About you",
    label: "What's your name?",
    type: "text",
    placeholder: "Jane Smith",
  },
  {
    key: "email",
    eyebrow: "About you",
    label: "Where should we reply?",
    hint: "We'll use this email to follow up on your ticket.",
    type: "email",
    placeholder: "you@daycare.com",
  },
  {
    key: "subject",
    eyebrow: "The issue",
    label: "Give it a short subject",
    type: "text",
    placeholder: "e.g. Can't save a booking",
  },
  {
    key: "description",
    eyebrow: "The issue",
    label: "Tell us what's going on",
    hint: "Steps to reproduce, what you expected, and anything else that helps.",
    type: "textarea",
    placeholder: "Describe the problem…",
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
  return "Unknown";
}

function detectOS(ua: string): string {
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown";
}

export function openSupportTicketForm() {
  window.dispatchEvent(new CustomEvent("support-ticket:open"));
}

export default function SupportTicketForm() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [stepError, setStepError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setStep(0);
      setStatus("idle");
      setStepError(null);
      setErrorMsg(null);
      setCategory("");
      setName("");
      setEmail("");
      setSubject("");
      setDescription("");
    };
    window.addEventListener("support-ticket:open", onOpen);
    return () => window.removeEventListener("support-ticket:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    const prev = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = "";
      html.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, step, status]);

  if (!open) return null;

  const total = STEPS.length;
  const current = STEPS[step];
  const pct = status === "sent" ? 100 : Math.round((step / total) * 100);

  function valueFor(key: StepKey): string {
    switch (key) {
      case "category":
        return category;
      case "name":
        return name;
      case "email":
        return email;
      case "subject":
        return subject;
      case "description":
        return description;
    }
  }

  function setValue(key: StepKey, v: string) {
    switch (key) {
      case "category":
        setCategory(v as Category);
        break;
      case "name":
        setName(v);
        break;
      case "email":
        setEmail(v);
        break;
      case "subject":
        setSubject(v);
        break;
      case "description":
        setDescription(v);
        break;
    }
  }

  function validateCurrent(): string | null {
    const v = valueFor(current.key).trim();
    if (!v) return "Please fill this in to continue.";
    if (current.key === "email" && !EMAIL_RE.test(v)) {
      return "That email doesn't look right.";
    }
    return null;
  }

  function next() {
    const err = validateCurrent();
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    if (step < total - 1) setStep(step + 1);
    else void submit();
  }

  function back() {
    setStepError(null);
    if (step > 0) setStep(step - 1);
  }

  async function submit() {
    setStatus("submitting");
    setErrorMsg(null);
    const ua = navigator.userAgent;
    try {
      const res = await fetch("/api/support/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          subject: subject.trim(),
          description: description.trim(),
          account_email: email.trim(),
          account_name: name.trim(),
          page_url: window.location.href,
          user_agent: ua,
          browser: detectBrowser(ua),
          os: detectOS(ua),
          viewport: `${window.innerWidth}x${window.innerHeight}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("idle");
        setErrorMsg(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("idle");
      setErrorMsg("Network error. Please try again.");
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !(current.type === "textarea" && e.shiftKey)) {
      e.preventDefault();
      next();
    }
  }

  const value = valueFor(current.key);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Submit a support ticket"
      className="fixed inset-0 z-[200] flex items-stretch justify-center bg-forest-dark/80 backdrop-blur-sm animate-[fadeInUp_0.25s_ease_both]"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-white/10">
        <div
          className="h-full bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close"
        className="absolute right-5 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12M18 6l-12 12" />
        </svg>
      </button>

      <div className="flex w-full items-center justify-center px-5 py-16">
        <div className="w-full max-w-[640px]">
          {status === "sent" ? (
            <div className="animate-[fadeInUp_0.4s_ease_both] text-center text-white">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink shadow-[0_8px_28px_rgba(255,168,0,0.45)]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <h2 className="!text-white text-heading-mid">
                Got it — we&apos;ll be in touch
              </h2>
              <p className="mx-auto mt-3 max-w-[460px] text-white/75">
                Your ticket is with the Genera team. We typically reply within a
                day.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-7 inline-flex cursor-pointer items-center rounded-full border-2 border-white px-6 py-3 font-massilia text-[0.95rem] font-bold text-white transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
          ) : (
            <div
              key={step}
              className="animate-[fadeInUp_0.35s_ease_both] text-white"
            >
              <div className="mb-3 font-caveat text-xl text-gold-soft">
                {current.eyebrow}
              </div>
              <h2 className="!text-white text-heading-mid leading-none">
                {current.label}
              </h2>
              {current.hint && (
                <p className="mt-3 text-white/70">{current.hint}</p>
              )}

              <div className="mt-7">
                {current.type === "choice" ? (
                  <div className="flex max-w-md flex-col gap-2.5">
                    {current.choices.map((c, i) => {
                      const selected = value === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => {
                            setValue(current.key, c.value);
                            setStepError(null);
                          }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-massilia text-[0.95rem] font-semibold transition ${
                            selected
                              ? "border-gold bg-gold text-ink shadow-[0_6px_20px_rgba(255,168,0,0.35)]"
                              : "border-white/30 bg-white/5 text-white hover:border-white/70 hover:bg-white/10"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              selected
                                ? "bg-ink/15 text-ink"
                                : "bg-white/15 text-white"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="min-w-0 flex-1">{c.label}</span>
                          {selected && (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="shrink-0 text-ink"
                              aria-hidden
                            >
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : current.type === "textarea" ? (
                  <textarea
                    ref={(el) => {
                      inputRef.current = el;
                    }}
                    value={value}
                    onChange={(e) => {
                      setValue(current.key, e.target.value);
                      setStepError(null);
                    }}
                    onKeyDown={onKeyDown}
                    rows={4}
                    maxLength={5000}
                    placeholder={current.placeholder}
                    className="w-full resize-none border-0 border-b-2 border-white/30 bg-transparent pb-3 font-massilia text-mini-h text-white placeholder-white/30 outline-none transition focus:border-gold"
                  />
                ) : (
                  <input
                    ref={(el) => {
                      inputRef.current = el;
                    }}
                    type={current.type === "email" ? "email" : "text"}
                    value={value}
                    onChange={(e) => {
                      setValue(current.key, e.target.value);
                      setStepError(null);
                    }}
                    onKeyDown={onKeyDown}
                    maxLength={current.key === "subject" ? 200 : 200}
                    placeholder={current.placeholder}
                    autoComplete={
                      current.key === "email"
                        ? "email"
                        : current.key === "name"
                          ? "name"
                          : "off"
                    }
                    className="w-full border-0 border-b-2 border-white/30 bg-transparent pb-3 font-massilia text-section-h text-white placeholder-white/30 outline-none transition focus:border-gold"
                  />
                )}
              </div>

              {stepError && (
                <p className="mt-3 text-sm text-gold-soft">{stepError}</p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={next}
                  disabled={status === "submitting"}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-6 py-3 font-massilia text-[0.95rem] font-bold text-ink shadow-[0_4px_18px_rgba(255,168,0,0.35)] transition hover:shadow-[0_8px_28px_rgba(255,168,0,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting"
                    ? "Sending…"
                    : step === total - 1
                      ? "Submit ticket"
                      : "OK"}
                  {status !== "submitting" && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
                <span className="font-massilia text-sm text-white/55">
                  press{" "}
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[0.7rem] text-white/80">
                    Enter ↵
                  </kbd>
                </span>
                {errorMsg && (
                  <span className="text-sm text-gold-soft">{errorMsg}</span>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between text-sm text-white/55">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5" />
                    <path d="M11 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <span className="font-caveat text-base text-white/60">
                  {step + 1} of {total}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
