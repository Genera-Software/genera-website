import type { SupportTicketPriority } from "@/lib/supabase/types";

export const PRIORITIES: readonly SupportTicketPriority[] = [
  "urgent",
  "high",
  "medium",
  "low",
] as const;

export const PRIORITY_LABEL: Record<SupportTicketPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const PRIORITY_BADGE: Record<SupportTicketPriority, string> = {
  urgent: "bg-red-50 text-red-700",
  high: "bg-orange-50 text-orange-700",
  medium: "bg-sky-50 text-sky-700",
  low: "bg-slate-100 text-slate-600",
};

/** Solid dot on the picker buttons and board column headers. */
export const PRIORITY_DOT: Record<SupportTicketPriority, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-sky-500",
  low: "bg-slate-400",
};

/** Selected option in the ticket sidebar picker. */
export const PRIORITY_OPTION_ACTIVE: Record<SupportTicketPriority, string> = {
  urgent: "border-red-300 bg-red-50 text-red-700",
  high: "border-orange-300 bg-orange-50 text-orange-700",
  medium: "border-sky-300 bg-sky-50 text-sky-700",
  low: "border-slate-300 bg-slate-100 text-slate-700",
};

/** Unselected option — neutral, with the destination colour previewed on hover. */
export const PRIORITY_OPTION_IDLE: Record<SupportTicketPriority, string> = {
  urgent: "border-teal-mid bg-white text-ink hover:border-red-300 hover:bg-red-50",
  high: "border-teal-mid bg-white text-ink hover:border-orange-300 hover:bg-orange-50",
  medium: "border-teal-mid bg-white text-ink hover:border-sky-300 hover:bg-sky-50",
  low: "border-teal-mid bg-white text-ink hover:border-slate-300 hover:bg-slate-100",
};

/** Lower rank = more important. Used to sort board columns and the list view. */
export const PRIORITY_RANK: Record<SupportTicketPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};
