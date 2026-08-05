#!/bin/sh
set -eu

: "${PGHOST:?PGHOST is required}"
: "${PGDATABASE:?PGDATABASE is required}"
: "${PGUSER:?PGUSER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"
: "${RESTIC_REPOSITORY:?RESTIC_REPOSITORY is required}"
: "${RESTIC_PASSWORD:?RESTIC_PASSWORD is required}"

backup_id="$(date -u +'%Y%m%dT%H%M%SZ')"
stage="/staging/bundle"
lock_file="/media/.backup.lock"
quiesce_seconds="${BACKUP_QUIESCE_SECONDS:-10}"

cleanup() {
  rm -f "$lock_file"
  rm -rf "$stage"
}
trap cleanup EXIT INT TERM

mkdir -p "$stage" "$RESTIC_REPOSITORY"
printf '%s\n' "$backup_id" > "$lock_file"
sleep "$quiesce_seconds"

pg_dump \
  --host="$PGHOST" \
  --port="${PGPORT:-5432}" \
  --username="$PGUSER" \
  --dbname="$PGDATABASE" \
  --format=custom \
  --compress=9 \
  --no-owner \
  --no-privileges \
  --file="$stage/database.dump"

tar --exclude='./.backup.lock' -czf "$stage/media.tar.gz" -C /media .
tar -czf "$stage/letsencrypt.tar.gz" -C /letsencrypt .

postgres_version="$(psql --host="$PGHOST" --port="${PGPORT:-5432}" --username="$PGUSER" --dbname="$PGDATABASE" --tuples-only --no-align --command='SHOW server_version')"
media_files="$(find /media -type f ! -name '.backup.lock' | wc -l | tr -d ' ')"
media_bytes="$(du -sk /media | awk '{print $1 * 1024}')"

cat > "$stage/metadata.env" <<EOF
BACKUP_FORMAT_VERSION=1
BACKUP_ID=${backup_id}
CREATED_AT_UTC=${backup_id}
POSTGRES_VERSION=${postgres_version}
POSTGRES_DATABASE=${PGDATABASE}
MEDIA_FILES=${media_files}
MEDIA_BYTES=${media_bytes}
EOF

(
  cd "$stage"
  sha256sum database.dump media.tar.gz letsencrypt.tar.gz metadata.env > manifest.sha256
)
rm -f "$lock_file"

if ! restic snapshots --no-lock >/dev/null 2>&1; then
  restic init
fi

(
  cd "$stage"
  restic backup database.dump media.tar.gz letsencrypt.tar.gz metadata.env manifest.sha256 \
    --host="${BACKUP_HOST:-bax-natro}" \
    --tag=bax-production \
    --tag="backup-id-${backup_id}"
)

restic forget \
  --host="${BACKUP_HOST:-bax-natro}" \
  --tag=bax-production \
  --group-by=host \
  --keep-daily="${BACKUP_KEEP_DAILY:-7}" \
  --keep-weekly="${BACKUP_KEEP_WEEKLY:-4}" \
  --keep-monthly="${BACKUP_KEEP_MONTHLY:-6}" \
  --prune
restic check

echo "Backup completed and verified: ${backup_id}"
