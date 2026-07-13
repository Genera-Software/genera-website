-- Notification recipients for new support tickets (managed in /admin/support).

create table if not exists public.support_notify_emails (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  label       text not null default '',
  created_at  timestamptz not null default now(),
  constraint support_notify_emails_email_format
    check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint support_notify_emails_email_unique
    unique (email)
);

create index if not exists support_notify_emails_created_at_idx
  on public.support_notify_emails (created_at desc);

-- Service role only (admin app + ingest APIs).
alter table public.support_notify_emails enable row level security;
