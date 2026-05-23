"use client";

import { useEffect, useRef, useState } from "react";
import { FOUNDING_100_FORM_SLUG } from "@/lib/cta";

type Status = "idle" | "loading" | "submitting" | "sent" | "error";

type QuestionType = "text" | "email" | "textarea" | "choice";

type Question = {
  key: string;
  eyebrow: string;
  label: string;
  hint: string;
  type: QuestionType;
  placeholder: string;
  choices: string[];
  optional: boolean;
};

type FormSchema = {
  slug: string;
  name: string;
  description: string;
  success: { title: string; message: string };
  questions: Question[];
};

const DEFAULT_SLUG = FOUNDING_100_FORM_SLUG;

export default function BookDemoModal() {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState<string>(DEFAULT_SLUG);
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Open via window event from any BookDemoButton on the page.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ slug?: string }>).detail;
      const nextSlug = detail?.slug || DEFAULT_SLUG;
      setOpen(true);
      setSlug(nextSlug);
      setStep(0);
      setForm({});
      setSchema(null);
      setStatus("loading");
      setErrorMsg(null);
      setStepError(null);
    };
    window.addEventListener("book-demo:open", onOpen as EventListener);
    return () =>
      window.removeEventListener("book-demo:open", onOpen as EventListener);
  }, []);

  // Fetch the form schema each time we open (cache busts when admin updates).
  useEffect(() => {
    if (!open || status !== "loading") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/forms/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          if (!cancelled) {
            setStatus("error");
            setErrorMsg(
              res.status === 404
                ? "This form isn't available right now."
                : "Couldn't load the form. Please try again.",
            );
          }
          return;
        }
        const data: FormSchema = await res.json();
        if (cancelled) return;
        if (!data.questions?.length) {
          setStatus("error");
          setErrorMsg("This form has no questions yet.");
          return;
        }
        const empty: Record<string, string> = {};
        data.questions.forEach((q) => {
          empty[q.key] = "";
        });
        setSchema(data);
        setForm(empty);
        setStatus("idle");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("Network error. Please try again.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, slug, status]);

  // Lock background scroll while open.
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
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
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

  // Esc to close, autofocus on step change.
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
  }, [open, step, schema]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={schema?.name ?? "Form"}
      className="fixed inset-0 z-[200] flex items-stretch justify-center bg-forest-dark/80 backdrop-blur-sm animate-[fadeInUp_0.25s_ease_both]"
    >
      <ProgressBar
        step={step}
        total={schema?.questions.length ?? 1}
        done={status === "sent"}
      />

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
          {status === "loading" && <LoadingCard />}
          {status === "error" && !schema && (
            <ErrorCard
              message={errorMsg ?? "Something went wrong."}
              onClose={() => setOpen(false)}
            />
          )}
          {schema && status === "sent" && (
            <SentCard
              title={schema.success.title}
              message={schema.success.message}
              onClose={() => setOpen(false)}
            />
          )}
          {schema && status !== "sent" && status !== "loading" && (
            <StepView
              schema={schema}
              step={step}
              setStep={setStep}
              form={form}
              setForm={setForm}
              status={status}
              setStatus={setStatus}
              stepError={stepError}
              setStepError={setStepError}
              errorMsg={errorMsg}
              setErrorMsg={setErrorMsg}
              inputRef={inputRef}
              slug={slug}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  step,
  total,
  done,
}: {
  step: number;
  total: number;
  done: boolean;
}) {
  const pct = done ? 100 : Math.round((step / total) * 100);
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-white/10">
      <div
        className="h-full bg-gold transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="text-center text-white/80">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-gold" />
      <p className="font-massilia text-sm text-white/60">Loading…</p>
    </div>
  );
}

function ErrorCard({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="animate-[fadeInUp_0.4s_ease_both] text-center text-white">
      <h2 className="!text-white text-[clamp(1.6rem,3vw,2.2rem)]">{message}</h2>
      <button type="button" onClick={onClose} className="btn btn-outline-w mt-7">
        Close
      </button>
    </div>
  );
}

