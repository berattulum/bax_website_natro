import type { MetadataRoute } from 'next'
import { siteLocales, siteRoutes } from '@/lib/i18n/site-routes'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baxcomposites.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return Object.entries(siteRoutes).flatMap(([key, route]) => siteLocales.map((locale) => ({
    url: `${siteURL}${route.paths[locale]}`,
    lastModified,
    changeFrequency: key === 'home' ? 'weekly' as const : 'monthly' as const,
    priority: key === 'home' ? 1 : ['privacy', 'cookies', 'application', 'privacyHub'].includes(key) ? 0.3 : 0.7,
    alternates: { languages: { en: `${siteURL}${route.paths.en}`, tr: `${siteURL}${route.paths.tr}` } },
  })))
}
