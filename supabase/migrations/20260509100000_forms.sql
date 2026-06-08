-- Forms, questions, submissions
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- forms
-- ---------------------------------------------------------------------------
create table if not exists public.forms (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  description     text not null default '',
  success_title   text not null default 'Got it — thanks!',
  success_message text not null default 'We''ll be in touch within one working day.',
  webhook_url     text,
  webhook_secret  text,
  notify_email    text,
  email_subject   text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- form_questions
-- ---------------------------------------------------------------------------
create table if not exists public.form_questions (
  id           uuid primary key default gen_random_uuid(),
  form_id      uuid not null references public.forms(id) on delete cascade,
  sort_order   integer not null default 0,
  key          text not null,
  eyebrow      text not null default '',
  label        text not null,
  hint         text not null default '',
  type         text not null default 'text',
  placeholder  text not null default '',
  choices      jsonb not null default '[]'::jsonb,
  is_optional  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint form_questions_type_chk
    check (type in ('text','email','textarea','choice')),
  constraint form_questions_form_key_uniq unique (form_id, key)
);

create index if not exists form_questions_form_id_sort_idx
  on public.form_questions (form_id, sort_order);

-- ---------------------------------------------------------------------------
-- form_submissions
-- ---------------------------------------------------------------------------
create table if not exists public.form_submissions (
  id                    uuid primary key default gen_random_uuid(),
  form_id               uuid not null references public.forms(id) on delete cascade,
  payload               jsonb not null default '{}'::jsonb,
  webhook_status        text not null default 'pending',
  webhook_status_code   integer,
  webhook_response      text,
  webhook_attempted_at  timestamptz,
  email_status          text not null default 'skipped',
  email_response        text,
  ip_address            text,
  user_agent            text,
  created_at            timestamptz not null default now(),
  constraint form_submissions_webhook_status_chk
    check (webhook_status in ('pending','sent','failed','skipped')),
  constraint form_submissions_email_status_chk
    check (email_status in ('pending','sent','failed','skipped'))
);

create index if not exists form_submissions_form_id_created_idx
  on public.form_submissions (form_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_forms_updated_at on public.forms;
create trigger trg_forms_updated_at
  before update on public.forms
  for each row execute function public.set_updated_at();

drop trigger if exists trg_form_questions_updated_at on public.form_questions;
create trigger trg_form_questions_updated_at
  before update on public.form_questions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — only the service role (admin client) and anon submit endpoint touch
-- these tables; keep RLS on with no public read/write policies.
-- ---------------------------------------------------------------------------
alter table public.forms            enable row level security;
alter table public.form_questions   enable row level security;
alter table public.form_submissions enable row level security;

-- ---------------------------------------------------------------------------
-- Seed: book-demo (mirrors the original modal)
-- ---------------------------------------------------------------------------
insert into public.forms (slug, name, description, success_title, success_message, notify_email, email_subject)
values (
  'book-demo',
  'Book a Demo',
  'Default lead-capture flow shown by the BookDemoButton.',
  'Got it — thanks!',
  'We''ll be in touch within one working day to lock in your walkthrough. In the meantime, you can poke around the rest of the site.',
  null,
  'New demo request'
)
on conflict (slug) do nothing;

with f as (select id from public.forms where slug = 'book-demo')
insert into public.form_questions
  (form_id, sort_order, key, eyebrow, label, hint, type, placeholder, choices, is_optional)
select
  f.id, 10, 'name',
  '1 → First things first',
  'What''s your name?', '',
  'text', 'Type your name here…', '[]'::jsonb, false
from f
union all select f.id, 20, 'email',
  '2 → How do we reach you?',
  'What''s your email?',
  'We''ll send the demo invite here.',
  'email', 'name@daycare.com', '[]'::jsonb, false from f
union all select f.id, 30, 'daycareName',
  '3 → Tell us about your business',
  'What''s your daycare called?', '',
  'text', 'e.g. Duncan''s Dog Co', '[]'::jsonb, false from f
union all select f.id, 40, 'daycareSize',
  '4 → Roughly how many pups?',
  'How many dogs do you handle a day?',
  'Pick the closest range — we won''t hold you to it.',
  'choice', '',
  '["1–10","11–25","26–50","51–100","100+"]'::jsonb,
  false from f
union all select f.id, 50, 'currentSoftware',
  '5 → What are you using today?',
  'What software (if any) are you using right now?',
  'Spreadsheets and post-it notes count.',
  'text', 'e.g. Gingr, paper, nothing yet…', '[]'::jsonb, true from f
union all select f.id, 60, 'bestTime',
  '6 → Almost done',
  'When''s a good time for a 20-minute walkthrough?',
  'Tell us a day, time, and timezone — we''ll work around it.',
  'textarea', 'e.g. Tuesday or Thursday afternoon, UK time', '[]'::jsonb, false from f
on conflict (form_id, key) do nothing;
