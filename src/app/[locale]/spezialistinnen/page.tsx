import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { listAllCenters } from '@/lib/care-pathway'
import { VerifiedBadge } from '@/components/VerifiedBadge'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Spezialzentren für seltene Erkrankungen in Österreich — WohinMedizin.at',
  description:
    'Verzeichnis österreichischer Referenz- und Spezialzentren für seltene Erkrankungen, inklusive ERN-Anbindung und Kontakt.',
  alternates: { canonical: `${SITE_URL}/spezialistinnen` },
}

const CENTER_TYPE_LABELS: Record<string, string> = {
  ern: 'Europäisches Referenznetzwerk (ERN)',
  national_ref: 'Nationales Referenzzentrum',
  university: 'Universitätsklinik',
  outpatient: 'Spezialambulanz',
  selfhelp: 'Selbsthilfezentrum',
}
const COUNTRY_LABELS: Record<string, string> = { at: 'Österreich', de: 'Deutschland', ch: 'Schweiz', eu_other: 'EU' }

export default async function SpezialistinnenPage() {
  const centers = await listAllCenters()

  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">
            Spezialzentren in Österreich
          </h1>
          <p className="text-[var(--color-muted)] leading-relaxed mb-8 max-w-2xl">
            Referenz- und Spezialzentren für seltene Erkrankungen. Eine Überweisung erfolgt in der Regel über die
            Hausärztin oder den Hausarzt. Auf jeder Krankheitsseite findest du die jeweils passenden Zentren.
          </p>

          {centers.length === 0 ? (
            <div className="rounded-xl bg-white border border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
              Das Verzeichnis wird gerade aufgebaut. Durchsuche in der Zwischenzeit die{' '}
              <Link href="/selten" className="text-[var(--color-donau-blau)] underline">Krankheitsübersicht</Link>.
            </div>
          ) : (
            <ul className="space-y-3">
              {centers.map((c) => (
                <li key={c.slug ?? c.name} className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--color-medizin-navy)] flex items-center gap-2 flex-wrap">
                        {c.name}
                        {c.verified && <VerifiedBadge />}
                      </p>
                      <p className="text-xs text-[var(--color-muted)] mt-1">
                        {[CENTER_TYPE_LABELS[c.center_type ?? ''] ?? c.center_type, c.ern_network, c.city, COUNTRY_LABELS[c.country ?? ''] ?? c.country].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 text-xs text-[var(--color-donau-blau)] hover:underline whitespace-nowrap">
                        Website ↗
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-medizin-navy)]">
              Ihr Zentrum ist nicht gelistet oder die Angaben sind veraltet?
            </p>
            <Link href="/partner" className="shrink-0 text-sm font-semibold text-[var(--color-donau-blau)] hover:underline">
              Profil eintragen oder verifizieren lassen →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
