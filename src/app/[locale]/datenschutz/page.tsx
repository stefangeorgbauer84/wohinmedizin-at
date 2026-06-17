import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — WohinMedizin.at',
  robots: { index: false },
}

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#123047' }}>Datenschutzerklärung</h1>
        <p className="text-sm mb-10" style={{ color: '#8AABB8' }}>Stand: Juni 2026</p>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-8" style={{ color: '#2D3F50' }}>

          <section>
            <h2 className="text-base font-semibold mb-2">1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
              WohinMedizin.at — [Unternehmensname eintragen]<br />
              [Adresse eintragen]<br />
              E-Mail: <a href="mailto:datenschutz@wohinmedizin.at" className="underline">datenschutz@wohinmedizin.at</a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">2. Welche Daten wir verarbeiten</h2>
            <p>
              WohinMedizin.at ist primär eine Informationsplattform ohne Nutzerregistrierung. Folgende Daten werden verarbeitet:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Server-Logs:</strong> IP-Adresse, Zeitstempel, aufgerufene URL, Browser-Typ — erhoben durch unseren Hosting-Anbieter Vercel Inc. (USA) zur Betriebssicherheit. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse). Speicherdauer: bis 30 Tage.</li>
              <li><strong>Navigator-Eingaben:</strong> Freitext-Beschreibungen von Symptomen oder medizinischen Anliegen, die du freiwillig in den WohinMedizin Navigator eingibst. Diese Daten werden zur Verarbeitung an Anthropic Inc. (USA) übertragen (siehe Abschnitt 5). Sie werden von uns nicht dauerhaft gespeichert.</li>
              <li><strong>Kontaktanfragen:</strong> Falls du uns per E-Mail kontaktierst, verarbeiten wir deine E-Mail-Adresse und die Inhalte deiner Anfrage zur Bearbeitung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">3. Cookies und Tracking</h2>
            <p>
              WohinMedizin.at setzt derzeit keine Tracking-Cookies und verwendet keine Drittanbieter-Analysedienste (z.B. Google Analytics). Technisch notwendige Session-Cookies können durch den Browser für die Nutzung des Admin-Bereichs gesetzt werden. Diese sind nicht für öffentliche Nutzer relevant.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">4. Hosting — Vercel</h2>
            <p>
              Diese Website wird auf der Plattform von Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, USA gehostet. Beim Aufruf der Website werden automatisch Server-Log-Daten (inkl. IP-Adresse) an Vercel übertragen. Grundlage für diesen Datentransfer in die USA ist Art. 46 DSGVO (Standardvertragsklauseln). Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Vercel Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">5. WohinMedizin Navigator — Anthropic</h2>
            <p>
              Der Navigator verarbeitet deine Symptombeschreibung mithilfe eines KI-Sprachmodells von Anthropic, Inc. (USA). Deine Eingabe wird dazu an die Anthropic API übertragen. Dies kann als Verarbeitung von Gesundheitsdaten (Art. 9 DSGVO) einzustufen sein, wenn du gesundheitsbezogene Informationen eingibst.
            </p>
            <p className="mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 9 Abs. 2 lit. a DSGVO (ausdrückliche Einwilligung durch Nutzung des Dienstes nach Kenntnisnahme dieses Hinweises) in Verbindung mit Art. 49 Abs. 1 lit. a DSGVO für die Drittlandübertragung.
            </p>
            <p className="mt-2">
              <strong>Hinweis:</strong> Gib keine identifizierenden Informationen (Name, Geburtsdatum, Adresse) in das Navigator-Eingabefeld ein. Anthropic verarbeitet Eingaben gemäß seiner eigenen <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">Datenschutzerklärung</a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">6. Datenquelle — Orphanet</h2>
            <p>
              Informationen zu seltenen Erkrankungen stammen aus der Orphanet-Datenbank (INSERM, Paris, Frankreich), lizenziert unter <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">CC BY 4.0</a>. Diese Daten enthalten keine personenbezogenen Informationen.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">7. Deine Rechte</h2>
            <p>Du hast nach DSGVO folgende Rechte:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p className="mt-2">
              Um deine Rechte auszuüben, wende dich an: <a href="mailto:datenschutz@wohinmedizin.at" className="underline">datenschutz@wohinmedizin.at</a>
            </p>
            <p className="mt-2">
              Du hast außerdem das Recht, bei der österreichischen Datenschutzbehörde Beschwerde einzulegen:<br />
              <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="underline">Datenschutzbehörde (dsb.gv.at)</a>, Barichgasse 40–42, 1030 Wien.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">8. Änderungen dieser Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die jeweils aktuelle Version ist auf dieser Seite abrufbar.
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-4">Diese Datenschutzerklärung ist ein Entwurf und muss vor dem öffentlichen Launch durch eine rechtlich qualifizierte Person geprüft und mit den vollständigen Unternehmensdaten vervollständigt werden.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
