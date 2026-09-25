import "server-only";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { assigneeName } from "./assignee";
import { ticketRef } from "./ref";

/** The ticket fields the list page already has loaded. */
export type SearchableTicket = {
  id: string;
  subject: string;
  account_email: string | null;
  account_name: string | null;
  created_by: string | null;
  assignees: string[];
};

/** Words, with "quoted phrases" kept whole. A leading # is dropped so "#FAE38383" finds a ref. */
export function parseSearchTerms(q: string): string[] {
  const terms: string[] = [];
  for (const m of q.matchAll(/"([^"]+)"|(\S+)/g)) {
    const term = (m[1] ?? m[2]).trim().replace(/^#/, "").toLowerCase();
    if (term) terms.push(term);
  }
  return terms.slice(0, 6);
}

function likePattern(term: string) {
  return `%${term.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

/**
 * Ids of tickets matching every term. A term matches a ticket when it appears in
 * the ref, subject, customer, assignees or creator (checked in memory, since the
 * page has those loaded), or in the description or any message in the thread
 * (checked in the database, since those are too large to load for the list).
 */
export async function searchTicketIds(
  q: string,
  tickets: SearchableTicket[],
): Promise<Set<string>> {
  const terms = parseSearchTerms(q);
  if (!terms.length) return new Set(tickets.map((t) => t.id));

  const haystacks = new Map(
    tickets.map((t) => [
      t.id,
      [
        ticketRef(t.id),
        t.subject,
        t.account_email,
        t.account_name,
        t.created_by,
        ...t.assignees,
        ...t.assignees.map(assigneeName),
      ]
        .filter(Boolean)
        .join("\n")
        .toLowerCase(),
    ]),
  );

  const supabase = getAdminSupabase();
  const perTerm = await Promise.all(
    terms.map(async (term) => {
      const pattern = likePattern(term);
      const [{ data: byDescription }, { data: byMessage }] = await Promise.all([
        supabase.from("support_tickets").select("id").ilike("description", pattern),
        supabase
          .from("support_ticket_messages")
          .select("ticket_id")
          .ilike("body", pattern),
      ]);
      const ids = new Set<string>();
      for (const [id, text] of haystacks) if (text.includes(term)) ids.add(id);
      for (const r of byDescription ?? []) ids.add(r.id);
      for (const r of byMessage ?? []) ids.add(r.ticket_id);
      return ids;
    }),
  );

  const [first, ...rest] = perTerm;
  return new Set([...first].filter((id) => rest.every((s) => s.has(id))));
}
