"use client";

import { openSupportTicketForm } from "./SupportTicketForm";

export default function SupportTicketButton({
  children = "Submit a support ticket",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openSupportTicketForm()}
      className={
        className ??
        "font-semibold text-forest underline decoration-gold underline-offset-2"
      }
    >
      {children}
    </button>
  );
}
