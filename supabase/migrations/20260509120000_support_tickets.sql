-- Support tickets — submitted from app.generasoftware.com via the support widget
-- and triaged in /admin/support.

create extension if not exists "pgcrypto";

create table if not exists public.support_tickets (
  id                 uuid primary key default gen_random_uuid(),
  status             text not null default 'new'
                       check (status in ('new', 'in_progress', 'completed')),
  category           text not null default 'other'
                       check (category in ('technical', 'billing', 'feature_request', 'account', 'other')),
  subject            text not null,
  description        text not null,

  -- account context (sent in payload from app.generasoftware.com)
  account_id         text,
  account_email      text,
  account_name       text,
  account_metadata   jsonb not null default '{}'::jsonb,

  -- diagnostics
  page_url           text,
  app_version        text,
  user_agent         text,
  browser            text,
  os                 text,
  viewport           text,
  console_errors     jsonb not null default '[]'::jsonb,

  -- triage
  source             text not null default 'app',
  internal_notes     text not null default '',
  assigned_to        text,

  -- timestamps
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  resolved_at        timestamptz
);

create index if not exists support_tickets_status_idx
  on public.support_tickets (status);

create index if not exists support_tickets_created_at_idx
  on public.support_tickets (created_at desc);

create index if not exists support_tickets_category_idx
  on public.support_tickets (category);

-- updated_at trigger
create or replace function public.support_tickets_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if new.status = 'completed' and (old.status is distinct from 'completed') then
    new.resolved_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists support_tickets_updated_at on public.support_tickets;
create trigger support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.support_tickets_set_updated_at();

-- RLS — only service role reads/writes; ingest API uses service role.
alter table public.support_tickets enable row level security;
