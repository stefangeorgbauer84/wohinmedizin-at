import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { listCenters } from '@/lib/care-pathway'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { MedicalOrganizationJsonLd } from '@/components/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Spezialist:innen & Spezialzentren in Österreich — WohinMedizin.at',
  description: 'Verzeichnis österreichischer Spezialist:innen, Referenz- und Spezialzentren für seltene Erkrankungen — Kassenarzt, Wahlarzt und ERN-zertifizierte Einrichtungen in ganz Österreich.',
  alternates: { canonical: `${SITE_URL}/spezialistinnen` },
  openGraph: {
    title: 'Spezialist:innen & Spezialzentren in Österreich — WohinMedizin.at',
    description: 'Kassenarzt, Wahlarzt und ERN-zertifizierte Spezialzentren für seltene Erkrankungen in Österreich finden.',
    url: `${SITE_URL}/spezialistinnen`,
    type: 'website',
  },
}

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

type SearchParams = Promise<{ q?: string; type?: string; country?: string; page?: string }>

export default async function SpezialistinnenPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, type, country, page } = await searchParams
  const currentPage = parseInt(page ?? '1', 10)
  const { centers, total } = await listCenters({ q, type, country, page: currentPage })
  const totalPages = Math.ceil(total / 20)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { q, type, country, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    const str = params.toString()
    return `/spezialistinnen${str ? `?${str}` : ''}`
  }

  return (
    <>
      <MedicalOrganizationJsonLd
        name="WohinMedizin.at — Spezialist:innen-Verzeichnis"
        url={`${SITE_URL}/spezialistinnen`}
        description="Verzeichnis österreichischer Spezialist:innen und Referenzzentren für seltene Erkrankungen, inklusive Kassenarzt- und Wahlarzt-Einrichtungen sowie ERN-Netzwerke."
      />
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">
            Spezialist:innen &amp; Spezialzentren in Österreich
          </h1>
          <p className="text-[var(--color-muted)] leading-relaxed mb-2 max-w-2xl">
            Durchsuche österreichische Referenz- und Spezialzentren für seltene Erkrankungen — von
            Kassenarzt- und Wahlarzt-Einrichtungen bis hin zu ERN-zertifizierten Universitätskliniken.
          </p>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6 max-w-2xl">
            Eine Überweisung erfolgt in der Regel über die Hausärztin oder den Hausarzt.
          </p>

          <form method="GET" action="/spezialistinnen" className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="search"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Nach Name, Stadt oder ERN-Netzwerk suchen …"
              className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]"
            />
            <select name="type" defaultValue={type ?? ''}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]">
              <option value="">Alle Typen</option>
              {Object.entries(CENTER_TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <select name="country" defaultValue={country ?? ''}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]">
              <option value="">Alle Länder</option>
              {Object.entries(COUNTRY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl wohin-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Suchen
            </button>
          </form>

          <p className="text-xs text-[var(--color-muted)] mb-4">
            {total} {total === 1 ? 'Zentrum' : 'Zentren'} gefunden
          </p>

          {centers.length === 0 ? (
            <div className="rounded-xl bg-white border border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
              Keine Zentren gefunden. Passe deine Suche an oder{' '}
              <Link href="/spezialistinnen" className="text-[var(--color-donau-blau)] underline">
                alle anzeigen
              </Link>.
            </div>
          ) : (
            <ul className="space-y-3">
              {centers.map((c) => (
                <li key={c.slug ?? c.name}>
                  {c.slug ? (
                    <Link href={`/spezialistinnen/${c.slug}`}
                      className="block bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-donau-blau)] hover:shadow-sm transition-all">
                      <CenterCard c={c} />
                    </Link>
                  ) : (
                    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                      <CenterCard c={c} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav aria-label="Seiten" className="flex gap-2 mt-8 justify-center">
              {currentPage > 1 && (
                <Link href={buildUrl({ page: String(currentPage - 1) })}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:border-[var(--color-donau-blau)]">
                  Zurueck
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-[var(--color-muted)]">
                Seite {currentPage} von {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link href={buildUrl({ page: String(currentPage + 1) })}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:border-[var(--color-donau-blau)]">
                  Weiter
                </Link>
              )}
            </nav>
          )}

          <div className="mt-10 rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-medizin-navy)]">
              Ihr Zentrum ist nicht gelistet oder die Angaben sind veraltet?
            </p>
            <Link href="/partner" className="shrink-0 text-sm font-semibold text-[var(--color-donau-blau)] hover:underline">
              Profil eintragen oder verifizieren lassen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function CenterCard({ c }: { c: import('@/lib/care-pathway').CareCenter }) {
  const TYPE_LABELS: Record<string, string> = {
    ern: 'ERN', national_ref: 'Nationales Referenzzentrum', university: 'Universitätsklinik',
    outpatient: 'Spezialambulanz', selfhelp: 'Selbsthilfezentrum',
  }
  const CTRY: Record<string, string> = { at: 'Österreich', de: 'Deutschland', ch: 'Schweiz', eu_other: 'EU' }
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-[var(--color-medizin-navy)] flex items-center gap-2 flex-wrap">
          {c.name}
          {c.verified && <VerifiedBadge />}
        </p>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          {[TYPE_LABELS[c.center_type ?? ''] ?? c.center_type, c.ern_network, c.city,
            CTRY[c.country ?? ''] ?? c.country].filter(Boolean).join(' · ')}
        </p>
      </div>
      {c.website && (
        <a href={c.website} target="_blank" rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-xs text-[var(--color-donau-blau)] hover:underline whitespace-nowrap">
          Website
        </a>
      )}
    </div>
  )
}
