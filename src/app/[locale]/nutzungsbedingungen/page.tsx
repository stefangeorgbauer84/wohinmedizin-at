import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Nutzungsbedingungen — WohinMedizin.at',
  robots: { index: false },
}

export default function NutzungsbedingungenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#123047' }}>Nutzungsbedingungen</h1>
        <p className="text-sm mb-10" style={{ color: '#8AABB8' }}>Stand: Juni 2026</p>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-8" style={{ color: '#2D3F50' }}>

          <section>
            <h2 className="text-base font-semibold mb-2">1. Geltungsbereich</h2>
            <p>
              Diese Nutzungsbedingungen gelten für die Nutzung der Website WohinMedizin.at sowie aller damit verbundenen Dienste, insbesondere des WohinMedizin Navigators.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">2. Kein Ersatz für medizinische Beratung</h2>
            <p>
              Die auf WohinMedizin.at bereitgestellten Informationen — einschließlich der Ausgaben des Navigators — dienen ausschließlich der allgemeinen Orientierung und ersetzen in keinem Fall eine individuelle ärztliche Untersuchung, Diagnose oder Behandlung. Bei medizinischen Fragen oder Beschwerden wende dich an eine Ärztin, einen Arzt oder den ärztlichen Notfalldienst (Notruf: 141 oder 112).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">3. Nutzung des Navigators</h2>
            <p>
              Der Navigator verwendet ein KI-Sprachmodell (Anthropic Claude). Die generierten Antworten stellen keine medizinischen Diagnosen dar. Du nutzt den Navigator auf eigene Verantwortung. Gib keine personenbezogenen Daten (Name, Adresse, Geburtsdatum) in das Eingabefeld ein.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">4. Datenquelle und Urheberrecht</h2>
            <p>
              Krankheitsdaten stammen aus Orphanet (CC BY 4.0). Alle übrigen Inhalte dieser Website sind urheberrechtlich geschützt. Eine Vervielfältigung bedarf der schriftlichen Genehmigung des Betreibers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">5. Haftungsbeschränkung</h2>
            <p>
              Der Betreiber haftet nicht für Schäden, die aus der Nutzung oder Nichtnutzbarkeit der angebotenen Informationen entstehen. Die Inhalte werden mit größtmöglicher Sorgfalt erstellt; eine Gewähr für Richtigkeit, Vollständigkeit und Aktualität wird nicht übernommen.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">6. Änderungen</h2>
            <p>
              Der Betreiber behält sich vor, diese Nutzungsbedingungen jederzeit zu ändern. Die jeweils gültige Version ist auf dieser Seite abrufbar.
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-4">Diese Nutzungsbedingungen sind ein Entwurf und müssen vor dem öffentlichen Launch rechtlich geprüft und vervollständigt werden.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
