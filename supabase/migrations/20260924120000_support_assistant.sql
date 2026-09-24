-- Support assistant replaces the Managed Agents "Ask Claude" run.
--
-- The assistant is now a short tool-calling loop against any OpenAI-compatible
-- model, advanced one step per request from the ticket page. The transcript is
-- kept on the ticket between steps (and cleared once there is a result), and
-- `ai_steps` is the compare-and-swap counter that stops two tabs interleaving.

alter table public.support_tickets
  add column if not exists ai_messages jsonb not null default '[]'::jsonb,
  add column if not exists ai_steps integer not null default 0;

drop index if exists public.support_tickets_ai_session_idx;
alter table public.support_tickets drop column if exists ai_session_id;

-- Any run left in flight by the old flow can never finish now.
update public.support_tickets
  set ai_status = 'failed',
      ai_error = 'Superseded by the support assistant — run it again.',
      ai_completed_at = now()
  where ai_status = 'running';

comment on column public.support_tickets.ai_status is
  'idle | running | ready | failed — lifecycle of the support assistant run.';
comment on column public.support_tickets.ai_suggestion is
  'The support assistant''s diagnosis and draft reply. Internal — review before sending anything to a customer.';
comment on column public.support_tickets.ai_messages is
  'Working transcript of an in-flight support assistant run; emptied when it finishes.';
