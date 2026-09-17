# Görsel regresyon testleri

Testler, çalışan siteyi masaüstü ve mobil Chromium görünümlerinde kontrol eder. Ana sayfanın ilk ekranı piksel karşılaştırmasına, ana public rotalar da HTTP ve tarayıcı çalışma zamanı hata kontrolüne tabi tutulur. Hareketli videolar karşılaştırma sırasında poster karesine sabitlenir.

## Ön koşul

```powershell
pnpm dev
# veya VISUAL_TEST_BASE_URL ile preview / production URL
pnpm exec playwright install chromium
```

Varsayılan base URL `http://127.0.0.1:3000`. Başka bir ortam için `VISUAL_TEST_BASE_URL` tanımlayın.

## Çalıştırma

```powershell
pnpm test:visual
```

Fark raporu `playwright-report` altında oluşur. Değişiklik bilinçli olarak onaylandıysa referans görüntüler şu komutla yenilenir:

```powershell
pnpm test:visual:update
```

Referans görüntüler yalnızca tasarım değişikliği incelendikten sonra güncellenmelidir.
