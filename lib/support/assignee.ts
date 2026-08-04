// Presentation helpers for ticket assignees. Assignment stores the admin's
// email (see supabase/migrations/20260804140000_support_ticket_assignee.sql);
// these turn that into something readable in a table cell or on a board card.

/** "dihan.algama@gmail.com" → "Dihan Algama" */
export function assigneeName(email: string): string {
  const local = email.split("@")[0] ?? email;
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || email
  );
}

/** "dihan.algama@gmail.com" → "DA". Falls back to one letter for single names. */
export function assigneeInitials(email: string): string {
  const parts = (email.split("@")[0] ?? email).split(/[._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Deterministic avatar colour so the same person is the same colour everywhere,
 * without storing one. Palette stays inside the site's existing range.
 */
const AVATAR_COLOURS = [
  "bg-forest text-white",
  "bg-gold text-ink",
  "bg-sky-600 text-white",
  "bg-purple-600 text-white",
  "bg-teal-600 text-white",
  "bg-rose-600 text-white",
  "bg-amber-600 text-white",
  "bg-indigo-600 text-white",
] as const;

export function assigneeColour(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLOURS[hash % AVATAR_COLOURS.length];
}
