import type { FeatureKey } from "@/lib/features";
import { PRICING_TIERS, TRIAL_DAYS, TOP_TIER } from "@/lib/pricing";

// One landing page per business type. The homepage stays a broad overview; these
// pages carry the detail for the keyword a daycare owner, walker, groomer or boarder
// actually types, and each opens with a plain paragraph that says what Genera is,
// who it is for and what it costs, so an answer engine has something to lift.
//
// Feature claims come from /features and the live demo account. A vertical only
// lists a feature it genuinely uses: a solo walker is not shown the Dog Bus, a
// groomer is not shown DEFRA capacity. Prices are read from lib/pricing so this
// file cannot drift from the pricing page.

const FROM = PRICING_TIERS.reduce((a, t) => (t.monthlyPrice < a ? t.monthlyPrice : a), Infinity);

/** "£50, £75 and £99 a month" */
export const PRICE_LIST = `${PRICING_TIERS.map((t) => `£${t.monthlyPrice}`).slice(0, -1).join(", ")} and £${TOP_TIER.monthlyPrice} a month`;

export type VerticalBlock = {
  feature: FeatureKey;
  title: string;
  body: string;
  /** Anchor on /features for the long version. */
  more?: string;
};

export type VerticalFaq = { q: string; a: string };

/** A drawn screen from /features (named exports of FeaturesClient) or a homepage showcase. */
export type ShowcaseKey =
  | "bookings"
  | "invoicing"
  | "routes"
  | "daily"
  | "assessments"
  | "team"
  | "capacity"
  | "finance"
  | "records"
  | "ownerApp"
  | "chat";

export type VerticalSpotlight = {
  showcase: ShowcaseKey;
  feature: FeatureKey;
  eyebrow: string;
  plan: "every" | "grow" | "thrive";
  onlyOnGenera?: boolean;
  title: string;
  lead: string;
  bullets: string[];
  /** Screen on the left, copy on the right. Alternate down the page. */
  flip?: boolean;
};

/** The three floating cards in the hero, with this business's numbers on them. */
export type HeroCard = {
  tone: "coral" | "green" | "gold";
  badge: string;
  figure: string;
  title: string;
  body: string;
};

export type Vertical = {
  slug: string;
  /** Who the page is for, in their words. */
  audience: string;
  /** <title>, kept under 60 characters where possible. */
  metaTitle: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  /**
   * The one-paragraph answer to "what is Genera for a X". Stands alone; names the
   * business type, the jobs, the price and the trial.
   */
  definition: string;
  /** The Caveat pill above the h1: "Built by a daycare, for dog walkers". */
  pill: string;
  heroCards: HeroCard[];
  /** The /features-style category header over the spotlights: "Why daycares switch" + one line. */
  categoryDesc: string;
  /** The drawn screens, in selling order. The owner app is always first. Four. */
  spotlights: VerticalSpotlight[];
  /** Everything else, as the card grid under the spotlights. */
  blocks: VerticalBlock[];
  /** Licensing or honesty notes shown between the blocks and the pricing. */
  notes?: { title: string; body: string; href?: string; linkLabel?: string }[];
  faqs: VerticalFaq[];
};

const TRIAL = `Every plan starts with a ${TRIAL_DAYS}-day free trial with everything unlocked and no card.`;
const NO_METER = "There is no charge per dog, per booking or per invoice, and no commission on what your customers pay you.";

