# Natro production teslimi

Bu repo Natro sunucusu alınmadan önce tamamlanabilen uygulama, veri ve medya hazırlığını içerir.

## Yerel teslim kapısı

Her release öncesinde çalıştırın:

```sh
pnpm release:check
docker build --target runner -t bax-production-app:verification .
```

İlk komut production ortam şablonunu, 52 dosyalık medya envanterini ve SQLite → PostgreSQL aktarım planını doğrular. İkinci komut Natro'da çalışacak Linux production imajını üretir.

## Repo dışında korunacak iki kaynak

Güvenlik ve kalıcı veri ayrımı nedeniyle aşağıdakiler Git'e eklenmez:

- `bax.db`: ilk PostgreSQL aktarım kaynağı
- `media/`: Payload CMS medya dosyaları

Bu iki kaynak repo ile birlikte sunucuya şifreli kanal üzerinden aktarılmalıdır. `media/` envanteri 52 dosya ve `fc0a97a11be773d5affbe835665a4af85b39cbb93288423c0394480111a76e7d` SHA-256 değeridir.

## Yalnızca sunucu alındıktan sonra yapılacaklar

1. Docker destekli Linux VPS hazırlanır; DNS A/AAAA kayıtları sunucuya yönlendirilir.
2. Repo `/srv/bax_website_natro` altına klonlanır.
3. `bax.db` ve `media/` aynı proje köküne güvenli biçimde aktarılır.
4. `.env.production.example`, `.env.production` olarak kopyalanır. Domain, e-posta, mutlak yedek yolu ve benzersiz secret değerleri doldurulur. İlk açılışta `ALLOW_INDEXING=false` kalır.
5. Aşağıdaki kapılar sırasıyla çalıştırılır:

```sh
pnpm prod:preflight
pnpm prod:config
pnpm prod:build
pnpm backup:verify
pnpm rehearsal:data:check
pnpm rehearsal:media:check
```

6. SSL hazırlanır, servisler açılır ve veri/medya aktarımı uygulanır. Ayrıntılar `natro-nginx-ssl.md`, `natro-media-storage.md`, `natro-rehearsal.md` ve `natro-backup-restore.md` belgelerindedir.
7. Canlı kabul testleri tamamlandıktan sonra `ALLOW_INDEXING=true` yapılır ve `pnpm prod:preflight:launch` çalıştırılır.

Sunucu değerleri tamamlanmadan deployment preflight'ın hata vermesi beklenen ve güvenli davranıştır; eksik yapılandırmayla yayın açılmasını engeller.
