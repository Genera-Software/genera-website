import type { ReactNode } from "react";

/* ============================================================
   The phone every app mockup on the site sits in.

   Children are laid out on a real 390×844 screen — draw them at
   the sizes the app uses on a device — and the whole screen is
   scaled down with --s, so type, spacing and radii keep their
   true proportions at any size. The status bar, Dynamic Island
   and home indicator are drawn on top.

   `scale` sets --s per breakpoint (Tailwind arbitrary properties).
   Use `statusBar="light"` when the screen under it is dark.
   ============================================================ */

export const DEVICE_SCALE = "[--s:0.74] sm:[--s:0.8]";

export default function DeviceFrame({
  label,
  children,
  className = "",
  scale = DEVICE_SCALE,
  statusBar = "dark",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  scale?: string;
  statusBar?: "dark" | "light";
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative shrink-0 rounded-[46px] bg-[#101418] p-[9px] shadow-[0_30px_60px_rgba(0,62,69,0.28),inset_0_0_0_1.5px_rgba(255,255,255,0.08)] ${scale} ${className}`}
    >
      <div
        aria-hidden
        className="relative overflow-hidden rounded-[38px] bg-white"
        style={{ width: "calc(390px * var(--s))", height: "calc(844px * var(--s))" }}
      >
        <div
          className="absolute top-0 left-0 h-[844px] w-[390px] origin-top-left text-left"
          style={{ transform: "scale(var(--s))" }}
        >
          {children}
          <StatusBar tone={statusBar} />
          <span className="absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

function StatusBar({ tone }: { tone: "dark" | "light" }) {
  return (
    <>
      <div
        className={`absolute inset-x-0 top-0 z-50 flex h-[54px] items-center justify-between px-[34px] pt-[6px] text-[16px] font-semibold ${
          tone === "light" ? "text-white" : "text-black"
        }`}
      >
        <span>9:41</span>
        <span className="flex items-center gap-[6px]">
          <svg viewBox="0 0 18 12" className="h-[12px] w-[18px]" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
            <rect x="10" y="3" width="3" height="9" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </svg>
          <svg viewBox="0 0 17 12" className="h-[12px] w-[17px]" fill="currentColor">
            <path d="M8.5 2.3c2.3 0 4.4.9 6 2.4l1.1-1.1A10 10 0 0 0 8.5.7 10 10 0 0 0 1.4 3.6l1.1 1.1a8.4 8.4 0 0 1 6-2.4Zm0 3.3c1.4 0 2.7.5 3.7 1.4l1.1-1.1a7 7 0 0 0-9.6 0l1.1 1.1c1-.9 2.3-1.4 3.7-1.4Zm0 3.3c.6 0 1.1.2 1.5.6L8.5 11 7 9.5c.4-.4.9-.6 1.5-.6Z" />
          </svg>
          <svg viewBox="0 0 27 13" className="h-[13px] w-[27px]">
            <rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4" />
            <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
            <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45" />
          </svg>
        </span>
      </div>
      <span className="absolute top-[11px] left-1/2 z-50 h-[35px] w-[122px] -translate-x-1/2 rounded-full bg-black" />
    </>
  );
}
