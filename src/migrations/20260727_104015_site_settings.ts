import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import type { SiteUISettings } from '../lib/cms/site-settings-defaults'

export function migrationData(settings: SiteUISettings) {
  return {
    navigation: settings.navigation,
    hero: {
      capabilities: settings.hero.capabilities,
      discuss: settings.hero.discuss,
      slidesLabel: settings.hero.slidesLabel,
      slideLabel: settings.hero.slideLabel,
      slide2Eyebrow: settings.hero.secondarySlides[0][0],
      slide2Title: settings.hero.secondarySlides[0][1],
      slide2Description: settings.hero.secondarySlides[0][2],
      slide3Eyebrow: settings.hero.secondarySlides[1][0],
      slide3Title: settings.hero.secondarySlides[1][1],
      slide3Description: settings.hero.secondarySlides[1][2],
    },
    narratives: {
      designEyebrow: settings.narratives[0][0],
      designTitle: settings.narratives[0][1],
      designDescription: settings.narratives[0][2],
      manufacturingEyebrow: settings.narratives[1][0],
      manufacturingTitle: settings.narratives[1][1],
      manufacturingDescription: settings.narratives[1][2],
    },
    process: {
      label: settings.process.label,
      ...Object.fromEntries(
        settings.process.steps.flatMap(([title, value], index) => [
          [`step${index + 1}Title`, title],
          [`step${index + 1}Text`, value],
        ]),
      ),
    },
    sections: settings.sections,
    directory: settings.directory,
    form: settings.form,
    footer: settings.footer,
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"directory_website_url" varchar DEFAULT 'https://baxcomposites.com/' NOT NULL,
  	"footer_privacy_url" varchar DEFAULT '/assets/legal/bax-personal-data-clarification.pdf' NOT NULL,
  	"footer_cookie_url" varchar DEFAULT '/assets/legal/bax-cookie-policy.pdf' NOT NULL,
  	"footer_application_url" varchar DEFAULT '/assets/legal/bax-kvkk-application-form.pdf' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"navigation_home" varchar NOT NULL,
  	"navigation_about" varchar NOT NULL,
  	"navigation_expertise" varchar NOT NULL,
  	"navigation_references" varchar NOT NULL,
  	"navigation_memberships" varchar NOT NULL,
  	"navigation_contact" varchar NOT NULL,
  	"navigation_contact_us" varchar NOT NULL,
  	"navigation_main_navigation_label" varchar NOT NULL,
  	"navigation_mobile_menu_label" varchar NOT NULL,
  	"navigation_language_label" varchar NOT NULL,
  	"hero_capabilities" varchar NOT NULL,
  	"hero_discuss" varchar NOT NULL,
  	"hero_slides_label" varchar NOT NULL,
  	"hero_slide_label" varchar NOT NULL,
  	"hero_slide2_eyebrow" varchar NOT NULL,
  	"hero_slide2_title" varchar NOT NULL,
  	"hero_slide2_description" varchar NOT NULL,
  	"hero_slide3_eyebrow" varchar NOT NULL,
  	"hero_slide3_title" varchar NOT NULL,
  	"hero_slide3_description" varchar NOT NULL,
  	"narratives_design_eyebrow" varchar NOT NULL,
  	"narratives_design_title" varchar NOT NULL,
  	"narratives_design_description" varchar NOT NULL,
  	"narratives_manufacturing_eyebrow" varchar NOT NULL,
  	"narratives_manufacturing_title" varchar NOT NULL,
  	"narratives_manufacturing_description" varchar NOT NULL,
  	"process_label" varchar NOT NULL,
  	"process_step1_title" varchar NOT NULL,
  	"process_step1_text" varchar NOT NULL,
  	"process_step2_title" varchar NOT NULL,
  	"process_step2_text" varchar NOT NULL,
  	"process_step3_title" varchar NOT NULL,
  	"process_step3_text" varchar NOT NULL,
  	"process_step4_title" varchar NOT NULL,
  	"process_step4_text" varchar NOT NULL,
  	"sections_principles_title" varchar NOT NULL,
  	"sections_solutions_label" varchar NOT NULL,
  	"sections_solutions_title" varchar NOT NULL,
  	"sections_solutions_text" varchar NOT NULL,
  	"sections_defense" varchar NOT NULL,
  	"sections_aviation" varchar NOT NULL,
  	"sections_selected_partners" varchar NOT NULL,
  	"directory_company" varchar NOT NULL,
  	"directory_email" varchar NOT NULL,
  	"directory_phone" varchar NOT NULL,
  	"directory_web" varchar NOT NULL,
  	"directory_tell_project" varchar NOT NULL,
  	"directory_company_name" varchar NOT NULL,
  	"directory_website_label" varchar NOT NULL,
  	"form_modal_title" varchar NOT NULL,
  	"form_modal_intro" varchar NOT NULL,
  	"form_name" varchar NOT NULL,
  	"form_company" varchar NOT NULL,
  	"form_subject" varchar NOT NULL,
  	"form_message" varchar NOT NULL,
  	"form_consent" varchar NOT NULL,
  	"form_send" varchar NOT NULL,
  	"form_sending" varchar NOT NULL,
  	"form_received" varchar NOT NULL,
  	"form_failed" varchar NOT NULL,
  	"form_close_label" varchar NOT NULL,
  	"footer_navigation" varchar NOT NULL,
  	"footer_head_office" varchar NOT NULL,
  	"footer_branch_office" varchar NOT NULL,
  	"footer_rights" varchar NOT NULL,
  	"footer_copyright" varchar NOT NULL,
  	"footer_legal_navigation_label" varchar NOT NULL,
  	"footer_privacy_label" varchar NOT NULL,
  	"footer_cookie_label" varchar NOT NULL,
  	"footer_application_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");`)

}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;`)
}
