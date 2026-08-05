# Natro otomatik yedekleme ve geri yükleme

Üretim yedekleri Restic 0.18.1 ile şifrelenmiş snapshot olarak tutulur. Her snapshot aynı yedek kimliği altında şu bileşenleri içerir:

- PostgreSQL custom-format dump (`database.dump`)
- Payload medya arşivi (`media.tar.gz`)
- Let's Encrypt sertifika arşivi (`letsencrypt.tar.gz`)
- Operasyon metadatası (`metadata.env`)
- SHA-256 manifesti (`manifest.sha256`)

Yedek alınırken `/app/media/.backup.lock` oluşturulur. Payload okuma işlemleri devam eder ancak medya oluşturma, değiştirme ve silme işlemleri kısa süreli durdurulur. Bekleme süresinden sonra PostgreSQL transaction-consistent dump ve dosya arşivleri hazırlanır. Yarım kalan staging dizinleri snapshot olarak kaydedilmez.

## İlk kurulum

Natro sunucusunda güçlü ve benzersiz bir Restic parolası üretin:

```sh
openssl rand -base64 48
```

Parolayı `.env.production` içindeki `BACKUP_RESTIC_PASSWORD` değerine yazın. Bu parola Git'e eklenmemeli ve parola yöneticisinde ayrıca saklanmalıdır. Parola kaybedilirse şifreli yedekler geri getirilemez.

Önerilen üretim değerleri:

```dotenv
BACKUP_REPOSITORY_PATH=/srv/bax-backups/restic
BACKUP_HOST=bax-natro
BACKUP_INTERVAL_SECONDS=86400
BACKUP_QUIESCE_SECONDS=10
BACKUP_KEEP_DAILY=7
BACKUP_KEEP_WEEKLY=4
BACKUP_KEEP_MONTHLY=6
TZ=Europe/Istanbul
```

Repository dizinini yalnızca yetkili sistem kullanıcısının okuyabileceği şekilde oluşturun. Şifreli repository'nin düzenli kopyasını Natro sunucusundan bağımsız ikinci bir konuma aktarın. Aynı sunucudaki tek kopya disk veya hesap kaybına karşı yeterli değildir.

## Otomatik yedeklemeyi başlatma

```sh
pnpm backup:up
docker compose --env-file .env.production -f compose.production.yml ps backup
docker compose --env-file .env.production -f compose.production.yml logs --tail=100 backup
```

Zamanlayıcı açılışta ilk yedeği alır, ardından `BACKUP_INTERVAL_SECONDS` kadar bekler. Varsayılan süre 24 saattir. Her başarılı çalışmada saklama politikası uygulanır ve `restic check` ile repository yapısı doğrulanır.

Elle yedek ve kontroller:

```sh
pnpm backup:now
pnpm backup:list
pnpm backup:verify
```

`backup:verify`, son snapshot'ı geçici RAM diskine geri açar; şifre çözme, SHA-256 manifesti, PostgreSQL dump kataloğu, medya ve SSL arşivlerini kontrol eder. Canlı veriyi değiştirmez.

## Üretim geri yükleme prosedürü

Geri yükleme canlı PostgreSQL, medya ve SSL içeriğini seçilen snapshot ile değiştirir. Önce snapshot kimliğini ve doğrulamasını kontrol edin:

```sh
pnpm backup:list
RESTORE_SNAPSHOT=<snapshot-id> pnpm backup:verify
```

Bakım penceresinde yazan servisleri durdurun:

```sh
docker compose --env-file .env.production -f compose.production.yml stop backup nginx app
```

Geri yüklemeyi açık onayla çalıştırın:

```sh
RESTORE_SNAPSHOT=<snapshot-id> \
RESTORE_MODE=apply \
RESTORE_CONFIRM=RESTORE_BAX_PRODUCTION \
docker compose --env-file .env.production -f compose.production.yml --profile restore run --rm restore
```

Restore servisi şu durumlarda işlemi reddeder:

- Şifre veya snapshot geçersizse
- Manifest ya da arşiv doğrulaması başarısızsa
- Uygulamanın PostgreSQL bağlantıları hâlâ açıksa
- `RESTORE_CONFIRM` tam olarak belirtilmemişse

Başarılı restore sonrasında:

```sh
docker compose --env-file .env.production -f compose.production.yml up -d app nginx certbot
pnpm media:audit
curl -fsS https://example.com/api/health
pnpm backup:up
```

Ana sayfa, yönetim paneli, örnek medya dosyaları ve kritik içerik sayıları kontrol edilmeden bakım penceresini kapatmayın.

## Saklama ve güvenlik

Varsayılan politika son 7 günlük, 4 haftalık ve 6 aylık snapshot'ı saklar. Restic snapshot'ları içerik bazlı tekilleştirir ve repository'yi parola ile şifreler. Repository dizinini, `.env.production` dosyasını ve parolayı aynı yedek paketinde birlikte paylaşmayın.

`backups/` Git tarafından yok sayılır. Repository içindeki dosyaları elle silmeyin veya düzenlemeyin. Hasar şüphesinde otomatik `forget/prune` işlemini durdurun ve önce repository'nin ayrı kopyasını alın.
