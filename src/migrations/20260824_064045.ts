import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_founder_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__founder_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__founder_page_v_published_locale" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_corporate_information_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__corporate_information_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__corporate_information_page_v_published_locale" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_sustainability_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sustainability_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sustainability_page_v_published_locale" AS ENUM('tr', 'en');
  CREATE TABLE "founder_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_tr" jsonb,
  	"content_en" jsonb,
  	"_status" "enum_founder_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_founder_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_content_tr" jsonb,
  	"version_content_en" jsonb,
  	"version__status" "enum__founder_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__founder_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "corporate_information_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_tr" jsonb,
  	"content_en" jsonb,
  	"records" jsonb,
  	"offices" jsonb,
  	"_status" "enum_corporate_information_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_corporate_information_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_content_tr" jsonb,
  	"version_content_en" jsonb,
  	"version_records" jsonb,
  	"version_offices" jsonb,
  	"version__status" "enum__corporate_information_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__corporate_information_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "sustainability_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_tr" jsonb,
  	"content_en" jsonb,
  	"_status" "enum_sustainability_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_sustainability_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_content_tr" jsonb,
  	"version_content_en" jsonb,
  	"version__status" "enum__sustainability_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__sustainability_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "_expertise_items_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_partners_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_memberships_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_site_content_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_site_settings_v" ADD COLUMN "autosave" boolean;
  CREATE INDEX "founder_page__status_idx" ON "founder_page" USING btree ("_status");
  CREATE INDEX "_founder_page_v_version_version__status_idx" ON "_founder_page_v" USING btree ("version__status");
  CREATE INDEX "_founder_page_v_created_at_idx" ON "_founder_page_v" USING btree ("created_at");
  CREATE INDEX "_founder_page_v_updated_at_idx" ON "_founder_page_v" USING btree ("updated_at");
  CREATE INDEX "_founder_page_v_snapshot_idx" ON "_founder_page_v" USING btree ("snapshot");
  CREATE INDEX "_founder_page_v_published_locale_idx" ON "_founder_page_v" USING btree ("published_locale");
  CREATE INDEX "_founder_page_v_latest_idx" ON "_founder_page_v" USING btree ("latest");
  CREATE INDEX "_founder_page_v_autosave_idx" ON "_founder_page_v" USING btree ("autosave");
  CREATE INDEX "corporate_information_page__status_idx" ON "corporate_information_page" USING btree ("_status");
  CREATE INDEX "_corporate_information_page_v_version_version__status_idx" ON "_corporate_information_page_v" USING btree ("version__status");
  CREATE INDEX "_corporate_information_page_v_created_at_idx" ON "_corporate_information_page_v" USING btree ("created_at");
  CREATE INDEX "_corporate_information_page_v_updated_at_idx" ON "_corporate_information_page_v" USING btree ("updated_at");
  CREATE INDEX "_corporate_information_page_v_snapshot_idx" ON "_corporate_information_page_v" USING btree ("snapshot");
  CREATE INDEX "_corporate_information_page_v_published_locale_idx" ON "_corporate_information_page_v" USING btree ("published_locale");
  CREATE INDEX "_corporate_information_page_v_latest_idx" ON "_corporate_information_page_v" USING btree ("latest");
  CREATE INDEX "_corporate_information_page_v_autosave_idx" ON "_corporate_information_page_v" USING btree ("autosave");
  CREATE INDEX "sustainability_page__status_idx" ON "sustainability_page" USING btree ("_status");
  CREATE INDEX "_sustainability_page_v_version_version__status_idx" ON "_sustainability_page_v" USING btree ("version__status");
  CREATE INDEX "_sustainability_page_v_created_at_idx" ON "_sustainability_page_v" USING btree ("created_at");
  CREATE INDEX "_sustainability_page_v_updated_at_idx" ON "_sustainability_page_v" USING btree ("updated_at");
  CREATE INDEX "_sustainability_page_v_snapshot_idx" ON "_sustainability_page_v" USING btree ("snapshot");
  CREATE INDEX "_sustainability_page_v_published_locale_idx" ON "_sustainability_page_v" USING btree ("published_locale");
  CREATE INDEX "_sustainability_page_v_latest_idx" ON "_sustainability_page_v" USING btree ("latest");
  CREATE INDEX "_sustainability_page_v_autosave_idx" ON "_sustainability_page_v" USING btree ("autosave");
  CREATE INDEX "_expertise_items_v_autosave_idx" ON "_expertise_items_v" USING btree ("autosave");
  CREATE INDEX "_partners_v_autosave_idx" ON "_partners_v" USING btree ("autosave");
  CREATE INDEX "_memberships_v_autosave_idx" ON "_memberships_v" USING btree ("autosave");
  CREATE INDEX "_site_content_v_autosave_idx" ON "_site_content_v" USING btree ("autosave");
  CREATE INDEX "_site_settings_v_autosave_idx" ON "_site_settings_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "founder_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_founder_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "corporate_information_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_corporate_information_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sustainability_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sustainability_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "founder_page" CASCADE;
  DROP TABLE "_founder_page_v" CASCADE;
  DROP TABLE "corporate_information_page" CASCADE;
  DROP TABLE "_corporate_information_page_v" CASCADE;
  DROP TABLE "sustainability_page" CASCADE;
  DROP TABLE "_sustainability_page_v" CASCADE;
  DROP INDEX "_expertise_items_v_autosave_idx";
  DROP INDEX "_partners_v_autosave_idx";
  DROP INDEX "_memberships_v_autosave_idx";
  DROP INDEX "_site_content_v_autosave_idx";
  DROP INDEX "_site_settings_v_autosave_idx";
  ALTER TABLE "_expertise_items_v" DROP COLUMN "autosave";
  ALTER TABLE "_partners_v" DROP COLUMN "autosave";
  ALTER TABLE "_memberships_v" DROP COLUMN "autosave";
  ALTER TABLE "_site_content_v" DROP COLUMN "autosave";
  ALTER TABLE "_site_settings_v" DROP COLUMN "autosave";
  DROP TYPE "public"."enum_founder_page_status";
  DROP TYPE "public"."enum__founder_page_v_version_status";
  DROP TYPE "public"."enum__founder_page_v_published_locale";
  DROP TYPE "public"."enum_corporate_information_page_status";
  DROP TYPE "public"."enum__corporate_information_page_v_version_status";
  DROP TYPE "public"."enum__corporate_information_page_v_published_locale";
  DROP TYPE "public"."enum_sustainability_page_status";
  DROP TYPE "public"."enum__sustainability_page_v_version_status";
  DROP TYPE "public"."enum__sustainability_page_v_published_locale";`)
}
