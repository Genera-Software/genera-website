"use client";

import { openSupportTicketForm, type SupportCategory } from "./SupportTicketForm";
import type { TestPlatform } from "@/lib/support/app-testing";

export default function SupportTicketButton({
  children = "Submit a support ticket",
  className,
  category,
  platform,
  ariaLabel,
}: {
  children?: React.ReactNode;
  className?: string;
  /** Open the form with this topic already chosen. */
  category?: SupportCategory;
  /** For a tester request: pre-pick the app. */
  platform?: TestPlatform;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => openSupportTicketForm({ category, platform })}
      className={
        className ??
        "font-semibold text-forest underline decoration-gold underline-offset-2"
      }
    >
      {children}
    </button>
  );
}
