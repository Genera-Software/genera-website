/* Minimal stroke icons for each docs section. Inherit `currentColor`
   so they tint with whatever colour the parent sets. */

const PATHS: Record<string, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2" />
    </>
  ),
  bookings: (
    <>
      <path d="M4 5h16v15H4z" />
      <path d="M4 9h16M9 13l2 2 4-4" />
    </>
  ),
  owners: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 7a3 3 0 0 1 0 6M17 20a5.5 5.5 0 0 0-3-4.9" />
    </>
  ),
  pets: (
    <>
      <circle cx="5.5" cy="11" r="1.6" />
      <circle cx="9.5" cy="6.5" r="1.6" />
      <circle cx="14.5" cy="6.5" r="1.6" />
      <circle cx="18.5" cy="11" r="1.6" />
      <path d="M12 12c-2.5 0-4.5 2-4.5 4.5 0 1.4 1 2.7 2.3 3 .9 0 1.6-.4 2.2-.4s1.3.4 2.2.4c1.3-.3 2.3-1.6 2.3-3C16.5 14 14.5 12 12 12z" />
    </>
  ),
  finance: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  reports: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 13v4M12 11v6M15 14v3" />
    </>
  ),
  team: (
    <>
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="16" cy="9" r="2.2" />
      <path d="M3 19a5 5 0 0 1 10 0M14 19a4.5 4.5 0 0 1 7-3.6" />
    </>
  ),
  routes: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M8 6h6a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
};

export default function SectionIcon({
  slug,
  className = "h-5 w-5",
}: {
  slug: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[slug] ?? PATHS.dashboard}
    </svg>
  );
}
