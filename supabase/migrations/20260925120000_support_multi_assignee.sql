-- Tickets can be worked by more than one admin, and each category can name the
-- staff its new tickets are handed to automatically.

-- 1. Several assignees per ticket ---------------------------------------------
-- Emails, like the single `assigned_to` it replaces (see
-- 20260804140000_support_ticket_assignee.sql for why emails, not ids).

alter table public.support_tickets
  add column if not exists assignees text[] not null default '{}';

update public.support_tickets
   set assignees = array[assigned_to]
 where assigned_to is not null
   and assignees = '{}';

create index if not exists support_tickets_assignees_idx
  on public.support_tickets using gin (assignees);

comment on column public.support_tickets.assignees is
  'Emails of the admins working this ticket (see public.admin_users). Empty = unassigned.';

-- Left in place so a deploy still running the old code keeps working while this
-- rolls out. Nothing writes it any more; drop it in a later migration.
comment on column public.support_tickets.assigned_to is
  'Deprecated — replaced by assignees. No longer written; safe to drop.';

-- 2. Who each category goes to ---------------------------------------------------

create table if not exists public.support_category_assignees (
  category    text not null,
  email       text not null,
  created_at  timestamptz not null default now(),
  primary key (category, email)
);

comment on table public.support_category_assignees is
  'Admins (by email) that new tickets in a category are auto-assigned to. Managed in /admin/support.';

-- Service role only (admin app + ingest APIs).
alter table public.support_category_assignees enable row level security;

-- 3. Auto-assign on insert ------------------------------------------------------
-- Done in the database so every way a ticket arrives — app widget, docs form,
-- inbound email, logged by hand — gets the same treatment. A ticket created
-- with assignees already set keeps them.

create or replace function public.support_tickets_auto_assign()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if coalesce(array_length(new.assignees, 1), 0) = 0 then
    select coalesce(array_agg(a.email order by a.created_at), '{}')
      into new.assignees
      from public.support_category_assignees a
     where a.category = new.category;
  end if;
  return new;
end;
$$;

drop trigger if exists support_tickets_auto_assign on public.support_tickets;
create trigger support_tickets_auto_assign
  before insert on public.support_tickets
  for each row execute function public.support_tickets_auto_assign();
