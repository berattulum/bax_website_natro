# Natro kalıcı medya depolama

Üretim medyası uygulama imajında veya Git deposunda tutulmaz. Payload'ın `/app/media` dizini, Docker tarafından yönetilen `bax_production_media_data` volume'una bağlanır. Uygulama `nextjs` kullanıcısı (UID/GID 1001) ile bu volume'a yazabilir.

Bu ayrım sayesinde yeni bir uygulama imajı oluşturmak veya container'ı yeniden yaratmak medya dosyalarını değiştirmez. `docker compose down -v` ve `docker volume rm bax_production_media_data` komutları kalıcı medyayı siler; normal bakım ve dağıtım sırasında kullanılmamalıdır.

## Mevcut aktarım envanteri

- Kaynak dosya sayısı: 52
- Toplam boyut: 663482 bayt
- Envanter SHA-256: `fc0a97a11be773d5affbe835665a4af85b39cbb93288423c0394480111a76e7d`
- PostgreSQL tarafından referans verilen dosya sayısı: 26

Envanter özeti dosya adı, boyut ve her dosyanın SHA-256 değeri kullanılarak üretilir. Kalan 26 dosya silinmez; bunlar aynı varlıkların önceki/adlandırılmış kopyaları olabilir ve geçiş tamamlanmadan artık dosya kabul edilmez.

## Natro sunucusuna kaynak aktarımı

Repo klonundaki `media/` dizini Git tarafından izlenmez. Mevcut yerel `media/` klasörünü şifreli bir kanal ile Natro sunucusundaki repo köküne aktarın. Örnek:

```sh
rsync -av --checksum --progress ./media/ natro-user@natro-server:/srv/bax_website_natro/media/
```

Aktarım bittikten sonra Natro sunucusunda `.env.production` içindeki şu değerlerin mevcut envanterle aynı olduğunu doğrulayın:

```dotenv
MEDIA_EXPECTED_FILES=52
MEDIA_EXPECTED_SHA256=fc0a97a11be773d5affbe835665a4af85b39cbb93288423c0394480111a76e7d
```

## Güvenli import sırası

Önce yalnızca kontrol çalıştırın. Dry-run kaynak sayısı veya özeti uyuşmazsa hiçbir dosya kopyalanmaz.

```sh
pnpm media:check
pnpm media:import
pnpm media:audit
```

Import davranışı:

- Yeni dosyalar geçici bir adla kopyalanır, SHA-256 doğrulamasından sonra atomik olarak gerçek adına taşınır.
- Aynı ada ve aynı içeriğe sahip dosyalar değiştirilmez.
- Aynı ada fakat farklı içeriğe sahip tek bir dosya bile varsa işlem kopyalamadan durur.
- Sembolik bağlantılar kabul edilmez.
- Import bittikten sonra tüm kaynak dosyaları yeniden hash'lenerek doğrulanır.

`media:audit`, PostgreSQL `media.filename` kayıtlarının tamamını kalıcı volume ile karşılaştırır. Eksik referans varsa sıfır olmayan çıkış koduyla durur. Referanssız dosyaları raporlar fakat veri kaybını önlemek için silmez.

## Dağıtım sonrası doğrulama

```sh
docker compose --env-file .env.production -f compose.production.yml ps app
docker compose --env-file .env.production -f compose.production.yml exec app sh -c 'test -w /app/media'
pnpm media:audit
curl -fsS https://example.com/api/health
```

Payload yönetim panelinden yüklenen yeni bir test görselinin `/api/media/file/<dosya-adı>` adresinden açıldığını doğrulayın. Test kaydını panel üzerinden silerken Payload'ın hem veritabanı kaydını hem fiziksel dosyayı kaldırdığını kontrol edin.

## Değişmez güvenlik kuralları

- `media/` klasörünü Git'e zorla eklemeyin.
- Canlı volume üzerinde elle dosya silmeyin veya yeniden adlandırmayın.
- Import öncesinde dry-run sonucunu kontrol edin.
- PostgreSQL ve medya volume yedeklerini aynı geçiş noktasına ait çift olarak saklayın.
- Yedekleme ve geri yükleme prosedürü doğrulanmadan kaynak `media/` klasörünü kaldırmayın.
