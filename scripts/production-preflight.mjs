import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const envArgument = process.argv.find((argument) => argument.startsWith('--env='))
const envPath = path.resolve(envArgument?.slice('--env='.length) || '.env.production')
const launch = process.argv.includes('--launch')

if (!existsSync(envPath)) throw new Error(`Environment file does not exist: ${envPath}`)

const values = new Map()
for (const rawLine of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const line = rawLine.trim()
  if (!line || line.startsWith('#')) continue
  const separator = line.indexOf('=')
  if (separator < 1) continue
  values.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim())
}

const errors = []
const warnings = []
const required = (name) => {
  const value = values.get(name) || ''
  if (!value) errors.push(`${name} is required.`)
  return value
}
const secret = (name, minimum = 32) => {
  const value = required(name)
  if (value && value.length < minimum) errors.push(`${name} must contain at least ${minimum} characters.`)
  if (/replace-with|example|changeme|password/i.test(value)) errors.push(`${name} still contains a placeholder value.`)
  return value
}

const siteURLValue = required('SITE_URL')
const domain = required('DOMAIN').toLowerCase()
const wwwDomain = required('WWW_DOMAIN').toLowerCase()
const serverNames = new Set((required('SERVER_NAMES')).toLowerCase().split(/[\s,]+/).filter(Boolean))
const certbotEmail = required('CERTBOT_EMAIL')
const allowedHosts = new Set((required('TURNSTILE_ALLOWED_HOSTS')).toLowerCase().split(',').map((host) => host.trim()).filter(Boolean))

let siteURL
try {
  siteURL = new URL(siteURLValue)
  if (siteURL.protocol !== 'https:') errors.push('SITE_URL must use https://.')
  if (siteURL.pathname !== '/' || siteURL.search || siteURL.hash) errors.push('SITE_URL must contain only the canonical origin.')
  if (domain && siteURL.hostname.toLowerCase() !== domain) errors.push('SITE_URL hostname must equal DOMAIN.')
} catch {
  errors.push('SITE_URL must be a valid absolute URL.')
}

const hostnamePattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i
for (const [name, hostname] of [['DOMAIN', domain], ['WWW_DOMAIN', wwwDomain]]) {
  if (hostname && !hostnamePattern.test(hostname)) errors.push(`${name} must be a public DNS hostname.`)
}
if (domain && wwwDomain !== `www.${domain}`) errors.push('WWW_DOMAIN must be the www subdomain of DOMAIN.')
if (domain && !serverNames.has(domain)) errors.push('SERVER_NAMES must include DOMAIN.')
if (wwwDomain && !serverNames.has(wwwDomain)) errors.push('SERVER_NAMES must include WWW_DOMAIN.')
if (domain && !allowedHosts.has(domain)) errors.push('TURNSTILE_ALLOWED_HOSTS must include DOMAIN.')
if (wwwDomain && !allowedHosts.has(wwwDomain)) errors.push('TURNSTILE_ALLOWED_HOSTS must include WWW_DOMAIN.')
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(certbotEmail)) errors.push('CERTBOT_EMAIL must be a valid email address.')

const postgresPassword = secret('POSTGRES_PASSWORD', 32)
const payloadSecret = secret('PAYLOAD_SECRET', 32)
const revalidationSecret = secret('REVALIDATION_SECRET', 32)
const previewSecret = secret('PREVIEW_SECRET', 32)
secret('BACKUP_RESTIC_PASSWORD', 32)
if (new Set([postgresPassword, payloadSecret, revalidationSecret, previewSecret]).size !== 4) {
  errors.push('Database, Payload, revalidation and preview secrets must all be different.')
}

if (required('HTTP_PORT') !== '80') errors.push('HTTP_PORT must be 80 for public TLS bootstrap.')
if (required('HTTPS_PORT') !== '443') errors.push('HTTPS_PORT must be 443 for production.')
if (required('MEDIA_EXPECTED_FILES') !== '52') errors.push('MEDIA_EXPECTED_FILES must match the verified inventory (52).')
if (required('MEDIA_EXPECTED_SHA256') !== 'fc0a97a11be773d5affbe835665a4af85b39cbb93288423c0394480111a76e7d') {
  errors.push('MEDIA_EXPECTED_SHA256 must match the verified media inventory.')
}

const backupPath = required('BACKUP_REPOSITORY_PATH')
if (!path.isAbsolute(backupPath)) errors.push('BACKUP_REPOSITORY_PATH must be an absolute server path.')

for (const pair of [
  ['NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY'],
  ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
]) {
  const configured = pair.map((name) => Boolean(values.get(name)))
  if (configured[0] !== configured[1]) errors.push(`${pair[0]} and ${pair[1]} must be configured together.`)
}
if (!values.get('NEXT_PUBLIC_TURNSTILE_SITE_KEY')) warnings.push('Turnstile is not configured; production contact forms have no challenge widget.')
if (!values.get('UPSTASH_REDIS_REST_URL')) warnings.push('Upstash is not configured; distributed production rate limiting is unavailable.')

const allowIndexing = values.get('ALLOW_INDEXING')
if (!['true', 'false'].includes(allowIndexing)) errors.push('ALLOW_INDEXING must be explicitly true or false.')
if (launch && allowIndexing !== 'true') errors.push('Launch preflight requires ALLOW_INDEXING=true.')
if (!launch && allowIndexing === 'true') warnings.push('Search indexing is enabled before the launch preflight.')

console.log(`Production preflight mode: ${launch ? 'launch' : 'deployment'}`)
console.log(`Environment keys inspected: ${values.size}`)
for (const warning of warnings) console.warn(`WARNING: ${warning}`)
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`)
  console.error(`Production preflight failed: ${errors.length} error(s), ${warnings.length} warning(s).`)
  process.exitCode = 1
} else {
  console.log(`Production preflight passed: 0 errors, ${warnings.length} warning(s).`)
}
