import corporateInformation from '@/content/i18n/corporate-information.json'

export type CorporateInformationCopy = {
  eyebrow: string
  title: string
  titleAccent: string
  intro: string
  identity: string
  offices: string
  head: string
  branch: string
  verify: string
  verifyText: string
  verifyLink: string
  legal: string
}

/** Static copy — edit `src/content/i18n/corporate-information.json`. */
export const corporateInformationCopy = corporateInformation.content as Record<
  'tr' | 'en',
  CorporateInformationCopy
>

export const corporateInformationRecords = corporateInformation.records as unknown as ReadonlyArray<
  readonly [string, string, string]
>

export const corporateInformationOffices = corporateInformation.offices as {
  head: string
  branch: string
}
