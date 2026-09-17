import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import fs from 'node:fs/promises'
import { companyProfileCopy } from '../src/lib/cms/company-profile-defaults.ts'
import { homeNarrativesCopy } from '../src/lib/cms/home-narratives-defaults.ts'
import { capabilitiesPageCopy } from '../src/lib/cms/capabilities-page-defaults.ts'
import { ecosystemPageCopy } from '../src/lib/cms/ecosystem-page-defaults.ts'
import { contactPageCopy } from '../src/lib/cms/contact-page-defaults.ts'

function readLiteral<T>(source: string, start: string, end: string): T {
  const from = source.indexOf(start)
  const to = source.indexOf(end, from + start.length)
  if (from < 0 || to < 0) throw new Error(`İçerik bloğu bulunamadı: ${start}`)
  const literal = source.slice(from + start.length, to).trim().replace(/\s+as const$/, '')
  return Function(`"use strict"; return (${literal})`)() as T
}

export async function script() {
  const payload = await getPayload({ config })
  const [founderSource, corporateSource, sustainabilitySource] = await Promise.all([
    fs.readFile(new URL('../src/components/corporate/FounderClient.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/corporate/CorporateInformationClient.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/sustainability/SustainabilityClient.tsx', import.meta.url), 'utf8'),
  ])
  const founderCopy = readLiteral<Record<'tr' | 'en', unknown>>(founderSource, 'export const founderCopy =', '\n\nexport function FounderClient')
  const corporateInformationRecords = readLiteral<unknown[]>(corporateSource, 'export const corporateInformationRecords =', '\n\nexport const corporateInformationCopy')
  const corporateInformationCopy = readLiteral<Record<'tr' | 'en', unknown>>(corporateSource, 'export const corporateInformationCopy =', '\n\nexport const corporateInformationOffices')
  const corporateInformationOffices = readLiteral<Record<string, string>>(corporateSource, 'export const corporateInformationOffices =', '\n\nexport function CorporateInformationClient')
  const sustainabilityCopy = readLiteral<Record<'tr' | 'en', unknown>>(sustainabilitySource, 'export const sustainabilityCopy =', '\n\nexport function SustainabilityClient')

  const pages = [
    { slug: 'founder-page' as const, data: { contentTr: founderCopy.tr, contentEn: founderCopy.en } },
    {
      slug: 'corporate-information-page' as const,
      data: {
        contentTr: corporateInformationCopy.tr,
        contentEn: corporateInformationCopy.en,
        records: corporateInformationRecords,
        offices: corporateInformationOffices,
      },
    },
    { slug: 'sustainability-page' as const, data: { contentTr: sustainabilityCopy.tr, contentEn: sustainabilityCopy.en } },
    { slug: 'company-profile-page' as const, data: { contentTr: companyProfileCopy.tr, contentEn: companyProfileCopy.en } },
    { slug: 'home-page' as const, data: { contentTr: homeNarrativesCopy.tr, contentEn: homeNarrativesCopy.en } },
    { slug: 'capabilities-page' as const, data: { contentTr: capabilitiesPageCopy.tr, contentEn: capabilitiesPageCopy.en } },
    { slug: 'ecosystem-page' as const, data: { contentTr: ecosystemPageCopy.tr, contentEn: ecosystemPageCopy.en } },
    { slug: 'contact-page' as const, data: { contentTr: contactPageCopy.tr, contentEn: contactPageCopy.en } },
  ]

  for (const page of pages) {
    await payload.updateGlobal({
      slug: page.slug,
      data: { ...page.data, _status: 'published' },
    })
    payload.logger.info(`${page.slug} CMS’ye aktarıldı.`)
  }
}

await script()
