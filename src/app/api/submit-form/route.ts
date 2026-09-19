import { createHash } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

import { checkFormRateLimit } from '@/lib/security/form-rate-limit'
import { verifyTurnstile } from '@/lib/security/verify-turnstile'

export const runtime = 'nodejs'

const responseHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
}

function jsonResponse(body: Record<string, unknown>, status: number, headers?: Record<string, string>) {
  return NextResponse.json(body, {
    status,
    headers: { ...responseHeaders, ...headers },
  })
}

const emptyToUndefined = (value: unknown) =>
  value === '' || value === null || value === undefined ? undefined : value

const formSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.preprocess(emptyToUndefined, z.string().trim().max(150).optional()),
  email: z.string().trim().email().max(200),
  phone: z.preprocess(emptyToUndefined, z.string().trim().max(40).optional()),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5_000),
  consent: z.literal(true),
  // Turnstile tokens can exceed 2k; keep headroom for longer responses.
  turnstileToken: z.preprocess(emptyToUndefined, z.string().max(8_192).optional().default('')),
  // Honeypot — must stay empty. Text inputs get autofilled; prefer checkbox.
  baxHp: z.preprocess(
    (value) => (value === true || value === 'on' || value === '1' ? '1' : ''),
    z.string().max(1).optional().default(''),
  ),
})

function getClientIP(request: NextRequest) {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

function rateLimitIdentifier(ip: string) {
  return createHash('sha256').update(ip).digest('hex')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function POST(request: NextRequest) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return jsonResponse({ error: 'Unsupported content type' }, 415)
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  // Missing Content-Length is allowed (chunked); only reject clearly oversized bodies.
  if (Number.isFinite(contentLength) && contentLength > 32_000) {
    return jsonResponse({ error: 'Request too large' }, 413)
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.CONTACT_FROM_EMAIL
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL
  if (!apiKey || !fromEmail || !notifyEmail) {
    return jsonResponse(
      { error: 'E-posta servisi yapılandırılmamış. Lütfen daha sonra tekrar deneyin.' },
      503,
      { 'Retry-After': '60' },
    )
  }

  const json = await request.json().catch(() => null)
  const parsed = formSchema.safeParse(json)
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.') || 'root').slice(0, 8)
    console.error('[contact] validation failed:', fields.join(','))
    return jsonResponse({ error: 'Geçersiz form verisi.' }, 400)
  }

  const data = parsed.data
  if (data.baxHp) {
    console.error('[contact] honeypot tripped')
    return jsonResponse({ error: 'Geçersiz form verisi.' }, 400)
  }

  const ip = getClientIP(request)
  const rateLimit = await checkFormRateLimit(rateLimitIdentifier(ip)).catch(() => null)

  if (!rateLimit) {
    return jsonResponse({ error: 'Form servisi geçici olarak kullanılamıyor.' }, 503, { 'Retry-After': '60' })
  }

  if (!rateLimit.success) {
    return jsonResponse(
      { error: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.' },
      429,
      {
        'Retry-After': String(Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000))),
      },
    )
  }

  const isHuman = await verifyTurnstile({
    token: data.turnstileToken,
    ip,
  }).catch(() => false)

  if (!isHuman) {
    return jsonResponse({ error: 'Güvenlik doğrulaması başarısız.' }, 403)
  }

  const resend = new Resend(apiKey)
  const safe = {
    name: escapeHtml(data.name),
    company: escapeHtml(data.company || '—'),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone || '—'),
    subject: escapeHtml(data.subject),
    message: escapeHtml(data.message).replaceAll('\n', '<br />'),
  }

  const result = await resend.emails
    .send({
      from: fromEmail,
      to: [notifyEmail],
      replyTo: data.email,
      subject: `[BaX Contact] ${data.subject}`,
      html: `
        <h2>Yeni iletişim formu</h2>
        <p><strong>Ad Soyad:</strong> ${safe.name}</p>
        <p><strong>Şirket:</strong> ${safe.company}</p>
        <p><strong>E-posta:</strong> ${safe.email}</p>
        <p><strong>Telefon:</strong> ${safe.phone}</p>
        <p><strong>Konu:</strong> ${safe.subject}</p>
        <p><strong>Mesaj:</strong><br />${safe.message}</p>
      `,
      text: [
        `Ad Soyad: ${data.name}`,
        `Şirket: ${data.company || '—'}`,
        `E-posta: ${data.email}`,
        `Telefon: ${data.phone || '—'}`,
        `Konu: ${data.subject}`,
        '',
        data.message,
      ].join('\n'),
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Resend request failed'
      console.error('[contact] resend throw:', message.slice(0, 240))
      return null
    })

  if (!result || result.error) {
    const providerMessage = result?.error?.message || 'unknown'
    console.error('[contact] resend error:', providerMessage.slice(0, 240))
    const testingOnly = /only send testing emails|verify a domain/i.test(providerMessage)
    return jsonResponse(
      {
        error: testingOnly
          ? 'E-posta servisi henüz üretim domaini ile doğrulanmamış. Lütfen Resend domain ayarını tamamlayın veya test alıcısını güncelleyin.'
          : 'Mesaj şu anda gönderilemiyor. Lütfen daha sonra tekrar deneyin.',
      },
      502,
      { 'Retry-After': '60' },
    )
  }

  console.info('[contact] resend ok:', result.data?.id || 'sent')
  return jsonResponse({ success: true, message: 'Talebiniz başarıyla gönderildi.' }, 201)
}
