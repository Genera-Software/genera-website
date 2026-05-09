


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "excerpt" "text" DEFAULT ''::"text" NOT NULL,
    "body_html" "text" DEFAULT ''::"text" NOT NULL,
    "cover_image_url" "text",
    "author_name" "text" DEFAULT 'Genera'::"text" NOT NULL,
    "category" "text" DEFAULT 'Insights'::"text" NOT NULL,
    "read_time_minutes" integer DEFAULT 3 NOT NULL,
    "is_published" boolean DEFAULT false NOT NULL,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."faqs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question" "text" NOT NULL,
    "answer_html" "text" DEFAULT ''::"text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "is_visible" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."faqs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."founding_spots" (
    "id" integer DEFAULT 1 NOT NULL,
    "total_spots" integer DEFAULT 100 NOT NULL,
    "claimed_spots" integer DEFAULT 27 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "founding_spots_singleton" CHECK (("id" = 1)),
    CONSTRAINT "founding_spots_totals_valid" CHECK ((("claimed_spots" >= 0) AND ("claimed_spots" <= "total_spots")))
);


ALTER TABLE "public"."founding_spots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trust_logos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "logo_url" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "is_visible" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trust_logos" OWNER TO "postgres";


ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."faqs"
    ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."founding_spots"
    ADD CONSTRAINT "founding_spots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trust_logos"
    ADD CONSTRAINT "trust_logos_pkey" PRIMARY KEY ("id");



CREATE INDEX "blog_posts_published_idx" ON "public"."blog_posts" USING "btree" ("is_published", "published_at" DESC);



CREATE INDEX "blog_posts_slug_idx" ON "public"."blog_posts" USING "btree" ("slug");



CREATE INDEX "faqs_visible_order_idx" ON "public"."faqs" USING "btree" ("is_visible", "sort_order");



CREATE INDEX "trust_logos_visible_order_idx" ON "public"."trust_logos" USING "btree" ("is_visible", "sort_order");



CREATE OR REPLACE TRIGGER "blog_posts_set_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "faqs_set_updated_at" BEFORE UPDATE ON "public"."faqs" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "founding_spots_set_updated_at" BEFORE UPDATE ON "public"."founding_spots" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trust_logos_set_updated_at" BEFORE UPDATE ON "public"."trust_logos" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "blog_posts_public_read" ON "public"."blog_posts" FOR SELECT TO "authenticated", "anon" USING ((("is_published" = true) AND ("published_at" <= "now"())));



ALTER TABLE "public"."faqs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "faqs_public_read" ON "public"."faqs" FOR SELECT TO "authenticated", "anon" USING (("is_visible" = true));



ALTER TABLE "public"."founding_spots" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "founding_spots_public_read" ON "public"."founding_spots" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."trust_logos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "trust_logos_public_read" ON "public"."trust_logos" FOR SELECT TO "authenticated", "anon" USING (("is_visible" = true));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."faqs" TO "anon";
GRANT ALL ON TABLE "public"."faqs" TO "authenticated";
GRANT ALL ON TABLE "public"."faqs" TO "service_role";



GRANT ALL ON TABLE "public"."founding_spots" TO "anon";
GRANT ALL ON TABLE "public"."founding_spots" TO "authenticated";
GRANT ALL ON TABLE "public"."founding_spots" TO "service_role";



GRANT ALL ON TABLE "public"."trust_logos" TO "anon";
GRANT ALL ON TABLE "public"."trust_logos" TO "authenticated";
GRANT ALL ON TABLE "public"."trust_logos" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































