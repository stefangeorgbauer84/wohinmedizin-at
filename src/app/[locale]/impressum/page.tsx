import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Impressum — WohinMedizin.at',
  robots: { index: false },
}

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#123047' }}>Impressum</h1>

        <section className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6" style={{ color: '#2D3F50' }}>
          <div>
            <h2 className="text-base font-semibold mb-1">Medieninhaber und Herausgeber</h2>
            <p>
              WohinMedizin.at<br />
              [Unternehmensname / Trägerorganisation eintragen]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort], Österreich
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-1">Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:kontakt@wohinmedizin.at" className="underline">kontakt@wohinmedizin.at</a>
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-1">Unternehmensgegenstand</h2>
            <p>
              Bereitstellung von medizinischen Orientierungsinformationen für Österreich. Die Inhalte dieser Website dienen ausschließlich der allgemeinen Information und ersetzen keine ärztliche Beratung, Diagnose oder Behandlung.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-1">Aufsichtsbehörde</h2>
            <p>[Zuständige Behörde eintragen, z.B. Bezirksverwaltungsbehörde]</p>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-1">Haftungsausschluss</h2>
            <p>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich. Medizinische Inhalte auf WohinMedizin.at dienen der allgemeinen Information und ersetzen in keinem Fall eine professionelle Beratung, Diagnose oder Behandlung durch ausgebildete Ärztinnen und Ärzte.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-1">Datenquelle seltene Erkrankungen</h2>
            <p>
              Die Informationen zu seltenen Erkrankungen stammen aus der{' '}
              <a href="https://www.orpha.net" target="_blank" rel="noopener noreferrer" className="underline">Orphanet-Datenbank</a>{' '}
              (INSERM, Paris) und werden unter der Lizenz{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">CC BY 4.0</a>{' '}
              genutzt. Quelle: Orphanet — www.orpha.net
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-1">Urheberrecht</h2>
            <p>
              Die auf dieser Website veröffentlichten Inhalte (Texte, Grafiken, Logos) unterliegen dem österreichischen Urheberrecht. Eine Vervielfältigung oder Verwendung dieser Inhalte bedarf der schriftlichen Zustimmung des Medieninhabers.
            </p>
          </div>

          <p className="text-xs text-gray-400 pt-4">Stand: Juni 2026 — Dieses Impressum ist ein Entwurf und muss vor dem öffentlichen Launch mit den vollständigen Unternehmensdaten vervollständigt werden.</p>
        </section>
      </div>
      <Footer />
    </main>
  )
}
