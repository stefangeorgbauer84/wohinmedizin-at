import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { PostHogProvider } from '@/components/PostHogProvider'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer'

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
  // Austria-specific variant: de-AT points to same URL as de (default)
  hreflangAlternates['de-AT'] = SITE_URL
  // x-default points to German version (default locale)
  hreflangAlternates['x-default'] = SITE_URL

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: hreflangAlternates,
    },
    metadataBase: new URL(SITE_URL),
    // Defaults für alle Routen unter [locale]; Seiten mit eigenem openGraph
    // (Startseite, selten, wissen, …) überschreiben diese Werte.
    openGraph: {
      type: 'website',
      siteName: 'WohinMedizin.at',
      url: hreflangAlternates[locale] ?? SITE_URL,
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
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
    <PostHogProvider>
      <NextIntlClientProvider messages={messages}>
        <a
          href="#hauptinhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-donau-blau)] focus:text-white focus:font-semibold focus:text-sm focus:shadow-lg"
        >
          Zum Hauptinhalt springen
        </a>
        <div className="pb-16">
          {children}
        </div>
        <MedicalDisclaimer />
      </NextIntlClientProvider>
      <FeedbackWidget />
    </PostHogProvider>
  )
}
