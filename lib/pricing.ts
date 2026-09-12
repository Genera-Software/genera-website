// The public pricing tiers, mirrored from the app's `platform_plans` table.
//
// Deliberately hard-coded rather than fetched. The marketing site talks to its own Supabase
// project (the CMS); the plans live in the app's project behind an authenticated-only RLS
// policy, so reading them from here would mean a cross-origin call to
// app.generasoftware.com on every revalidate — and an empty pricing section on the homepage
// any time that call fails. Prices move rarely; a broken landing page is expensive.
//
// Source of truth: supabase/migrations/20260912000000_platform_pricing_tiers.sql and
// 20260914000000_platform_plan_staff_limit.sql in the `genera` repo. `id` is the real
// platform_plans UUID — /register reads `?plan=<id>` and seeds the subscription from it, so
// these must stay in step with that table or a tier button silently falls back to the
// platform default plan.
//
// The Founding Member plan is intentionally absent: it is is_active=false, grandfathered
// for daycares that joined before pricing launched, and not on sale.

import { REGISTER_URL } from "@/lib/urls";

/** Every plan gets the same free trial; stated once so the copy can't drift from the cards. */
export const TRIAL_DAYS = 30;

export type TierFeature = {
  label: string;
  /** Shown greyed in brackets after the label, e.g. "in development". */
  note?: string;
  included: boolean;
};

export type PricingTier = {
  /** platform_plans.id — rides into signup on the query string. */
  id: string;
  name: string;
  /** One line under the name: who the tier is for. */
  tagline: string;
  monthlyPrice: number;
  /** Team members allowed besides the account owner; `null` = unlimited. */
  staffLimit: number | null;
  featured: boolean;
  features: TierFeature[];
};

/** In every plan, whatever the daycare pays. */
const CORE: TierFeature[] = [
  { label: "Bookings & scheduling", included: true },
  { label: "Invoicing & payments", included: true },
  { label: "Owners, pets & vaccination records", included: true },
  { label: "Branded customer app", included: true },
];

/**
 * Unlocked by the tier. Built as a helper rather than written out three times so a tier can
 * never list a feature the one above it is missing.
 */
const gated = (unlocked: readonly string[] | null): TierFeature[] =>
  [
    { key: "reports", label: "Assessments & report cards" },
    { key: "daycare_finance", label: "Daycare finance & forecast" },
    { key: "routing", label: "Routing & driver portal" },
    { key: "messages", label: "Owner messaging" },
    { key: "marketing", label: "Marketing tools", note: "in development" },
  ].map((f) => ({
    label: f.label,
    note: f.note,
    // `null` means everything, present and future — the same fail-open rule the app uses.
    included: unlocked === null || unlocked.includes(f.key),
  }));

/** `staffLimit` counts people besides the account owner, so the owner is added back here. */
export const seatLine = (staffLimit: number | null) =>
  staffLimit === null
    ? "Unlimited staff logins"
    : `Logins for you plus ${staffLimit} member${staffLimit === 1 ? "" : "s"} of staff`;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "c1e0ef8e-556b-4977-a404-784b4385be81",
    name: "Starter",
    tagline: "You, one other pair of hands, and a diary that finally lives somewhere.",
    monthlyPrice: 50,
    staffLimit: 1,
    featured: false,
    features: [...CORE, ...gated([])],
  },
  {
    id: "22237ae6-3d47-4b7e-8106-5fac23a13ed1",
    name: "Grow",
    tagline: "A small team on a rota, and someone asking how the month actually went.",
    monthlyPrice: 75,
    staffLimit: 4,
    featured: false,
    features: [...CORE, ...gated(["reports", "daycare_finance"])],
  },
  {
    id: "4cbec70f-59f6-4ec3-b83f-06ad9d74c469",
    name: "Thrive",
    tagline: "Dog Buses on the road and more owners than you can text back.",
    monthlyPrice: 99,
    staffLimit: null,
    featured: true,
    features: [...CORE, ...gated(null)],
  },
];

/** Dearest tier on sale — the honest worst case for "this is the whole bill". */
export const TOP_TIER = PRICING_TIERS.reduce((best, tier) =>
  tier.monthlyPrice > best.monthlyPrice ? tier : best,
);

export const registerUrlForTier = (tierId: string) =>
  `${REGISTER_URL}?plan=${encodeURIComponent(tierId)}`;

export const money = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);

/** Invoice-line money: always two decimals, the way a real bill prints "£99.00" and "£0.00". */
export const invoiceMoney = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

/**
 * A sample month's activity for the "What you keep" invoice mock. Illustrative figures for a
 * busy month — never a rate of ours, and no competitor arithmetic appears alongside them.
 * The claim they support is verifiable in the app: nothing meters bookings, pets or owner
 * logins, and both revenue-share levers are set to zero.
 */
export const SAMPLE_MONTH = {
  invoicedToOwners: 18400,
  bookings: 312,
  appPayments: 140,
  pets: 86,
  owners: 71,
};

/* -------------------------------------------------------------------------- */
/* /pricing page copy — the long-form version of the tiers above               */
/* -------------------------------------------------------------------------- */

/**
 * The "What you get" split: what every daycare gets whatever they pay, and what the tier
 * unlocks. Deliberately separate from the homepage FEATURES grid — that one sells the
 * product, this one draws the line a buyer is about to pay for.
 */
