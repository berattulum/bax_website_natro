import contact from '@/content/i18n/contact.json'

export type ContactPageCopy = {
  eyebrow: string
  title: string
  intro: string
  formTitle: string
  formIntro: string
  requestType: string
  requestTypes: string[]
  name: string
  company: string
  email: string
  phone: string
  message: string
  messagePlaceholder: string
  consent: string
  privacy: string
  send: string
  sending: string
  received: string
  failed: string
  direct: string
  offices: string
  headOffice: string
  branchOffice: string
  back: string
}

/** Static copy — edit `src/content/i18n/contact.json`. */
export const contactPageCopy = contact as Record<'tr' | 'en', ContactPageCopy>
