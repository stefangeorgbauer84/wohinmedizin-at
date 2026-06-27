import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const ADMIN_PATH = /^\/(payload)\/admin/

function getAllowedIPs(): Set<string> {
  const raw = process.env.ADMIN_ALLOWED_IPS ?? ''
  return new Set(raw.split(',').map(s => s.trim()).filter(Boolean))
}

export function middleware(request: NextRequest) {
  if (ADMIN_PATH.test(request.nextUrl.pathname)) {
    const allowedIPs = getAllowedIPs()
    if (allowedIPs.size > 0) {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        request.headers.get('x-real-ip') ??
        'unknown'
      if (!allowedIPs.has(ip)) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }
    return NextResponse.next()
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/(payload)/admin/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
