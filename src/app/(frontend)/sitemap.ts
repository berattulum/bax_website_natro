import type { MetadataRoute } from 'next'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baxcomposites.com'

const routes = [
  '',
  '/sirket-profili',
  '/kurumsal-bilgiler',
  '/is-ortakliklari',
  '/aglar-ve-uyelikler',
  '/surdurulebilirlik',
  '/iletisim',
  '/kvkk',
  '/kvkk/aydinlatma-metni',
  '/kvkk/basvuru',
  '/cerez-politikasi',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route, index) => ({
    url: `${siteURL}${route}`,
    lastModified,
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : route.startsWith('/kvkk') || route === '/cerez-politikasi' ? 0.3 : 0.7,
  }))
}
