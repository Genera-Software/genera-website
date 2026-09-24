"use client";

/** Drops the assistant's draft into the reply box for the admin to edit. */
export default function UseDraftReplyButton({ draft }: { draft: string }) {
  return (
    <button
      type="button"
      className="text-xs font-semibold text-forest underline-offset-2 hover:underline"
      onClick={() => {
        const box = document.getElementById("ticket-reply-body");
        if (!(box instanceof HTMLTextAreaElement)) return;
        box.value = draft;
        box.scrollIntoView({ behavior: "smooth", block: "center" });
        box.focus();
      }}
    >
      Use draft reply
    </button>
  );
}
