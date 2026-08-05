import type { SearchEntry } from "@/app/docs/_data/sections";

/**
 * Docs matching for free-text support questions.
 *
 * Deliberately separate from `rankSearch` in app/docs/_data/sections.ts: that
 * one requires the whole query to appear as a substring, which is right for a
 * search box ("booking") and useless for a ticket body ("I can't work out how
 * to add a second dog to a customer"). This scores per-token instead, so a
 * sentence still finds the page.
 *
 * Pure and dependency-free so it can be unit-tested and run on either side.
 */

/** Words that carry no signal in a support question. */
const STOPWORDS = new Set([
  "a", "about", "after", "again", "all", "also", "am", "an", "and", "any",
  "are", "arent", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "cannot", "cant", "could",
  "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down",
  "during", "each", "every", "few", "for", "from", "further", "get", "getting", "had",
  "has", "have", "having", "he", "her", "here", "hers", "him", "his", "how",
  "i", "if", "im", "in", "into", "is", "isnt", "it", "its", "ive", "just",
  "keep", "let", "like", "me", "more", "most", "my", "need", "no", "nor",
  "not", "of", "off", "on", "once", "only", "or", "other", "our", "out",
  "over", "own", "please", "same", "she", "should", "so", "some", "still",
  "such", "than", "that", "the", "their", "them", "then", "there", "these",
  "they", "this", "those", "through", "to", "too", "try", "trying", "under",
  "until", "up", "us", "use", "using", "very", "want", "was", "wasnt", "way",
  "we", "were", "what", "when", "where", "which", "while", "who", "why",
  "will", "with", "wont", "would", "you", "your", "yours",
  // Support-desk noise: present in almost every ticket, so they discriminate
  // nothing and would otherwise drag in unrelated pages.
  "able", "ask", "broken", "bug", "error", "help", "issue", "problem",
  "question", "support", "ticket", "wrong", "hi", "hello", "thanks", "team",
]);

/**
 * Domain vocabulary. Customers write "dog" and "customer"; the docs say "pet"
 * and "owner". Each key expands to extra tokens that also count as a match.
 */
const SYNONYMS: Record<string, string[]> = {
  dog: ["pet"],
  dogs: ["pet"],
  puppy: ["pet"],
  cat: ["pet"],
  animal: ["pet"],
  customer: ["owner"],
  customers: ["owner"],
  client: ["owner"],
  clients: ["owner"],
  invoice: ["finance", "billing"],
  invoices: ["finance", "billing"],
  bill: ["finance", "billing", "invoice"],
  billing: ["finance", "invoice"],
  payment: ["finance", "charges", "invoice"],
  payments: ["finance", "charges", "invoice"],
  refund: ["finance", "charges"],
  charge: ["finance", "charges"],
  debit: ["finance", "direct debits"],
  subscription: ["membership", "plans"],
  staff: ["team"],
  employee: ["team"],
  employees: ["team"],
  worker: ["team"],
  rota: ["team", "schedule"],
  shift: ["team", "schedule"],
  calendar: ["dashboard", "schedule"],
  diary: ["dashboard", "calendar"],
  driver: ["routes"],
  pickup: ["routes"],
  dropoff: ["routes"],
  van: ["routes"],
  transport: ["routes"],
  booking: ["bookings"],
  daycare: ["bookings", "finance"],
  boarding: ["bookings"],
  password: ["settings", "account"],
  login: ["settings", "account"],
  notification: ["notifications"],
  report: ["reports"],
  export: ["reports"],
};

/** Crude singulariser — enough to make "bookings" match "booking". */
function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

