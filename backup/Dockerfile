FROM restic/restic:0.18.1 AS restic

FROM postgres:17-alpine

RUN apk add --no-cache tzdata

COPY --from=restic /usr/bin/restic /usr/local/bin/restic
COPY backup.sh restore.sh schedule.sh /usr/local/bin/

RUN chmod 755 /usr/local/bin/backup.sh /usr/local/bin/restore.sh /usr/local/bin/schedule.sh

ENTRYPOINT []
