import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { listDiseases } from '@/lib/diseases'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Seltene Erkrankungen — WohinMedizin.at',
  description:
    'Informationen zu über 11.000 seltenen Erkrankungen: Symptome, Codes, Vererbung, Prävalenz und österreichische Anlaufstellen.',
  alternates: { canonical: `${SITE_URL}/selten` },
  openGraph: {
    title: 'Seltene Erkrankungen — WohinMedizin.at',
    description:
      'Über 11.000 seltene Erkrankungen mit ORPHA-Code, HPO-Symptomen, ICD-11-Codes und österreichischen Spezialzentren.',
    url: `${SITE_URL}/selten`,
    siteName: 'WohinMedizin.at',
    locale: 'de_AT',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Seltene Erkrankungen — WohinMedizin.at',
    description: 'Über 11.000 seltene Erkrankungen mit österreichischen Anlaufstellen.',
  },
}

const ORGAN_LABELS: Record<string, string> = {
  neurological:               'Neurologisch',
  cardiovascular:             'Herz & Gefäße',
  musculoskeletal:            'Bewegungsapparat',
  hematological_immunological:'Blut & Immunsystem',
  endocrine_metabolic:        'Stoffwechsel',
  dermatological:             'Haut',
  gastrointestinal:           'Magen-Darm',
  respiratory:                'Atemwege',
  urogenital:                 'Niere & Harnwege',
  visual:                     'Augen',
  auditory:                   'Ohren',
  reproductive:               'Reproduktion',
  psychiatric:                'Psychiatrisch',
  multisystemic:              'Multisystemisch',
  oncological:                'Onkologisch',
}

// Label → URL-Slug der Bereichs-Hub-Seiten (interne Verlinkung)
const ORGAN_HUB_SLUG: Record<string, string> = {
  'Neurologisch': 'neurologisch',
  'Herz & Gefäße': 'herz-gefaesse',
  'Bewegungsapparat': 'bewegungsapparat',
  'Blut & Immunsystem': 'blut-immunsystem',
  'Stoffwechsel': 'stoffwechsel',
  'Haut': 'haut',
  'Magen-Darm': 'magen-darm',
  'Niere & Harnwege': 'niere-harnwege',
  'Augen': 'augen',
  'Ohren': 'ohren',
  'Psychiatrisch': 'psychiatrisch',
  'Multisystemisch': 'multisystemisch',
  'Onkologisch': 'onkologisch',
}

type SearchParams = Promise<{ q?: string; organ?: string; page?: string }>

