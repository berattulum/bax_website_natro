# Natro Nginx ve SSL devreye alma

Bu yapı ilk açılışta sertifika yoksa HTTP bootstrap modunda çalışır. Sertifika alındıktan sonra Nginx yeniden oluşturulur ve HTTP isteklerini HTTPS'e yönlendirir. Certbot sertifikaları 12 saatte bir kontrol eder; Nginx güncel sertifikayı en geç 6 saat içinde yeniden yükler.

## Ön koşullar

1. Alan adının ve `www` kaydının A/AAAA kayıtlarını Natro sunucusuna yönlendirin.
2. Sunucunun güvenlik duvarında yalnızca gerekli dış portları açın: TCP 80 ve 443.
3. `.env.production.example` dosyasını `.env.production` olarak kopyalayın ve tüm örnek değerleri gerçek, güçlü değerlerle değiştirin.
4. `DOMAIN`, `WWW_DOMAIN`, `SERVER_NAMES`, `CERTBOT_EMAIL` ve `SITE_URL` değerlerinin aynı alan adı ailesini kullandığını doğrulayın.
5. `.env.production` dosyasını Git'e eklemeyin.

## İlk devreye alma

```sh
docker compose --env-file .env.production -f compose.production.yml config --quiet
docker compose --env-file .env.production -f compose.production.yml up -d --build --wait
pnpm ssl:init
docker compose --env-file .env.production -f compose.production.yml ps
```

`ssl:init` çalıştırılmadan önce hem ana alan adı hem de `www` alan adı internetten port 80 üzerinden bu sunucuya erişebilmelidir. DNS henüz hazır değilse sertifika komutunu tekrar tekrar çalıştırmayın; DNS yayılımını doğruladıktan sonra yeniden deneyin.

## Doğrulama

```sh
curl -I http://example.com
curl -I https://example.com
curl -fsS https://example.com/api/health
docker compose --env-file .env.production -f compose.production.yml logs --tail=100 nginx certbot
```

Beklenen sonuçlar:

- HTTP yanıtı HTTPS adresine `301` yönlendirmesi yapar.
- HTTPS ana sayfası `200` döndürür.
- `/api/health` yanıtında uygulama ve veritabanı sağlıklı görünür.
- HTTPS yanıtında HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` ve `Permissions-Policy` başlıkları bulunur.
- `X-Powered-By` başlığı görünmez.

## Yenileme ve sorun giderme

Certbot sürekli çalışan ayrı bir servistir. Durumunu şu komutlarla kontrol edin:

```sh
docker compose --env-file .env.production -f compose.production.yml ps certbot nginx
docker compose --env-file .env.production -f compose.production.yml exec certbot certbot certificates
docker compose --env-file .env.production -f compose.production.yml exec certbot certbot renew --dry-run
```

Sertifika alımı başarısızsa önce DNS kayıtlarını, port 80 erişimini ve `/.well-known/acme-challenge/` yolunun Nginx'e ulaştığını kontrol edin. `letsencrypt` ve `certbot_webroot` volume'larını silmeyin; sertifika durumu bu volume'larda tutulur.
