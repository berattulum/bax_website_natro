import { getPayload } from 'payload'
import config from '@payload-config'
import SiteClient from '@/components/SiteClient'
import type { ManagedLocale } from '@/components/ManagedSections'

const emptyLocale = (): ManagedLocale => ({ dictionary: {}, expertise: [], partners: [], memberships: [] })

export default async function HomePage() {
  const locales: Record<'tr' | 'en', ManagedLocale> = { tr: emptyLocale(), en: emptyLocale() }
  const payload = await getPayload({ config })

  for (const locale of ['tr', 'en'] as const) {
    const content = await payload.findGlobal({ slug: 'site-content', locale })
    const dictionary = Object.fromEntries(
      [
        ['hero1Subtitle', content.heroEyebrow], ['hero1Title', content.heroTitle], ['hero1Description', content.heroDescription],
        ['aboutTitle', content.aboutTitle], ['aboutDescription', content.aboutDescription], ['aboutGoal', content.aboutGoal],
        ['visionTitle', content.visionTitle], ['visionText', content.visionText], ['missionTitle', content.missionTitle], ['missionText', content.missionText], ['valuesTitle', content.valuesTitle], ['valuesText', content.valuesText],
        ['referencesTitle', content.referencesTitle], ['referencesText', content.referencesText], ['membershipsTitle', content.membershipsTitle], ['membershipsText', content.membershipsText], ['processTitle', content.processTitle],
        ['contactTitle', content.contactTitle], ['contactText', content.contactText], ['email', content.email], ['phone', content.phone], ['headOffice', content.headOffice], ['branchOffice', content.branchOffice], ['footerText', content.footerText],
      ].filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0),
    )

    const [expertise, partners, memberships] = await Promise.all([
      payload.find({ collection: 'expertise-items', locale, sort: 'order', limit: 20 }),
      payload.find({ collection: 'partners', locale, sort: 'order', limit: 100, where: { active: { equals: true } } }),
      payload.find({ collection: 'memberships', locale, sort: 'order', limit: 100, where: { active: { equals: true } } }),
    ])
    const mediaUrl = (media: unknown) => typeof media === 'object' && media && 'url' in media && typeof media.url === 'string' ? media.url : ''

    locales[locale] = {
      dictionary,
      expertise: expertise.docs.map((item) => ({ order: item.order, title: item.title, description: item.description })),
      partners: partners.docs.map((item) => ({ name: item.name, caption: item.caption || item.name, website: item.website, logo: mediaUrl(item.logo) })),
      memberships: memberships.docs.map((item) => ({ name: item.name, category: item.category, website: item.website, logo: mediaUrl(item.logo), darkCard: item.darkCard || false })),
    }
  }

  return <SiteClient locales={locales} />
}
