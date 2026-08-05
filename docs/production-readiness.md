# Production readiness kapısı

Gerçek Natro sunucusunda Docker build veya veri aktarımı başlatılmadan önce `.env.production` otomatik olarak denetlenmelidir. Araç secret değerlerini ekrana yazmaz.

## Dağıtım öncesi

```sh
pnpm prod:preflight
pnpm prod:config
```

Preflight; alan adı ve HTTPS tutarlılığını, public portları, benzersiz ve yeterli uzunluktaki secret'ları, şifreli yedekleme parolasını, mutlak yedek dizinini, doğrulanmış medya envanterini ve birbirine bağlı servis ayarlarını kontrol eder.

## Yayın açılışı

DNS, TLS, health, içerik, medya, admin, yedekleme/geri yükleme ve görsel regresyon kontrolleri tamamlanana kadar:

```dotenv
ALLOW_INDEXING=false
```

Tüm kabul kontrollerinden sonra değeri `true` yapın ve kesin yayın kapısını çalıştırın:

```sh
pnpm prod:preflight:launch
docker compose --env-file .env.production -f compose.production.yml up -d --build --wait
curl -fsS https://example.com/robots.txt
```

`prod:preflight:launch`, indeksleme açık değilse yayını reddeder. `robots.txt` doğrulamasında production alan adı için taramaya izin verildiği ve sitemap adresinin doğru olduğu görülmelidir.

## Haricî bağımlılıklar

Production iletişim formları için Turnstile anahtar çifti; birden fazla uygulama instance'ında ortak rate limiting için Upstash URL/token çifti birlikte tanımlanmalıdır. Preflight tek taraflı yapılandırmayı hata, tamamen eksik yapılandırmayı uyarı olarak raporlar.
