import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import {
  getPickableSymptoms,
  findDiseasesBySymptoms,
  type DiseaseMatch,
} from '@/lib/symptom-finder'
import { SymptomSearchBox } from '@/components/SymptomSearchBox'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Symptom-Finder — Erkrankungen, die zu deinen Angaben passen | WohinMedizin.at',
  description:
    'Wähle deine Anzeichen in einfacher Sprache und sieh, welche seltenen Erkrankungen dazu passen könnten — und wer sie in Österreich behandelt. Keine Diagnose.',
  alternates: { canonical: `${SITE_URL}/finden` },
}

type SearchParams = Promise<{ s?: string | string[] }>

const STRENGTH_STYLE: Record<DiseaseMatch['strength'], { label: string; cls: string }> = {
  stark:   { label: 'starker Bezug',  cls: 'bg-violet-100 text-violet-800' },
  mittel:  { label: 'mittlerer Bezug', cls: 'bg-blue-50 text-blue-700' },
  schwach: { label: 'schwacher Bezug', cls: 'bg-slate-100 text-slate-600' },
}

export default async function FindenPage({ searchParams }: { searchParams: SearchParams }) {
  const { s } = await searchParams
  const selected = (Array.isArray(s) ? s : s ? [s] : []).filter(Boolean)

  const [categories, matches] = await Promise.all([
    getPickableSymptoms('de'),
    findDiseasesBySymptoms(selected, 'de'),
  ])

  const carry = selected.map((c) => `s=${encodeURIComponent(c)}`).join('&')

  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

          {/* Intro */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-selten-violett)] mb-2">
              Symptom-Finder
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">
              Was spürst du?
            </h1>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Wähle deine Anzeichen aus. Wir zeigen dir Erkrankungen, die dazu passen könnten —
              und im nächsten Schritt, wer sie in Österreich behandelt. Das ist
              <strong> keine Diagnose</strong>, sondern eine erste Orientierung.
            </p>
          </div>

          {/* Red-flag-Hinweis */}
          <div className="rounded-xl px-5 py-4 mb-8 text-sm flex gap-3 items-start bg-red-50 border border-red-100 text-red-800">
            <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              Bei akuten, starken oder plötzlichen Beschwerden (z.B. Atemnot, Lähmung, starke Schmerzen)
              warte nicht — wähle den Notruf <strong>144</strong> oder geh in die nächste Notaufnahme.
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-xl bg-white border border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
              Der Symptomkatalog wird gerade aufgebaut. Nutze in der Zwischenzeit den{' '}
              <Link href="/navigator" className="text-[var(--color-donau-blau)] underline">Navigator</Link>{' '}
              oder durchsuche die{' '}
              <Link href="/selten" className="text-[var(--color-donau-blau)] underline">Krankheitsübersicht</Link>.
            </div>
          ) : (
            <form method="get" className="mb-10">
              <SymptomSearchBox />
              <div className="space-y-3">
                {categories.map((cat, i) => {
                  // Erste Kategorie und solche mit getroffener Auswahl offen — Rest eingeklappt
                  // (kleineres initiales Rendering → bessere Core Web Vitals, weniger Überforderung).
                  const hasSelected = cat.symptoms.some((s) => selected.includes(s.hpo_code))
                  const open = i === 0 || hasSelected
                  return (
                  <details key={cat.category} data-symptom-group open={open} className="bg-white rounded-xl border border-[var(--color-border)] group">
                    <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between text-sm font-semibold text-[var(--color-medizin-navy)] rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-selten-violett)]">
                      <span>{cat.label} <span className="font-normal text-[var(--color-muted)]">({cat.symptoms.length})</span></span>
                      <svg className="transition-transform group-open:rotate-180" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </summary>
                    <div className="flex flex-wrap gap-2 px-5 pb-5">
                      {cat.symptoms.map((sym) => {
                        const isOn = selected.includes(sym.hpo_code)
                        return (
                          <label
                            key={sym.hpo_code}
                            data-symptom-name={sym.name.toLowerCase()}
                            className={`cursor-pointer select-none rounded-full px-4 py-2 min-h-[40px] inline-flex items-center text-sm border transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-selten-violett)] ${
                              isOn
                                ? 'bg-[var(--color-selten-violett)] text-white border-[var(--color-selten-violett)]'
                                : 'bg-white text-[var(--color-medizin-navy)] border-[var(--color-border)] hover:border-[var(--color-selten-violett)]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="s"
                              value={sym.hpo_code}
                              defaultChecked={isOn}
                              className="sr-only"
                            />
                            {sym.name}
                          </label>
                        )
                      })}
                    </div>
                  </details>
                  )
                })}
              </div>

              <div className="sticky bottom-0 mt-6 bg-[var(--color-warmweiss)] py-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Passende Erkrankungen zeigen
                </button>
                {selected.length > 0 && (
                  <Link href="/finden" className="text-sm text-[var(--color-muted)] underline">
                    Auswahl zurücksetzen
                  </Link>
                )}
              </div>
            </form>
          )}

          {/* Ergebnisse */}
          {selected.length > 0 && (
            <section className="mt-4">
              <h2 className="text-xl font-bold text-[var(--color-medizin-navy)] mb-1">
                {matches.length > 0
                  ? `${matches.length} Erkrankungen, die dazu passen könnten`
                  : 'Noch keine passenden Erkrankungen gefunden'}
              </h2>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                Sortiert nach Bezug zu deinen Angaben. Je spezifischer ein Anzeichen, desto stärker zählt es.
              </p>

              {matches.length === 0 ? (
                <div className="rounded-xl bg-white border border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
                  Wähle weitere oder spezifischere Anzeichen, oder beschreibe dein Anliegen frei im{' '}
                  <Link href="/navigator" className="text-[var(--color-donau-blau)] underline">Navigator</Link>.
                </div>
              ) : (
                <ul className="space-y-3">
                  {matches.map((m) => {
                    const st = STRENGTH_STYLE[m.strength]
                    return (
                      <li key={m.id}>
                        <Link
                          href={`/selten/${m.slug}${carry ? `?${carry}` : ''}`}
                          className="block bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-selten-violett)] hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <span className="font-semibold text-[var(--color-medizin-navy)]">{m.name}</span>
                            <span className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-1 ${st.cls}`}>
                              {st.label}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--color-muted)] mb-2">
                            {m.orpha_code ?? ''} · {m.match_count} von {m.selected_count} Angaben passen
                          </p>
                          {m.matched_labels.length > 0 && (
                            <p className="text-xs text-[var(--color-muted)]">
                              Passende Anzeichen: {m.matched_labels.slice(0, 5).join(', ')}
                            </p>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-[var(--color-muted)] mt-10 leading-relaxed">
            Dieser Finder ersetzt keine ärztliche Untersuchung. Er hilft dir nur, dich zu orientieren und
            besser vorbereitet ins Gespräch mit deiner Hausärztin oder deinem Hausarzt zu gehen. Datenquelle:
            Orphanet (CC BY 4.0) und HPO.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
