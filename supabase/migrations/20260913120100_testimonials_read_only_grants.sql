-- Supabase's default privileges grant anon/authenticated every privilege on
-- new public tables. RLS already blocks writes (only a read policy exists),
-- but keep the grants read-only too; admin writes use the service role.
revoke insert, update, delete, truncate, references, trigger
  on table "public"."testimonials" from "anon", "authenticated";
