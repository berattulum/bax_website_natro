#!/bin/sh
set -eu

: "${PGHOST:?PGHOST is required}"
: "${PGDATABASE:?PGDATABASE is required}"
: "${PGUSER:?PGUSER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"
: "${RESTIC_REPOSITORY:?RESTIC_REPOSITORY is required}"
: "${RESTIC_PASSWORD:?RESTIC_PASSWORD is required}"

snapshot="${RESTORE_SNAPSHOT:-latest}"
mode="${RESTORE_MODE:-verify}"
work="/restore-work"
lock_file="/media/.backup.lock"

cleanup() {
  rm -f "$lock_file"
  find "$work" -mindepth 1 -delete 2>/dev/null || true
}
trap cleanup EXIT INT TERM

mkdir -p "$work"
find "$work" -mindepth 1 -delete
restic restore "$snapshot" --target "$work" --host="${BACKUP_HOST:-bax-natro}" --tag=bax-production

manifest="$(find "$work" -type f -name manifest.sha256 -print -quit)"
if [ -z "$manifest" ]; then
  echo 'Backup manifest was not restored.' >&2
  exit 1
fi
bundle="$(dirname "$manifest")"
(
  cd "$bundle"
  sha256sum -c manifest.sha256
  pg_restore --list database.dump >/dev/null
  tar -tzf media.tar.gz >/dev/null
  tar -tzf letsencrypt.tar.gz >/dev/null
)

echo "Backup cryptographic and archive verification passed: ${snapshot}"
if [ "$mode" = 'verify' ]; then
  exit 0
fi
if [ "$mode" != 'apply' ]; then
  echo 'RESTORE_MODE must be verify or apply.' >&2
  exit 1
fi
if [ "${RESTORE_CONFIRM:-}" != 'RESTORE_BAX_PRODUCTION' ]; then
  echo 'Restore refused. Set RESTORE_CONFIRM=RESTORE_BAX_PRODUCTION explicitly.' >&2
  exit 1
fi

active_connections="$(psql --host="$PGHOST" --port="${PGPORT:-5432}" --username="$PGUSER" --dbname="$PGDATABASE" --tuples-only --no-align --command="SELECT count(*) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid()")"
if [ "$active_connections" -ne 0 ]; then
  echo "Restore refused: ${active_connections} active database connection(s) remain. Stop app and migrator first." >&2
  exit 1
fi

printf '%s\n' "restore-${snapshot}" > "$lock_file"
find /media -mindepth 1 ! -name '.backup.lock' -delete
tar -xzf "$bundle/media.tar.gz" -C /media
chown -R 1001:1001 /media

find /letsencrypt -mindepth 1 -delete
tar -xzf "$bundle/letsencrypt.tar.gz" -C /letsencrypt

dropdb --host="$PGHOST" --port="${PGPORT:-5432}" --username="$PGUSER" --if-exists --force "$PGDATABASE"
createdb --host="$PGHOST" --port="${PGPORT:-5432}" --username="$PGUSER" "$PGDATABASE"
pg_restore \
  --host="$PGHOST" \
  --port="${PGPORT:-5432}" \
  --username="$PGUSER" \
  --dbname="$PGDATABASE" \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  "$bundle/database.dump"

echo "Restore applied successfully: ${snapshot}"
