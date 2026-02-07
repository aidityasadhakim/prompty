const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMITS = {
  general: { requests: 100, windowMs: 60 * 1000 },
  like: { requests: 10, windowMs: 60 * 1000 },
  upload: { requests: 5, windowMs: 60 * 60 * 1000 },
} as const

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

export function checkRateLimit(
  key: string,
  type: keyof typeof RATE_LIMITS = 'general',
): RateLimitResult {
  const limit = RATE_LIMITS[type]
  const now = Date.now()

  const record = rateLimitStore.get(key)

  if (!record || record.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs,
    })
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime: now + limit.windowMs,
    }
  }

  if (record.count >= limit.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: record.resetTime - now,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: limit.requests - record.count,
    resetTime: record.resetTime,
  }
}

export function getRateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(RATE_LIMITS.general.requests),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
    ...(result.retryAfter && {
      'Retry-After': String(Math.ceil(result.retryAfter / 1000)),
    }),
  }
}

export function isRateLimited(result: RateLimitResult): boolean {
  return !result.allowed
}

export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60 * 1000)
}
