import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Über uns — WohinMedizin.at',
  description: 'WohinMedizin.at hilft Menschen in Österreich, die richtige medizinische Anlaufstelle zu finden — mit Fokus auf seltene Erkrankungen.',
  alternates: { canonical: `${SITE_URL}/ueber-uns` },
}

export default function UeberUnsPage() {
  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-4">Über WohinMedizin.at</h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
            WohinMedizin.at hilft Menschen in Österreich, sich im Gesundheitssystem zu orientieren — besonders dann,
            wenn die Suche nach einer Diagnose lang und unübersichtlich ist.
          </p>

          <div className="space-y-7 text-[var(--color-muted)] leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Unser Anliegen</h2>
              <p>
                Gerade bei seltenen Erkrankungen vergehen oft Jahre bis zur richtigen Diagnose. Wir bündeln verlässliche
                Informationen, verständlich aufbereitet, und zeigen konkrete Anlaufstellen — von der Hausärztin bis zum
                spezialisierten Zentrum.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Woher die Daten kommen</h2>
              <p>
                Die Krankheitsinformationen basieren auf der Orphanet-Datenbank (INSERM US14, CC BY 4.0) und der Human
                Phenotype Ontology (HPO). Österreichische Spezialzentren und Patientenorganisationen recherchieren und
                pflegen wir laufend. Redaktionell geprüfte Einträge sind als solche gekennzeichnet.
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
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Partnerschaften & Kontakt</h2>
              <p>
                Du vertrittst eine Patientenorganisation, ein Spezialzentrum oder möchtest mit uns zusammenarbeiten?
                Schreib uns an <a href="mailto:kontakt@wohinmedizin.at" className="text-[var(--color-donau-blau)] underline">kontakt@wohinmedizin.at</a>.
              </p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/finden" className="px-5 py-2.5 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity">Symptom-Finder</Link>
            <Link href="/selten" className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-medizin-navy)] font-semibold text-sm hover:bg-[var(--color-warmweiss)] transition-colors">Seltene Erkrankungen</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
