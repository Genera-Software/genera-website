/* The /contact form's options, shared by the page and /api/contact so the
   two can't disagree about what's a valid topic or size. */

export const CONTACT_TOPIC_KEYS = ["questions", "pricing", "switching", "account", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPIC_KEYS)[number];

export const CONTACT_TOPICS: Array<{
  key: ContactTopic;
  label: string;
  hint: string;
  placeholder: string;
}> = [
  {
    key: "questions",
    label: "Questions about Genera",
    hint: "What it does, and whether it fits the way you work.",
    placeholder: "Tell us a little about your setting and what you'd like to know…",
  },
  {
    key: "pricing",
    label: "Pricing & plans",
    hint: "Which plan suits the size of your setting.",
    placeholder: "Roughly how many dogs a day, how many staff, and which features matter most…",
  },
  {
    key: "switching",
    label: "Switching to Genera",
    hint: "Moving your owners, pets and bookings across.",
    placeholder: "What you use today, roughly how many owners and pets, and when you'd like to move…",
  },
  {
    key: "account",
    label: "Help with my account",
    hint: "You already use Genera and need a hand.",
    placeholder: "What's happening, and which daycare account it's on…",
  },
  {
    key: "other",
    label: "Something else",
    hint: "Partnerships, press, or just saying hello.",
    placeholder: "What's on your mind?",
  },
];

export const DOGS_PER_DAY = ["Under 10", "10–25", "25–50", "50+"] as const;

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 3000;
