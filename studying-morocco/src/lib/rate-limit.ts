import 'server-only'

import { headers } from 'next/headers'

type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()

export const clientIP = async () => {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
}

/**
 * Small in-memory fixed-window limiter. On serverless it is per instance, which
 * is enough to blunt form spam; put a WAF rule in front for stronger guarantees.
 */
export const rateLimit = async (scope: string, limit: number, windowMs: number): Promise<boolean> => {
  const key = `${scope}:${await clientIP()}`
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    if (buckets.size > 5000) for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k)
    return true
  }
  bucket.count += 1
  return bucket.count <= limit
}
