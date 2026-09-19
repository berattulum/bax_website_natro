import { defineField, defineType } from 'sanity'

/** Locale pair — only for short list-item labels edited in Studio. */
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

const ecosystemChromeFields = [
  localeString('eyebrow', 'Eyebrow'),
  localeString('lead', 'Lead'),
  localeString('title', 'Title'),
  localeText('description', 'Description'),
  localeString('index', 'Directory heading'),
  localeString('next', 'Next section title'),
  localeText('nextText', 'Next section text'),
  localeString('explore', 'Explore CTA'),
]

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
  preview: {
    select: { title: 'name', subtitle: 'caption.tr', media: 'logo', order: 'order' },
    prepare: ({ title, subtitle, media, order }) => ({
      title: `${order ?? '?'}. ${title || 'Partner'}`,
      subtitle,
      media,
    }),
  },
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
  preview: {
    select: { title: 'name', subtitle: 'category.tr', media: 'logo', order: 'order' },
    prepare: ({ title, subtitle, media, order }) => ({
      title: `${order ?? '?'}. ${title || 'Membership'}`,
      subtitle,
      media,
    }),
  },
})

/** Singleton — page titles/copy for Partnerships + Networks & Memberships. */
export const ecosystemPage = defineType({
  name: 'ecosystemPage',
  title: 'Ecosystem Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'partnerships',
      title: 'İş Ortaklıkları / Partnerships',
      type: 'object',
      fields: ecosystemChromeFields,
    }),
    defineField({
      name: 'networks',
      title: 'Ağlar ve Üyelikler / Networks & Memberships',
      type: 'object',
      fields: ecosystemChromeFields,
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Ecosystem page copy' }),
  },
})
