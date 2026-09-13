import type { CSSProperties } from "react";

/* ============================================================
   The feature catalogue's colours — one pair per feature, light
   to deep. Wherever the site names a feature (the landing grid
   and spotlights, /features, /pricing) it wears the same colour
   and the same icon (components/features/FeatureIcon), so a
   feature reads as the same thing on every page.

   Neighbours on the landing page's 3-up grid sit on clearly
   different hues; keep that in mind when adding one.
   ============================================================ */
export const FEATURE_ACCENTS = {
  bookings:      ["#19A7B6", "#00606E"],
  ownerApp:      ["#6D7BF3", "#3643B8"],
  payments:      ["#72B57C", "#3F7F4B"],
  routes:        ["#F5B940", "#CC8200"],
  messages:      ["#FF9F55", "#D9621F"],
  compliance:    ["#2F8A93", "#003E45"],
  dailySchedule: ["#94A3B8", "#475569"],
  assessments:   ["#9D8FE3", "#5E4DB3"],
  finance:       ["#5E9FE3", "#2B5FAE"],
  records:       ["#F0906F", "#C65A44"],
  team:          ["#EE809D", "#BD4C6C"],
  marketing:     ["#BC82CE", "#7D4396"],
  support:       ["#A6CB5E", "#5F9128"],
  essentials:    ["#C8A27A", "#8B5E34"],
} as const satisfies Record<string, readonly [string, string]>;

export type FeatureKey = keyof typeof FEATURE_ACCENTS;

export const featureGradient = (feature: FeatureKey) => {
  const [from, to] = FEATURE_ACCENTS[feature];
  return `linear-gradient(135deg, ${from}, ${to})`;
};

/* A card tinted with its feature: a faint wash of the colour from the
   icon corner, and the colour on the border on hover — pair it with
   `hover:border-[color:var(--accent-edge)]` on the card. */
export function featureCardStyle(feature: FeatureKey, base = "var(--color-cream)"): CSSProperties {
  const [from, to] = FEATURE_ACCENTS[feature];
  return {
    "--accent-edge": `${to}55`,
    background: `radial-gradient(120% 90% at 0% 0%, ${from}1a, transparent 60%), ${base}`,
  } as CSSProperties;
}
