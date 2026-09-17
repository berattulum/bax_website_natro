import { expect, test } from '@playwright/test'
import { freezeDynamicMedia, openHealthyPage, publicRoutes } from './helpers'

test.describe('production public site', () => {
  for (const route of publicRoutes) {
    test(`${route} opens without a runtime error`, async ({ page }) => {
      await openHealthyPage(page, route)
    })
  }

  test('homepage matches its approved visual baseline', async ({ page }, testInfo) => {
    await openHealthyPage(page, '/en')

    const firstSlide = page.locator('.opening-dot').first()
    if (await firstSlide.isVisible() && await firstSlide.getAttribute('aria-current') !== 'true') await firstSlide.click()
    await freezeDynamicMedia(page)

    await expect(page).toHaveScreenshot(`homepage-${testInfo.project.name}.png`)
  })
})