export const CORE_FEATURE_CARDS: { title: string; body: string }[] = [
  {
    title: "Bookings & scheduling",
    body: "Monthly and daily views, an approval workflow, recurring bookings and per-service capacity limits. Owners request from their own portal.",
  },
  {
    title: "Invoicing & payments",
    body: "Charges raised from the bookings you already took, invoices sent, and payment collected by card or Direct Debit.",
  },
  {
    title: "Owners & pets",
    body: "Pet profiles with photos, vet and vaccination details, and the owner records tied to them. One place, not a filing cabinet.",
  },
  {
    title: "Team & rota",
    body: "Daily and weekly rota, time off, staff profiles. Never gated — a one-person daycare still has to roster itself. Your plan sets how many people hold a login.",
  },
  {
    title: "Branded customer app",
    body: "Owners add your portal to their home screen and it opens under your name and your logo — where they request bookings, keep their pet's details current and settle invoices. Nothing to find in an app store, and nothing to build.",
  },
];

/**
 * Unlocked by the plan. `plan` names the tier that unlocks it; `badge` is the fallback for a
 * label that isn't a tier at all — "In development" gets no tier styling, because a tier
 * badge next to it would imply a plan called that.
 */
export const GATED_FEATURE_CARDS: {
  title: string;
  body: string;
  plan?: string;
  badge?: string;
  tone: "teal" | "gold" | "muted";
  pending?: boolean;
}[] = [
  {
    title: "Reports",
    plan: "Grow",
    tone: "teal",
    body: "Assessments, temperament tests and trial days, recorded on a phone in the yard and turned into a branded report card the owner actually reads.",
  },
  {
    title: "Daycare finance",
    plan: "Grow",
    tone: "teal",
    body: "The money side in one place: what you've invoiced and what's still owed, what the diary is worth for the next six months, and what your team costs to run.",
  },
  {
    title: "Routing & driver portal",
    plan: "Thrive",
    tone: "gold",
    body: "Collection and drop-off runs planned once, driven from a phone, and tracked stop by stop — so you always know which dog is on which Dog Bus and who last had them.",
  },
  {
    title: "Messages",
    plan: "Thrive",
    tone: "gold",
    body: "One place for every conversation with an owner, instead of three WhatsApp accounts, a personal phone and a Facebook page nobody checks.",
  },
  {
    title: "Marketing tools",
    badge: "In development",
    tone: "muted",
    pending: true,
    body: "Tools for filling quiet days and bringing lapsed owners back. Not built yet: it's included in Thrive and appears in your account as it ships.",
  },
];

/**
 * The tier walkthrough. Each entry describes the *setting* the tier is for rather than
 * listing features again — the cards already do that. The seat line is appended from the
 * tier's own `staffLimit`, so only the tail of it lives here.
 */
export const TIER_STORIES: Record<
  string,
  {
    headline: string;
    body: string;
    bullets: string[];
    seatTail?: string;
    mock: "bookings" | "finance" | "routes";
  }
> = {
  Starter: {
    headline: "You and one other pair of hands.",
    body: "A single site where you know every dog by name, the diary lives in your head and the invoicing eats your Sunday. Starter replaces the diary and the spreadsheet, and stops there.",
    bullets: [
      "Bookings, owners, pets and the rota, with owner self-service",
      "Invoices raised from real bookings and paid online",
    ],
    mock: "bookings",
  },
  Grow: {
    headline: "A small team on a rota, and someone asking how the month went.",
    body: "Once other people are handling dogs, the questions change: who assessed this dog, what did we invoice, what is still owed, what does payroll cost against it. Grow answers those without a spreadsheet.",
    bullets: [
      "Assessments and report cards, filled in on a phone and emailed to the owner",
      "Finance dashboard, six-month revenue forecast and salaries",
    ],
    mock: "finance",
  },
  Thrive: {
    headline: "Dog Buses on the road and more owners than you can text back.",
    body: "Collections, drivers and a hundred conversations a week are where the day actually goes. Thrive puts the runs, the driver portal and every owner message inside the same system as the bookings.",
    bullets: [
      "Route planning with optimised stops, plus a portal each driver signs into",
      "Owner messaging and broadcasts, in the app and by push",
    ],
    seatTail: ", and marketing tools as they ship",
    mock: "routes",
  },
};

export const SETUP_STEPS = [
  {
    title: "Bring your owners across",
    body: "Fill in the owner import template and upload it. Pets, contacts and vet details land with them.",
  },
  {
    title: "Set your services and prices",
    body: "Daycare, sleepovers, walks, grooming — with weekly-count tiers and puppy rates if you use them.",
  },
  {
    title: "Open your portal to owners",
    body: "They get your own branded portal on its own address, and start requesting bookings themselves.",
  },
  {
    title: "Let the invoicing run itself",
    body: "Charges come off the bookings you took, invoices go out, and Direct Debit collects. Xero if you keep books there.",
  },
];

/** How the seat allowance reads in prose, for the tier walkthrough and the FAQ. */
export const seatPhrase = (staffLimit: number | null) =>
  staffLimit === null
    ? "Unlimited staff logins"
    : `Logins for you plus ${staffLimit} member${staffLimit === 1 ? "" : "s"} of staff`;

/** "you plus 1 on Starter, you plus 4 on Grow, unlimited on Thrive" — one FAQ answer. */
export const seatSummary = PRICING_TIERS.map((tier) =>
  tier.staffLimit === null
    ? `unlimited on ${tier.name}`
    : `you plus ${tier.staffLimit} on ${tier.name}`,
).join(", ");
