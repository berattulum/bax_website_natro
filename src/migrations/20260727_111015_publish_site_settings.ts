import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "site_settings"
    SET "_status" = 'published'
    WHERE "_status" IS DISTINCT FROM 'published';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "site_settings"
    SET "_status" = 'draft'
    WHERE "_status" IS DISTINCT FROM 'draft';
  `)
}
