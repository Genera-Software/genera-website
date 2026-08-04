-- Ticket assignment. `support_tickets.assigned_to` has existed since the table
-- was created but was never written to; this wires it to the admin allowlist.
--
-- It holds the admin's *email* rather than a foreign key to admin_users.id:
-- tickets are historical records, and an email stays readable if the person is
-- later removed. Removing an admin unassigns their open tickets in application
-- code (lib/admin/users.ts), so there is no dangling-work-queue problem either.

create index if not exists support_tickets_assigned_to_idx
  on public.support_tickets (assigned_to)
  where assigned_to is not null;

comment on column public.support_tickets.assigned_to is
  'Email of the admin this ticket is assigned to (see public.admin_users). Null = unassigned.';
