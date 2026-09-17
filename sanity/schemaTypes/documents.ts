import { defineField, defineType } from 'sanity'

const localeString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'tr', title: 'TR', type: 'string' }),
      defineField({ name: 'en', title: 'EN', type: 'string' }),
    ],
  })

const localeText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'tr', title: 'TR', type: 'text' }),
      defineField({ name: 'en', title: 'EN', type: 'text' }),
    ],
  })

export const siteContent = defineType({
  name: 'siteContent',
  title: 'Site Content',
  type: 'document',
  fields: [
    localeString('heroEyebrow', 'Hero eyebrow'),
    localeString('heroTitle', 'Hero title'),
    localeText('heroDescription', 'Hero description'),
    localeString('aboutTitle', 'About title'),
    localeText('aboutDescription', 'About description'),
    localeText('aboutGoal', 'About goal'),
    localeString('visionTitle', 'Vision title'),
    localeText('visionText', 'Vision text'),
    localeString('missionTitle', 'Mission title'),
    localeText('missionText', 'Mission text'),
    localeString('valuesTitle', 'Values title'),
    localeText('valuesText', 'Values text'),
    localeString('referencesTitle', 'References title'),
    localeText('referencesText', 'References text'),
    localeString('membershipsTitle', 'Memberships title'),
    localeText('membershipsText', 'Memberships text'),
    localeString('processTitle', 'Process title'),
    localeString('contactTitle', 'Contact title'),
    localeText('contactText', 'Contact text'),
    localeString('email', 'Email'),
    localeString('phone', 'Phone'),
    localeText('headOffice', 'Head office'),
    localeText('branchOffice', 'Branch office'),
    localeText('footerText', 'Footer text'),
    localeString('seoTitle', 'SEO title'),
    localeText('seoDescription', 'SEO description'),
    defineField({
      name: 'sectionLayout',
      title: 'Section layout',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'section',
              type: 'string',
              options: {
                list: [
                  'about',
                  'designNarrative',
                  'expertise',
                  'manufacturingNarrative',
                  'process',
                  'principles',
                  'solutions',
                  'partners',
                  'memberships',
                  'contact',
                ],
              },
            }),
            defineField({ name: 'enabled', type: 'boolean', initialValue: true }),
          ],
        },
      ],
    }),
  ],
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'tr',
      title: 'Turkish UI',
      type: 'object',
      fields: [
        defineField({ name: 'navigation', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'hero', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'narratives', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'process', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'sections', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'directory', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'form', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'footer', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
      ],
    }),
    defineField({
      name: 'en',
      title: 'English UI',
      type: 'object',
      fields: [
        defineField({ name: 'navigation', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'hero', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'narratives', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'process', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'sections', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'directory', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'form', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
        defineField({ name: 'footer', type: 'object', options: { collapsible: true }, fields: [{ name: 'data', type: 'text', title: 'JSON' }] }),
      ],
    }),
    defineField({
      name: 'payload',
      title: 'Raw settings (preferred)',
      description: 'Full SiteUISettings JSON for tr/en — used by the site when present.',
      type: 'object',
      fields: [
        defineField({ name: 'tr', type: 'text', title: 'TR JSON' }),
        defineField({ name: 'en', type: 'text', title: 'EN JSON' }),
      ],
    }),
  ],
})

function managedPage(name: string, title: string, extra: ReturnType<typeof defineField>[] = []) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({
        name: 'contentTr',
        title: 'Content TR (JSON)',
        type: 'text',
        rows: 20,
      }),
      defineField({
        name: 'contentEn',
        title: 'Content EN (JSON)',
        type: 'text',
        rows: 20,
      }),
      ...extra,
    ],
  })
}

export const homePage = managedPage('homePage', 'Home Page')
export const companyProfilePage = managedPage('companyProfilePage', 'Company Profile')
export const founderPage = managedPage('founderPage', 'Founder')
export const corporateInformationPage = managedPage('corporateInformationPage', 'Corporate Information', [
  defineField({ name: 'records', title: 'Records JSON', type: 'text' }),
  defineField({ name: 'offices', title: 'Offices JSON', type: 'text' }),
])
export const sustainabilityPage = managedPage('sustainabilityPage', 'Sustainability')
export const capabilitiesPage = managedPage('capabilitiesPage', 'Capabilities')
export const ecosystemPage = managedPage('ecosystemPage', 'Ecosystem')
export const contactPage = managedPage('contactPage', 'Contact Page')

export const expertiseItem = defineType({
  name: 'expertiseItem',
  title: 'Expertise Item',
  type: 'document',
  fields: [
    defineField({ name: 'order', type: 'number', validation: (r) => r.required().min(1) }),
    localeString('title', 'Title'),
    localeText('description', 'Description'),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.tr', order: 'order' },
    prepare: ({ title, order }) => ({ title: `${order ?? '?'}. ${title || 'Expertise'}` }),
  },
})

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    localeString('caption', 'Caption'),
    defineField({ name: 'website', type: 'url' }),
    defineField({ name: 'logoUrl', title: 'Logo URL (or /logos/...)', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo image', type: 'image' }),
    defineField({ name: 'active', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})

export const membership = defineType({
  name: 'membership',
  title: 'Membership',
  type: 'document',
  fields: [
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    localeString('category', 'Category'),
    defineField({ name: 'website', type: 'url' }),
    defineField({ name: 'logoUrl', title: 'Logo URL (or /logos/...)', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo image', type: 'image' }),
    defineField({ name: 'darkCard', type: 'boolean', initialValue: false }),
    defineField({ name: 'active', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
