# Natro geçiş provası

Bu akış SQLite içeriğini production PostgreSQL'e transaction içinde aktarır, medyayı kalıcı Docker hacmine kopyalar ve hedefi denetler.

## Ön koşullar

- `bax.db` çalışma alanı kökünde bulunmalı.
- Kaynak medya dosyaları `media` klasöründe bulunmalı.
- `.env.production` gerçek production değerleriyle hazırlanmalı.
- Özellikle `BACKUP_RESTIC_PASSWORD` tanımlı ve yedek deposu doğrulanmış olmalı.

## Kontrollü prova

```powershell
pnpm prod:up
pnpm backup:now
pnpm rehearsal:data:check
pnpm rehearsal:media:check
pnpm rehearsal:data:import
pnpm rehearsal:media:import
pnpm rehearsal:audit
pnpm rehearsal:revalidate
pnpm test:visual
```

`rehearsal:data:check` SQLite bütünlüğünü, hedef şemayı, medya referanslarını ve planlanan tablo kayıtlarını hedefe yazmadan denetler. Gerçek veri aktarımı bütün tablolar için tek PostgreSQL transaction kullanır; herhangi bir doğrulama hatasında rollback yapılır. Kaynak SQLite kayıtları draft durumunda tutulduğu için prova komutu, aktarılan site içeriği, uzmanlık, partner ve üyelik kayıtlarını aynı transaction içinde yayınlar ve yalnızca en güncel sürüm kaydını `published` olarak işaretler.

Medya aktarımı farklı içerikle aynı ada sahip bir dosya bulursa durur. Başarılı aktarım sonrasında audit, PostgreSQL'deki her medya kaydının kalıcı hacimde karşılığı olduğunu doğrular.

Veri aktarımı Payload hook'larını çalıştırmadan doğrudan transaction kullandığı için `rehearsal:revalidate`, imzalı internal endpoint üzerinden ana sayfa, global içerik, ayarlar, uzmanlık, referans, üyelik ve medya cache tag'lerini temizler. Uygulamayı yalnızca yeniden başlatmak kalıcı Next.js cache hacmini temizlemez; bu adım atlanmamalıdır.

## Kesin geçiş kuralı

Yedekleme ve doğrulanmış geri yükleme çalışmadan gerçek Natro sunucusunda veri aktarımı başlatılmaz. Prova sonrasında public sayfalar, yönetim paneli, kayıt sayıları ve masaüstü/mobil görsel regresyon testleri kontrol edilir.