export const VERTICALS: Vertical[] = [
  /* ── Dog daycares ─────────────────────────────────────────────
     Search intent: "dog daycare software uk", "daycare booking
     system", "how many dogs can I take". The daycare-only ideas
     are the licensed daily number, the waitlist once a day fills,
     who is in today on one screen, and report cards.
     ──────────────────────────────────────────────────────────── */
  {
    slug: "dog-daycare-software",
    audience: "dog daycares",
    metaTitle: "Dog Daycare Software UK, Built Inside a Licensed Daycare",
    description: `Dog daycare software for UK daycares: online booking, a daily capacity tied to your licensed number with a waitlist once a day fills, one screen showing who is in today, report cards and invoicing by Direct Debit. From £${FROM} a month, ${TRIAL_DAYS} days free.`,
    eyebrow: "For dog daycares",
    h1: "Dog daycare software built inside a licensed daycare",
    lead: "Duncan has run Duncan's Dog Co for 15 years. Genera is the software he built to run it, and the daily cap, the vaccination dates and the invoice run are there because an inspector asked for them.",
    definition: `Genera is UK dog daycare software for online booking, daily capacity and invoicing. Owners request daycare days from an app under your own name and logo, including recurring weekly patterns; every request lands in one approval queue; each service carries a maximum number of bookings per day, so once you reach the number on your licence the day shows as full and further requests arrive as waitlist requests; the daily schedule lists every dog, collection and drop-off for the day; assessments and report cards are scored on a phone with the dog in front of you; and the month's invoices are raised from the days you actually took and collected by Direct Debit through GoCardless or card through Stripe, with Xero kept in step. Plans are ${PRICE_LIST}. ${TRIAL} ${NO_METER}`,
    pill: "Built by a daycare, for dog daycares",
    heroCards: [
      { tone: "coral", badge: "Today", figure: "18", title: "Dogs in. 20 on the licence.", body: "The daily cap holds the number the inspector wrote down." },
      { tone: "green", badge: "Paid", figure: "£1,240", title: "Invoiced from bookings.", body: "Direct Debit collected it. Nobody chased anyone." },
      { tone: "gold", badge: "Full", figure: "2", title: "Waitlisted for Thursday.", body: "The day filled, so two requests wait for you to decide." },
    ],
    categoryDesc:
      "Daily capacity against your licensed number, who is in today on one screen, assessments and report cards, and daycare billing that raises itself.",
    spotlights: [
      {
        showcase: "ownerApp",
        feature: "ownerApp",
        eyebrow: "Owner booking portal",
        plan: "every",
        title: "Owners book their daycare days from your own app.",
        lead: "Your booking portal opens from the owner's home screen with your logo, your name and your colour. They request days, set a regular Monday and Wednesday pattern, keep the dog's details current and pay. Every request still comes back to you to approve.",
        bullets: [
          "Your logo, name and brand colour, set once",
          "Day requests and recurring weekly patterns",
          "No app store, nothing for you to build",
        ],
      },

    ],
    blocks: [
      {
        feature: "compliance",
        title: "A daily cap set to your licensed number",
        body: "Each service carries a maximum number of bookings per day. Once a day hits the limit it shows as full and the next request arrives as a waitlist request for you to approve. Owners are told the date is full, never how close to full you run.",
        more: "capacity",
      },
      {
        feature: "dailySchedule",
        title: "Who is in today, on one screen",
        body: "A single-day summary with stat cards per service, then every dog, owner, collection and drop-off in one list, plus day notes for the team. It is the screen your staff work from all day.",
        more: "daily-schedule",
      },
      {
        feature: "assessments",
        title: "Trial days scored on a phone",
        body: "Templates for first days, temperament, behaviour and health, scored on a phone with the dog in front of you, sent as a branded report card instead of a vague text at pick-up. From Grow.",
        more: "assessments",
      },
      {
        feature: "payments",
        title: "A month of daycare, invoiced in one run",
        body: "Charges come off the days you actually took. Raise every owner's invoice in one go, collect by Direct Debit through GoCardless or card through Stripe, and see who has opened, who has paid and what is owed. Xero kept in step.",
        more: "invoicing",
      },
      {
        feature: "finance",
        title: "Memberships, tiers and a weekend rate",
        body: "Sell a set number of days a month as a membership, price by tier, and charge a different rate on Saturdays and Sundays or on the bank holidays you list. Loyalty discounts sit under the tier price.",
        more: "finance",
      },
      {
        feature: "bookings",
        title: "A heatmap of your busy and quiet days",
        body: "A density view of bookings across the month makes the quiet Fridays obvious, which is what you need before you discount a day or put a member of staff on it.",
        more: "bookings",
      },
      {
        feature: "records",
        title: "Vaccination dates an inspector can see",
        body: "Every dog's vet, vaccination dates, feeding notes and emergency contacts in one profile, with a Vaccinations report of what is due and late notices for the ones that lapse.",
        more: "records",
      },
      {
        feature: "team",
        title: "A rota, even for a team of two",
        body: "Daily and weekly rota with staffed hours, your peak cover and the thinnest hour of the day, plus holiday and sick tracking. In every plan, because a one-person daycare still has to roster itself.",
        more: "team",
      },
      {
        feature: "routes",
        title: "The Dog Bus, if you run one",
        body: "Morning and evening rounds with an optimised stop order, a driver portal with one-tap check-offs and live tracking. On Thrive, and invisible if owners bring their own dogs.",
        more: "routes",
      },
    ],
    notes: [
      {
        title: "Three licence conditions the software carries for you",
        body: "Condition 4.1 puts a number of dogs on your licence; the daily cap holds it. Condition 9.4 wants a completed primary vaccination course two weeks before a first day; the pet record dates it. Condition 25.1 wants each dog's vet on file; the owner keeps it current from their app. The rest of the licence is the building and the people, which no software can do.",
        href: "/guides/dog-daycare-licence-england",
        linkLabel: "Every condition, with the sources",
      },
    ],
    faqs: [
      {
        q: "What is the best dog daycare software in the UK?",
        a: `The honest answer is that it depends on whether you need routing and Direct Debit. Genera is built in England for UK daycares: it bills in pounds, collects by Direct Debit through GoCardless, reconciles to Xero, and ties your daily booking limit to your licensed number. It was built to run Duncan's Dog Co, a licensed daycare in Surrey, and starts at £${FROM} a month with ${TRIAL_DAYS} days free.`,
      },
      {
        q: "Can dog daycare software stop me going over my licensed number of dogs?",
        a: "Yes. Set a maximum number of bookings per day on each service. Once a day reaches that limit it shows as full on every calendar and new requests arrive as waitlist requests for you to approve rather than being confirmed automatically.",
      },
      {
        q: "Does Genera work for a one-person dog daycare?",
        a: `Yes. The Starter plan at £${FROM} a month covers you plus one other login, and bookings, invoicing, pet records, the branded owner app and the rota are all in it. Nothing is priced per dog.`,
      },
      {
        q: "Can owners book daycare days themselves?",
        a: "Yes. Owners request days from a portal under your name and logo, including recurring weekly or fortnightly patterns. You approve each request, or set a service to auto-accept so regulars go straight into the diary.",
      },
      {
        q: "How much does dog daycare software cost?",
        a: `Genera is ${PRICE_LIST}, by plan, with ${TRIAL_DAYS} days free with everything unlocked and no card to start. No setup fee, no contract, no per-booking fee and no commission on what your customers pay you.`,
      },
    ],
  },

  /* ── Dog walkers ──────────────────────────────────────────────
     Search intent: "dog walking software", "dog walker app",
     "recurring bookings", "group walk". Walker-only ideas: a
     schedule that repeats on several weekdays as one row, AM and
     PM walks as separate timeslot bookings, group walk limits.
     ──────────────────────────────────────────────────────────── */
  {
    slug: "dog-walker-software",
    audience: "dog walkers",
    metaTitle: "Dog Walking Software UK for Recurring Walks and Invoicing",
    description: `Dog walking software for UK walkers: recurring walk schedules on any weekdays, separate AM and PM walks, a limit on each group walk, a daily list of who is out and invoices raised from the walks you did. From £${FROM} a month, ${TRIAL_DAYS} days free.`,
    eyebrow: "For dog walkers",
    h1: "Dog walking software that books the regular Tuesday walk once",
    lead: "A walk is a service with its own time, price and group size. Owners book it from an app with your name on it, the regular ones repeat for as long as you like, and the month invoices itself from the walks you actually did.",
    definition: `Genera is UK dog walking software for recurring walks, group size and invoicing. A walk is a service with its own price, timeslot and capacity; a recurring schedule repeats weekly or fortnightly on any combination of weekdays and shows as one row you edit in a single place; because a timeslot service sells times rather than days, a morning walk and an afternoon walk for the same dog are two separate bookings; each group walk carries a cap and closes itself when full; owners request walks and see your price list in an app under your own name and logo; the daily schedule lists who is out today with the day notes; and the month's invoices are raised from the walks you did and collected by Direct Debit through GoCardless or card through Stripe. Plans are ${PRICE_LIST}. ${TRIAL} ${NO_METER}`,
    pill: "Built by a daycare, for dog walkers",
    heroCards: [
      { tone: "coral", badge: "Today", figure: "6", title: "Walks out today.", body: "Grouped by walk, with the dog, the owner and the notes." },
      { tone: "green", badge: "Paid", figure: "£420", title: "Invoiced from walks.", body: "One run at month end, collected by Direct Debit." },
      { tone: "gold", badge: "Repeating", figure: "3", title: "Days, one schedule.", body: "Monday, Wednesday and Friday is a single recurring row, not three bookings." },
    ],
    categoryDesc:
      "Recurring walk schedules, morning and afternoon walks as separate bookings, a cap on every group walk, and who is out today in one list.",
    spotlights: [
      {
        showcase: "ownerApp",
        feature: "ownerApp",
        eyebrow: "Owner booking portal",
        plan: "every",
        title: "Your own app, under your own name.",
        lead: "Owners add your portal to their home screen and it opens with your logo and your colour. They request walks, see the price list you publish, keep the dog's vet and vaccination details current and settle invoices. No app store, nothing to build.",
        bullets: [
          "Your logo, name and brand colour, set once",
          "Walk requests and your published price list",
          "Invoices, card payments and Direct Debit in the Billing tab",
        ],
      },

    ],
    blocks: [
      {
        feature: "bookings",
        title: "Monday, Wednesday and Friday is one schedule",
        body: "A recurring schedule repeats weekly or fortnightly on any combination of weekdays and shows as a single row with a chip per day. Edit or end it once and every day changes. Fortnightly rounds carry their own badge.",
        more: "bookings",
      },
      {
        feature: "compliance",
        title: "Morning and afternoon walks, and a cap per group",
        body: "A timeslot service sells times rather than whole days, so the same dog on the 9am and the 2pm round is two bookings, not a duplicate. Set how many dogs share a walk and the slot closes itself when it is full.",
        more: "capacity",
      },
      {
        feature: "dailySchedule",
        title: "Who is out today, grouped by walk",
        body: "Every walk for the day with the dog, the owner, the access notes and the collection window, and a booking button on the same screen for the owner who texts at seven.",
        more: "daily-schedule",
      },
      {
        feature: "payments",
        title: "Invoices from the walks you did",
        body: "Raise the month in one run off the bookings in the diary, then let Direct Debit through GoCardless or card through Stripe collect. Credits come off the next invoice automatically.",
        more: "invoicing",
      },
      {
        feature: "routes",
        title: "A round in the van, planned once",
        body: "If you collect rather than meet at the door, drag dogs onto a round, optimise the stop order and give each driver a portal with collection times and one-tap check-offs. On Thrive.",
        more: "routes",
      },
      {
        feature: "messages",
        title: "One wet-weather message to everybody",
        body: "Owners message you from their app and you answer from one inbox instead of a personal phone and three WhatsApp threads. Broadcast a cancellation to every owner by push. On Thrive.",
        more: "messages",
      },
      {
        feature: "records",
        title: "Vet, vaccinations and the gate code",
        body: "Pet profiles with photos, vet and vaccination dates, feeding and behaviour notes, plus the access details that matter when you are at the door and the owner is at work.",
        more: "records",
      },
      {
        feature: "team",
        title: "A second pair of hands on the rota",
        body: "Daily and weekly rota, staffed hours, holiday and sick tracking. In every plan; your plan only sets how many people hold a login.",
        more: "team",
      },
    ],
    notes: [
      {
        title: "No licence, so the number is yours to set and show",
        body: "Dog walking is not a licensable activity in England, and the six-dog limit people quote is a condition on a daycare licence, not a law that reaches an independent walker. Some councils cap dogs per person in their parks. Genera lets you put your own cap on each walk and hold to it, which is increasingly what owners ask for before they book.",
        href: "/guides/do-dog-walkers-need-a-licence",
        linkLabel: "Do dog walkers need a licence in England?",
      },
    ],
    faqs: [
      {
        q: "What is the best software for dog walkers in the UK?",
        a: `Genera is built in England and priced from £${FROM} a month with ${TRIAL_DAYS} days free. For a walker the parts that matter are recurring schedules on any combination of weekdays, separate morning and afternoon walks, a cap per group walk, a daily list of who is out and invoicing collected by UK Direct Debit through GoCardless.`,
      },
      {
        q: "Can owners book a regular weekly dog walk?",
        a: "Yes. A recurring schedule repeats weekly or fortnightly on as many weekdays as you like and appears as one row with a chip for each day, so a dog walked Monday, Wednesday and Friday is a single schedule you edit in one place.",
      },
      {
        q: "Can I limit how many dogs are on a group walk?",
        a: "Yes. Give the walk a daily capacity, or run it as a timeslot service and set how many dogs share a slot. When it is full the slot closes and further requests arrive as waitlist requests for you to approve.",
      },
      {
        q: "Does a dog walker need a licence in the UK?",
        a: "Not in England. Dog walking is not one of the licensable activities under the 2018 Regulations and the day care guidance excludes dog walkers by name. The Animal Welfare Act duty of care still applies and some councils cap dogs per person in public parks.",
      },
      {
        q: "Does Genera charge per dog or per walk?",
        a: "No. The monthly plan is the only charge. There is no per-dog, per-walk or per-invoice fee and no commission on what your customers pay you.",
      },
    ],
  },

  /* ── Dog groomers ─────────────────────────────────────────────
     Search intent: "dog grooming software", "grooming appointment
     booking", "salon booking system". Groomer-only ideas: the
     slot grid with one pet per slot, Requires Approval as a
     pending-request queue, editable services, deposits, and the
     Service Provider portal for a second groomer.
     ──────────────────────────────────────────────────────────── */
  {
    slug: "dog-grooming-software",
    audience: "dog groomers",
    metaTitle: "Dog Grooming Software UK with Online Appointment Booking",
    description: `Dog grooming software for UK groomers: an appointment slot grid owners book themselves, one pet per slot, editable services with their own timeslot length and price, pending requests you approve, deposits and card payments. From £${FROM} a month, ${TRIAL_DAYS} days free.`,
    eyebrow: "For dog groomers",
    h1: "Dog grooming software with an appointment diary owners fill themselves",
    lead: "A full groom is a ninety-minute slot, a nail clip is ten. Owners pick from the times you actually have free while your hands are in a coat, and the slot closes behind them.",
    definition: `Genera is UK dog grooming software for online appointment booking, editable services and deposits. Turning on Requires a Timeslot makes a service sell times rather than whole days, so owners pick from a slot grid in an app under your own name and logo and a booked slot greys itself out, because a grooming slot takes one pet; each service holds its own slot length, standard and puppy price, tiered pricing, daily maximum, closed days and visibility, all editable by you; Requires Approval turns a service's bookings into pending requests you approve; deposits are raised as their own request and come off the final invoice automatically; a second groomer can be given a Service Provider portal showing only their own weekly schedule; and payment is by card through Stripe or Direct Debit through GoCardless. Plans are ${PRICE_LIST}. ${TRIAL} ${NO_METER}`,
    pill: "Built by a daycare, for dog groomers",
    heroCards: [
      { tone: "coral", badge: "Today", figure: "5", title: "Appointments booked.", body: "Picked from the slot grid, one dog per slot." },
      { tone: "green", badge: "Paid", figure: "£310", title: "Card, on the day.", body: "Stripe takes it and the invoice marks itself paid." },
      { tone: "gold", badge: "Pending", figure: "2", title: "Waiting on you.", body: "Requests for a service you chose to approve by hand." },
    ],
    categoryDesc:
      "An appointment slot grid with one dog per slot, services you edit yourself, a pending-request queue, deposits, and a portal for a second groomer.",
    spotlights: [
      {
        showcase: "ownerApp",
        feature: "ownerApp",
        eyebrow: "Owner booking portal",
        plan: "every",
        title: "Owners book an appointment while you are mid-groom.",
        lead: "Your portal opens from the owner's home screen with your logo and your colour. They pick a time from the slot grid, see your published price list, upload the dog's details and pay the invoice, without ringing you with clippers in your hand.",
        bullets: [
          "Your logo, name and brand colour, set once",
          "A View prices button and your own price list",
          "Invoices and card payments in the Billing tab",
        ],
      },

    ],
    blocks: [
      {
        feature: "bookings",
        title: "Appointment slots, one dog at a time",
        body: "Turn on Requires a Timeslot and the service sells times instead of whole days. Owners pick from the times you have free, and a booked slot closes because a grooming slot takes one pet. Slot length is set per service, so a full groom and a nail trim are different blocks of your day.",
        more: "bookings",
      },
      {
        feature: "compliance",
        title: "Services you edit, requests you approve",
        body: "Standard and puppy price, tiered pricing, slot length, a daily maximum, closed days and whether customers can see it at all, each editable in a minute. Tick Requires Approval and that service's bookings land as pending requests instead of going straight into your day.",
        more: "capacity",
      },
      {
        feature: "team",
        title: "A portal for a second groomer",
        body: "The Service Provider role gives a groomer, trainer or visiting vet a weekly schedule of only the service they are assigned to, with no access to finance, pay or the rest of the diary. You keep one calendar behind it.",
        more: "team",
      },
      {
        feature: "payments",
        title: "Deposits that come off the final bill",
        body: "Tick deposit request to bill an amount up front rather than sweeping the month's charges. It lands as credit on the owner's account and comes off the next invoice automatically. Card through Stripe, Direct Debit through GoCardless.",
        more: "invoicing",
      },
      {
        feature: "records",
        title: "The coat notes, and the nervous one",
        body: "A profile per dog with photos, breed, vet and vaccination dates and your own notes, tied to the owner record. Whoever is on shift reads what you would have told them.",
        more: "records",
      },
      {
        feature: "dailySchedule",
        title: "Today's appointments on one screen",
        body: "Every groom for the day in order with the owner and the notes beside it, and a booking button for the walk-in who rings at nine.",
        more: "daily-schedule",
      },
      {
        feature: "messages",
        title: "The finished-coat photo, in one thread",
        body: "Owners message you from their app and you answer from one inbox, with read receipts, so the pick-up time and the photo go to the same place. On Thrive.",
        more: "messages",
      },
    ],
    faqs: [
      {
        q: "What is the best dog grooming software in the UK?",
        a: `For a UK groomer the parts that matter are an online appointment slot grid, services you can edit yourself, deposits and card payments in pounds. Genera does all four, was built in England, and starts at £${FROM} a month with ${TRIAL_DAYS} days free and no card to start.`,
      },
      {
        q: "Can clients book grooming appointments online?",
        a: "Yes. Owners open your portal, pick from the grid of times you have free and book. Slots that are taken are greyed out because a grooming slot only takes one pet, and you can set any service to Requires Approval so its bookings arrive as pending requests instead.",
      },
      {
        q: "Can I set different appointment lengths for different grooms?",
        a: "Yes. Each service has its own timeslot length, price, puppy price, daily maximum and closed days, so a full groom can be ninety minutes and a nail trim ten, on the days you choose to offer each.",
      },
      {
        q: "Can I take a deposit for a grooming appointment?",
        a: "Yes. Raise it as a deposit request rather than a normal invoice. When the owner pays it, the amount sits as credit on their account and comes off the final invoice automatically.",
      },
      {
        q: "Do dog groomers need a licence in the UK?",
        a: "No. Grooming is not a licensable activity under the Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018. The Animal Welfare Act duty of care applies to any dog in your care.",
      },
    ],
  },

  /* ── Boarding kennels and hotels ──────────────────────────────
     Search intent: "kennel software", "dog boarding software",
     "kennel management system", "occupancy". Boarding-only ideas:
     the Monthly Summary with dogs on site per night, night-only
     versus daycare-on-top pricing with AM/PM arrival, a note per
     day of a stay, and the forward revenue view.
     ──────────────────────────────────────────────────────────── */
  {
    slug: "dog-boarding-software",
    audience: "boarding kennels and hotels",
    metaTitle: "Dog Boarding and Kennel Software UK with Occupancy Per Night",
    description: `Kennel and dog boarding software for the UK: a month of stays on one page with dogs on site every night, night-only or daycare-on-top pricing with AM and PM arrivals, weekend and bank holiday rates, vaccination tracking and a forward revenue view. From £${FROM} a month.`,
    eyebrow: "For boarding kennels and hotels",
    h1: "Kennel software that counts the dogs on site every night",
    lead: "A stay occupies a fortnight of squares on a calendar and tells you nothing. The monthly summary puts the whole month on one page: every stay, every arrival and departure, and a bar for each night showing how many dogs are in.",
    definition: `Genera is UK kennel and dog boarding software for occupancy, boarding rates and invoicing. The monthly summary puts a month of stays on one page with a bar for every night showing how many dogs are on site, plus total stays, nights booked and the peak night, and each stay listed with its arrival, departure, nights and transport; boarding carries a maximum per night, so a full night turns further requests into waitlist requests; pricing is night-only or daycare-on-top with AM and PM arrivals, and each day is priced on its own date so weekend and bank holiday rates apply automatically; vaccination dates including leptospirosis sit on every pet profile with a report of what is due; and the forecast shows what the next one to twelve months are already worth. Plans are ${PRICE_LIST}. ${TRIAL} ${NO_METER}`,
    pill: "Built by a daycare, for boarding kennels",
    heroCards: [
      { tone: "coral", badge: "Tonight", figure: "7", title: "On site. 8 on the licence.", body: "The nightly cap holds the number the inspector wrote down." },
      { tone: "green", badge: "Booked", figure: "94", title: "Nights this month.", body: "Stays, nights and the peak night, on one page." },
      { tone: "gold", badge: "Peak", figure: "Sat", title: "Full, 8 of 8.", body: "The next Saturday request waits for you to decide." },
    ],
    categoryDesc:
      "A month of boarding on one page, a cap per night, night-only or daycare-on-top pricing with weekend rates, and what the diary is already worth.",
    spotlights: [
      {
        showcase: "ownerApp",
        feature: "ownerApp",
        eyebrow: "Owner booking portal",
        plan: "every",
        title: "Owners request their holiday dates from your own app.",
        lead: "Your portal opens from the owner's home screen with your logo and your colour. They request arrival and departure dates, keep vaccination details current and settle the invoice, and every request comes back to you to approve before it holds a night.",
        bullets: [
          "Your logo, name and brand colour, set once",
          "Stay requests with arrival and departure dates",
          "Invoices, card payments and Direct Debit in the Billing tab",
        ],
      },

    ],
    blocks: [
      {
        feature: "bookings",
        title: "A month of boarding on one page",
        body: "Pick a service and a month: a bar for every night shows how many dogs are on site, with stays, nights booked and the peak night above it, then each stay with its arrival, departure, nights and transport. Stays that cross a month boundary are counted properly.",
        more: "bookings",
      },
      {
        feature: "compliance",
        title: "A cap per night, set to your licence",
        body: "Boarding carries a maximum per day like any other service. Once a night is full the next request arrives as a waitlist request for you to approve, which is what stops a bank holiday weekend quietly going one over.",
        more: "capacity",
      },
      {
        feature: "finance",
        title: "Night-only or daycare on top, priced per date",
        body: "Charge by the night, or add the day charge with an AM or PM arrival so the first and last day price correctly. Each day is priced on its own date, so weekend and bank holiday rates apply by themselves. The forecast then shows what the diary is already worth.",
        more: "finance",
      },
      {
        feature: "records",
        title: "Vaccinations, including leptospirosis",
        body: "The boarding guidance treats leptospirosis as a core vaccine and a licence was refused renewal over it in 2026. Every dog's vet and vaccination dates sit on the profile, the Vaccinations report shows what is due, and late notices catch the ones that lapse.",
        more: "records",
      },
      {
        feature: "dailySchedule",
        title: "A different note for each day of a stay",
        body: "A boarding stay can hold its own note per day, so the medication on Tuesday and the early collection on Friday are on the right day rather than buried in one booking note.",
        more: "daily-schedule",
      },
      {
        feature: "payments",
        title: "Deposits now, the balance at checkout",
        body: "Take a deposit up front as its own request; it becomes credit on the owner's account and comes off the final invoice. Collect the rest by Direct Debit or card, with Xero kept in step.",
        more: "invoicing",
      },
      {
        feature: "messages",
        title: "The holiday photo they are waiting for",
        body: "Owners message you from their app and your whole team answers from one inbox, which matters most when somebody's dog is with you for a fortnight. On Thrive.",
        more: "messages",
      },
      {
        feature: "team",
        title: "Cover for the nights and the bank holidays",
        body: "Daily and weekly rota with staffed hours, your peak cover and the thinnest hour, plus holiday and sick tracking, on every plan.",
        more: "team",
      },
    ],
    notes: [
      {
        title: "Kennels and home boarding are set up the same way",
        body: "Both run as a boarding service with a maximum number of dogs per night, set to the number on your licence. Whether you have a block of runs or spare rooms in the house, the month reads the same on the summary and the cap holds the same way.",
        href: "/guides/dog-daycare-licence-england",
        linkLabel: "The licence conditions, with sources",
      },
    ],
    faqs: [
      {
        q: "What is the best kennel software in the UK?",
        a: `For a boarding kennels the parts that matter are occupancy per night, pricing that handles arrival and departure days, vaccination tracking and UK payments. Genera puts a month of stays on one page with a bar for every night, prices each day on its own date, and starts at £${FROM} a month with ${TRIAL_DAYS} days free.`,
      },
      {
        q: "Can I see how many dogs are booked in on a given night?",
        a: "Yes. The monthly summary shows a bar for every night of the month with the number of dogs on site, along with total stays, nights booked and the peak night, and lists each stay with its arrival, departure and number of nights.",
      },
      {
        q: "How does boarding pricing handle the first and last day?",
        a: "You choose. A night-only rate charges by the night. With the daycare charge switched on, every stay also asks for an AM or PM arrival, so a dog arriving in the morning is charged for that day as well and a late checkout is charged for its last day.",
      },
      {
        q: "Can I charge more at weekends and bank holidays?",
        a: "Yes. A service can carry a weekend rate for Saturdays and Sundays and a bank holiday rate for the dates you list. Because each day is priced on its own date, they apply to everyone, above any tier or loyalty discount.",
      },
      {
        q: "Do I need a licence to board dogs in the UK?",
        a: "In England, yes. Providing boarding for dogs, as kennels, home boarding or day care, is a licensable activity under the 2018 Regulations, and boarding without a licence is an offence under section 13 of the Animal Welfare Act 2006. Wales licenses boarding under the Animal Boarding Establishments Act 1963.",
      },
    ],
  },
];

export const getVertical = (slug: string) => VERTICALS.find((v) => v.slug === slug);
