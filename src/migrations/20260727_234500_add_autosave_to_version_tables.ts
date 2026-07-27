import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_site_content_v"
      ADD COLUMN IF NOT EXISTS "autosave" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v"
      ADD COLUMN IF NOT EXISTS "autosave" boolean DEFAULT false;
    ALTER TABLE "_expertise_items_v"
      ADD COLUMN IF NOT EXISTS "autosave" boolean DEFAULT false;
    ALTER TABLE "_partners_v"
      ADD COLUMN IF NOT EXISTS "autosave" boolean DEFAULT false;
    ALTER TABLE "_memberships_v"
      ADD COLUMN IF NOT EXISTS "autosave" boolean DEFAULT false;

    CREATE INDEX IF NOT EXISTS "_site_content_v_autosave_idx"
      ON "_site_content_v" USING btree ("autosave");
    CREATE INDEX IF NOT EXISTS "_site_settings_v_autosave_idx"
      ON "_site_settings_v" USING btree ("autosave");
    CREATE INDEX IF NOT EXISTS "_expertise_items_v_autosave_idx"
      ON "_expertise_items_v" USING btree ("autosave");
    CREATE INDEX IF NOT EXISTS "_partners_v_autosave_idx"
      ON "_partners_v" USING btree ("autosave");
    CREATE INDEX IF NOT EXISTS "_memberships_v_autosave_idx"
      ON "_memberships_v" USING btree ("autosave");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "_site_content_v_autosave_idx";
    DROP INDEX IF EXISTS "_site_settings_v_autosave_idx";
    DROP INDEX IF EXISTS "_expertise_items_v_autosave_idx";
    DROP INDEX IF EXISTS "_partners_v_autosave_idx";
    DROP INDEX IF EXISTS "_memberships_v_autosave_idx";

    ALTER TABLE "_site_content_v" DROP COLUMN IF EXISTS "autosave";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "autosave";
    ALTER TABLE "_expertise_items_v" DROP COLUMN IF EXISTS "autosave";
    ALTER TABLE "_partners_v" DROP COLUMN IF EXISTS "autosave";
    ALTER TABLE "_memberships_v" DROP COLUMN IF EXISTS "autosave";
  `)
}
