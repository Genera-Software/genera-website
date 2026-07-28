-- "Ask Claude" repo analysis for a support ticket.
--
-- The analysis runs as an Anthropic Managed Agents session with the app repo
-- mounted read-only. Sessions take minutes, which is far longer than a Netlify
-- function may run, so the ticket row carries the session id and the result is
-- reconciled the next time an admin views the ticket.

alter table public.support_tickets
  add column if not exists ai_status text not null default 'idle',
  add column if not exists ai_session_id text,
  add column if not exists ai_suggestion text,
  add column if not exists ai_error text,
  add column if not exists ai_requested_at timestamptz,
  add column if not exists ai_completed_at timestamptz;

do $$
begin
  alter table public.support_tickets
    add constraint support_tickets_ai_status_check
    check (ai_status in ('idle', 'running', 'ready', 'failed'));
exception
  when duplicate_object then null;
end $$;

-- Reconciliation looks up a ticket by the session id an Anthropic webhook or a
-- page view hands back.
create unique index if not exists support_tickets_ai_session_idx
  on public.support_tickets (ai_session_id)
  where ai_session_id is not null;

comment on column public.support_tickets.ai_status is
  'idle | running | ready | failed — lifecycle of the Ask Claude repo analysis.';
comment on column public.support_tickets.ai_suggestion is
  'Claude''s diagnosis of this ticket against the app repo. Internal only — never send verbatim to a customer.';