async function DiseaseGrid({ q, organ, page }: { q?: string; organ?: string; page: number }) {
  const { diseases, total } = await listDiseases({ q, organ, page })
  const totalPages = Math.ceil(total / 24)

  if (diseases.length === 0) {
    return (
      <div className="text-center py-20 text-[var(--color-muted)]">
        <p className="text-lg font-medium mb-2">Keine Erkrankungen gefunden</p>
        <p className="text-sm">Bitte passe deine Suche an oder wähle einen anderen Filter.</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        {total.toLocaleString('de-AT')} Erkrankungen{q ? ` für „${q}"` : ''}
        {organ ? ` · Filter: ${ORGAN_LABELS[organ] ?? organ}` : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {diseases.map((d) => (
          <Link
            key={d.id}
            href={`/selten/${d.slug}`}
            className="group flex flex-col gap-3 p-5 rounded-xl bg-white border border-[var(--color-border)] hover:border-[var(--color-selten-violett)] hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-semibold text-[var(--color-medizin-navy)] group-hover:text-[var(--color-selten-violett)] transition-colors leading-snug line-clamp-2">
                {d.name}
              </h2>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {d.orpha_code && (
                  <span className="text-xs font-mono bg-[var(--color-morgen-hellblau)] text-[var(--color-donau-blau)] px-2 py-0.5 rounded-full">
                    {d.orpha_code.replace('ORPHA:', '')}
                  </span>
                )}
                {d.editorial_status === 'published' && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    Geprüft
                  </span>
                )}
              </div>
            </div>

            {d.brief_description && (
              <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-3">
                {d.brief_description}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {d.organ_systems.slice(0, 3).map((os) => (
                <span
                  key={os}
                  className="text-xs bg-[var(--color-warmweiss)] border border-[var(--color-border)] text-[var(--color-muted)] px-2 py-0.5 rounded-full"
                >
                  {ORGAN_LABELS[os] ?? os}
                </span>
              ))}
              {d.icd10_code && (
                <span className="text-xs font-mono text-[var(--color-muted)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                  ICD-10: {d.icd10_code}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Seitennavigation">
          {page > 1 && (
            <Link
              href={`/selten?${new URLSearchParams({ ...(q ? { q } : {}), ...(organ ? { organ } : {}), page: String(page - 1) })}`}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-morgen-hellblau)] transition-colors"
            >
              Zurück
            </Link>
          )}
          <span className="text-sm text-[var(--color-muted)] px-3">
            Seite {page} von {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/selten?${new URLSearchParams({ ...(q ? { q } : {}), ...(organ ? { organ } : {}), page: String(page + 1) })}`}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:bg-[var(--color-morgen-hellblau)] transition-colors"
            >
              Weiter
            </Link>
          )}
        </nav>
      )}
    </>
  )
}

export default async function SeltenPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, organ, page: pageStr } = await searchParams
  const parsedPage = parseInt(pageStr ?? '1', 10)
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1">

        {/* Hero */}
        <section className="selten-gradient py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs text-white mb-4">
                <span className="w-2 h-2 rounded-full bg-white/60" aria-hidden="true" />
                Orphanet-Datenbank · CC BY 4.0
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Seltene Erkrankungen
              </h1>
              <p className="text-white/80 leading-relaxed text-lg">
                Informationen zu über 11.000 seltenen Erkrankungen — Symptome, Codes, Vererbung und
                österreichische Anlaufstellen.
              </p>
            </div>
          </div>
        </section>

        {/* Suche + Filter + Ergebnisse */}
        <section className="py-10 bg-[var(--color-warmweiss)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Symptom-Finder CTA — der Einstieg für Betroffene ohne Krankheitsnamen */}
            <Link
              href="/finden"
              className="flex items-center gap-4 mb-8 p-5 rounded-xl bg-violet-50 border border-violet-200 hover:border-[var(--color-selten-violett)] transition-colors group"
            >
              <span className="shrink-0 w-11 h-11 rounded-xl wohin-gradient text-white flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--color-medizin-navy)] group-hover:text-[var(--color-selten-violett)] transition-colors">
                  Du kennst den Namen nicht? Starte beim Symptom-Finder
                </span>
                <span className="block text-sm text-[var(--color-muted)]">
                  Wähle deine Anzeichen und sieh, welche Erkrankungen dazu passen könnten.
                </span>
              </span>
            </Link>

            {/* Suchleiste */}
            <form method="GET" action="" className="mb-6">
              <div className="flex gap-3 max-w-xl">
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Erkrankung suchen (z.B. Wilson, Marfan, Gaucher…)"
                  className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-selten-violett)] focus:border-transparent"
                  aria-label="Erkrankung suchen"
                />
                {organ && <input type="hidden" name="organ" value={organ} />}
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[var(--color-selten-violett)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Suchen
                </button>
              </div>
            </form>

            {/* Organ-Filter */}
            <div className="flex flex-wrap gap-2 mb-8" role="list" aria-label="Nach Organsystem filtern">
              <Link
                href={q ? `/selten?q=${encodeURIComponent(q)}` : '/selten'}
                role="listitem"
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  !organ
                    ? 'bg-[var(--color-selten-violett)] text-white border-[var(--color-selten-violett)]'
                    : 'bg-white border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-selten-violett)] hover:text-[var(--color-selten-violett)]'
                }`}
              >
                Alle
              </Link>
              {Object.entries(ORGAN_LABELS).map(([value, label]) => (
                <Link
                  key={value}
                  href={`/selten?${new URLSearchParams({ ...(q ? { q } : {}), organ: value })}`}
                  role="listitem"
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    organ === value
                      ? 'bg-[var(--color-selten-violett)] text-white border-[var(--color-selten-violett)]'
                      : 'bg-white border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-selten-violett)] hover:text-[var(--color-selten-violett)]'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Bereiche durchstöbern — interne Verlinkung zu den Hub-Seiten (nur auf der Standardansicht) */}
            {!q && !organ && (
              <div className="mb-8 rounded-xl bg-white border border-[var(--color-border)] p-5">
                <p className="text-sm font-semibold text-[var(--color-medizin-navy)] mb-3">Nach Bereich durchstöbern</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ORGAN_HUB_SLUG).map(([label, slug]) => (
                    <Link key={slug} href={`/selten/bereich/${slug}`}
                      className="text-sm bg-[var(--color-warmweiss)] border border-[var(--color-border)] text-[var(--color-medizin-navy)] px-3 py-1.5 rounded-full hover:border-[var(--color-selten-violett)] hover:text-[var(--color-selten-violett)] transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ergebnisse */}
            <Suspense fallback={<div className="py-20 text-center text-[var(--color-muted)]">Lade Erkrankungen…</div>}>
              <DiseaseGrid q={q} organ={organ} page={page} />
            </Suspense>
          </div>
        </section>

        {/* Attribution */}
        <section className="py-6 bg-white border-t border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-[var(--color-muted)]">
              Daten bereitgestellt von{' '}
              <a href="https://www.orphadata.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-donau-blau)]">
                Orphanet (INSERM US14)
              </a>
              , lizenziert unter{' '}
              <a href="https://creativecommons.org/licenses/by/4.0" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-donau-blau)]">
                CC BY 4.0
              </a>
              . Medizinische Angaben ohne Gewähr — kein Ersatz für ärztliche Beratung.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
