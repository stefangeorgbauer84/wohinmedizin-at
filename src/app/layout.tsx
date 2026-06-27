import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'),
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const locale = headersList.get('x-next-intl-locale') || 'de'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  // Cookielose, DSGVO-freundliche Analytics — nur wenn konfiguriert (kein Consent-Banner nötig)
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        {plausibleDomain && (
          <script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
        )}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
