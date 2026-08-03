import type { SupportTicketStatus } from "@/lib/supabase/types";

export const STATUSES: readonly SupportTicketStatus[] = [
  "new",
  "in_progress",
  "completed",
] as const;

export const STATUS_LABEL: Record<SupportTicketStatus, string> = {
  new: "New",
  in_progress: "In progress",
  completed: "Completed",
};

export const STATUS_BADGE: Record<SupportTicketStatus, string> = {
  new: "bg-amber-50 text-amber-700",
  in_progress: "bg-sky-50 text-sky-700",
  completed: "bg-emerald-50 text-emerald-700",
};

/** Solid dot on the picker buttons and board column headers. */
export const STATUS_DOT: Record<SupportTicketStatus, string> = {
  new: "bg-amber-400",
  in_progress: "bg-sky-400",
  completed: "bg-emerald-400",
};

/** Selected option in the ticket sidebar picker. */
export const STATUS_OPTION_ACTIVE: Record<SupportTicketStatus, string> = {
  new: "border-amber-300 bg-amber-50 text-amber-700",
  in_progress: "border-sky-300 bg-sky-50 text-sky-700",
  completed: "border-emerald-300 bg-emerald-50 text-emerald-700",
};

/** Unselected option — neutral, with the destination colour previewed on hover. */
export const STATUS_OPTION_IDLE: Record<SupportTicketStatus, string> = {
  new: "border-teal-mid bg-white text-ink hover:border-amber-300 hover:bg-amber-50",
  in_progress:
    "border-teal-mid bg-white text-ink hover:border-sky-300 hover:bg-sky-50",
  completed:
    "border-teal-mid bg-white text-ink hover:border-emerald-300 hover:bg-emerald-50",
};
