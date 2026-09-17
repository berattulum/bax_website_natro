import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const pages = [
  'company_profile_page',
  'home_page',
  'capabilities_page',
  'ecosystem_page',
  'contact_page',
] as const

function createPageSQL(name: string) {
  return `
  CREATE TYPE "public"."enum_${name}_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__${name}_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__${name}_v_published_locale" AS ENUM('tr', 'en');
  CREATE TABLE "${name}" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_tr" jsonb,
  	"content_en" jsonb,
  	"_status" "enum_${name}_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  CREATE TABLE "_${name}_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_content_tr" jsonb,
  	"version_content_en" jsonb,
  	"version__status" "enum__${name}_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__${name}_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  CREATE INDEX "${name}__status_idx" ON "${name}" USING btree ("_status");
  CREATE INDEX "_${name}_v_version_version__status_idx" ON "_${name}_v" USING btree ("version__status");
  CREATE INDEX "_${name}_v_created_at_idx" ON "_${name}_v" USING btree ("created_at");
  CREATE INDEX "_${name}_v_updated_at_idx" ON "_${name}_v" USING btree ("updated_at");
  CREATE INDEX "_${name}_v_snapshot_idx" ON "_${name}_v" USING btree ("snapshot");
  CREATE INDEX "_${name}_v_published_locale_idx" ON "_${name}_v" USING btree ("published_locale");
  CREATE INDEX "_${name}_v_latest_idx" ON "_${name}_v" USING btree ("latest");
  CREATE INDEX "_${name}_v_autosave_idx" ON "_${name}_v" USING btree ("autosave");
`
}

function dropPageSQL(name: string) {
  return `
  DROP TABLE IF EXISTS "${name}" CASCADE;
  DROP TABLE IF EXISTS "_${name}_v" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_${name}_status";
  DROP TYPE IF EXISTS "public"."enum__${name}_v_version_status";
  DROP TYPE IF EXISTS "public"."enum__${name}_v_published_locale";
`
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(pages.map(createPageSQL).join('\n')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(pages.map(dropPageSQL).join('\n')))
}
