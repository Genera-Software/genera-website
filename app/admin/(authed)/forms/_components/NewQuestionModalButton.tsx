"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionForm from "./QuestionForm";

export default function NewQuestionModalButton({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-all hover:opacity-90 hover:shadow-md hover:shadow-gold/30"
      >
        + New question
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="New question"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm"
        >
          <div className="relative my-10 w-full max-w-2xl rounded-2xl border border-teal-mid bg-white p-6 shadow-[0_24px_60px_rgba(0,62,69,0.25)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-cream hover:text-ink"
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

            <h2 className="font-poppins text-lg font-extrabold text-ink">
              New question
            </h2>
            <p className="mb-5 text-sm text-ink-soft">
              Adds a question to the end of the list. You can reorder it after.
            </p>

            <QuestionForm
              action={async (fd) => {
                await action(fd);
                setOpen(false);
                router.refresh();
              }}
              submitLabel="Add question"
            />
          </div>
        </div>
      )}
    </>
  );
}
