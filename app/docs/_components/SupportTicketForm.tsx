"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "sent";

type Category =
  | "technical"
  | "billing"
  | "feature_request"
  | "account"
  | "other";

const CATEGORIES: Array<{ value: Category; label: string }> = [
  { value: "technical", label: "Technical issue" },
  { value: "billing", label: "Billing" },
  { value: "feature_request", label: "Feature request" },
  { value: "account", label: "Account" },
  { value: "other", label: "Something else" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Below this there isn't enough to match on, so we don't bother asking. */
const MIN_QUERY = 12;

type DocSuggestion = {
  title: string;
  section: string;
  href: string;
  snippet: string;
};

type FieldErrors = Partial<
  Record<"name" | "email" | "subject" | "description", string>
>;

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

const labelClass =
  "mb-1.5 block font-massilia text-fine font-bold text-forest";
const fieldClass =
  "w-full rounded-xl border border-teal-mid bg-cream px-3.5 py-2.5 text-meta text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-forest focus:bg-white";

export default function SupportTicketForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [category, setCategory] = useState<Category>("technical");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [suggestions, setSuggestions] = useState<DocSuggestion[]>([]);
  // The exact text the current `suggestions` were fetched for. Used to tell
  // "we've already looked this up" from "the customer has typed since".
  const [suggestedFor, setSuggestedFor] = useState("");
  const [checking, setChecking] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const query = `${subject} ${description}`.trim();

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setStatus("idle");
      setErrorMsg(null);
      setFieldErrors({});
      setCategory("technical");
      setName("");
      setEmail("");
      setSubject("");
      setDescription("");
      setSuggestions([]);
      setSuggestedFor("");
      setChecking(false);
    };
    window.addEventListener("support-ticket:open", onOpen);
    return () => window.removeEventListener("support-ticket:open", onOpen);
  }, []);

  const fetchSuggestions = useCallback(
    async (text: string, signal?: AbortSignal): Promise<DocSuggestion[]> => {
      const res = await fetch(
        `/api/support/suggest?q=${encodeURIComponent(text)}`,
        { signal },
      );
      if (!res.ok) return [];
      const data = (await res.json()) as { suggestions?: DocSuggestion[] };
      return data.suggestions ?? [];
    },
    [],
  );

  // Live lookup while they type, debounced so it fires on a pause.
  useEffect(() => {
    if (!open || status === "sent") return;
    if (query.length < MIN_QUERY) {
      setSuggestions([]);
      setSuggestedFor("");
      return;
    }
    if (query === suggestedFor) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const hits = await fetchSuggestions(query, controller.signal);
        setSuggestions(hits);
        setSuggestedFor(query);
      } catch {
        // Suggestions are a bonus — never let a failed lookup block support.
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, status, query, suggestedFor, fetchSuggestions]);

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
    const t = setTimeout(() => nameRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Please tell us your name.";
    if (!email.trim()) errors.email = "We need an email to reply to.";
    else if (!EMAIL_RE.test(email.trim())) {
      errors.email = "That email doesn't look right.";
    }
    if (!subject.trim()) errors.subject = "Give your ticket a short subject.";
    if (!description.trim()) {
      errors.description = "Tell us a little about what's happening.";
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // The live lookup is debounced, so someone who types their description and
    // clicks Send within 400ms would otherwise never see a suggestion. Resolve
    // it here before deciding, and give them one chance to read it.
    if (query.length >= MIN_QUERY && query !== suggestedFor) {
      setChecking(true);
      try {
        const hits = await fetchSuggestions(query);
        setSuggestions(hits);
        setSuggestedFor(query);
        if (hits.length > 0) {
          setChecking(false);
          requestAnimationFrame(() =>
            suggestionsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            }),
          );
          return;
        }
      } catch {
        // Lookup failed — carry on and send the ticket.
      }
      setChecking(false);
    }

    await submit();
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

  if (!open) return null;

  const showSuggestions = suggestions.length > 0 && status !== "sent";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-form-title"
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-forest-dark/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="my-auto w-full max-w-[560px] animate-[fadeInUp_0.25s_ease_both] overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-teal-mid/60 bg-cream px-5 py-4 sm:px-6">
          <div>
            <h2
              id="support-form-title"
              className="font-massilia text-body-lg font-extrabold text-forest"
            >
              Get support
            </h2>
            <p className="mt-0.5 text-meta text-ink-soft">
              We usually reply by email within a day.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="-mr-1.5 -mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-dark hover:text-forest"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        {status === "sent" ? (
          <div className="px-5 py-10 text-center sm:px-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink">
              <svg
                width="26"
                height="26"
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
            <h3 className="font-massilia text-body-lg font-extrabold text-forest">
              Got it — we&apos;ll be in touch
            </h3>
            <p className="mx-auto mt-2 max-w-[380px] text-meta text-ink-soft">
              Your ticket is with the Genera team. We typically reply within a
              day.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex cursor-pointer items-center rounded-full bg-forest px-5 py-2.5 font-massilia text-fine font-bold text-white transition-shadow hover:shadow-[0_6px_22px_rgba(0,62,69,0.3)]"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="max-h-[min(72vh,640px)] overflow-y-auto px-5 py-5 sm:px-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="support-name" className={labelClass}>
                  Your name
                </label>
                <input
                  id="support-name"
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className={fieldClass}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-fine text-red-700">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="support-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="support-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@daycare.com"
                  className={fieldClass}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-fine text-red-700">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="support-category" className={labelClass}>
                What&apos;s this about?
              </label>
              <select
                id="support-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={`${fieldClass} cursor-pointer`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="support-subject" className={labelClass}>
                Subject
              </label>
              <input
                id="support-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
                placeholder="e.g. Can't save a booking"
                className={fieldClass}
              />
              {fieldErrors.subject && (
                <p className="mt-1 text-fine text-red-700">
                  {fieldErrors.subject}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="support-description" className={labelClass}>
                How can we help?
              </label>
              <textarea
                id="support-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                maxLength={5000}
                placeholder="What were you trying to do, and what happened instead?"
                className={`${fieldClass} resize-y`}
              />
              {fieldErrors.description && (
                <p className="mt-1 text-fine text-red-700">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* Suggested Help Centre pages, live as they type. */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="mt-5 rounded-xl border border-gold/45 bg-gold-light/50 p-4"
              >
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 17h.01" />
                      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
                    </svg>
                  </span>
                  <p className="font-massilia text-fine font-bold text-forest">
                    This might save you the wait
                  </p>
                </div>

                <ul className="flex flex-col gap-1.5">
                  {suggestions.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-2.5 rounded-lg border border-transparent bg-white/70 px-3 py-2.5 transition-colors hover:border-teal-mid hover:bg-white"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-massilia text-fine font-bold text-forest">
                            {s.title}
                          </span>
                          <span className="mt-0.5 line-clamp-2 text-[0.8rem] leading-snug text-ink-soft">
                            {s.section} · {s.snippet}
                          </span>
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-1 shrink-0 text-ink-soft transition-colors group-hover:text-forest"
                        >
                          <path d="M7 17L17 7" />
                          <path d="M8 7h9v9" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>

                <p className="mt-2.5 text-[0.8rem] text-ink-soft">
                  Opens in a new tab — your ticket stays as you left it.
                </p>
              </div>
            )}

            {errorMsg && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-meta text-red-800">
                {errorMsg}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-teal-mid/60 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-full px-4 py-2.5 font-massilia text-fine font-bold text-ink-soft transition-colors hover:bg-cream-dark hover:text-forest"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "submitting" || checking}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-massilia text-fine font-bold text-ink shadow-[0_4px_14px_rgba(255,168,0,0.3)] transition-shadow hover:shadow-[0_6px_22px_rgba(255,168,0,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checking
                  ? "Checking the docs…"
                  : status === "submitting"
                    ? "Sending…"
                    : showSuggestions
                      ? "Still need help — send"
                      : "Send ticket"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
