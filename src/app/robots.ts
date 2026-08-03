import type { MetadataRoute } from 'next'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baxcomposites.com'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production' && process.env.ALLOW_INDEXING === 'true'

  return {
    rules: isProduction
      ? { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${siteURL}/sitemap.xml`,
    host: siteURL,
  }
}
