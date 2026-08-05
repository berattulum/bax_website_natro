FROM nginx:1.28-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY proxy_params /etc/nginx/bax_proxy_params
COPY templates /etc/nginx/templates-bax
COPY docker-entrypoint.sh /usr/local/bin/bax-nginx-entrypoint

RUN chmod 755 /usr/local/bin/bax-nginx-entrypoint

ENTRYPOINT ["/usr/local/bin/bax-nginx-entrypoint"]
