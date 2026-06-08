-- Story timeline (the "journey so far" entries on /our-story).
-- Editable from the admin CMS; read by the public page.

CREATE TABLE IF NOT EXISTS "public"."story_timeline" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "year" "text" NOT NULL,
    "body" "text" NOT NULL,
    "image_url" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "is_visible" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."story_timeline" OWNER TO "postgres";

ALTER TABLE ONLY "public"."story_timeline"
    ADD CONSTRAINT "story_timeline_pkey" PRIMARY KEY ("id");

CREATE INDEX "story_timeline_visible_order_idx"
    ON "public"."story_timeline" USING "btree" ("is_visible", "sort_order");

CREATE OR REPLACE TRIGGER "story_timeline_set_updated_at"
    BEFORE UPDATE ON "public"."story_timeline"
    FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();

ALTER TABLE "public"."story_timeline" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "story_timeline_public_read" ON "public"."story_timeline"
    FOR SELECT TO "authenticated", "anon"
    USING (("is_visible" = true));

GRANT ALL ON TABLE "public"."story_timeline" TO "anon";
GRANT ALL ON TABLE "public"."story_timeline" TO "authenticated";
GRANT ALL ON TABLE "public"."story_timeline" TO "service_role";

-- Seed the existing hardcoded entries.
INSERT INTO "public"."story_timeline" ("year", "body", "sort_order") VALUES
    ('2011', 'Duncan and Jess start Duncan''s Dog Co as a dog walking service in South West London.', 10),
    ('2013', 'The business expands into full daycare services as demand grows.', 20),
    ('2016', 'Move to a beautiful woodland facility in Surrey. The team grows significantly.', 30),
    ('2018', 'The missed booking. A loyal customer (and developer) offers to build a solution.', 40),
    ('2019', 'The first prototype of Genera goes live at Duncan''s Dog Co.', 50),
    ('2022', 'After years of refinement, Genera is opened up to other pet businesses.', 60),
    ('Today', 'Genera is used by pet businesses across the UK. And we are just getting started.', 70)
ON CONFLICT DO NOTHING;

-- Public storage bucket for uploaded photos.
INSERT INTO "storage"."buckets" ("id", "name", "public")
VALUES ('story-images', 'story-images', true)
ON CONFLICT ("id") DO NOTHING;

-- Public read of objects in story-images.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM "pg_policies"
        WHERE "schemaname" = 'storage'
          AND "tablename" = 'objects'
          AND "policyname" = 'story_images_public_read'
    ) THEN
        CREATE POLICY "story_images_public_read"
            ON "storage"."objects" FOR SELECT
            TO "authenticated", "anon"
            USING ("bucket_id" = 'story-images');
    END IF;
END
$$;
