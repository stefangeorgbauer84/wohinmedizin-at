import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getCenterBySlug } from '@/lib/care-pathway'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { jsonLdString } from '@/lib/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'
export const revalidate = 3600

type Props = { params: Promise<{ locale: string; slug: string }> }

const CENTER_TYPE_LABELS: Record<string, string> = {
  ern: 'Europäisches Referenznetzwerk (ERN)',
  national_ref: 'Nationales Referenzzentrum',
  university: 'Universitätsklinik',
  outpatient: 'Spezialambulanz',
  selfhelp: 'Selbsthilfezentrum',
}
const COUNTRY_LABELS: Record<string, string> = {
  at: 'Österreich', de: 'Deutschland', ch: 'Schweiz', eu_other: 'EU',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const center = await getCenterBySlug(slug)
  if (!center) return { title: 'Zentrum nicht gefunden' }
  const typeLabel = CENTER_TYPE_LABELS[center.center_type ?? ''] ?? 'Spezialzentrum'
  const title = `${center.name} — ${typeLabel} | WohinMedizin.at`
  const description = center.description?.slice(0, 160)
    ?? `${center.name} ist ein ${typeLabel} in ${center.city ?? COUNTRY_LABELS[center.country ?? ''] ?? 'Österreich'} für seltene Erkrankungen.`
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/spezialistinnen/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/spezialistinnen/${slug}`, siteName: 'WohinMedizin.at', locale: 'de_AT', type: 'article' },
  }
}

export default async function CenterDetailPage({ params }: Props) {
  const { slug } = await params
  const center = await getCenterBySlug(slug)
  if (!center) notFound()

  const typeLabel = CENTER_TYPE_LABELS[center.center_type ?? ''] ?? center.center_type
  const countryLabel = COUNTRY_LABELS[center.country ?? ''] ?? center.country

  const clinicLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: center.name,
    ...(center.website ? { url: center.website } : {}),
    ...(center.phone ? { telephone: center.phone } : {}),
    ...(center.address ? {
      address: {
        '@type': 'PostalAddress',
        streetAddress: center.address,
        addressLocality: center.city,
        addressCountry: center.country?.toUpperCase(),
      },
    } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(clinicLd) }} />
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-muted)] mb-6">
            <Link href="/spezialistinnen" className="hover:text-[var(--color-donau-blau)]">Spezialzentren</Link>
            <span className="mx-1.5">›</span>
            <span>{center.name}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-medizin-navy)] flex flex-wrap items-center gap-3 mb-2">
              {center.name}
              {center.verified && <VerifiedBadge />}
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              {[typeLabel, center.ern_network, center.city, countryLabel].filter(Boolean).join(' · ')}
            </p>
          </div>

          {center.description && (
            <p className="text-[var(--color-muted)] leading-relaxed mb-8">{center.description}</p>
          )}

          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
            <h2 className="font-semibold text-[var(--color-medizin-navy)] mb-4">Kontakt</h2>
            <dl className="space-y-2 text-sm">
              {center.address && (
                <div className="flex gap-3">
                  <dt className="text-[var(--color-muted)] w-20 shrink-0">Adresse</dt>
                  <dd className="text-[var(--color-medizin-navy)]">{center.address}</dd>
                </div>
              )}
              {center.phone && (
                <div className="flex gap-3">
                  <dt className="text-[var(--color-muted)] w-20 shrink-0">Telefon</dt>
                  <dd><a href={`tel:${center.phone}`} className="text-[var(--color-donau-blau)] hover:underline">{center.phone}</a></dd>
                </div>
              )}
              {center.email && (
                <div className="flex gap-3">
                  <dt className="text-[var(--color-muted)] w-20 shrink-0">E-Mail</dt>
                  <dd><a href={`mailto:${center.email}`} className="text-[var(--color-donau-blau)] hover:underline">{center.email}</a></dd>
                </div>
              )}
              {center.website && (
                <div className="flex gap-3">
                  <dt className="text-[var(--color-muted)] w-20 shrink-0">Website</dt>
                  <dd>
                    <a href={center.website} target="_blank" rel="noopener noreferrer"
                      className="text-[var(--color-donau-blau)] hover:underline">
                      {center.website.replace(/^https?:\/\//, '')}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-5 text-sm text-[var(--color-medizin-navy)] mb-8">
            Eine Überweisung an dieses Zentrum erfolgt in der Regel durch die behandelnde Hausärztin oder den Hausarzt. Bitte frage dort nach einer gezielten Weiterleitung.
          </div>

          <Link href="/spezialistinnen" className="text-sm text-[var(--color-donau-blau)] hover:underline">
            Alle Spezialzentren
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
