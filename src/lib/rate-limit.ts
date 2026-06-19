/**
 * Einfacher IP-basierter Rate Limiter (Sliding Window, In-Memory).
 *
 * Einschränkung: Funktioniert nur innerhalb einer einzelnen Serverless-Instanz.
 * Für Multi-Instance-Produktion (Vercel mit mehreren Lambdas) muss dieser
 * Ansatz durch @upstash/ratelimit + Upstash Redis ersetzt werden.
 *
 * Empfohlenes Upgrade:
 *   npm install @upstash/ratelimit @upstash/redis
 *   https://github.com/upstash/ratelimit
 */

interface Window {
  count: number
  resetAt: number
}

// Kein globaler State in Next.js Edge Runtime — wir nutzen module-level Map
// (lebt so lange wie die Lambda-Instanz warm ist)
const store = new Map<string, Window>()

// Ablauf-Cleanup alle 5 Minuten
let cleanupTimer: ReturnType<typeof setInterval> | null = null
function ensureCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, win] of store.entries()) {
      if (win.resetAt < now) store.delete(key)
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Prüft ob eine IP das Rate-Limit überschritten hat.
 *
 * @param ip       Client-IP-Adresse
 * @param limit    Max. Anfragen pro Zeitfenster (default: 10)
 * @param windowMs Zeitfenster in ms (default: 60.000 = 1 Minute)
 */
export function checkRateLimit(
  ip: string,
  limit = 10,
  windowMs = 60_000,
): RateLimitResult {
  ensureCleanup()

  const now = Date.now()
  const existing = store.get(ip)

  if (!existing || existing.resetAt < now) {
    // Neues Fenster
    const resetAt = now + windowMs
    store.set(ip, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count++
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt }
}