/** Split free text into meaningful, de-duplicated search tokens. */
export function tokenise(text: string): string[] {
  const raw = text
    .toLowerCase()
    .replace(/['']/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  const out = new Set<string>();
  for (const word of raw) {
    if (word.length < 3 || STOPWORDS.has(word)) continue;
    out.add(word);
    const stemmed = stem(word);
    if (stemmed !== word && stemmed.length >= 3) out.add(stemmed);
    for (const extra of SYNONYMS[word] ?? []) out.add(extra);
  }
  return [...out];
}

export type DocSuggestion = {
  title: string;
  section: string;
  /** Path on this site, e.g. "/docs/bookings#adding-a-booking". */
  href: string;
  snippet: string;
  score: number;
};

/**
 * Sections that are searchable at /docs but make poor deflection targets.
 *
 * "What's New" is a changelog: it name-checks every feature in the product, so
 * it out-matches the actual how-to page for almost any question, and then
 * answers none of them. Excluding it is the single biggest quality win here.
 */
const EXCLUDED_SECTIONS = new Set(["whats-new"]);

// Where a token hit counts for most. A word in the page title is a far better
// signal than the same word buried in a how-to step.
const WEIGHT_TITLE = 6;
const WEIGHT_SECTION = 2;
const WEIGHT_ROUTE = 3;
const WEIGHT_BODY = 1;

type PreparedEntry = {
  entry: SearchEntry;
  title: Set<string>;
  section: Set<string>;
  route: Set<string>;
  body: Set<string>;
};

/** Split indexed text into whole words plus their stems. */
function wordSet(text: string): Set<string> {
  const out = new Set<string>();
  for (const word of text.toLowerCase().replace(/['']/g, "").split(/[^a-z0-9]+/)) {
    if (!word) continue;
    out.add(word);
    const stemmed = stem(word);
    if (stemmed !== word) out.add(stemmed);
  }
  return out;
}

/**
 * Matching is on whole words, not substrings — otherwise "words" matches inside
 * "password" and a page of gibberish gets a confident suggestion. Stems are
 * added on both sides so "bookings" still finds "booking".
 */
function prepare(index: SearchEntry[]): PreparedEntry[] {
  return index.map((entry) => ({
    entry,
    title: wordSet(entry.subTitle),
    section: wordSet(entry.sectionTitle),
    route: wordSet(entry.route ?? ""),
    body: wordSet(entry.haystack),
  }));
}

// Preparing the index costs a pass over every page, so keep it per index array.
// Callers hand us the same cached array on every request.
const preparedCache = new WeakMap<SearchEntry[], PreparedEntry[]>();

function getPrepared(index: SearchEntry[]): PreparedEntry[] {
  let prepared = preparedCache.get(index);
  if (!prepared) {
    prepared = prepare(index);
    preparedCache.set(index, prepared);
  }
  return prepared;
}

/** Multi-word synonyms ("direct debits") can't be a single set member. */
function hasToken(set: Set<string>, token: string, raw: string): boolean {
  if (!token.includes(" ")) return set.has(token);
  return raw.includes(token);
}

/**
 * Inverse document frequency, so rare words outrank common ones.
 *
 * Without this, "recurring booking" scores "Bookings" and "Recurring" almost
 * equally — "booking" appears on nearly every page, so it says little, while
 * "recurring" appears on one and says everything. Weighting by rarity puts the
 * specific page first.
 */
function buildIdf(
  prepared: PreparedEntry[],
  tokens: string[],
): Map<string, number> {
  const idf = new Map<string, number>();
  const total = prepared.length || 1;
  for (const token of tokens) {
    let df = 0;
    for (const p of prepared) {
      if (
        hasToken(p.title, token, p.entry.subTitle.toLowerCase()) ||
        hasToken(p.body, token, p.entry.haystack)
      ) {
        df++;
      }
    }
    // +1 keeps a token that matches everything at a small positive weight
    // rather than zero — it still counts, just barely.
    idf.set(token, Math.log(total / (1 + df)) + 0.5);
  }
  return idf;
}

/**
 * Rank docs pages against a free-text question.
 *
 * `minScore` exists so a vague question surfaces nothing rather than three
 * irrelevant pages — a bad suggestion is worse than none, because it trains
 * people to ignore the panel.
 */
export function suggestDocs(
  index: SearchEntry[],
  text: string,
  { limit = 3, minScore = 20 }: { limit?: number; minScore?: number } = {},
): DocSuggestion[] {
  const tokens = tokenise(text);
  if (tokens.length === 0) return [];

  const phrase = text.trim().toLowerCase();
  const prepared = getPrepared(index);
  const idf = buildIdf(prepared, tokens);
  const scored: DocSuggestion[] = [];

  for (const p of prepared) {
    const entry = p.entry;
    if (EXCLUDED_SECTIONS.has(entry.sectionSlug)) continue;

    const titleRaw = entry.subTitle.toLowerCase();
    const sectionRaw = entry.sectionTitle.toLowerCase();
    const routeRaw = (entry.route ?? "").toLowerCase();

    let score = 0;
    let matched = 0;

    for (const token of tokens) {
      let best = 0;
      if (hasToken(p.title, token, titleRaw)) best = WEIGHT_TITLE;
      else if (hasToken(p.route, token, routeRaw)) best = WEIGHT_ROUTE;
      else if (hasToken(p.section, token, sectionRaw)) best = WEIGHT_SECTION;
      else if (hasToken(p.body, token, entry.haystack)) best = WEIGHT_BODY;
      if (best > 0) {
        score += best * (idf.get(token) ?? 1);
        matched++;
      }
    }

    if (matched === 0) continue;

    // Covering more of what they asked beats hammering one word.
    score += matched * 2;

    // A verbatim phrase match is about as strong a signal as we get.
    if (phrase.length > 6 && entry.haystack.includes(phrase)) score += 12;

    if (score >= minScore) {
      scored.push({
        title: entry.subTitle,
        section: entry.sectionTitle,
        href: `/docs/${entry.sectionSlug}#${entry.anchor}`,
        snippet: entry.snippet,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  // One page per section: three hits from "Bookings" read as one answer, and
  // spreading the picks gives a better chance of covering the real question.
  const seenSections = new Set<string>();
  const spread: DocSuggestion[] = [];
  const overflow: DocSuggestion[] = [];
  for (const hit of scored) {
    if (seenSections.has(hit.section)) overflow.push(hit);
    else {
      seenSections.add(hit.section);
      spread.push(hit);
    }
  }

  // Diversity decides *which* pages make the cut; score decides the order they
  // are shown in, so the strongest answer is always at the top.
  return [...spread, ...overflow]
    .slice(0, limit)
    .sort((a, b) => b.score - a.score);
}
