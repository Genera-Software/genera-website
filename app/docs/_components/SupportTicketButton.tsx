"use client";

import { openSupportTicketForm, type SupportCategory } from "./SupportTicketForm";

export default function SupportTicketButton({
  children = "Submit a support ticket",
  className,
  category,
}: {
  children?: React.ReactNode;
  className?: string;
  /** Open the form with this topic already chosen. */
  category?: SupportCategory;
}) {
  return (
    <button
      type="button"
      onClick={() => openSupportTicketForm({ category })}
      className={
        className ??
        "font-semibold text-forest underline decoration-gold underline-offset-2"
      }
    >
      {children}
    </button>
  );
}
