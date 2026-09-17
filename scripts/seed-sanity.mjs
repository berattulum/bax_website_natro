/**
 * Seed Sanity with list documents only (expertise, partners, memberships).
 * Page copy lives in `src/content/i18n/*.json` — not seeded to Sanity.
 *
 * Requires: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_WRITE_TOKEN
 * Run: pnpm seed:sanity
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token,
  useCdn: false,
})

const defaultPartners = [
  ['CTC', 'CTC · an Airbus company', 'https://ctc-composites.com/', '/logos/ctc.png'],
  ['CTRM', 'CTRM · DRB-HICOM', 'https://www.ctrm.com.my/', '/logos/ctrm.png'],
  ['Kale', 'Kale', 'https://www.kale.com.tr/', '/logos/kale.png'],
  ['Toray', 'Toray', 'https://www.toray.com/', '/logos/toray.png'],
  ['Ecoplas', 'Ecoplas', 'https://www.ecoplas.com.tr/', '/logos/ecoplas.png'],
  ['FEV', 'FEV', 'https://www.fev.com/', '/logos/fev.png'],
  ['Rimac', 'Rimac Automobili', 'https://www.rimac-automobili.com/', '/logos/rimac.png'],
  ['MAN', 'MAN', 'https://www.man.eu/', '/logos/man.png'],
  ['Lightyear', 'Lightyear', 'https://lightyear.one/', '/logos/lightyear.png'],
  ['LIST Luxembourg', 'LIST Luxembourg', 'https://www.list.lu/', '/logos/list.png'],
  ['9T Labs', '9T Labs', 'https://www.9tlabs.com/', '/logos/9t-labs.png'],
  ['EURO-COMPOSITES', 'EURO-COMPOSITES', 'https://www.euro-composites.com/en/', '/logos/euro-composites.png'],
  ['SPIRAL RTC', 'SPIRAL RTC', 'https://spiralrtc.com/', '/logos/spiral-rtc.png'],
  ['TPRC', 'TPRC', 'https://tprc.nl/', '/logos/tprc.svg'],
  ['TPAC', 'TPAC', 'https://thermoplasticcomposites.nl/', '/logos/tpac.jpg'],
  ['Addcomposites', 'Addcomposites', 'https://www.addcomposites.com/', '/logos/addcomposites.png'],
]

const defaultMemberships = [
  ['M-ERA.NET', 'AR-GE AĞI', 'R&D NETWORK', 'https://www.m-era.net/', '/logos/memberships/m-era-net.png'],
  ['TÜBİTAK', 'ARAŞTIRMA KURUMU', 'RESEARCH INSTITUTION', 'https://tubitak.gov.tr/', '/logos/memberships/tubitak.svg'],
  ['TOBB', 'MESLEK ÜST KURULUŞU', 'BUSINESS ORGANIZATION', 'https://www.tobb.org.tr/', '/logos/memberships/tobb.jpg'],
  ['İstanbul Ticaret Odası', 'TİCARET ODASI', 'CHAMBER OF COMMERCE', 'https://www.ito.org.tr/tr', '/logos/memberships/ito.png'],
  ['KOSGEB', 'KOBİ DESTEK EKOSİSTEMİ', 'SME SUPPORT ECOSYSTEM', 'https://www.kosgeb.gov.tr/', '/logos/memberships/kosgeb.png'],
  ['Türkiye İhracatçılar Meclisi', 'İHRACAT EKOSİSTEMİ', 'EXPORT ECOSYSTEM', 'https://tim.org.tr/', '/logos/memberships/tim.svg'],
  ['SSI', 'SEKTÖR BİRLİĞİ', 'SECTOR ASSOCIATION', 'https://www.turksavunmasanayi.gov.tr/', '/logos/memberships/ssi.png'],
  ['OAİB', 'İHRACATÇI BİRLİĞİ', 'EXPORTERS ASSOCIATION', 'https://oaib.org.tr/', '/logos/memberships/oaib.png'],
  ['Eureka Network', 'İNOVASYON AĞI', 'INNOVATION NETWORK', 'https://www.eurekanetwork.org/', '/logos/memberships/eureka.svg'],
]

const defaultExpertise = [
  {
    order: 1,
    title: { tr: 'Kompozit Mühendislik', en: 'Composite Engineering' },
    description: {
      tr: 'Yapısal tasarım, malzeme seçimi ve proses mühendisliği',
      en: 'Structural design, material selection and process engineering',
    },
  },
  {
    order: 2,
    title: { tr: 'RTM & Proses', en: 'RTM & Process' },
    description: {
      tr: 'Kontrollü enjeksiyon ve tekrarlanabilir üretim',
      en: 'Controlled injection and repeatable manufacturing',
    },
  },
  {
    order: 3,
    title: { tr: 'Test & Doğrulama', en: 'Test & Verification' },
    description: {
      tr: 'Yapısal test ve ölçülebilir kalite kanıtı',
      en: 'Structural testing and measurable quality evidence',
    },
  },
]

async function upsert(doc) {
  await client.createOrReplace(doc)
  console.log('upserted', doc._id)
}

async function main() {
  for (const item of defaultExpertise) {
    await upsert({
      _id: `expertise-${item.order}`,
      _type: 'expertiseItem',
      ...item,
    })
  }

  let order = 1
  for (const [name, caption, website, logoUrl] of defaultPartners) {
    await upsert({
      _id: `partner-${order}`,
      _type: 'partner',
      order: order++,
      name,
      caption: { tr: caption, en: caption },
      website,
      logoUrl,
      active: true,
    })
  }

  order = 1
  for (const [name, categoryTr, categoryEn, website, logoUrl] of defaultMemberships) {
    await upsert({
      _id: `membership-${order}`,
      _type: 'membership',
      order: order++,
      name,
      category: { tr: categoryTr, en: categoryEn },
      website,
      logoUrl,
      darkCard: false,
      active: true,
    })
  }

  console.log('Sanity seed complete (expertise, partners, memberships).')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
