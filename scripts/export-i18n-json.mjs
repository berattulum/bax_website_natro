/**
 * One-shot helper: dump current thin re-exports back to JSON.
 * Prefer editing `src/content/i18n/*.json` directly — that is the source of truth.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { capabilitiesPageCopy } from '../src/lib/cms/capabilities-page-defaults.ts'
import { companyProfileCopy } from '../src/lib/cms/company-profile-defaults.ts'
import { contactPageCopy } from '../src/lib/cms/contact-page-defaults.ts'
import {
  corporateInformationCopy,
  corporateInformationOffices,
  corporateInformationRecords,
} from '../src/lib/cms/corporate-information-defaults.ts'
import { ecosystemPageCopy } from '../src/lib/cms/ecosystem-page-defaults.ts'
import { founderCopy } from '../src/lib/cms/founder-page-defaults.ts'
import { homeNarrativesCopy } from '../src/lib/cms/home-narratives-defaults.ts'
import { DEFAULT_SITE_SETTINGS } from '../src/lib/cms/site-settings-defaults.ts'
import { sustainabilityCopy } from '../src/lib/cms/sustainability-page-defaults.ts'

const root = join(process.cwd(), 'src/content/i18n')
mkdirSync(root, { recursive: true })

function dump(name, data) {
  writeFileSync(join(root, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  console.log('wrote', name)
}

dump('site-settings', DEFAULT_SITE_SETTINGS)
dump('home-narratives', homeNarrativesCopy)
dump('company-profile', companyProfileCopy)
dump('capabilities', capabilitiesPageCopy)
dump('ecosystem', ecosystemPageCopy)
dump('contact', contactPageCopy)
dump('founder', founderCopy)
dump('corporate-information', {
  content: corporateInformationCopy,
  records: corporateInformationRecords,
  offices: corporateInformationOffices,
})
dump('sustainability', sustainabilityCopy)
