/** The four-colour Google Play triangle, for store badges. */
export default function GooglePlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 26" className={className} aria-hidden="true">
      <path fill="#00D7FE" d="M1.1.4C.8.7.6 1.2.6 1.9v22.2c0 .7.2 1.2.5 1.5l.1.1L13.6 13.3V13L1.2.3z" />
      <path fill="#FFCE00" d="m17.7 17.5-4.1-4.2V13l4.1-4.2.1.1 4.9 2.8c1.4.8 1.4 2.1 0 2.9l-4.9 2.8z" />
      <path fill="#FF3A44" d="M17.8 17.4 13.6 13.2 1.1 25.6c.5.5 1.2.5 2.1.1z" />
      <path fill="#00F076" d="M17.8 9 3.2.7C2.3.2 1.6.3 1.1.8l12.5 12.4z" />
    </svg>
  );
}
