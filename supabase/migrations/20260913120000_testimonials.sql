-- Customer testimonials for the landing page, managed at /admin/testimonials.
-- `video_url` takes an Instagram, YouTube or Vimeo link (or a direct video
-- file); when set, the card's photo becomes a play button for a popup.
create table if not exists "public"."testimonials" (
  "id" uuid default gen_random_uuid() not null primary key,
  "quote" text not null,
  "name" text not null,
  "role" text,
  "business" text not null,
  "image_url" text,
  "video_url" text,
  "sort_order" integer default 0 not null,
  "is_visible" boolean default true not null,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz default now() not null
);

create index if not exists "testimonials_visible_order_idx"
  on "public"."testimonials" ("is_visible", "sort_order");

create or replace trigger "testimonials_set_updated_at"
  before update on "public"."testimonials"
  for each row execute function "public"."set_updated_at"();

alter table "public"."testimonials" enable row level security;

create policy "testimonials_public_read" on "public"."testimonials"
  for select to "authenticated", "anon" using ("is_visible" = true);

grant select on table "public"."testimonials" to "anon", "authenticated";
grant all on table "public"."testimonials" to "service_role";

-- The first testimonial, previously hard-coded in lib/testimonials.ts.
insert into "public"."testimonials" ("quote", "name", "business", "image_url", "video_url", "sort_order")
select
  'This is stopping us sitting tearing our hair out for hours on end… at 3:00 in the morning doing invoices… The less time that I spend crying behind my laptop and the more time I spend in the field…',
  'Ceara',
  'The Big Bowowski',
  '/images/testimonials/ceara-big-bowowski.jpg',
  'https://www.instagram.com/reels/DbiGBXBjLzL/',
  10
where not exists (select 1 from "public"."testimonials");
