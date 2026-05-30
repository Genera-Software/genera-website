// Shared metadata for the "Powered by Genera" / "Book with Genera" badges.
// Used by the tracked image endpoint (app/api/badge/[id]/route.ts) to validate
// IDs, and by the /admin/badges dashboard to label events. The visual specs
// (colours, fonts) live in app/(site)/badge-kit/_components/BadgeKit.tsx and
// scripts/generate-badges.mjs.

export type BadgeKind = "powered" | "book";
export type BadgeShape = "pill" | "card" | "stamp";

export type BadgeMeta = {
  id: string;
  kind: BadgeKind;
  shape: BadgeShape;
  style: string; // "Forest" | "Cream" | "Outline"
  label: string;
};

const KIND_LABEL: Record<BadgeKind, string> = {
  powered: "Powered by",
  book: "Book with",
};

function meta(
  id: string,
  kind: BadgeKind,
  shape: BadgeShape,
  style: string,
): BadgeMeta {
  const shapeLabel = shape.charAt(0).toUpperCase() + shape.slice(1);
  return { id, kind, shape, style, label: `${KIND_LABEL[kind]} · ${shapeLabel} — ${style}` };
}

export const BADGES: BadgeMeta[] = [
  meta("powered-by-genera-pill-forest", "powered", "pill", "Forest"),
  meta("powered-by-genera-pill-cream", "powered", "pill", "Cream"),
  meta("powered-by-genera-pill-light", "powered", "pill", "Outline"),
  meta("powered-by-genera-card-forest", "powered", "card", "Forest"),
  meta("powered-by-genera-card-cream", "powered", "card", "Cream"),
  meta("powered-by-genera-stamp-forest", "powered", "stamp", "Forest"),
  meta("book-with-genera-pill-forest", "book", "pill", "Forest"),
  meta("book-with-genera-pill-cream", "book", "pill", "Cream"),
  meta("book-with-genera-pill-light", "book", "pill", "Outline"),
  meta("book-with-genera-card-forest", "book", "card", "Forest"),
  meta("book-with-genera-card-cream", "book", "card", "Cream"),
  meta("book-with-genera-stamp-forest", "book", "stamp", "Forest"),
];

export const BADGES_BY_ID: Record<string, BadgeMeta> = Object.fromEntries(
  BADGES.map((b) => [b.id, b]),
);
