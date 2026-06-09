/* ─────────────────────────────────────────────────────────────
   Genera Help Centre — content model.

   Every docs page is generated from this file. To add depth to a
   feature, edit its subsection here (add bullets to `howToUse`,
   entries to `items`, or a longer `whatItDoes`) — the page picks it
   up automatically. To add a whole new section, append a DocSection
   and it shows up in the sidebar + gets its own route.
   ───────────────────────────────────────────────────────────── */

/** A labelled definition row (used for tab lists, sub-blocks, etc.). */
export type DocItem = { label: string; desc: string };

/** A single feature / page within a section. */
export type DocSubsection = {
  title: string;
  /** The in-app URL this maps to, shown as a chip (e.g. "/admin/home"). */
  route?: string;
  /** Plain-English summary of what the page is for. */
  whatItDoes?: string;
  /** Step-by-step guidance, rendered as a checklist. */
  howToUse?: string[];
  /** Definition rows (e.g. the tabs on a profile). */
  items?: DocItem[];
};

export type DocSection = {
  slug: string;
  num: number;
  title: string;
  /** One-liner used on cards + under the sidebar entry. */
  tagline: string;
  /** Optional longer intro shown at the top of the section page. */
  intro?: string;
  /** Screenshot under /public/docs/images (omit if none yet). */
  image?: string;
  imageAlt?: string;
  subsections: DocSubsection[];
};

