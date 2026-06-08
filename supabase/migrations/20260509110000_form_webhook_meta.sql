-- Add a configurable hidden key/value sent with every webhook payload.
-- Stored as JSONB so we can extend to multiple pairs later without another
-- migration. Merged into the webhook body's `data` object at submit time.

alter table public.forms
  add column if not exists webhook_meta jsonb not null default '{}'::jsonb;
