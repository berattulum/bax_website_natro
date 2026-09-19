/**
 * Smoke-test Resend contact delivery without printing secrets.
 * Run: node --env-file=.env.local --env-file=.env scripts/test-resend-contact.mjs
 */
import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.CONTACT_FROM_EMAIL
const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
const allowedHosts = process.env.TURNSTILE_ALLOWED_HOSTS ?? ''

console.log(
  JSON.stringify(
    {
      hasApiKey: Boolean(apiKey),
      fromEmail: fromEmail || null,
      notifyEmail: notifyEmail || null,
      turnstileConfigured: Boolean(siteKey && secret),
      allowedHosts: allowedHosts
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean),
    },
    null,
    2,
  ),
)

if (!apiKey || !fromEmail || !notifyEmail) {
  console.error('Missing RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_NOTIFY_EMAIL')
  process.exit(1)
}

const resend = new Resend(apiKey)
const result = await resend.emails.send({
  from: fromEmail,
  to: [notifyEmail],
  subject: '[BaX Contact] Resend smoke test',
  text: 'Bu bir otomatik test mesajıdır. Form entegrasyonu çalışıyor.',
  html: '<p>Bu bir otomatik test mesajıdır. Form entegrasyonu çalışıyor.</p>',
})

if (result.error) {
  console.error('RESEND_ERROR', result.error.message || JSON.stringify(result.error))
  process.exit(1)
}

console.log('RESEND_OK', result.data?.id || 'sent')
