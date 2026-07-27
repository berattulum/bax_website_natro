import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { DEFAULT_SITE_SETTINGS } from '../lib/cms/site-settings-defaults'
import { migrationData } from './20260727_104015_site_settings'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_expertise_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__expertise_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__expertise_items_v_published_locale" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_published_locale" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_memberships_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__memberships_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__memberships_v_published_locale" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_site_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_content_v_version_section_layout_section" AS ENUM('about', 'designNarrative', 'expertise', 'manufacturingNarrative', 'process', 'principles', 'solutions', 'partners', 'memberships', 'contact');
  CREATE TYPE "public"."enum__site_content_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_content_v_published_locale" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_published_locale" AS ENUM('tr', 'en');
  CREATE TABLE "_expertise_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__expertise_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__expertise_items_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_expertise_items_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric,
  	"version_name" varchar,
  	"version_website" varchar,
  	"version_logo_id" integer,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__partners_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_partners_v_locales" (
  	"version_caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_memberships_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric,
  	"version_name" varchar,
  	"version_website" varchar,
  	"version_logo_id" integer,
  	"version_dark_card" boolean DEFAULT false,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__memberships_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__memberships_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_memberships_v_locales" (
  	"version_category" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_content_v_version_section_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section" "enum__site_content_v_version_section_layout_section",
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_email" varchar DEFAULT 'info@baxcomposites.com',
  	"version_phone" varchar DEFAULT '+90 (212) 565 00 08',
  	"version__status" "enum__site_content_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_content_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_site_content_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_title" varchar,
  	"version_hero_description" varchar,
  	"version_about_title" varchar,
  	"version_about_description" varchar,
  	"version_about_goal" varchar,
  	"version_vision_title" varchar,
  	"version_vision_text" varchar,
  	"version_mission_title" varchar,
  	"version_mission_text" varchar,
  	"version_values_title" varchar,
  	"version_values_text" varchar,
  	"version_expertise_title" varchar,
  	"version_references_title" varchar,
  	"version_references_text" varchar,
  	"version_memberships_title" varchar,
  	"version_memberships_text" varchar,
  	"version_process_title" varchar,
  	"version_contact_title" varchar,
  	"version_contact_text" varchar,
  	"version_head_office" varchar,
  	"version_branch_office" varchar,
  	"version_footer_text" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_directory_website_url" varchar DEFAULT 'https://baxcomposites.com/',
  	"version_footer_privacy_url" varchar DEFAULT '/assets/legal/bax-personal-data-clarification.pdf',
  	"version_footer_cookie_url" varchar DEFAULT '/assets/legal/bax-cookie-policy.pdf',
  	"version_footer_application_url" varchar DEFAULT '/assets/legal/bax-kvkk-application-form.pdf',
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_settings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_site_settings_v_locales" (
  	"version_navigation_home" varchar,
  	"version_navigation_about" varchar,
  	"version_navigation_expertise" varchar,
  	"version_navigation_references" varchar,
  	"version_navigation_memberships" varchar,
  	"version_navigation_contact" varchar,
  	"version_navigation_contact_us" varchar,
  	"version_navigation_main_navigation_label" varchar,
  	"version_navigation_mobile_menu_label" varchar,
  	"version_navigation_language_label" varchar,
  	"version_hero_capabilities" varchar,
  	"version_hero_discuss" varchar,
  	"version_hero_slides_label" varchar,
  	"version_hero_slide_label" varchar,
  	"version_hero_slide2_eyebrow" varchar,
  	"version_hero_slide2_title" varchar,
  	"version_hero_slide2_description" varchar,
  	"version_hero_slide3_eyebrow" varchar,
  	"version_hero_slide3_title" varchar,
  	"version_hero_slide3_description" varchar,
  	"version_narratives_design_eyebrow" varchar,
  	"version_narratives_design_title" varchar,
  	"version_narratives_design_description" varchar,
  	"version_narratives_manufacturing_eyebrow" varchar,
  	"version_narratives_manufacturing_title" varchar,
  	"version_narratives_manufacturing_description" varchar,
  	"version_process_label" varchar,
  	"version_process_step1_title" varchar,
  	"version_process_step1_text" varchar,
  	"version_process_step2_title" varchar,
  	"version_process_step2_text" varchar,
  	"version_process_step3_title" varchar,
  	"version_process_step3_text" varchar,
  	"version_process_step4_title" varchar,
  	"version_process_step4_text" varchar,
  	"version_sections_principles_title" varchar,
  	"version_sections_solutions_label" varchar,
  	"version_sections_solutions_title" varchar,
  	"version_sections_solutions_text" varchar,
  	"version_sections_defense" varchar,
  	"version_sections_aviation" varchar,
  	"version_sections_selected_partners" varchar,
  	"version_directory_company" varchar,
  	"version_directory_email" varchar,
  	"version_directory_phone" varchar,
  	"version_directory_web" varchar,
  	"version_directory_tell_project" varchar,
  	"version_directory_company_name" varchar,
  	"version_directory_website_label" varchar,
  	"version_form_modal_title" varchar,
  	"version_form_modal_intro" varchar,
  	"version_form_name" varchar,
  	"version_form_company" varchar,
  	"version_form_subject" varchar,
  	"version_form_message" varchar,
  	"version_form_consent" varchar,
  	"version_form_send" varchar,
  	"version_form_sending" varchar,
  	"version_form_received" varchar,
  	"version_form_failed" varchar,
  	"version_form_close_label" varchar,
  	"version_footer_navigation" varchar,
  	"version_footer_head_office" varchar,
  	"version_footer_branch_office" varchar,
  	"version_footer_rights" varchar,
  	"version_footer_copyright" varchar,
  	"version_footer_legal_navigation_label" varchar,
  	"version_footer_privacy_label" varchar,
  	"version_footer_cookie_label" varchar,
  	"version_footer_application_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "expertise_items" ALTER COLUMN "order" DROP NOT NULL;
  ALTER TABLE "expertise_items_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "expertise_items_locales" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "partners" ALTER COLUMN "order" DROP NOT NULL;
  ALTER TABLE "partners" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "partners" ALTER COLUMN "website" DROP NOT NULL;
  ALTER TABLE "memberships" ALTER COLUMN "order" DROP NOT NULL;
  ALTER TABLE "memberships" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "memberships" ALTER COLUMN "website" DROP NOT NULL;
  ALTER TABLE "memberships" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "memberships_locales" ALTER COLUMN "category" DROP NOT NULL;
  ALTER TABLE "site_content_section_layout" ALTER COLUMN "section" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "directory_website_url" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_privacy_url" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_cookie_url" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_application_url" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_home" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_about" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_expertise" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_references" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_memberships" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_contact" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_contact_us" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_main_navigation_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_mobile_menu_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_language_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_capabilities" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_discuss" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slides_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide2_eyebrow" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide2_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide2_description" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide3_eyebrow" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide3_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide3_description" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_design_eyebrow" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_design_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_design_description" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_manufacturing_eyebrow" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_manufacturing_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_manufacturing_description" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step1_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step1_text" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step2_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step2_text" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step3_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step3_text" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step4_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step4_text" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_principles_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_solutions_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_solutions_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_solutions_text" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_defense" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_aviation" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_selected_partners" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_company" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_email" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_phone" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_web" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_tell_project" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_company_name" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_website_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_modal_title" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_modal_intro" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_name" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_company" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_subject" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_message" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_consent" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_send" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_sending" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_received" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_failed" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_close_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_navigation" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_head_office" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_branch_office" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_rights" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_copyright" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_legal_navigation_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_privacy_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_cookie_label" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_application_label" DROP NOT NULL;
  ALTER TABLE "expertise_items" ADD COLUMN "_status" "enum_expertise_items_status" DEFAULT 'draft';
  ALTER TABLE "partners" ADD COLUMN "_status" "enum_partners_status" DEFAULT 'draft';
  ALTER TABLE "memberships" ADD COLUMN "_status" "enum_memberships_status" DEFAULT 'draft';
  ALTER TABLE "site_content" ADD COLUMN "_status" "enum_site_content_status" DEFAULT 'draft';
  ALTER TABLE "site_settings" ADD COLUMN "_status" "enum_site_settings_status" DEFAULT 'draft';
  UPDATE "expertise_items" SET "_status" = 'published';
  UPDATE "partners" SET "_status" = 'published';
  UPDATE "memberships" SET "_status" = 'published';
  UPDATE "site_content" SET "_status" = 'published';
  UPDATE "site_settings" SET "_status" = 'published';
  ALTER TABLE "_expertise_items_v" ADD CONSTRAINT "_expertise_items_v_parent_id_expertise_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."expertise_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_expertise_items_v_locales" ADD CONSTRAINT "_expertise_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_expertise_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v_locales" ADD CONSTRAINT "_partners_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_memberships_v" ADD CONSTRAINT "_memberships_v_parent_id_memberships_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."memberships"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_memberships_v" ADD CONSTRAINT "_memberships_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_memberships_v_locales" ADD CONSTRAINT "_memberships_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_memberships_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_content_v_version_section_layout" ADD CONSTRAINT "_site_content_v_version_section_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_content_v_locales" ADD CONSTRAINT "_site_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_locales" ADD CONSTRAINT "_site_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_expertise_items_v_parent_idx" ON "_expertise_items_v" USING btree ("parent_id");
  CREATE INDEX "_expertise_items_v_version_version_updated_at_idx" ON "_expertise_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_expertise_items_v_version_version_created_at_idx" ON "_expertise_items_v" USING btree ("version_created_at");
  CREATE INDEX "_expertise_items_v_version_version__status_idx" ON "_expertise_items_v" USING btree ("version__status");
  CREATE INDEX "_expertise_items_v_created_at_idx" ON "_expertise_items_v" USING btree ("created_at");
  CREATE INDEX "_expertise_items_v_updated_at_idx" ON "_expertise_items_v" USING btree ("updated_at");
  CREATE INDEX "_expertise_items_v_snapshot_idx" ON "_expertise_items_v" USING btree ("snapshot");
  CREATE INDEX "_expertise_items_v_published_locale_idx" ON "_expertise_items_v" USING btree ("published_locale");
  CREATE INDEX "_expertise_items_v_latest_idx" ON "_expertise_items_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_expertise_items_v_locales_locale_parent_id_unique" ON "_expertise_items_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_partners_v_parent_idx" ON "_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_snapshot_idx" ON "_partners_v" USING btree ("snapshot");
  CREATE INDEX "_partners_v_published_locale_idx" ON "_partners_v" USING btree ("published_locale");
  CREATE INDEX "_partners_v_latest_idx" ON "_partners_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_partners_v_locales_locale_parent_id_unique" ON "_partners_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_memberships_v_parent_idx" ON "_memberships_v" USING btree ("parent_id");
  CREATE INDEX "_memberships_v_version_version_logo_idx" ON "_memberships_v" USING btree ("version_logo_id");
  CREATE INDEX "_memberships_v_version_version_updated_at_idx" ON "_memberships_v" USING btree ("version_updated_at");
  CREATE INDEX "_memberships_v_version_version_created_at_idx" ON "_memberships_v" USING btree ("version_created_at");
  CREATE INDEX "_memberships_v_version_version__status_idx" ON "_memberships_v" USING btree ("version__status");
  CREATE INDEX "_memberships_v_created_at_idx" ON "_memberships_v" USING btree ("created_at");
  CREATE INDEX "_memberships_v_updated_at_idx" ON "_memberships_v" USING btree ("updated_at");
  CREATE INDEX "_memberships_v_snapshot_idx" ON "_memberships_v" USING btree ("snapshot");
  CREATE INDEX "_memberships_v_published_locale_idx" ON "_memberships_v" USING btree ("published_locale");
  CREATE INDEX "_memberships_v_latest_idx" ON "_memberships_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_memberships_v_locales_locale_parent_id_unique" ON "_memberships_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_content_v_version_section_layout_order_idx" ON "_site_content_v_version_section_layout" USING btree ("_order");
  CREATE INDEX "_site_content_v_version_section_layout_parent_id_idx" ON "_site_content_v_version_section_layout" USING btree ("_parent_id");
  CREATE INDEX "_site_content_v_version_version__status_idx" ON "_site_content_v" USING btree ("version__status");
  CREATE INDEX "_site_content_v_created_at_idx" ON "_site_content_v" USING btree ("created_at");
  CREATE INDEX "_site_content_v_updated_at_idx" ON "_site_content_v" USING btree ("updated_at");
  CREATE INDEX "_site_content_v_snapshot_idx" ON "_site_content_v" USING btree ("snapshot");
  CREATE INDEX "_site_content_v_published_locale_idx" ON "_site_content_v" USING btree ("published_locale");
  CREATE INDEX "_site_content_v_latest_idx" ON "_site_content_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_site_content_v_locales_locale_parent_id_unique" ON "_site_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_snapshot_idx" ON "_site_settings_v" USING btree ("snapshot");
  CREATE INDEX "_site_settings_v_published_locale_idx" ON "_site_settings_v" USING btree ("published_locale");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_site_settings_v_locales_locale_parent_id_unique" ON "_site_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "expertise_items__status_idx" ON "expertise_items" USING btree ("_status");
  CREATE INDEX "partners__status_idx" ON "partners" USING btree ("_status");
  CREATE INDEX "memberships__status_idx" ON "memberships" USING btree ("_status");
  CREATE INDEX "site_content__status_idx" ON "site_content" USING btree ("_status");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");`)

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'tr',
    data: {
      ...migrationData(DEFAULT_SITE_SETTINGS.tr),
      _status: 'published',
    },
    overrideAccess: true,
    req,
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      ...migrationData(DEFAULT_SITE_SETTINGS.en),
      _status: 'published',
    },
    overrideAccess: true,
    req,
  })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_expertise_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_expertise_items_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_partners_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_partners_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_memberships_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_memberships_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_content_v_version_section_layout" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_content_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_content_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_expertise_items_v" CASCADE;
  DROP TABLE "_expertise_items_v_locales" CASCADE;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "_partners_v_locales" CASCADE;
  DROP TABLE "_memberships_v" CASCADE;
  DROP TABLE "_memberships_v_locales" CASCADE;
  DROP TABLE "_site_content_v_version_section_layout" CASCADE;
  DROP TABLE "_site_content_v" CASCADE;
  DROP TABLE "_site_content_v_locales" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_locales" CASCADE;
  DROP INDEX "expertise_items__status_idx";
  DROP INDEX "partners__status_idx";
  DROP INDEX "memberships__status_idx";
  DROP INDEX "site_content__status_idx";
  DROP INDEX "site_settings__status_idx";
  ALTER TABLE "expertise_items" ALTER COLUMN "order" SET NOT NULL;
  ALTER TABLE "expertise_items_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "expertise_items_locales" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "partners" ALTER COLUMN "order" SET NOT NULL;
  ALTER TABLE "partners" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "partners" ALTER COLUMN "website" SET NOT NULL;
  ALTER TABLE "memberships" ALTER COLUMN "order" SET NOT NULL;
  ALTER TABLE "memberships" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "memberships" ALTER COLUMN "website" SET NOT NULL;
  ALTER TABLE "memberships" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "memberships_locales" ALTER COLUMN "category" SET NOT NULL;
  ALTER TABLE "site_content_section_layout" ALTER COLUMN "section" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "directory_website_url" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_privacy_url" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_cookie_url" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_application_url" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_home" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_about" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_expertise" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_references" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_memberships" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_contact" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_contact_us" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_main_navigation_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_mobile_menu_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "navigation_language_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_capabilities" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_discuss" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slides_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide2_eyebrow" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide2_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide2_description" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide3_eyebrow" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide3_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "hero_slide3_description" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_design_eyebrow" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_design_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_design_description" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_manufacturing_eyebrow" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_manufacturing_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "narratives_manufacturing_description" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step1_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step1_text" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step2_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step2_text" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step3_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step3_text" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step4_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "process_step4_text" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_principles_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_solutions_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_solutions_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_solutions_text" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_defense" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_aviation" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "sections_selected_partners" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_company" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_email" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_phone" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_web" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_tell_project" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_company_name" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "directory_website_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_modal_title" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_modal_intro" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_name" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_company" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_subject" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_message" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_consent" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_send" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_sending" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_received" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_failed" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "form_close_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_navigation" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_head_office" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_branch_office" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_rights" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_copyright" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_legal_navigation_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_privacy_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_cookie_label" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "footer_application_label" SET NOT NULL;
  ALTER TABLE "expertise_items" DROP COLUMN "_status";
  ALTER TABLE "partners" DROP COLUMN "_status";
  ALTER TABLE "memberships" DROP COLUMN "_status";
  ALTER TABLE "site_content" DROP COLUMN "_status";
  ALTER TABLE "site_settings" DROP COLUMN "_status";
  DROP TYPE "public"."enum_expertise_items_status";
  DROP TYPE "public"."enum__expertise_items_v_version_status";
  DROP TYPE "public"."enum__expertise_items_v_published_locale";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum__partners_v_version_status";
  DROP TYPE "public"."enum__partners_v_published_locale";
  DROP TYPE "public"."enum_memberships_status";
  DROP TYPE "public"."enum__memberships_v_version_status";
  DROP TYPE "public"."enum__memberships_v_published_locale";
  DROP TYPE "public"."enum_site_content_status";
  DROP TYPE "public"."enum__site_content_v_version_section_layout_section";
  DROP TYPE "public"."enum__site_content_v_version_status";
  DROP TYPE "public"."enum__site_content_v_published_locale";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum__site_settings_v_published_locale";`)
}