export const SECTIONS: DocSection[] = [
  {
    slug: "dashboard",
    num: 1,
    title: "Dashboard",
    tagline: "Your daily operating picture",
    intro:
      "The home of the admin portal — a monthly calendar plus daily and map views that show, at a glance, who is in and what is happening today.",
    image: "/docs/images/01-dashboard.png",
    imageAlt: "Admin dashboard showing the monthly booking calendar",
    subsections: [
      {
        title: "Dashboard (calendar)",
        route: "/admin/home",
        whatItDoes:
          "Shows a monthly calendar of bookings with row and status icons. Each day surfaces who is booked in for daycare, sleepovers, and other services.",
        howToUse: [
          "Use the arrows to move between months; Go to today jumps back to the current date.",
          "Use the sun button on a day for an instant daycare booking and the moon button for an instant sleepover booking — no need to open the full form.",
          "Click a day to expand its detail list (on mobile this opens below the calendar).",
          "Check the key for what each row and status icon means (confirmed, declined, pending, has notes, etc.).",
          "Use Fit calendar to screen / Expand calendar to fit content to control density.",
        ],
      },
      {
        title: "Daily view",
        route: "/admin/home/daily",
        whatItDoes:
          "A single-day operational summary with stat cards per service type (daycare, sleepover, welcome/assessment, vet, unassigned), each colour-coded to its service icon.",
        howToUse: [
          "Open it at the start of the day to see headcounts and who is in for what.",
          "Use it as the run sheet for the team.",
        ],
      },
      {
        title: "Map",
        route: "/admin/home/map",
        whatItDoes:
          "A live map of drivers and their latest locations, today's routes (saved routes plus any default routes not yet saved for today), and which staff are scheduled to work. It flags assigned drivers who are marked off.",
        howToUse: [
          "Use it during pickup/drop-off windows to watch progress in real time.",
          "The map updates live as driver locations come in.",
        ],
      },
    ],
  },
  {
    slug: "bookings",
    num: 2,
    title: "Bookings",
    tagline: "Reservations, approvals & recurring schedules",
    intro:
      "Everything related to reservations, approvals, and recurring schedules lives here.",
    image: "/docs/images/02-bookings.png",
    imageAlt: "Bookings request list with approvals",
    subsections: [
      {
        title: "Bookings",
        route: "/admin/bookings",
        whatItDoes:
          "The central booking list. Pending requests are always shown (no age cap) so nothing stale slips past you; accepted/declined activity is limited to the last 30 days to keep the list clean.",
        howToUse: [
          "Review pending requests and approve or decline each one.",
          "Filter/scan by status: Confirmed, Pending Approval, Declined.",
          "Open a booking to edit dates, service, or notes.",
        ],
      },
      {
        title: "Recurring",
        route: "/admin/bookings/recurring",
        whatItDoes:
          "Manages repeating bookings. Pending and accepted recurring schedules are kept in separate buckets so you can act on new requests independently of schedules already running.",
        howToUse: [
          "Approve Pending Approval recurring requests.",
          "Manage Active Recurring Bookings to pause, edit, or end a schedule.",
        ],
      },
      {
        title: "Frequency",
        route: "/admin/bookings/frequency",
        whatItDoes:
          "Shows how often each pet/owner books — useful for spotting your most regular customers and gaps in attendance.",
        howToUse: [
          "Scan to identify regulars vs. occasional clients for capacity planning and outreach.",
        ],
      },
      {
        title: "Heatmap",
        route: "/admin/bookings/heatmap",
        whatItDoes:
          "A visual density view of bookings across days, making busy and quiet periods obvious at a glance.",
        howToUse: [
          "Use it for capacity and staffing decisions — spot the peak days and the slow ones.",
        ],
      },
      {
        title: "Log",
        route: "/admin/bookings/log",
        whatItDoes:
          "A chronological audit trail of booking activity (created, accepted, declined, changed).",
        howToUse: ["Use it to trace what happened to a specific booking and when."],
      },
      {
        title: "Notes",
        route: "/admin/bookings/notes",
        whatItDoes: "Collects day notes and booking notes in one place.",
        howToUse: [
          "Review notes attached to bookings/days; the Has notes icon on the calendar points back here.",
        ],
      },
    ],
  },
  {
    slug: "owners",
    num: 3,
    title: "Owners",
    tagline: "Your customer directory",
    intro:
      "Your customers — pet owners — with their contact details, pets, and full account history.",
    image: "/docs/images/03-owners.png",
    imageAlt: "Owners customer directory",
    subsections: [
      {
        title: "Owners",
        route: "/admin/owners",
        whatItDoes:
          "The directory of pet owners (your customers) with their contact details and linked pets.",
        howToUse: [
          "Search for an owner, open their record to see and edit contact info, view their pets, and review their account.",
        ],
      },
      {
        title: "Owner detail",
        route: "/admin/owners/[ownerId]",
        whatItDoes:
          "A single owner's full profile — their pets, bookings, charges, and communication history.",
        howToUse: [
          "Open it from the owners list (or by clicking an owner's name elsewhere) to manage one customer end-to-end.",
        ],
      },
    ],
  },
  {
    slug: "pets",
    num: 4,
    title: "Pets",
    tagline: "Every pet, profile & care record",
    intro:
      "The directory of all pets at your daycare, plus each pet's full profile across a set of tabs.",
    image: "/docs/images/04-pets.png",
    imageAlt: "Pets directory with vaccination warning icons",
    subsections: [
      {
        title: "Pets",
        route: "/admin/pets",
        whatItDoes:
          "The directory of all pets at your daycare. Warning icons flag pets with expiring or missing vaccinations (driven by the reminder window set in Settings).",
        howToUse: [
          "Search/scan for a pet, watch for vaccination warning icons, and click through to a pet's profile to manage everything about them.",
        ],
      },
      {
        title: "Pet profile and tabs",
        route: "/admin/pets/[petId]/…",
        whatItDoes: "Opening a pet gives you a set of tabs:",
        items: [
          {
            label: "Pet profile",
            desc: "Core details: name, breed, age, owner, medical notes, vaccinations, behaviour, and photo.",
          },
          { label: "Bookings", desc: "Every booking for this pet." },
          { label: "Charges", desc: "The full charge history for this pet." },
          { label: "Invoices", desc: "Invoices that include this pet." },
          {
            label: "Gallery",
            desc: "Photos for this pet (use Delete photo to remove one).",
          },
          { label: "Logs", desc: "Activity and care logs." },
          { label: "Delete", desc: "Permanently remove the pet." },
        ],
        howToUse: [
          "Open a pet from the Pets list, then move across the tabs to update details, check their booking and billing history, manage photos, or remove the record.",
        ],
      },
    ],
  },
  {
    slug: "finance",
    num: 5,
    title: "Finance",
    tagline: "Invoicing, billing, memberships & payroll",
    intro:
      "Finance splits into two areas in the sidebar: Billings & Services and Daycare Finance. Several features require a connected payment provider (Stripe or GoCardless).",
    image: "/docs/images/05-finance.png",
    imageAlt: "Finance billings and services invoicing hub",
    subsections: [
      {
        title: "Billings & Services",
        route: "/admin/finance",
        whatItDoes:
          "The hub for invoicing and billing. From here you generate invoices for a date range from accumulated charges (membership charges are billed separately via Stripe subscription and excluded here).",
        howToUse: [
          "Pick a date range and generate invoices — charges are grouped per owner, a reference number is assigned (e.g. INV-0042), and a Stripe invoice is raised for owners with a saved payment method.",
          "Open an invoice to view it, and use the Options menu on a paid invoice to issue a refund.",
        ],
      },
      {
        title: "Daycare Finance (dashboard)",
        route: "/admin/finance/dashboard",
        whatItDoes:
          "A financial snapshot for the selected period — revenue invoiced, outstanding amounts, recurring memberships, and how those compare against payroll (salary cost is prorated to the window for a fair Net figure).",
        howToUse: [
          "Set the period and read the aggregates and charts to gauge the health of the business.",
        ],
      },
      {
        title: "Charges",
        route: "/admin/finance/charges",
        whatItDoes:
          "Manages the charges that accumulate at booking time and later roll up into invoices.",
        howToUse: [
          "Review charges, add ad-hoc charges, and confirm what will be invoiced.",
        ],
      },
      {
        title: "Charges log",
        route: "/admin/finance/charges-log",
        whatItDoes: "Every charge across all pets in the selected period.",
        howToUse: [
          "Set the period and review; click a pet's name to open their full charges history.",
        ],
      },
      {
        title: "Direct Debits",
        route: "/admin/finance/direct-debits",
        whatItDoes:
          "Manages BACS Direct Debit mandates for automatic collection. Requires a connected payment provider (Stripe or GoCardless).",
        howToUse: [
          "Connect a provider first, then set up and monitor owners' Direct Debit mandates.",
        ],
      },
      {
        title: "Membership Plans",
        route: "/admin/finance/memberships",
        whatItDoes:
          "Define frequency-based membership plans with fixed monthly pricing. Pets on a plan are billed automatically via BACS Direct Debit through your Stripe account.",
        howToUse: [
          "Connect Stripe/GoCardless, create a plan (frequency + monthly price), then assign pets to it for automatic monthly billing.",
        ],
      },
      {
        title: "Refunds",
        route: "/admin/finance/refunds",
        whatItDoes:
          "A record of every refund issued against your invoices, with gateway status and reason.",
        howToUse: [
          "Review past refunds here. To create one, use the Options menu on a paid invoice (not from this page).",
        ],
      },
      {
        title: "Salaries",
        route: "/admin/finance/salaries",
        whatItDoes:
          "Summarises staff salaries and wages (toggle between day-care staff and part-time staff). Monthly pay set on a staff profile flows in here; annual pay is monthly × 12.",
        howToUse: [
          "Review payroll totals; edit individual pay from each staff member's profile.",
        ],
      },
      {
        title: "Services",
        route: "/admin/finance/services",
        whatItDoes:
          "An overview of the services your daycare offers (daycare, walks, grooming, training, etc.) with pricing.",
        howToUse: [
          "Create and edit services and prices (requires a connected payment provider to enable some actions). These feed the booking flow and pricing.",
        ],
      },
      {
        title: "Balances & Daily",
        whatItDoes: "Two account-level views for keeping on top of money owed.",
        items: [
          {
            label: "Balances — /admin/finance/balances",
            desc: "Outstanding balances per owner; the [slug] variant drills into one account.",
          },
          {
            label: "Daily — /admin/finance/daily",
            desc: "A daily finance view, including per-pet/service custom pricing currently in effect.",
          },
        ],
      },
    ],
  },
  {
    slug: "reports",
    num: 6,
    title: "Reports",
    tagline: "Health, contacts & compliance reporting",
    intro: "The reporting hub linking to the report types below.",
    subsections: [
      {
        title: "Reports",
        route: "/admin/reports",
        whatItDoes: "The reporting hub linking to the report types below.",
      },
      {
        title: "Health alerts",
        route: "/admin/reports/alerts",
        whatItDoes: "Lists all health alerts from the past 30 days.",
        howToUse: ["Review recent health flags raised on pets and follow up."],
      },
      {
        title: "Contacts",
        route: "/admin/reports/contacts",
        whatItDoes: "A list of pets and their owners' contact details.",
        howToUse: ["Use it as a quick emergency/contact sheet or export source."],
      },
      {
        title: "Late notice",
        route: "/admin/reports/late",
        whatItDoes: "Late notices — pickups/drop-offs or payments flagged as late.",
        howToUse: ["Review and act on late items."],
      },
      {
        title: "Records",
        route: "/admin/reports/records",
        whatItDoes: "Dog records from the past 30 days.",
        howToUse: ["Review recent care/activity records."],
      },
      {
        title: "Sessions / Assessments",
        route: "/admin/reports/sessions",
        whatItDoes:
          "A list of assessments for each pet from 30 days ago to now.",
        howToUse: ["Track which pets have completed assessment sessions."],
      },
      {
        title: "Vaccinations",
        route: "/admin/reports/vaccinations",
        whatItDoes: "A list of vaccination types and status.",
        howToUse: [
          "Audit vaccination coverage; pair with the reminder window in Settings to stay ahead of expiries.",
        ],
      },
    ],
  },
  {
    slug: "team",
    num: 7,
    title: "Team",
    tagline: "Staff, access, holidays & pay",
    intro: "The staff hub — your team members and their access.",
    subsections: [
      {
        title: "Team",
        route: "/admin/team",
        whatItDoes: "The staff hub — your team members and their access.",
      },
      {
        title: "Manage staff",
        route: "/admin/team/manage",
        whatItDoes: "Add, edit, and remove staff members.",
        howToUse: ["Create staff accounts and set their access here."],
      },
      {
        title: "Holidays",
        route: "/admin/team/holidays",
        whatItDoes: "Holiday bookings and approvals for staff.",
        howToUse: ["Review Approve Holidays requests and manage allowances."],
      },
      {
        title: "Staff profile",
        route: "/admin/team/profile/[id]",
        whatItDoes: "One staff member's full record, organised into sections:",
        items: [
          {
            label: "Profile Information",
            desc: "Name, address, working days, holiday and sick allowance.",
          },
          {
            label: "Role & Driver Access",
            desc: "Role sets their default portal at login; Assign as Driver makes them eligible for route assignment even if their role is Admin.",
          },
          {
            label: "Salary",
            desc: "Monthly pay (flows into Finance › Salaries; annual = monthly × 12).",
          },
          { label: "Commission", desc: "Commission records." },
          {
            label: "Holidays / Lieu Days / Sickness",
            desc: "Leave earned and taken.",
          },
          {
            label: "Delete Staff Member",
            desc: "Permanently remove them.",
          },
        ],
        howToUse: [
          "Open a staff member to update their details, set role and driver eligibility, manage pay, and track leave.",
        ],
      },
    ],
  },
  {
    slug: "routes",
    num: 8,
    title: "Routes",
    tagline: "Pickup & drop-off route planning",
    intro:
      "Pickup and drop-off route planning. The Routes page uses tabs (?tab=…); the legacy /admin/routes/default and /daily URLs redirect into them.",
    image: "/docs/images/08-routes.png",
    imageAlt: "Routes planning with a map",
    subsections: [
      {
        title: "Default routes",
        route: "/admin/routes (Default tab)",
        whatItDoes:
          "Your reusable, standing routes — the default order of stops for regular pickups/drop-offs.",
        howToUse: [
          "Build a route by drag-and-drop, then save it as the default.",
          "Use Reset to default order to revert and Change route colour to label routes on the map.",
        ],
      },
      {
        title: "Daily routes",
        route: "Daily tab",
        whatItDoes:
          "Today's actual routes, starting from your defaults and adjusted for who's actually booked in.",
        howToUse: [
          "Review and tweak the day's stops, Optimize stops (depot → pets → depot) for an efficient order, and open map links to navigate.",
          "Note: Waze only supports a single destination, so its link goes to the route's final stop.",
        ],
      },
      {
        title: "Live tracking",
        route: "Tracking tab",
        whatItDoes: "Live driver tracking on a map during the run.",
        howToUse: ["Watch drivers progress through their stops in real time."],
      },
    ],
  },
  {
    slug: "settings",
    num: 9,
    title: "Settings",
    tagline: "Branding, billing, customers & integrations",
    intro:
      "Open Settings from your profile menu. It's organised into tabs covering branding, invoicing, customer-facing settings, documents, integrations, notifications and payments.",
    image: "/docs/images/09-settings.png",
    imageAlt: "Settings branding and business details",
    subsections: [
      {
        title: "Settings",
        route: "/admin/settings",
        whatItDoes:
          'The settings hub. The main page also shows your profile snapshot ("A quick look at your account" — edit full details from your profile).',
      },
      {
        title: "Branding & business",
        route: "/admin/settings (Branding)",
        whatItDoes:
          "Your daycare logo, customer-portal background, and core business details.",
        howToUse: [
          "Upload your logo and background and keep your business info current — these appear to customers.",
        ],
      },
      {
        title: "Invoicing",
        route: "/admin/settings/billing",
        whatItDoes:
          "Configure invoice numbering, payment terms, manual bank-transfer details, and VAT. The bank block only prints on the PDF when no payment gateway is auto-collecting.",
        howToUse: [
          "Set your prefix, terms, and bank details. Changes apply to invoices generated after saving — existing finalised invoices are unchanged.",
        ],
      },
      {
        title: "Customers",
        route: "/admin/settings/customers",
        whatItDoes: "Customer-facing settings, including:",
        items: [
          {
            label: "Operating Times",
            desc: "Collection and drop-off time windows shown to customers.",
          },
          {
            label: "Owner add-pet form",
            desc: "Terms owners must sign before adding a pet and before booking; use typed text or a PDF (setting one locks the other). Publishing a new version forces owners to re-sign before booking again.",
          },
          {
            label: "Service Settings",
            desc: "The maximum bookings each service can take per day; once a service hits its daily limit, new bookings become waitlist requests for you to approve, and cancellations free space automatically.",
          },
          {
            label: "Vaccination reminders",
            desc: "How far in advance owners and staff are emailed about expiring vaccinations; this also drives the warning icon on /admin/pets and the banner on each pet profile.",
          },
          {
            label: "Membership Billing",
            desc: "When the first membership Direct Debit is collected (renewals afterwards fall on the owner's chosen day).",
          },
        ],
        howToUse: [
          "Work through each block to control what customers see and how bookings, vaccinations, and memberships behave.",
        ],
      },
      {
        title: "Documents",
        route: "/admin/settings/documents",
        whatItDoes: "Stores two kinds of documents:",
        items: [
          {
            label: "Customer-facing documents",
            desc: "Owners can view/download these from their portal (first-aid certificates, public liability cover, packing lists, etc.).",
          },
          {
            label: "Internal documents",
            desc: "Staff-only paperwork (cleaning regimes, emergency plans, vet contracts) never shown to owners.",
          },
        ],
        howToUse: [
          "Upload to the right bucket depending on whether owners should see it.",
        ],
      },
      {
        title: "Integrations",
        route: "/admin/settings/integrations",
        whatItDoes: "Third-party connections for your daycare.",
        howToUse: ["Connect and manage external integrations here."],
      },
      {
        title: "Notifications",
        route: "/admin/settings/notifications",
        whatItDoes:
          "Controls which emails go out, split into Owner emails (to customers) and Staff emails (to your team), by notification type.",
        howToUse: [
          "Toggle the Notification Types you want enabled for each audience.",
        ],
      },
      {
        title: "Payments",
        route: "/admin/settings/payments",
        whatItDoes:
          "Connect a payment provider (Stripe or GoCardless) so invoices, memberships, and Direct Debits run through your own account — your daycare's name and address then appear on every invoice.",
        howToUse: [
          "Connect your provider here first; several Finance features (memberships, Direct Debits, some service actions) stay locked until you do.",
        ],
      },
      {
        title: "Change password",
        route: "/admin/settings (Change Password)",
        whatItDoes: "Update your account password.",
        howToUse: ["You'll need your current password to set a new one."],
      },
    ],
  },
];

/** Lightweight nav list (serialisable for client components). */
export const NAV = SECTIONS.map(({ slug, num, title, tagline }) => ({
  slug,
  num,
  title,
  tagline,
}));

export function getSection(slug: string): DocSection | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}
