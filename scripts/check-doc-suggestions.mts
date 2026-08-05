/**
 * Regression check for docs suggestions in the support widget.
 *
 *   npm run check:suggestions
 *
 * The scoring in lib/support/suggest.ts is empirical — weights, the IDF term
 * and `minScore` were tuned against these cases. Re-run it after editing the
 * scoring, the synonym list, or the Help Centre content: real questions should
 * find the right page, and vague ones should return nothing at all, because a
 * wrong suggestion teaches people to ignore the panel.
 *
 * Runs against the code-defined SECTIONS, not the CMS, so it is deterministic.
 */

import { SEARCH_INDEX } from "../app/docs/_data/sections";
import { suggestDocs } from "../lib/support/suggest";

// Realistic ticket bodies a Genera customer might write.
const CASES: Array<{ q: string; expect?: string; expectTitle?: string }> = [
  { q: "How do I add a new booking for a dog that's already on the system?", expectTitle: "Adding a booking" },
  { q: "I can't work out how to raise an invoice for a customer", expect: "Finance" },
  { q: "The calendar isn't showing today's arrivals properly", expect: "Dashboard" },
  { q: "Where do I set up a direct debit for a client?", expect: "Finance" },
  { q: "How do I add a new staff member to the rota?", expect: "Team" },
  { q: "I need to change the pickup order for the van run tomorrow", expect: "Routes" },
  { q: "How can I export a report of last month's revenue?", expect: "Reports" },
  { q: "Trying to add vaccination records to a pet profile", expect: "Pets" },
  { q: "How do I set up a recurring booking every Tuesday?", expectTitle: "Recurring" },
  { q: "Where can I update the owner's phone number?", expect: "Owners" },
  // Should stay quiet — nothing in the docs answers these.
  { q: "Your website is down and I cannot log in at all", expect: undefined },
  { q: "asdf asdf asdf", expect: undefined },
  { q: "I would like to request a refund on my subscription please", expect: "Finance" },
];

let pass = 0;
let fail = 0;

for (const { q, expect, expectTitle } of CASES) {
  const hits = suggestDocs(SEARCH_INDEX, q);
  const sections = hits.map((h) => h.section);
  const titles = hits.map((h) => h.title);
  const ok = expectTitle
    ? titles.includes(expectTitle)
    : expect
      ? sections.includes(expect)
      : hits.length === 0;
  if (ok) pass++;
  else fail++;
  console.log(
    `${ok ? "✓" : "✗"} "${q.slice(0, 58)}${q.length > 58 ? "…" : ""}"`,
  );
  console.log(
    `    want: ${expectTitle ?? expect ?? "(no suggestions)"}  got: ${
      hits.length
        ? hits.map((h) => `${h.section}/${h.title} [${h.score}]`).join(", ")
        : "(none)"
    }`,
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
