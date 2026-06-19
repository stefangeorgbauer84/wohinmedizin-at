import { NextRequest } from 'next/server'
import { universalSearch } from '@/lib/search'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.trim().length < 2) {
    return Response.json({ diseases: [], symptoms: [], pages: [] })
  }
  const results = await universalSearch(q, 'de')
  return Response.json(results, {
    headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=300' },
  })
}
