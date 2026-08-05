#!/bin/sh
set -eu

certificate="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
private_key="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

if [ -s "$certificate" ] && [ -s "$private_key" ]; then
  template=/etc/nginx/templates-bax/https.conf.template
  echo "TLS certificate found for ${DOMAIN}; enabling HTTPS."
else
  template=/etc/nginx/templates-bax/bootstrap.conf.template
  echo "TLS certificate not found for ${DOMAIN}; starting HTTP bootstrap mode."
fi

envsubst '${DOMAIN} ${SERVER_NAMES}' < "$template" > /etc/nginx/conf.d/default.conf
nginx -t

(
  while sleep 6h; do
    nginx -t && nginx -s reload
  done
) &

exec nginx -g 'daemon off;'
