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

/** A captioned screenshot shown inside a subsection (e.g. a step in a flow).
 *  Set `placeholder: true` to render a "screenshot coming soon" box instead of
 *  loading `src` — handy for newly-documented features awaiting a real capture. */
export type DocImage = {
  src: string;
  alt: string;
  caption?: string;
  placeholder?: boolean;
};

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
  /** Captioned step screenshots, shown as a gallery within the subsection. */
  images?: DocImage[];
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
      {
        title: "Adding a booking",
        whatItDoes:
          "The Add booking window is where a booking is created. It has two tabs — Book a pet for an existing customer (a one-off or recurring booking) and Meet & Greet for a pet that isn't a customer yet. You open it (or quick-book) from a pet's Bookings tab — see Pets › Bookings tab & quick-book.",
        items: [
          {
            label: "Book a pet",
            desc: "Create a one-off or recurring booking for a pet already in your system — choose the pet, service, transport, and notes.",
          },
          {
            label: "Meet & Greet",
            desc: "Log an introductory visit for a prospective customer by capturing their date, pet name, address, and owner details.",
          },
        ],
        howToUse: [
          "Choose a pet — search by pet or owner name, or tap one from the Most booked grid. Use Change to switch pets later.",
          "Pick a service from the Service dropdown (daycare, sleepover, and so on). The booking can't be saved until a service is chosen — Add booking stays greyed out with a reminder — and the rate updates to match.",
          "Set transport with the two toggles: collect from home and drop off at home. The collection and drop-off windows come from your Operating Times settings.",
          "Add an optional note for the team, then press Add booking.",
          "To repeat the booking, turn on Recurring: set a Start date, optionally turn on Set an end date, and Genera books the same weekday every week between the two dates (e.g. every Wednesday). Use Override price to charge a one-off rate instead of the service default.",
          "For someone who isn't a customer yet, switch to the Meet & Greet tab and fill in the date, pet name, address (search to auto-fill or enter it manually) and owner name, then press Create meet & greet.",
        ],
        images: [
          {
            src: "/docs/images/01-dashboard-select-booking.png",
            alt: "Choose a pet step showing a search box and a Most booked grid of pet avatars",
            caption:
              "Step 1 — Choose a pet: search by pet or owner, or tap one of your Most booked pets.",
          },
          {
            src: "/docs/images/01-dashboard-add-booking.png",
            alt: "Booking form with a Service dropdown, transport toggles and a notes field",
            caption:
              "Step 2 — Pick a service and set transport. Add booking stays disabled, with a reminder, until a service is chosen.",
          },
          {
            src: "/docs/images/01-dashboard-add-booking-recurring.png",
            alt: "Recurring booking with start date, end date, transport and an override price field",
            caption:
              "Recurring — repeat the booking weekly between a start and end date; the rate and an optional price override sit at the bottom.",
          },
          {
            src: "/docs/images/01-dashboard-meet-greet.png",
            alt: "Meet & Greet form with date, pet name, address search and owner name",
            caption:
              "Meet & Greet — log an intro visit for a not-yet-customer with their date, pet, address and owner.",
          },
        ],
      },
      {
        title: "Search & notifications",
        route: "Top bar (every page)",
        whatItDoes:
          "Two tools sit in the top bar on every admin page: a global search for jumping straight to a pet or owner, and a notification bell that surfaces everything needing your attention.",
        items: [
          {
            label: "Global search",
            desc: "Type a pet or owner name to see grouped Pets and Customers results, then open the record. On the Pets and Owners list pages the same box filters that list instead.",
          },
          {
            label: "Notification bell",
            desc: "Shows recent notifications with an unread badge; each one links to the related record, and approval items take you to the Notification Centre.",
          },
        ],
        howToUse: [
          "Use search to reach a record fast — arrows to move through results, Enter to open, Esc to close.",
          "Open the bell for a quick look, or choose View all to open the full Notification Centre.",
        ],
        images: [
          {
            src: "",
            placeholder: true,
            alt: "Global search dropdown with grouped pet and customer results",
            caption: "Global search — grouped Pets and Customers results from the top bar.",
          },
          {
            src: "",
            placeholder: true,
            alt: "Notification bell dropdown with recent items and an unread badge",
            caption: "The notification bell with its unread badge and recent items.",
          },
        ],
      },
      {
        title: "Notification Centre",
        route: "/admin/notifications",
        whatItDoes:
          "A full inbox of everything happening across your daycare — booking and membership requests, new customers and dogs, direct-debit events, cancellations, time-off and more. It updates live as things happen, separate from the Settings › Notifications preferences that control which alerts you get.",
        items: [
          {
            label: "Filters",
            desc: "All / Unread pills plus a type dropdown (Approvals, Memberships, Bookings, Customers, New dogs, Direct debit, Cancellations, Time-off and others).",
          },
          {
            label: "Inline approvals",
            desc: "Booking and membership requests can be Accepted or Declined right here — accepting a booking raises its charges; declining asks for a reason and emails the customer.",
          },
        ],
        howToUse: [
          "Filter to Unread or a specific type to focus, action approvals inline, and use Mark all as read to clear the count.",
          "Disabled notification types (set in Settings › Notifications) are hidden automatically.",
        ],
        images: [
          {
            src: "",
            placeholder: true,
            alt: "Notification Centre inbox with filter pills, a type dropdown and accept/decline buttons",
            caption: "The Notification Centre — filter, then accept or decline requests inline.",
          },
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
      {
        title: "Bookings tab & quick-book",
        route: "/admin/pets/[petId] (Bookings tab)",
        whatItDoes:
          "A pet's Bookings tab shows a monthly calendar of just that pet's bookings. Each day carries a sun (daycare) and a moon (sleepover) quick-book button, and a + Add Booking button opens the full Add booking window (see Dashboard › Adding a booking).",
        items: [
          {
            label: "Quick-book (sun / moon)",
            desc: "The sun books an instant daycare day and the moon an instant sleepover for this pet — no form needed. Use the Hide Quick-book toggle to hide these icons.",
          },
          {
            label: "+ Add Booking",
            desc: "Opens the full Add booking window for a one-off or recurring booking, or a Meet & Greet — documented under Dashboard › Adding a booking.",
          },
        ],
        howToUse: [
          "Click the sun (daycare) or moon (sleepover) on a day to book it instantly for this pet, with no form.",
          "Use the Hide Quick-book toggle to hide the sun/moon icons when you don't need them.",
          "Press + Add Booking for the full window, where you choose a service, transport, recurring options and notes.",
        ],
        images: [
          {
            src: "/docs/images/04-pets-booking.png",
            alt: "A pet's Bookings tab showing a monthly calendar with sun and moon quick-book icons and an Add Booking button",
            caption:
              "The pet's Bookings tab — sun (daycare) and moon (sleepover) quick-book on each day, a Hide Quick-book toggle, and + Add Booking for the full window.",
          },
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
    tagline: "Staff, rota, holidays & pay",
    intro:
      "The Team area is where you manage your staff — their working rota, time off, roles and pay. Every Team page shares three tabs in the top right: Calendar, Approve Holidays and Manage Staff. The Approve Holidays tab shows a badge when requests are waiting.",
    image: "/docs/images/07-team.png",
    imageAlt: "Team rota calendar showing who is working each day",
    subsections: [
      {
        title: "Team rota (calendar)",
        route: "/admin/team",
        whatItDoes:
          "A monthly calendar showing who is working each day. Each day lists your staff as named chips — a green briefcase for full-time and a purple clock for part-time — alongside any time off (holiday, sick or in-lieu). A small People count sits in each day's corner.",
        items: [
          {
            label: "Today Summary",
            desc: "A strip at the top with today's pet counts (Total, Daycare, Sleepover, Extras, Meet & Greet) plus a chip per driver showing how many pets they're assigned today.",
          },
          {
            label: "Pending entries",
            desc: "Time off still awaiting approval shows with a dashed amber border and a 'pending' label until an admin decides.",
          },
        ],
        howToUse: [
          "Who appears as working comes from each person's working days (the Mon–Sun toggles on their profile) — there are no manual shifts to set.",
          "Use the arrows to change month, or the centre button to jump back to today.",
          "Click a day (desktop) to open a who's-working popup; on mobile, tap a day to reveal the list below the calendar.",
          "Use Add Entry to log time off — see 'Logging time off' below. The legend at the bottom explains every icon.",
        ],
      },
      {
        title: "Logging time off (Add Entry)",
        route: "/admin/team (Add Entry)",
        whatItDoes:
          "The Add Entry button on the rota opens a short form to record time off for a staff member. It only logs time off — it does not create working shifts (those come from working days).",
        howToUse: [
          "Pick the staff member, choose a Type (Holiday, Sick day or Day in lieu), set the start and end dates, and add an optional note.",
          "Save once all fields are set. Holiday requests then appear under Approve Holidays for an admin to accept or decline.",
        ],
      },
      {
        title: "Manage staff",
        route: "/admin/team/manage",
        whatItDoes:
          "A table of everyone on your team. At a glance you see each person's role, working days and leave balances, and you add new staff from here.",
        items: [
          { label: "Name & Email", desc: "The staff member and their login email." },
          {
            label: "Role",
            desc: "Admin, Manager, Staff, Auditor or Driver — this sets what they can see and do (see Staff profile).",
          },
          {
            label: "Working Days",
            desc: "The Mon–Sun chips with their working days highlighted.",
          },
          {
            label: "Holiday Remaining",
            desc: "Their annual holiday allowance minus the holiday days they've booked this year.",
          },
          { label: "Sick Days", desc: "Sick days taken this year." },
          {
            label: "Awaiting Approvals",
            desc: "Flags whether they have time-off requests still pending.",
          },
        ],
        howToUse: [
          "Click any row (or card on mobile) to open that person's full Staff profile.",
          "Use Add Staff to create a new team member — see 'Add new staff' below.",
        ],
        images: [
          {
            src: "/docs/images/07-team-manage.png",
            alt: "Manage Staff table with name, email, role, working days, holiday remaining, sick days and approvals",
            caption:
              "Manage Staff — roles, working days and leave balances for everyone, with Add Staff top right.",
          },
        ],
      },
      {
        title: "Add new staff",
        route: "/admin/team/manage (Add Staff)",
        whatItDoes:
          "Creates a new team member and provisions their account. They receive an email to set their own password, so you never handle it.",
        items: [
          {
            label: "Part-time toggle",
            desc: "Marks whether the person is part-time or full-time.",
          },
          {
            label: "Name, Start Date, Email",
            desc: "Email is required and is their login — it must be a valid address.",
          },
          {
            label: "Address",
            desc: "Search to auto-fill or enter it manually; it's geocoded for routing where possible.",
          },
          {
            label: "Role, Salary, Allowances",
            desc: "Set their role, annual salary, and annual holiday and sick-day allowances. Choosing the Driver role automatically makes them route-assignable.",
          },
        ],
        howToUse: [
          "Fill in the fields, pick a role, set salary and allowances, then save. The new member gets a password-setup email.",
        ],
        images: [
          {
            src: "/docs/images/07-team-add-staff.png",
            alt: "Add New Staff modal with part-time toggle, name, start date, email and address fields",
            caption:
              "Add New Staff — the modal scrolls on to Role, Salary and the holiday and sick-day allowances.",
          },
        ],
      },
      {
        title: "Approve holidays",
        route: "/admin/team/holidays",
        whatItDoes:
          "Where time-off requests (holiday, sick day, day in lieu) are accepted or declined. It has a Pending tab for outstanding requests and a History tab for everything already decided.",
        howToUse: [
          "On Pending, review each request (staff, type, dates, days, who requested it, notes) and press Accept or Decline.",
          "A decided request moves straight to History, recording who approved it and when. Declining can capture a reason.",
          "You can't approve your own request — another admin has to decide it.",
        ],
      },
      {
        title: "Staff profile",
        route: "/admin/team/profile/[id]",
        whatItDoes:
          "One staff member's full record. A sticky side-nav jumps between sections, and each section saves on its own.",
        items: [
          {
            label: "Profile Information",
            desc: "Avatar, name, address, working days, and holiday and sick allowances. The login email is read-only — contact support to change it.",
          },
          {
            label: "Role & Driver Access",
            desc: "Set the role (each is explained inline), a delivery capacity, and the Assign as Driver toggle. Only Admins can edit this. Role sets the default portal at login and what the person can access.",
          },
          {
            label: "Salary",
            desc: "Part-time toggle (reveals monthly hours), monthly pay, hourly rate and max daily pay. Annual pay is shown read-only as monthly × 12, and feeds Finance › Salaries.",
          },
          {
            label: "Holidays / Sickness / Lieu Days",
            desc: "Leave booked against allowance, sick days recorded, and days in lieu earned or taken.",
          },
          { label: "Commission", desc: "Commission records for the staff member." },
          {
            label: "Delete",
            desc: "Permanently remove the staff member (with a name confirmation).",
          },
        ],
        howToUse: [
          "Open a staff member from Manage Staff, then move through the sections to update details, set role and driver eligibility, manage pay, and track leave. Each section's Save enables once you change something.",
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

/** Stable in-page anchor id for a subsection (e.g. "Change password" →
    "change-password"). Used by both the section page and search. */
export function subAnchor(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** One searchable record per subsection, linking to /docs/[slug]#anchor. */
export type SearchEntry = {
  sectionSlug: string;
  sectionTitle: string;
  subTitle: string;
  anchor: string;
  route?: string;
  snippet: string;
  /** Lower-cased blob of every searchable field. */
  haystack: string;
};

export const SEARCH_INDEX: SearchEntry[] = SECTIONS.flatMap((s) =>
  s.subsections.map((sub) => {
    const parts = [
      sub.title,
      sub.route ?? "",
      sub.whatItDoes ?? "",
      ...(sub.howToUse ?? []),
      ...(sub.items ?? []).flatMap((it) => [it.label, it.desc]),
      ...(sub.images ?? []).map((img) => img.caption ?? ""),
      s.title,
      s.tagline,
    ];
    return {
      sectionSlug: s.slug,
      sectionTitle: s.title,
      subTitle: sub.title,
      anchor: subAnchor(sub.title),
      route: sub.route,
      snippet: sub.whatItDoes ?? sub.items?.[0]?.desc ?? s.tagline,
      haystack: parts.join(" · ").toLowerCase(),
    };
  }),
);

/** Ranked search over subsections. Title hits rank above body hits. */
export function searchDocs(query: string, limit = 12): SearchEntry[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const scored: { e: SearchEntry; score: number }[] = [];
  for (const e of SEARCH_INDEX) {
    const inTitle = e.subTitle.toLowerCase().includes(term);
    const inRoute = (e.route ?? "").toLowerCase().includes(term);
    const inBody = e.haystack.includes(term);
    if (!inTitle && !inRoute && !inBody) continue;
    // Lower score sorts first.
    const score = inTitle ? 0 : inRoute ? 1 : 2;
    scored.push({ e, score });
  }
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((s) => s.e);
}
