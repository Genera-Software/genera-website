alter table public.support_tickets
  add column if not exists priority text not null default 'medium';

-- Guard against anything outside the four levels the admin UI understands.
alter table public.support_tickets
  drop constraint if exists support_tickets_priority_check;
alter table public.support_tickets
  add constraint support_tickets_priority_check
  check (priority in ('low', 'medium', 'high', 'urgent'));

-- The board and list views group/filter by priority.
create index if not exists support_tickets_priority_idx
  on public.support_tickets (priority);
