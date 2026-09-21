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
  blocks: VerticalBlock[];
  /** Licensing or honesty notes shown between the blocks and the pricing. */
  notes?: { title: string; body: string; href?: string; linkLabel?: string }[];
  faqs: VerticalFaq[];
};

const TRIAL = `Every plan starts with a ${TRIAL_DAYS}-day free trial with everything unlocked and no card.`;
const NO_METER = "There is no charge per dog, per booking or per invoice, and no commission on what your customers pay you.";

export const VERTICALS: Vertical[] = [
  {
    slug: "dog-daycare-software",
    audience: "dog daycares",
    metaTitle: "Dog Daycare Software UK, Built Inside a Licensed Daycare",
    description: `UK dog daycare software for bookings, a branded owner app, invoicing by Direct Debit and staying inside your licensed numbers. Built by the owner of a licensed daycare. From £${FROM} a month, ${TRIAL_DAYS}-day free trial.`,
    eyebrow: "For dog daycares",
    h1: "Dog daycare software built inside a licensed daycare",
    lead: "Duncan has run Duncan's Dog Co for 15 years. Genera is the software he built to run it, and the daily cap, the vaccination dates and the invoice run are there because an inspector asked for them.",
    definition: `Genera is UK dog daycare software for taking bookings, invoicing owners and running the day. Owners request days from an app under your own name and logo, every request lands in one queue for you to approve or auto-accept, a daily capacity on each service keeps you inside your licensed numbers, and the month's invoices are raised from the bookings you took and collected by Direct Debit or card. Plans are ${PRICE_LIST}. ${TRIAL} ${NO_METER}`,
    blocks: [
      {
        feature: "bookings",
        title: "One queue instead of your DMs",
        body: "Owners book from their own app with your services, prices and rules built in. Requests land in one approval queue, and nothing is confirmed until you say so unless you have set that service to auto-accept. Recurring bookings go into the diary a year ahead.",
        more: "bookings",
      },
      {
        feature: "compliance",
        title: "A daily cap tied to your licence",
        body: "Set the daily limit for each service. Once a day is full, new requests become waitlist requests for you to decide on, and full days are flagged on every calendar. You never slip over your licensed number by accident.",
        more: "capacity",
      },
      {
        feature: "dailySchedule",
        title: "Who is in today, on one screen",
        body: "Every dog, service, collection and drop-off for the day in one list, with the booking button right there when someone rings. Sleepovers, other services and meet and greets are counted at the top.",
        more: "daily-schedule",
      },
      {
        feature: "payments",
        title: "Invoices raised from the bookings you took",
        body: "Raise the month's invoices for every owner in one run, then let Direct Debit through GoCardless and card payments through Stripe collect. See who has opened, who has paid and what is still owed, with Xero kept in step if that is where your books live.",
        more: "invoicing",
      },
      {
        feature: "records",
        title: "Vaccination dates where an inspector can see them",
        body: "Pet profiles hold each dog's vet and vaccination details, and the Vaccinations report shows what is due. The licence conditions ask for a completed primary course two weeks before a first day; the record of when that was is here, not in a text thread.",
        more: "records",
      },
      {
        feature: "assessments",
        title: "First-day assessments on a phone in the yard",
        body: "Pick a template, rate each question while the dog is in front of you, add photos, and send the owner a branded report card instead of a vague text. Included from the Grow plan.",
        more: "assessments",
      },
      {
        feature: "team",
        title: "A rota, even for a team of two",
        body: "Daily and weekly rota, time off and staff profiles are in every plan. The plan only sets how many people hold a login. A one-person daycare still has to roster itself, so this is never gated.",
        more: "team",
      },
      {
        feature: "routes",
        title: "The Dog Bus, if you run one",
        body: "Most daycares Genera is built for do not collect. If yours does, the Thrive plan adds morning and evening routes, an optimised stop order and a driver portal with one-tap check-offs. Leave it off if you have no van.",
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
        q: "Does Genera work for a one-person dog daycare?",
        a: `Yes. The Starter plan at £${FROM} a month is for you plus one other login, and bookings, invoicing, pet records, the branded owner app and the rota are all in it. Nothing is priced by the number of dogs.`,
      },
      {
        q: "Do I need to do collections to use it?",
        a: "No. Routes and the driver portal are a Thrive plan feature for daycares that run a van. A daycare where owners drop off and pick up never sees them.",
      },
      {
        q: "Does it take payment by Direct Debit?",
        a: "Yes. Direct Debit runs through GoCardless and card payments through Stripe, and owners settle invoices from the Billing tab of their app. Genera takes no share of what your customers pay you.",
      },
      {
        q: "Is Genera UK dog daycare software?",
        a: "Yes. It was built in England to run Duncan's Dog Co, a licensed daycare in Elmbridge, and it bills in pounds, collects by UK Direct Debit and is built around the 2018 licensing conditions.",
      },
      {
        q: "How much does dog daycare software cost?",
        a: `Genera is ${PRICE_LIST}, by plan, with a ${TRIAL_DAYS}-day free trial that unlocks everything and no card to start. There is no setup fee and no contract.`,
      },
    ],
  },
  {
    slug: "dog-walker-software",
    audience: "dog walkers",
    metaTitle: "Dog Walker Software UK for Bookings and Invoicing",
    description: `Dog walking software for solo walkers and small teams: regular walks booked a year ahead, an owner app under your name, invoices raised from the walks you did and collected by Direct Debit. From £${FROM} a month, ${TRIAL_DAYS}-day free trial.`,
    eyebrow: "For dog walkers",
    h1: "Dog walker software that puts the regular Tuesday walk in the diary for good",
    lead: "Walks are services with a price, a time and a daily limit. Owners book them from an app with your name on it, and the month invoices itself from the walks you actually did.",
    definition: `Genera is UK dog walking software for booking walks, invoicing owners and keeping each dog's details in one place. A walk is set up as a service with its price, its timeslot and how many dogs it takes; owners request it from an app under your name and logo; recurring bookings write a regular walk into the diary a year ahead; and the month's invoices are raised from the walks you did and collected by Direct Debit or card. Plans are ${PRICE_LIST}, and a solo walker with one helper is the £${FROM} plan. ${TRIAL} ${NO_METER}`,
    blocks: [
      {
        feature: "bookings",
        title: "Regular walks, booked once",
        body: "A recurring booking puts the Monday and Thursday walk in the diary a year ahead. One-off requests land in one queue for you to approve, or set a walk to auto-accept and never look at it again.",
        more: "bookings",
      },
      {
        feature: "ownerApp",
        title: "Your own app, under your own name",
        body: "Owners add your portal to their home screen and it opens with your logo and your colour. That is where they request walks, keep the dog's vet and vaccination details current and settle invoices. Nothing to build and nothing in an app store.",
        more: "owner-app",
      },
      {
        feature: "compliance",
        title: "A limit on every walk group",
        body: "Give each walk service a daily capacity, whether that is four dogs or six. Once it is full, new requests wait for you to decide. Owners increasingly ask how many dogs you take out at once; this is how you set the number and hold to it.",
        more: "capacity",
      },
      {
        feature: "payments",
        title: "Invoices from the walks you did",
        body: "Raise the month's invoices in one run from the bookings in the diary, then let Direct Debit through GoCardless or card payments through Stripe collect. See who has paid and what is still owed without a spreadsheet.",
        more: "invoicing",
      },
      {
        feature: "dailySchedule",
        title: "Who is out today",
        body: "Every walk for the day in one list, grouped by service, with the dog, the owner and the notes. Add a booking from the same screen when someone texts.",
        more: "daily-schedule",
      },
      {
        feature: "messages",
        title: "Every owner conversation in one inbox",
        body: "Owners message you from their app and you reply from one place instead of a personal phone and three WhatsApp threads. Broadcast a wet-weather cancellation to everyone by push. On the Thrive plan.",
        more: "messages",
      },
    ],
    notes: [
      {
        title: "No licence, so the numbers are yours to set",
        body: "Dog walking is not a licensable activity in England. The six-dog limit people quote is a condition on a daycare licence, not a law that reaches an independent walker, and some councils cap dogs per person in their parks. Genera lets you put your own limit on each walk and show it, which is what owners are starting to ask for.",
        href: "/guides/do-dog-walkers-need-a-licence",
        linkLabel: "Do dog walkers need a licence in England?",
      },
    ],
    faqs: [
      {
        q: "Does a dog walker need a licence in the UK?",
        a: "Not in England. Dog walking is not one of the licensable activities under the 2018 Regulations, and the day care guidance excludes dog walkers by name. The Animal Welfare Act duty of care still applies, and some councils cap dogs per person in public parks.",
      },
      {
        q: "Can owners book a regular weekly walk?",
        a: "Yes. A recurring booking writes the same walk into the diary for as far ahead as you like, and the owner can request changes from their app.",
      },
      {
        q: "Does Genera charge per dog or per walk?",
        a: "No. The plan is the only thing you pay for. There is no per-dog, per-booking or per-invoice fee and no commission on payments.",
      },
      {
        q: "Does Genera collect dogs for the walk?",
        a: "If you drive a round, the Thrive plan adds routes with an optimised stop order and a driver portal. A walker who meets dogs at the door does not need it and never sees it.",
      },
    ],
  },
  {
    slug: "dog-grooming-software",
    audience: "dog groomers",
    metaTitle: "Dog Grooming Software UK with Owner Booking",
    description: `Dog grooming software with a timeslot diary owners fill from your own branded app, deposits and credits, card and Direct Debit payments and each dog's notes and vaccination dates. From £${FROM} a month, ${TRIAL_DAYS}-day free trial.`,
    eyebrow: "For dog groomers",
    h1: "Dog grooming software with a diary owners fill in themselves",
    lead: "A full groom is a sixty-minute slot, a nail clip is five pounds, and both are booked from an app with your name on it while you have your hands in a coat.",
    definition: `Genera is UK dog grooming software for a bookable diary, invoicing and pet records. Each groom is a service with its price and its timeslot length, owners request a slot from an app under your name and logo, requests land in one queue to approve or auto-accept, and invoices are settled by card through Stripe or by Direct Debit through GoCardless with deposits and credits taken off the next bill automatically. Plans are ${PRICE_LIST}, and a solo groomer is the £${FROM} plan. ${TRIAL} ${NO_METER}`,
    blocks: [
      {
        feature: "bookings",
        title: "Timeslot services, not a free-for-all diary",
        body: "Set a full groom at sixty minutes and a nail clip at five, with a daily capacity on each. Owners see what is open and request it. The week and day schedule shows every slot from six in the morning.",
        more: "bookings",
      },
      {
        feature: "ownerApp",
        title: "Owners book while you are mid-groom",
        body: "Your portal opens from the owner's home screen with your logo and your colour. They request a slot, update the dog's details and pay the invoice without ringing you. Every request still comes back to you to approve unless you have set it to auto-accept.",
        more: "owner-app",
      },
      {
        feature: "payments",
        title: "Deposits, credits and card payments",
        body: "Take card payments through Stripe and Direct Debit through GoCardless. Credits and deposits come off the next invoice automatically, and you can see who has opened an invoice and who has paid.",
        more: "invoicing",
      },
      {
        feature: "records",
        title: "Each dog's notes and vaccination dates",
        body: "Pet profiles with photos, vet details, vaccination dates and your own notes on the dog, tied to the owner record. The owner keeps their side current from the app.",
        more: "records",
      },
      {
        feature: "dailySchedule",
        title: "Today's dogs in one list",
        body: "Every groom for the day grouped by service, with the owner and the notes beside it, and a booking button for the walk-in who rings at nine.",
        more: "daily-schedule",
      },
      {
        feature: "messages",
        title: "Photos and pick-up times in one thread",
        body: "Owners message you from their app and you answer from one inbox, with read receipts. Send the finished-coat photo and the pick-up time from the same place. On the Thrive plan.",
        more: "messages",
      },
    ],
    notes: [
      {
        title: "What Genera does not do for groomers",
        body: "There is no breed styling library, no grooming-specific record card and no till. It is a diary owners fill themselves, invoicing that collects itself and a record for each dog. If that is the part of the week you want back, it fits; if you need a full salon system, it is not that.",
      },
    ],
    faqs: [
      {
        q: "Do dog groomers need a licence in the UK?",
        a: "No. Grooming is not a licensable activity under the Animal Welfare (Licensing of Activities Involving Animals) (England) Regulations 2018. The Animal Welfare Act duty of care applies to any dog in your care.",
      },
      {
        q: "Can I set different appointment lengths for different grooms?",
        a: "Yes. Every service has its own timeslot length, price, daily capacity and closed days, so a full groom can be sixty minutes and a nail clip ten.",
      },
      {
        q: "Can owners pay a deposit?",
        a: "Yes. Deposits and credits are recorded against the owner and taken off the next invoice automatically.",
      },
      {
        q: "Is there a per-appointment fee?",
        a: "No. The monthly plan is the only charge. There is no per-booking fee and no commission on card payments beyond what Stripe itself charges you.",
      },
    ],
  },
  {
    slug: "dog-boarding-software",
    audience: "dog boarders and kennels",
    metaTitle: "Dog Boarding Software UK for Kennels and Home Boarders",
    description: `Dog boarding software with a nightly capacity tied to your licence, a monthly summary of stays, nights and peak night, vaccination records including leptospirosis, an owner app and invoicing by Direct Debit. From £${FROM} a month, ${TRIAL_DAYS}-day free trial.`,
    eyebrow: "For boarding kennels and home boarders",
    h1: "Dog boarding software that counts the dogs on site every night",
    lead: "A sleepover is a service with a nightly capacity. The monthly summary shows every stay, every arrival and departure, the peak night, and how close you are to the number on your licence.",
    definition: `Genera is UK dog boarding software for kennels and home boarders that handles overnight bookings, a nightly capacity tied to your licence, vaccination records, invoicing and an owner app. Boarding is set up as a service with tiered pricing and a limit on dogs per night; owners request stays from an app under your name; the monthly summary lists every stay with arrival, departure, nights and transport and shows dogs on site for each night; and invoices are raised from the stays you took and collected by Direct Debit or card. Plans are ${PRICE_LIST}. ${TRIAL} ${NO_METER}`,
    blocks: [
      {
        feature: "compliance",
        title: "A nightly limit tied to your licence",
        body: "Give the boarding service the number of dogs your licence allows per night. Once a night is full, new requests become waitlist requests for you to decide on. The licensed number is never crossed by accident on a bank holiday weekend.",
        more: "capacity",
      },
      {
        feature: "bookings",
        title: "The monthly summary is the boarding screen",
        body: "Stays, nights booked, peak night and arrivals and departures for the month, with a dogs-on-site bar for every night, then each stay with the dog, the owner, arrival, departure, nights, transport and status.",
        more: "bookings",
      },
      {
        feature: "records",
        title: "Vaccination dates, including leptospirosis",
        body: "The boarding guidance treats leptospirosis as a core vaccine, and a licence was refused renewal in 2025 over it. Pet profiles hold each dog's vet and vaccination dates, the Vaccinations report shows what is due, and the owner updates their side from the app.",
        more: "records",
      },
      {
        feature: "ownerApp",
        title: "Owners request stays from your own app",
        body: "Your portal opens from the owner's home screen with your logo and your colour. They request dates, keep the dog's details current and settle the invoice. Every request comes back to you to approve.",
        more: "owner-app",
      },
      {
        feature: "payments",
        title: "Invoices from the stays you took",
        body: "Raise the month's invoices in one run, collect by Direct Debit through GoCardless or card through Stripe, and see who has paid. Deposits come off the final invoice automatically. Xero is kept in step if you use it.",
        more: "invoicing",
      },
      {
        feature: "finance",
        title: "What the diary is worth six months out",
        body: "Boarding is booked further ahead than anything else. The forecast shows what the next one to twelve months are worth from the stays already in the diary, month by month, and where it comes from. From the Grow plan.",
        more: "finance",
      },
    ],
    notes: [
      {
        title: "Kennels, home boarding and what Genera does not allocate",
        body: "Genera counts dogs per night against your licensed number; it does not allocate individual kennels, runs or rooms, and there is no kennel card. Kennel boarding and home boarding are both a boarding service with a nightly cap. If run allocation is the job, it is not the tool.",
        href: "/guides/dog-daycare-licence-england",
        linkLabel: "The licence conditions, with sources",
      },
    ],
    faqs: [
      {
        q: "Do I need a licence to board dogs in the UK?",
        a: "In England, yes. Providing boarding for dogs, as kennels, home boarding or day care, is a licensable activity under the 2018 Regulations, and boarding without a licence is an offence under section 13 of the Animal Welfare Act 2006. Wales licenses boarding under the Animal Boarding Establishments Act 1963.",
      },
      {
        q: "Does Genera work for home boarding?",
        a: "Yes. Home boarding is a boarding service with a nightly capacity, exactly as a kennel is. Set the limit to the number of dogs on your licence.",
      },
      {
        q: "Can I charge different rates for longer stays or more dogs?",
        a: "Yes. Each service carries tiered pricing, so a stay can be priced differently by tier, and a puppy rate can be set separately.",
      },
      {
        q: "Does it show me how many dogs are on site tonight?",
        a: "Yes. The monthly summary has a dogs-on-site bar for every night of the month, with stays, nights booked and the peak night at the top.",
      },
    ],
  },
];

export const getVertical = (slug: string) => VERTICALS.find((v) => v.slug === slug);
