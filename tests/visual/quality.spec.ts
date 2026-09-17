import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { openHealthyPage, publicRoutes } from './helpers'

test.describe('site quality', () => {
  test('internal links resolve without errors', async ({ page, request }) => {
    await openHealthyPage(page, '/en')
    const hrefs = await page.locator('a[href]').evaluateAll((links) => [...new Set(links
      .map((link) => (link as HTMLAnchorElement).href)
      .filter((href) => href.startsWith(location.origin)))])

    for (const href of hrefs) {
      const response = await request.get(href)
      expect(response.status(), `${href} kırık bağlantı olmamalı`).toBeLessThan(400)
    }
  })

  test('language menu changes URL, content and document language', async ({ page }) => {
    await openHealthyPage(page, '/en/company')
    await page.locator('summary[aria-label="Language selection"]').click()
    await page.locator('.header-language-options button').filter({ hasText: 'Türkçe' }).click()
    await expect(page).toHaveURL(/\/tr\/sirket-profili$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Şirket profili')
  })

  test('primary navigation is keyboard reachable', async ({ page }) => {
    await openHealthyPage(page, '/en')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
    await expect(focused).toHaveAttribute('href', /.+/)
  })

  test('key pages have no serious accessibility violations', async ({ page }) => {
    for (const route of ['/en', '/en/contact', '/tr/sirket-profili']) {
      await openHealthyPage(page, route)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      const serious = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
      expect(serious, `${route} ciddi erişilebilirlik ihlali içermemeli`).toEqual([])
    }
  })

  test('contact form submits a valid enquiry', async ({ page }) => {
    await page.route('https://challenges.cloudflare.com/turnstile/**', async (route) => route.fulfill({
      contentType: 'application/javascript',
      body: `window.turnstile={render:(element,options)=>{options.callback('test-token');return 'test-widget'},reset:()=>{},remove:()=>{}}`,
    }))
    await page.route('**/api/submit-form', async (route) => route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    }))
    await openHealthyPage(page, '/en/contact')
    await page.getByText('Project development', { exact: true }).click()
    await page.getByLabel('Full name').fill('Test User')
    await page.getByLabel('Business email').fill('test@example.com')
    await page.getByLabel('Your need or project scope').fill('Automated end-to-end contact form validation.')
    await page.locator('label').filter({ hasText: 'I consent' }).click({ position: { x: 6, y: 6 } })
    expect(await page.locator('form').evaluate((form) => (form as HTMLFormElement).checkValidity())).toBeTruthy()
    await page.getByRole('button', { name: /SEND ENQUIRY/ }).click()
    await expect(page.getByRole('status')).toContainText('received')
  })

  test('admin requires authentication', async ({ page }) => {
    const response = await page.request.get('/api/users/me')
    expect(response.ok()).toBeTruthy()
    expect(await response.json()).toMatchObject({ user: null })
  })

  test('localized pages expose canonical and hreflang links', async ({ page }) => {
    await openHealthyPage(page, '/tr/iletisim')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/tr\/iletisim$/)
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/contact$/)
    await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute('href', /\/tr\/iletisim$/)
  })

  test('robots and sitemap are valid and localized', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.ok()).toBeTruthy()
    expect(await robots.text()).toContain('Sitemap:')

    const sitemap = await request.get('/sitemap.xml')
    const xml = await sitemap.text()
    expect(sitemap.ok()).toBeTruthy()
    expect(xml).toContain('/en/contact')
    expect(xml).toContain('/tr/iletisim')
    expect(xml).toContain('hreflang="en"')
    expect(xml).toContain('hreflang="tr"')
  })

  test('unknown pages return 404', async ({ request }) => {
    expect((await request.get('/en/does-not-exist')).status()).toBe(404)
  })

  for (const route of publicRoutes) {
    test(`${route} has one main heading and labelled controls`, async ({ page }) => {
      await openHealthyPage(page, route)
      await expect(page.locator('h1')).toHaveCount(1)
      const unnamedButtons = page.locator('button:not([aria-label])').filter({ hasNotText: /\S/ })
      await expect(unnamedButtons).toHaveCount(0)
    })
  }
})
