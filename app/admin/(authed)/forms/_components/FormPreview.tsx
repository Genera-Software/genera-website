"use client";

import { useEffect, useRef, useState } from "react";

type QuestionType = "text" | "email" | "tel" | "textarea" | "choice";

type PreviewQuestion = {
  key: string;
  eyebrow: string;
  label: string;
  hint: string;
  type: QuestionType;
  placeholder: string;
  choices: string[];
  is_optional: boolean;
};

type Props = {
  questions: PreviewQuestion[];
  successTitle: string;
  successMessage: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FormPreview({
  questions,
  successTitle,
  successMessage,
}: Props) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(questions.map((q) => [q.key, ""])),
  );
  const [done, setDone] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // If the question list changes (after a save), reset the preview state.
  useEffect(() => {
    setValues(Object.fromEntries(questions.map((q) => [q.key, ""])));
    setStep(0);
    setDone(false);
    setStepError(null);
  }, [questions]);

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [step, done]);

  if (questions.length === 0) {
    return (
      <Frame>
        <div className="p-10 text-center text-white/70">
          <p className="font-massilia text-sm uppercase tracking-wider text-white/40">
            Preview
          </p>
          <p className="mt-3 text-lg">No questions yet.</p>
          <p className="mt-1 text-sm text-white/55">
            Add a question and the preview will appear here.
          </p>
        </div>
      </Frame>
    );
  }

  const total = questions.length;
  const current = questions[step];
  const value = values[current.key] ?? "";
  const progressPct = done ? 100 : Math.round((step / total) * 100);

  function validateCurrent(): string | null {
    const v = (values[current.key] ?? "").trim();
    if (!v && !current.is_optional) return "Please fill this in to continue.";
    if (current.type === "email" && v && !EMAIL_RE.test(v)) {
      return "That email doesn't look right.";
    }
    if (current.type === "tel" && v && !/^[+\d][\d\s\-().]{6,}$/.test(v)) {
      return "Please enter a valid phone number.";
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
      setDone(true);
    }
  }

  function back() {
    setStepError(null);
    if (step > 0) setStep(step - 1);
  }

  function reset() {
    setValues(Object.fromEntries(questions.map((q) => [q.key, ""])));
    setStep(0);
    setDone(false);
    setStepError(null);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !(current.type === "textarea" && e.shiftKey)) {
      e.preventDefault();
      next();
    }
  }

  return (
    <Frame>
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-1 bg-white/10">
        <div
          className="h-full bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <button
        type="button"
        onClick={reset}
        className="absolute right-4 top-3 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/20 hover:text-white"
        title="Restart preview"
      >
        ⟲ Restart
      </button>

      <div className="px-6 py-12 sm:px-10 sm:py-16">
        {done ? (
          <SuccessView
            title={successTitle}
            message={successMessage}
            onReset={reset}
          />
        ) : (
          <div
            key={step}
            className="animate-[fadeInUp_0.35s_ease_both] text-white"
          >
            {current.eyebrow && (
              <div className="mb-3 font-caveat text-xl text-gold-soft">
                {current.eyebrow}
              </div>
            )}
            <h2 className="!text-white text-[clamp(1.4rem,2.6vw,2rem)] leading-none">
              {current.label}
              {current.is_optional && (
                <span className="ml-2 align-middle font-massilia text-sm font-medium text-white/50">
                  (optional)
                </span>
              )}
            </h2>
            {current.hint && (
              <p className="mt-3 text-sm text-white/70">{current.hint}</p>
            )}

            <div className="mt-6">
              {current.type === "choice" ? (
                <div className="flex flex-wrap gap-2.5">
                  {current.choices.map((c, i) => {
                    const selected = value === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setValues({ ...values, [current.key]: c });
                          setStepError(null);
                        }}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-left font-massilia text-sm font-semibold transition ${
                          selected
                            ? "border-gold bg-gold text-ink"
                            : "border-white/25 bg-white/5 text-white hover:border-white/60 hover:bg-white/10"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                            selected
                              ? "bg-ink/15 text-ink"
                              : "bg-white/15 text-white"
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
                    setValues({ ...values, [current.key]: e.target.value });
                    setStepError(null);
                  }}
                  onKeyDown={onKeyDown}
                  rows={3}
                  placeholder={current.placeholder}
                  className="w-full resize-none border-0 border-b-2 border-white/30 bg-transparent pb-2 font-massilia text-base text-white placeholder-white/30 outline-none transition focus:border-gold"
                />
              ) : (
                <input
                  ref={(el) => {
                    inputRef.current = el;
                  }}
                  type={current.type === "email" ? "email" : current.type === "tel" ? "tel" : "text"}
                  value={value}
                  onChange={(e) => {
                    setValues({ ...values, [current.key]: e.target.value });
                    setStepError(null);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={current.placeholder}
                  className="w-full border-0 border-b-2 border-white/30 bg-transparent pb-2 font-massilia text-lg text-white placeholder-white/30 outline-none transition focus:border-gold"
                />
              )}
            </div>

            {stepError && (
              <p className="mt-3 text-xs text-gold-soft">{stepError}</p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
              >
                {step === total - 1 ? "Submit" : "OK"}
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
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </button>
              <span className="font-massilia text-xs text-white/55">
                press{" "}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[0.7rem] text-white/80">
                  Enter ↵
                </kbd>
              </span>
            </div>

            <div className="mt-8 flex items-center justify-between text-xs text-white/55">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg
                  width="12"
                  height="12"
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
              <span className="font-caveat text-sm text-white/60">
                {step + 1} of {total}
              </span>
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-forest-mid/40 bg-forest-dark text-white shadow-[0_12px_40px_rgba(0,62,69,0.25)]">
      {children}
    </div>
  );
}

function SuccessView({
  title,
  message,
  onReset,
}: {
  title: string;
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="animate-[fadeInUp_0.4s_ease_both] py-4 text-center text-white">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink shadow-[0_8px_28px_rgba(255,168,0,0.45)]">
        <svg
          width="24"
          height="24"
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
      <h2 className="!text-white text-[clamp(1.4rem,2.6vw,2rem)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-[420px] text-sm text-white/75">
        {message}
      </p>
      <p className="mt-4 text-xs text-white/40">
        (Preview only — nothing was submitted.)
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-xl border border-white/30 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Restart preview
      </button>
    </div>
  );
}
