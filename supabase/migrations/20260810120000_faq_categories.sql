-- Group FAQs into sections on the public /faqs page.
-- Nullable: FAQs without a category fall into a general "Other" group.
alter table "public"."faqs"
  add column if not exists "category" text;

create index if not exists "faqs_category_idx"
  on "public"."faqs" ("category");
