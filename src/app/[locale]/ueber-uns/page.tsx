import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AboutPageJsonLd } from '@/components/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Über uns — WohinMedizin.at',
  description: 'WohinMedizin.at ist eine unabhängige Orientierungsplattform für Menschen in Österreich mit seltenen oder unklaren Erkrankungen. Erfahre mehr über unser Team, unsere Datenquellen und unsere Mission.',
  alternates: { canonical: `${SITE_URL}/ueber-uns` },
  openGraph: {
    title: 'Über uns — WohinMedizin.at',
    description: 'Unabhängige Orientierungsplattform für seltene Erkrankungen in Österreich. Über unser Team und unsere Datenquellen.',
    url: `${SITE_URL}/ueber-uns`,
    type: 'website',
  },
}

export default function UeberUnsPage() {
  return (
    <>
      <AboutPageJsonLd
        name="Über WohinMedizin.at"
        url={`${SITE_URL}/ueber-uns`}
        description="WohinMedizin.at ist eine unabhängige Orientierungsplattform für Menschen in Österreich mit seltenen oder unklaren Erkrankungen."
      />
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-4">Über WohinMedizin.at</h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-10">
            WohinMedizin.at hilft Menschen in Österreich, sich im Gesundheitssystem zu orientieren — besonders dann,
            wenn die Suche nach einer Diagnose lang und unübersichtlich ist.
          </p>

          <div className="space-y-8 text-[var(--color-muted)] leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Unsere Mission</h2>
              <p>
                Gerade bei seltenen Erkrankungen vergehen oft Jahre bis zur richtigen Diagnose. Wir bündeln verlässliche
                Informationen, aufbereitet für Betroffene und Angehörige, und zeigen konkrete Anlaufstellen — von der
                Hausärztin bis zum spezialisierten Referenzzentrum.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-3">So funktioniert die Plattform</h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li><strong className="text-[var(--color-medizin-navy)]">Symptome beschreiben</strong> — im Symptom-Finder oder Navigator deine Beschwerden eingeben.</li>
                <li><strong className="text-[var(--color-medizin-navy)]">Erkrankungen einordnen</strong> — passende seltene Diagnosen mit ORPHA-, ICD- und HPO-Bezug entdecken.</li>
                <li><strong className="text-[var(--color-medizin-navy)]">Anlaufstelle finden</strong> — gezielt zu Spezialzentren, Ambulanzen und Patientenorganisationen in Österreich navigieren.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Redaktion & Team</h2>
              <p className="mb-3">
                WohinMedizin.at wird von einem kleinen, interdisziplinären Team aus Medizin, Gesundheitskommunikation und
                Softwareentwicklung betrieben. Alle Krankheitseinträge werden redaktionell geprüft — verifizierte Einträge
                sind entsprechend gekennzeichnet.
              </p>
              <p>
                Redaktionelle Anfragen, Korrekturen und Kooperationen:{' '}
                <a href="mailto:redaktion@wohinmedizin.at" className="text-[var(--color-donau-blau)] underline">
                  redaktion@wohinmedizin.at
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Woher die Daten kommen</h2>
              <p>
                Die Krankheitsinformationen basieren auf der Orphanet-Datenbank (INSERM US14, CC BY 4.0) und der Human
                Phenotype Ontology (HPO). Österreichische Spezialzentren und Patientenorganisationen recherchieren und
                pflegen wir laufend.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Wichtiger Hinweis</h2>
              <p>
                WohinMedizin.at ersetzt keine ärztliche Beratung, Diagnose oder Behandlung. Wir bieten Orientierung —
                die medizinische Einschätzung trifft immer qualifiziertes Fachpersonal.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Partnerschaften &amp; Kontakt</h2>
              <p>
                Du vertrittst eine Patientenorganisation, ein Spezialzentrum oder möchtest mit uns zusammenarbeiten?
                Schreib uns an{' '}
                <a href="mailto:kontakt@wohinmedizin.at" className="text-[var(--color-donau-blau)] underline">
                  kontakt@wohinmedizin.at
                </a>.
              </p>
            </section>

          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/finden" className="px-5 py-2.5 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Symptom-Finder
            </Link>
            <Link href="/selten" className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-medizin-navy)] font-semibold text-sm hover:bg-[var(--color-warmweiss)] transition-colors">
              Seltene Erkrankungen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
