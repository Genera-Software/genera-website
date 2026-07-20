alter table public.support_ticket_messages
  add column if not exists read_at timestamptz;

-- Backfill: existing messages are considered already seen, so turning this on
-- doesn't light up the badge with historical replies.
update public.support_ticket_messages
  set read_at = created_at
  where read_at is null;

-- Drives the sidebar badge: unread inbound messages only.
create index if not exists support_ticket_messages_unread_idx
  on public.support_ticket_messages (ticket_id)
  where read_at is null and direction = 'inbound';
