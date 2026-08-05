# Görsel regresyon testleri

Testler, production Docker yapısını masaüstü ve mobil Chromium görünümlerinde kontrol eder. Ana sayfanın ilk ekranı piksel karşılaştırmasına, ana public rotalar da HTTP ve tarayıcı çalışma zamanı hata kontrolüne tabi tutulur. Hareketli videolar karşılaştırma sırasında poster karesine sabitlenir. Yerel self-signed sertifika yalnızca test tarayıcısında kabul edilir.

## Ön koşul

```powershell
pnpm prod:up
pnpm exec playwright install chromium
```

## Çalıştırma

```powershell
pnpm test:visual
```

Fark raporu `playwright-report` altında oluşur. Değişiklik bilinçli olarak onaylandıysa referans görüntüler şu komutla yenilenir:

```powershell
pnpm test:visual:update
```

Başka bir ortamı sınamak için `VISUAL_TEST_BASE_URL` tanımlanabilir. Referans görüntüler yalnızca tasarım değişikliği incelendikten sonra güncellenmelidir.
