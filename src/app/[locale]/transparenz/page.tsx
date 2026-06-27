import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Transparenz — Datenquellen, Redaktion & Finanzierung — WohinMedizin.at',
  description:
    'Wie WohinMedizin.at arbeitet: Datenquellen (Orphanet, PubMed, ICD-11), Redaktionsprozess, medizinische Prüfung, Aktualität der Inhalte und Finanzierungsmodell — offen erklärt.',
  alternates: { canonical: `${SITE_URL}/transparenz` },
  openGraph: {
    title: 'Transparenz — WohinMedizin.at',
    description:
      'Datenquellen, Redaktionsprozess und Finanzierungsmodell von WohinMedizin.at — vollständig offengelegt.',
    url: `${SITE_URL}/transparenz`,
    siteName: 'WohinMedizin.at',
    locale: 'de_AT',
    type: 'website',
  },
}

export default function TransparenzPage() {
  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">
            Transparenz — Quellen, Redaktion & Finanzierung
          </h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-10">
            WohinMedizin.at ist eine medizinische Orientierungsplattform für Österreich. Wir legen hier offen, woher
            unsere Inhalte stammen, wie sie geprüft werden, wie oft sie aktualisiert werden — und wie wir die Plattform
            finanzieren.
          </p>

          {/* ── Drei Kernregeln ── */}
          <div className="rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-5 mb-10">
            <h2 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-3">Unsere drei festen Regeln</h2>
            <ul className="space-y-2 text-sm text-[var(--color-medizin-navy)]">
              <li className="flex gap-2">
                <span className="text-[var(--color-alpen-mint)] shrink-0">✓</span>
                Medizinische Inhalte und Reihenfolgen sind <strong>nicht käuflich</strong>. Kein Sponsor und kein Zentrum erhält einen Ranking-Vorteil.
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--color-alpen-mint)] shrink-0">✓</span>
                Jede kommerzielle Beziehung ist <strong>sichtbar gekennzeichnet</strong> — &#8222;Anzeige&#8220;, &#8222;Verifiziert&#8220; oder &#8222;Unterstützt durch …&#8220;.
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--color-alpen-mint)] shrink-0">✓</span>
                Wir machen <strong>keine</strong> Publikumswerbung für verschreibungspflichtige Medikamente und keine verdeckte Beeinflussung.
              </li>
            </ul>
          </div>

          <div className="space-y-10 text-[var(--color-muted)] leading-relaxed">

            {/* ── Teil I: Datenquellen ── */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-medizin-navy)] mb-4">
                I. Datenquellen
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Orphanet — ORPHA-Codes für seltene Erkrankungen
                  </h3>
                  <p>
                    Für den Bereich Seltene Erkrankungen nutzen wir die Orphanet-Datenbank, die weltweit größte und
                    anerkannteste Quelle für seltene Krankheiten. Orphanet vergibt eindeutige ORPHA-Codes (z.B. ORPHA:558
                    für das Marfan-Syndrom), die internationale Vergleichbarkeit und semantische Präzision ermöglichen.
                    Orphanet-Inhalte stehen unter der Lizenz CC BY 4.0 — das bedeutet, wir dürfen sie nutzen und
                    weitergeben, solange wir die Quelle nennen. Das tun wir auf jeder betreffenden Seite. Orphanet
                    wird vom INSERM (Frankreich) koordiniert und von der Europäischen Kommission gefördert; die Daten
                    werden von medizinischen Expert:innen laufend gepflegt.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    ICD-11 und ICD-10 — internationale Klassifikationssysteme
                  </h3>
                  <p>
                    Alle Erkrankungsprofile werden mit ICD-11-Stamm-Codes (MMS-Linearisierung der WHO) und — soweit
                    für Österreich relevant — mit ICD-10-WHO-Codes versehen. ICD-11 ist der globale Standard für
                    Mortalitäts- und Morbiditätsstatistik; in Österreich ist ICD-10 Stand 2026 noch das gültige
                    Abrechnungssystem. Wir bilden beide Versionen ab, um die Inhalte klinisch und administrativ
                    verwendbar zu machen. Die ICD-Systematik ermöglicht außerdem eine polyhierarchische
                    Einordnung — eine Erkrankung kann gleichzeitig mehrere Organsysteme betreffen, was der
                    medizinischen Realität entspricht.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    PubMed und medizinische Fachliteratur
                  </h3>
                  <p>
                    Für die inhaltliche Aufbereitung von Erkrankungen, Symptomen und Behandlungsoptionen greifen
                    wir auf peer-reviewte Fachliteratur aus PubMed/MEDLINE zurück. Nur publizierte und
                    qualitätsgesicherte Studien fließen in die Inhalte ein. Wir unterscheiden dabei zwischen
                    systematischen Reviews und Metaanalysen (höchste Evidenzstufe), randomisierten kontrollierten
                    Studien, Beobachtungsstudien sowie Fallserien und Expertenmeinungen. Die verwendeten
                    Hauptquellen werden auf jeder Krankheitsseite dokumentiert und sind für alle Nutzer:innen
                    nachvollziehbar.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Österreichische Fachgesellschaften und offizielle Stellen
                  </h3>
                  <p>
                    Für den österreichischen Kontext — Kassenstrukturen, Überweisungswege, regionale
                    Spezialisierungszentren, gesetzliche Regelungen — nutzen wir die Publikationen
                    österreichischer Fachgesellschaften (z.B. Österreichische Gesellschaft für Innere Medizin,
                    Österreichische Krebshilfe, Österreichische Gesellschaft für Neurologie), offizielle Stellen
                    wie das Bundesministerium für Gesundheit sowie das Informationsportal gesundheit.gv.at.
                    Darüber hinaus kooperieren wir mit ERN-Referenzzentren (European Reference Networks) und
                    österreichischen Universitätskliniken, die Informationen zu seltenen Erkrankungen bereitstellen.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Weitere Terminologie-Quellen
                  </h3>
                  <p>
                    Ergänzend zu den oben genannten Hauptquellen nutzen wir SNOMED CT für semantische
                    EHR-Interoperabilität, OMIM (Online Mendelian Inheritance in Man) für genetische
                    Erkrankungen sowie die Human Phenotype Ontology (HPO) für standardisierte Phänotyp-Codes.
                    Diese Terminologien ermöglichen maschinell lesbare Verknüpfungen zwischen Erkrankungen,
                    Symptomen und Genen — eine Grundlage für zukünftige Funktionen wie semantische Suche und
                    Differenzialdiagnoseunterstützung.
                  </p>
                </div>
              </div>
            </section>

            {/* ── Teil II: Redaktionsprozess ── */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-medizin-navy)] mb-4">
                II. Redaktionsprozess
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Erstellung und Facharztprüfung
                  </h3>
                  <p>
                    Neue Inhalte werden von medizinisch geschulten Redakteur:innen nach einem strukturierten
                    Template erstellt. Jeder Erkrankungseintrag durchläuft anschließend eine Prüfung durch
                    mindestens eine:n Facharzt oder Fachärztin der entsprechenden Disziplin. Bei seltenen
                    Erkrankungen ziehen wir Spezialist:innen aus ERN-anerkannten Zentren oder nationalen
                    Fachgesellschaften hinzu. Inhalte werden erst nach positiver Fachprüfung veröffentlicht.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Redaktionelle und juristische Prüfung
                  </h3>
                  <p>
                    Nach der medizinischen Prüfung erfolgt eine redaktionelle Qualitätskontrolle: Sprache,
                    Verständlichkeit (Zielgruppe sind Laien, keine Fachpersonen), innere Konsistenz und
                    korrekte Quellenangaben werden geprüft. Bei Inhalten mit rechtlichen Implikationen —
                    etwa zu Sozialleistungen, Pflegegeld oder Berufsunfähigkeit — erfolgt zusätzlich eine
                    juristische Sichtung. Erst wenn alle drei Stufen abgeschlossen sind, wird ein Eintrag
                    auf &#8222;Veröffentlicht&#8220; gesetzt.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Aktualität und Überprüfungszyklen
                  </h3>
                  <p>
                    Medizinisches Wissen entwickelt sich laufend weiter. Deshalb gilt für alle Inhalte
                    ein Überprüfungszyklus von maximal 12 Monaten. Bei Erkrankungen mit aktiver
                    Therapieentwicklung oder laufenden klinischen Studien verkürzen wir diesen Zeitraum
                    entsprechend. Das Datum der letzten inhaltlichen Prüfung ist auf jeder Seite sichtbar
                    angegeben. Substanzielle Änderungen — neue Therapiezulassung, aktualisierte Leitlinie,
                    neue Studiendaten — werden im Änderungsprotokoll dokumentiert.
                  </p>
                </div>
              </div>
            </section>

            {/* ── Teil III: Grenzen ── */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-medizin-navy)] mb-4">
                III. Was WohinMedizin.at nicht ist
              </h2>
              <p className="mb-4">
                WohinMedizin.at ist eine <strong>Orientierungsplattform</strong>, keine medizinische
                Einrichtung. Das bedeutet konkret:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-[var(--color-selten-violett)] shrink-0 font-bold">—</span>
                  <span>
                    <strong>Kein Ersatz für ärztliche Beratung.</strong> Die Inhalte auf WohinMedizin.at
                    dienen der allgemeinen Information und können ein persönliches Arztgespräch nicht
                    ersetzen. Bei konkreten Beschwerden, Verdachtsdiagnosen oder Behandlungsentscheidungen
                    ist immer qualifiziertes medizinisches Fachpersonal einzubeziehen.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-selten-violett)] shrink-0 font-bold">—</span>
                  <span>
                    <strong>Keine Diagnose.</strong> WohinMedizin.at stellt keine Diagnosen. Die Plattform
                    hilft dabei, Beschwerden einzuordnen und die richtige Fachrichtung zu finden — die
                    Diagnose selbst ist Aufgabe von Ärzt:innen mit Zugang zur vollständigen Anamnese,
                    körperlicher Untersuchung und diagnostischen Tests.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-selten-violett)] shrink-0 font-bold">—</span>
                  <span>
                    <strong>Kein Notfalldienst.</strong> In medizinischen Notfällen bitte immer den
                    Notruf 144 (Rettung) oder die Gesundheitshotline 1450 anrufen — nicht WohinMedizin.at
                    als erste Anlaufstelle nutzen.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-selten-violett)] shrink-0 font-bold">—</span>
                  <span>
                    <strong>Keine Vollständigkeit bei seltenen Erkrankungen.</strong> Obwohl wir über
                    6.000 seltene Erkrankungen in unserer Datenbank erfassen, ist die inhaltliche Tiefe
                    je nach Erkrankung unterschiedlich. Bei sehr seltenen Erkrankungen ohne ausreichende
                    Datenbasis verweisen wir ausdrücklich auf spezialisierte Einrichtungen und die
                    Orphanet-Patienteninformationen.
                  </span>
                </li>
              </ul>
            </section>

            {/* ── Teil IV: Finanzierung ── */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-medizin-navy)] mb-4">
                IV. Finanzierung
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Hinweise auf klinische Studien
                  </h3>
                  <p>
                    Auf Krankheitsseiten zeigen wir laufende klinische Studien aus dem öffentlichen
                    Register ClinicalTrials.gov. Wenn wir mit einem Studiensponsor bei der Information
                    über Rekrutierung zusammenarbeiten, kennzeichnen wir das. Eine Studienteilnahme
                    besprichst du immer mit deiner Ärztin oder deinem Arzt — wir treffen keine
                    Vorauswahl in deinem Namen und geben ohne ausdrückliche Einwilligung keine Daten weiter.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Verifizierte Zentrumsprofile
                  </h3>
                  <p>
                    Spezialzentren können ihr Profil verifizieren und erweitern lassen. Das{' '}
                    <strong>&#8222;Verifiziert&#8220;-Badge</strong> bedeutet ausschließlich: Wir haben die Angaben
                    bestätigt. Es bedeutet <strong>nicht</strong>, dass ein Zentrum bezahlt hat, um
                    bevorzugt angezeigt zu werden — die Sortierung folgt allein der medizinischen
                    Relevanz und Region.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">
                    Geförderte Aufklärungsinhalte
                  </h3>
                  <p>
                    Die redaktionelle Aufbereitung einzelner Erkrankungen kann gefördert werden, etwa
                    durch Pharmaunternehmen oder Stiftungen. Solche Einträge tragen sichtbar den Hinweis{' '}
                    <strong>&#8222;Unterstützt durch …&#8220;</strong>. Der Inhalt bleibt vollständig in unserer
                    redaktionellen Hand; Förderer erhalten kein Mitspracherecht an medizinischen Aussagen.
                  </p>
                </div>
              </div>
            </section>

            {/* ── Kontakt ── */}
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">
                Fragen, Korrekturen oder Hinweise?
              </h2>
              <p>
                Wenn du einen inhaltlichen Fehler findest, eine Quelle vermisst oder ein Anliegen zu
                unseren Richtlinien hast, schreib uns bitte an{' '}
                <a
                  href="mailto:kontakt@wohinmedizin.at"
                  className="text-[var(--color-donau-blau)] underline"
                >
                  kontakt@wohinmedizin.at
                </a>
                . Wir prüfen jeden Hinweis und melden uns innerhalb von 5 Werktagen.
              </p>
            </section>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/datenschutz"
              className="text-sm font-medium text-[var(--color-donau-blau)] hover:underline"
            >
              Zur Datenschutzerklärung →
            </Link>
            <Link
              href="/impressum"
              className="text-sm font-medium text-[var(--color-donau-blau)] hover:underline"
            >
              Zum Impressum →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
