-- Content Command Centre state store. The dashboard itself is a single-file
-- client app (served password-gated at /command-centre) that used to keep
-- all state in localStorage only. This table lets it sync across devices:
-- one row per workspace, whole-state JSON blob, last write wins. Only the
-- service role reads/writes, gated by the app's own session cookie, see
-- lib/command-centre/session.ts and app/api/command-centre/state/route.ts.

create table if not exists public.command_centre_state (
  id          text primary key default 'default',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.command_centre_state enable row level security;
