-- Badge impressions — minimal, cookie-free tracking for the "Powered by Genera"
-- / "Book with Genera" badges customers embed on their own sites. Each load of
-- /api/badge/<id>.png records the badge and the embedding site's host. No IPs,
-- no user agents, no cookies. Surfaced in /admin/badges.

create extension if not exists "pgcrypto";

create table if not exists public.badge_events (
  id            uuid primary key default gen_random_uuid(),
  badge_id      text not null,
  kind          text not null default 'powered'
                  check (kind in ('powered', 'book')),
  shape         text check (shape in ('pill', 'card', 'stamp')),
  referer_host  text,
  created_at    timestamptz not null default now()
);

create index if not exists badge_events_created_at_idx
  on public.badge_events (created_at desc);

create index if not exists badge_events_referer_host_idx
  on public.badge_events (referer_host);

create index if not exists badge_events_badge_id_idx
  on public.badge_events (badge_id);

-- RLS — only the service role reads/writes; the image API uses service role.
alter table public.badge_events enable row level security;
