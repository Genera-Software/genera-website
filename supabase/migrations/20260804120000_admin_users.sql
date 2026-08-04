-- The /admin allowlist, moved out of the ADMIN_ALLOWED_EMAILS env var so it can
-- be managed from the CMS itself without a redeploy.
--
-- Membership of this table is what grants access to /admin. A Supabase Auth
-- account on its own is NOT enough — public sign-up would otherwise be a way in.

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  invited_by text,
  created_at timestamptz not null default now(),
  last_invited_at timestamptz,
  -- Stored lowercase so lookups never need to case-fold.
  constraint admin_users_email_lowercase check (email = lower(email)),
  constraint admin_users_email_shape check (position('@' in email) > 1)
);

alter table public.admin_users enable row level security;
-- Intentionally no RLS policies: the table is reachable only through the
-- service-role key on the server, plus the security-definer function below.

-- Answers "is the caller an admin?" for the calling JWT and nothing else. It
-- takes no argument, so it cannot be used to probe whether some other address
-- is an admin, and it never returns the list itself.
create or replace function public.is_current_user_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke execute on function public.is_current_user_admin() from public, anon;
grant execute on function public.is_current_user_admin() to authenticated;
-- The Supabase linter flags this as "signed-in users can execute a SECURITY
-- DEFINER function" (lint 0029). That is the point: the Edge middleware calls it
-- with the user's own session because it must not hold the service-role key.
-- Safe because the function takes no arguments, answers only for the calling
-- JWT, and never returns the list.

-- Seed the existing admin so this migration does not lock the CMS out.
insert into public.admin_users (email, invited_by)
values ('dihan.algama@gmail.com', 'migration')
on conflict (email) do nothing;
