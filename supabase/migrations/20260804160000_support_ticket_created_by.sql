-- Manually-logged tickets (source = 'manual') come in through the "+ New ticket"
-- modal on /admin/support, not from a real browser session, so they have no
-- account details and no page URL. Until now that left them indistinguishable
-- from a widget submission with missing data.
--
-- `created_by` records which admin logged the ticket. It holds the admin's
-- *email* rather than a foreign key to admin_users.id, matching `assigned_to`:
-- tickets are historical records and an email stays readable after someone is
-- removed from the allowlist.
--
-- Deliberately separate from `account_email`, which is the *customer's* address
-- and drives the reply-to on the ticket detail page. Putting the admin there
-- would send replies back to ourselves.

alter table public.support_tickets
  add column if not exists created_by text;

comment on column public.support_tickets.created_by is
  'Email of the admin who logged this ticket manually (see public.admin_users). Null for widget/docs submissions.';
