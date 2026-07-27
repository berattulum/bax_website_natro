type TurnstileResponse = {
  success: boolean
  hostname?: string
  action?: string
  'error-codes'?: string[]
}

export async function verifyTurnstile({
  token,
  ip,
}: {
  token: string
  ip: string
}) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return process.env.NODE_ENV !== 'production'
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (ip !== 'unknown') {
    body.set('remoteip', ip)
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(5_000),
    },
  )

  if (!response.ok) return false

  const result = (await response.json()) as TurnstileResponse
  const allowedHosts = (process.env.TURNSTILE_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)

  const hostnameAllowed =
    allowedHosts.length === 0 ||
    Boolean(result.hostname && allowedHosts.includes(result.hostname))

  return Boolean(
    result.success &&
      result.action === 'contact_form' &&
      hostnameAllowed,
  )
}
