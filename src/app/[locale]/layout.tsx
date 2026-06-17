import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  // hreflang: de ohne Prefix (localePrefix: 'as-needed'), alle anderen mit Prefix
  const hreflangAlternates: Record<string, string> = {}
  for (const loc of routing.locales) {
    hreflangAlternates[loc] = loc === 'de' ? SITE_URL : `${SITE_URL}/${loc}`
  }
  hreflangAlternates['x-default'] = SITE_URL

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: hreflangAlternates,
    },
    metadataBase: new URL(SITE_URL),
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
