import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import fs from 'node:fs/promises'

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

  await payload.updateGlobal({
    slug: 'founder-page',
    data: { contentTr: founderCopy.tr, contentEn: founderCopy.en, _status: 'published' },
  })
  await payload.updateGlobal({
    slug: 'corporate-information-page',
    data: { contentTr: corporateInformationCopy.tr, contentEn: corporateInformationCopy.en, records: corporateInformationRecords, offices: corporateInformationOffices, _status: 'published' },
  })
  await payload.updateGlobal({
    slug: 'sustainability-page',
    data: { contentTr: sustainabilityCopy.tr, contentEn: sustainabilityCopy.en, _status: 'published' },
  })

  payload.logger.info('Kurucu, Kurumsal Bilgiler ve Sürdürülebilirlik içerikleri CMS’ye aktarıldı.')
}

await script()
