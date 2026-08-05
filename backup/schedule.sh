#!/bin/sh
set -eu

interval="${BACKUP_INTERVAL_SECONDS:-86400}"
case "$interval" in
  ''|*[!0-9]*) echo 'BACKUP_INTERVAL_SECONDS must be a positive integer.' >&2; exit 1 ;;
esac
if [ "$interval" -lt 60 ]; then
  echo 'BACKUP_INTERVAL_SECONDS must be at least 60.' >&2
  exit 1
fi

trap 'exit 0' INT TERM
while :; do
  if ! /usr/local/bin/backup.sh; then
    echo 'Scheduled backup failed; the previous verified snapshots were retained.' >&2
  fi
  sleep "$interval" &
  wait $!
done
