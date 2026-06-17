import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all paths except: Payload admin, API routes, Next.js internals, static files
  matcher: [
    '/((?!admin|api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
