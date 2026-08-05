import { expect, test, type Page } from '@playwright/test'

const publicRoutes = [
  '/',
  '/sirket-profili',
  '/is-ortakliklari',
  '/aglar-ve-uyelikler',
  '/surdurulebilirlik',
  '/iletisim',
] as const

async function openHealthyPage(page: Page, route: string) {
  const pageErrors: Error[] = []
  page.on('pageerror', (error) => pageErrors.push(error))

  const response = await page.goto(route, { waitUntil: 'networkidle' })
  expect(response, `${route} bir HTTP yanıtı üretmeli`).not.toBeNull()
  expect(response?.status(), `${route} başarılı dönmeli`).toBeLessThan(400)
  await expect(page.locator('body')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  expect(pageErrors, `${route} tarayıcı çalışma zamanı hatası üretmemeli`).toEqual([])
}

async function freezeDynamicMedia(page: Page) {
  await page.locator('video').evaluateAll((elements) => {
    for (const element of elements) {
      const video = element as HTMLVideoElement
      video.pause()
      video.removeAttribute('src')
      for (const source of video.querySelectorAll('source')) source.remove()
      video.load()
    }
  })
  await page.waitForTimeout(200)
}

test.describe('production public site', () => {
  for (const route of publicRoutes) {
    test(`${route} opens without a runtime error`, async ({ page }) => {
      await openHealthyPage(page, route)
    })
  }

  test('homepage matches its approved visual baseline', async ({ page }, testInfo) => {
    await openHealthyPage(page, '/')

    const firstSlide = page.locator('.opening-dot').first()
    if (await firstSlide.isVisible() && await firstSlide.getAttribute('aria-current') !== 'true') await firstSlide.click()
    await freezeDynamicMedia(page)

    await expect(page).toHaveScreenshot(`homepage-${testInfo.project.name}.png`)
  })
})
