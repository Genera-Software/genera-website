/**
 * Inline paw-print SVG that inherits its color from the surrounding text
 * via `fill="currentColor"`. Use this instead of the 🐾 emoji wherever
 * the icon should match the text color.
 */
export default function Paw({
  className,
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
      className={className}
    >
      <circle cx="5.5" cy="11" r="2.2" />
      <circle cx="9.5" cy="6" r="2.2" />
      <circle cx="14.5" cy="6" r="2.2" />
      <circle cx="18.5" cy="11" r="2.2" />
      <path d="M12 11.5c-3 0-5.5 2.5-5.5 5.5 0 1.5 1 3 2.5 3.5 1 0 2-.5 3-.5s2 .5 3 .5c1.5-.5 2.5-2 2.5-3.5 0-3-2.5-5.5-5.5-5.5z" />
    </svg>
  );
}
