import { NextRequest, NextResponse } from 'next/server'
import { universalSearch } from '@/lib/search'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? req.headers.get('x-real-ip') ?? 'anonymous'
  const rl = await checkRateLimit(`api:${ip}`)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: rl.resetAt },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.trim().length < 2) {
    return Response.json({ diseases: [], symptoms: [], pages: [] })
  }
  const results = await universalSearch(q, 'de')
  return Response.json(results, {
    headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=300' },
  })
}
