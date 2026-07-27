import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type RateLimitResult = {
  success: boolean
  reset: number
}

const localAttempts = new Map<string, number[]>()
let distributedRateLimit: Ratelimit | null = null

function getDistributedRateLimit() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null
  }

  distributedRateLimit ??= new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '10 m'),
    analytics: true,
    prefix: 'bax:contact-form',
  })

  return distributedRateLimit
}

function localRateLimit(identifier: string): RateLimitResult {
  const now = Date.now()
  const windowStart = now - 10 * 60 * 1000
  const recentAttempts = (localAttempts.get(identifier) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  )

  if (recentAttempts.length >= 5) {
    return { success: false, reset: recentAttempts[0] + 10 * 60 * 1000 }
  }

  recentAttempts.push(now)
  localAttempts.set(identifier, recentAttempts)
  return { success: true, reset: now + 10 * 60 * 1000 }
}

export async function checkFormRateLimit(identifier: string): Promise<RateLimitResult> {
  const distributed = getDistributedRateLimit()
  if (distributed) {
    const result = await distributed.limit(identifier)
    return { success: result.success, reset: result.reset }
  }

  // Local development remains usable without an external Redis account.
  // Production should always define the Upstash variables for multi-replica safety.
  return localRateLimit(identifier)
}
