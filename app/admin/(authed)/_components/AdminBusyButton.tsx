"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type AdminBusyButtonVariant =
  | "gold"
  | "goldLg"
  | "forest"
  | "forestSm"
  | "outline"
  | "outlineDanger"
  | "outlineSm"
  | "outlineDangerSm"
  | "outlineMarkAll"
  | "ghostWide"
  | "icon"
  | "ticketStatus"
  | "ticketStatusActive"
  | "ticketOption";

const VARIANT_STYLES: Record<
  AdminBusyButtonVariant,
  { button: string; spinner: string }
> = {
  gold: {
    button:
      "rounded-full bg-gold px-5 py-2.5 font-massilia text-sm font-bold text-ink shadow-[0_4px_14px_rgba(255,168,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,168,0,0.45)] transition-shadow disabled:cursor-not-allowed disabled:opacity-65",
    spinner: "h-4 w-4 border-2 border-ink/20 border-t-ink",
  },
  goldLg: {
    button:
      "rounded-full bg-gold px-5 py-3 font-massilia text-base font-bold text-ink shadow-[0_4px_14px_rgba(255,168,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,168,0,0.45)] transition-shadow disabled:cursor-not-allowed disabled:opacity-65",
    spinner: "h-4 w-4 border-2 border-ink/20 border-t-ink",
  },
  forest: {
    button:
      "rounded-full bg-forest px-5 py-2 font-massilia text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,62,69,0.2)] transition-colors hover:bg-forest-mid disabled:cursor-not-allowed disabled:opacity-65",
    spinner: "h-4 w-4 border-2 border-white/25 border-t-white",
  },
  forestSm: {
    button:
      "rounded-full bg-forest px-4 py-1.5 font-massilia text-sm font-bold text-white transition-colors hover:bg-forest-mid disabled:cursor-not-allowed disabled:opacity-65",
    spinner: "h-3.5 w-3.5 border-2 border-white/25 border-t-white",
  },
  outline: {
    button:
      "rounded-full border border-teal-mid bg-white px-5 py-2 text-sm font-semibold text-forest transition-colors hover:border-forest disabled:cursor-not-allowed disabled:opacity-60",
    spinner: "h-4 w-4 border-2 border-teal-mid/50 border-t-forest",
  },
  outlineDanger: {
    button:
      "rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60",
    spinner: "h-3.5 w-3.5 border-2 border-red-200 border-t-red-600",
  },
  outlineSm: {
    button:
      "rounded-full border border-teal-mid bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-60",
    spinner: "h-3.5 w-3.5 border-2 border-teal-mid/50 border-t-forest",
  },
  outlineDangerSm: {
    button:
      "rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60",
    spinner: "h-3 w-3 border-2 border-red-200 border-t-red-600",
  },
  outlineMarkAll: {
    button:
      "rounded-full border border-teal-mid bg-white px-3.5 py-2 text-xs font-semibold text-forest transition-colors hover:border-forest disabled:cursor-not-allowed disabled:opacity-60",
    spinner: "h-3.5 w-3.5 border-2 border-teal-mid/50 border-t-forest",
  },
  ghostWide: {
    button:
      "flex w-full items-center justify-start gap-3 rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
    spinner: "h-4 w-4 border-2 border-cream/25 border-t-cream",
  },
  icon: {
    button:
      "inline-flex h-7 w-7 items-center justify-center rounded-full p-1 text-ink-soft/70 transition-colors hover:bg-cream-dark hover:text-ink disabled:cursor-not-allowed disabled:opacity-50",
    spinner: "h-3.5 w-3.5 border-2 border-ink-soft/35 border-t-forest",
  },
  ticketStatus: {
    button:
      "w-full rounded-lg border border-teal-mid bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-forest hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60",
    spinner: "h-4 w-4 border-2 border-teal-mid/50 border-t-forest",
  },
  ticketStatusActive: {
    button:
      "w-full cursor-default rounded-lg bg-cream px-3 py-2 text-sm font-semibold text-ink-soft",
    spinner: "h-4 w-4 border-2 border-ink-soft/20 border-t-ink-soft",
  },
  // Colour-coded status/priority picker. Deliberately carries no bg/border/text
  // colour of its own — the caller supplies those per option via className.
  // The child-span rule stretches the label row so a trailing tick can sit right.
  ticketOption: {
    button:
      "flex w-full items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-default [&>span]:w-full [&>span]:justify-start",
    spinner: "h-4 w-4 border-2 border-ink-soft/20 border-t-ink-soft",
  },
};

function Spinner({ className }: { className: string }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full animate-spin ${className}`}
      aria-hidden
    />
  );
}

export type AdminBusyButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  pending: boolean;
  pendingLabel: string;
  children: ReactNode;
  variant?: AdminBusyButtonVariant;
  /** When false, only the label changes while pending (no spinner). Default true. */
  showSpinner?: boolean;
};

export function AdminBusyButton({
  pending,
  pendingLabel,
  children,
  variant = "gold",
  showSpinner = true,
  className = "",
  disabled,
  type = "button",
  ...rest
}: AdminBusyButtonProps) {
  const vs = VARIANT_STYLES[variant];
  const isIcon = variant === "icon";
  const showSpin = showSpinner && pending;
  const label = pending ? pendingLabel : children;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || pending}
      aria-busy={pending}
      className={`${vs.button} ${className}`.trim()}
    >
      {isIcon ? (
        <span className="inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center">
          {showSpin ? <Spinner className={vs.spinner} /> : children}
        </span>
      ) : (
        <span className="inline-flex min-h-[1.15rem] items-center justify-center gap-2">
          {showSpin && <Spinner className={vs.spinner} />}
          {label}
        </span>
      )}
    </button>
  );
}

export type AdminFormStatusButtonProps = Omit<AdminBusyButtonProps, "pending">;

/** Submit / action button that reads pending state from the closest parent &lt;form&gt; (React useFormStatus). */
export function AdminFormStatusButton(props: AdminFormStatusButtonProps) {
  const { pending } = useFormStatus();
  return <AdminBusyButton {...props} pending={pending} />;
}
