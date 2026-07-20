create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound')),
  author_name text,
  from_email text,
  to_email text,
  subject text,
  body text not null default '',
  body_html text,
  attachments jsonb not null default '[]'::jsonb,
  provider_message_id text,
  delivery_status text not null default 'sent' check (delivery_status in ('sent', 'failed', 'received')),
  delivery_error text,
  created_at timestamptz not null default now()
);

create index if not exists support_ticket_messages_ticket_idx
  on public.support_ticket_messages (ticket_id, created_at);

create unique index if not exists support_ticket_messages_provider_id_idx
  on public.support_ticket_messages (provider_message_id)
  where provider_message_id is not null;

alter table public.support_ticket_messages enable row level security;

comment on table public.support_ticket_messages is
  'Email conversation thread for a support ticket. Outbound = admin reply sent via Postmark; inbound = customer reply received via Postmark inbound webhook.';