function StepView({
  schema,
  step,
  setStep,
  form,
  setForm,
  status,
  setStatus,
  stepError,
  setStepError,
  errorMsg,
  setErrorMsg,
  inputRef,
  slug,
}: {
  schema: FormSchema;
  step: number;
  setStep: (n: number) => void;
  form: Record<string, string>;
  setForm: (next: Record<string, string>) => void;
  status: Status;
  setStatus: (s: Status) => void;
  stepError: string | null;
  setStepError: (e: string | null) => void;
  errorMsg: string | null;
  setErrorMsg: (e: string | null) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  slug: string;
}) {
  const total = schema.questions.length;
  const current = schema.questions[step];
  const value = form[current.key] ?? "";

  function validateCurrent(): string | null {
    const v = (form[current.key] ?? "").trim();
    if (!v && !current.optional) return "Please fill this in to continue.";
    if (current.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
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
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      void submit();
    }
  }

  function back() {
    setStepError(null);
    if (step > 0) setStep(step - 1);
  }

  async function submit() {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/forms/${encodeURIComponent(slug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  return (
    <div key={step} className="animate-[fadeInUp_0.35s_ease_both] text-white">
      {current.eyebrow && (
        <div className="mb-3 font-caveat text-xl text-gold-soft">
          {current.eyebrow}
        </div>
      )}
      <h2 className="!text-white text-[clamp(1.7rem,3.6vw,2.6rem)] leading-none">
        {current.label}
        {current.optional && (
          <span className="ml-2 align-middle font-massilia text-sm font-medium text-white/50">
            (optional)
          </span>
        )}
      </h2>
      {current.hint && <p className="mt-3 text-white/70">{current.hint}</p>}

      <div className="mt-7">
        {current.type === "choice" ? (
          <div className="flex flex-wrap gap-2.5">
            {current.choices.map((c, i) => {
              const selected = value === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, [current.key]: c });
                    setStepError(null);
                  }}
                  className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-left font-massilia font-semibold transition ${
                    selected
                      ? "border-gold bg-gold text-ink"
                      : "border-white/25 bg-white/5 text-white hover:border-white/60 hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                      selected ? "bg-ink/15 text-ink" : "bg-white/15 text-white"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {c}
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
              setForm({ ...form, [current.key]: e.target.value });
              setStepError(null);
            }}
            onKeyDown={onKeyDown}
            rows={3}
            placeholder={current.placeholder}
            className="w-full resize-none border-0 border-b-2 border-white/30 bg-transparent pb-3 font-massilia text-[1.4rem] text-white placeholder-white/30 outline-none transition focus:border-gold"
          />
        ) : (
          <input
            ref={(el) => {
              inputRef.current = el;
            }}
            type={current.type === "email" ? "email" : "text"}
            value={value}
            onChange={(e) => {
              setForm({ ...form, [current.key]: e.target.value });
              setStepError(null);
            }}
            onKeyDown={onKeyDown}
            placeholder={current.placeholder}
            autoComplete={
              current.type === "email"
                ? "email"
                : current.key.toLowerCase().includes("name")
                  ? "name"
                  : "off"
            }
            className="w-full border-0 border-b-2 border-white/30 bg-transparent pb-3 font-massilia text-[1.6rem] text-white placeholder-white/30 outline-none transition focus:border-gold"
          />
        )}
      </div>

      {stepError && <p className="mt-3 text-sm text-gold-soft">{stepError}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={next}
          disabled={status === "submitting"}
          className="btn btn-gold inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting"
            ? "Sending…"
            : step === total - 1
              ? "Submit"
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
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[0.75rem] text-white/80">
            Enter ↵
          </kbd>
        </span>
        {errorMsg && <span className="text-sm text-gold-soft">{errorMsg}</span>}
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
  );
}

function SentCard({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
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
      <h2 className="!text-white text-[clamp(1.8rem,3.6vw,2.6rem)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-[460px] text-white/75">{message}</p>
      <button type="button" onClick={onClose} className="btn btn-outline-w mt-7">
        Close
      </button>
    </div>
  );
}
