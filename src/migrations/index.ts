import * as migration_20260722_211659_initial_schema from './20260722_211659_initial_schema';
import * as migration_20260727_104015_site_settings from './20260727_104015_site_settings';
import * as migration_20260727_105016_content_versioning_drafts from './20260727_105016_content_versioning_drafts';

export const migrations = [
  {
    up: migration_20260722_211659_initial_schema.up,
    down: migration_20260722_211659_initial_schema.down,
    name: '20260722_211659_initial_schema',
  },
  {
    up: migration_20260727_104015_site_settings.up,
    down: migration_20260727_104015_site_settings.down,
    name: '20260727_104015_site_settings',
  },
  {
    up: migration_20260727_105016_content_versioning_drafts.up,
    down: migration_20260727_105016_content_versioning_drafts.down,
    name: '20260727_105016_content_versioning_drafts'
  },
];
