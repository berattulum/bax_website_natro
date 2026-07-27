import { createHash } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@payload-config'
import { checkFormRateLimit } from '@/lib/security/form-rate-limit'
import { verifyTurnstile } from '@/lib/security/verify-turnstile'

export const runtime = 'nodejs'

const formSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(150).optional(),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5_000),
  consent: z.literal(true),
  turnstileToken: z.string().max(2_500),
  website: z.string().max(0).optional().default(''),
})

function getClientIP(request: NextRequest) {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

function rateLimitIdentifier(ip: string) {
  return createHash('sha256')
    .update(ip)
    .digest('hex')
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 20_000) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  }

  const json = await request.json().catch(() => null)
  const parsed = formSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz form verisi.' }, { status: 400 })
  }

  const data = parsed.data
  const ip = getClientIP(request)
  const rateLimit = await checkFormRateLimit(rateLimitIdentifier(ip))

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000)),
          ),
        },
      },
    )
  }

  const isHuman = await verifyTurnstile({
    token: data.turnstileToken,
    ip,
  }).catch(() => false)

  if (!isHuman) {
    return NextResponse.json(
      { error: 'Güvenlik doğrulaması başarısız.' },
      { status: 403 },
    )
  }

  const payload = await getPayload({ config })
  await payload.create({
    collection: 'messages',
    overrideAccess: true,
    data: {
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      consent: data.consent,
      status: 'new',
    },
    context: { source: 'secure-contact-form' },
  })

  return NextResponse.json(
    { success: true, message: 'Talebiniz başarıyla gönderildi.' },
    { status: 201 },
  )
}
