import { expect, type Page } from '@playwright/test'

export const publicRoutes = [
  '/en', '/en/company', '/en/partnerships', '/en/networks-memberships', '/en/sustainability', '/en/contact',
  '/tr', '/tr/sirket-profili', '/tr/is-ortakliklari', '/tr/aglar-ve-uyelikler', '/tr/surdurulebilirlik', '/tr/iletisim',
] as const

export async function openHealthyPage(page: Page, route: string) {
  const pageErrors: Error[] = []
  page.on('pageerror', (error) => pageErrors.push(error))
  const response = await page.goto(route, { waitUntil: 'networkidle' })
  expect(response, `${route} bir HTTP yanıtı üretmeli`).not.toBeNull()
  expect(response?.status(), `${route} başarılı dönmeli`).toBeLessThan(400)
  await expect(page.locator('body')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  expect(pageErrors, `${route} tarayıcı çalışma zamanı hatası üretmemeli`).toEqual([])
}

export async function freezeDynamicMedia(page: Page) {
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
