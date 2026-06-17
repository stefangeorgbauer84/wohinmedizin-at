import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Transparenz & Finanzierung — WohinMedizin.at',
  description:
    'Wie sich WohinMedizin.at finanziert: Studien-Hinweise, verifizierte Zentrumsprofile und gekennzeichnete Förderung — offen erklärt, redaktionell unabhängig.',
  alternates: { canonical: `${SITE_URL}/transparenz` },
}

export default function TransparenzPage() {
  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">Transparenz & Finanzierung</h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
            Damit WohinMedizin.at dauerhaft bestehen kann, braucht es eine Finanzierung. Wir legen hier offen, wie wir Geld
            verdienen — und vor allem, was wir bewusst <strong>nicht</strong> tun.
          </p>

          <div className="rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-5 mb-8">
            <h2 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-2">Unsere drei festen Regeln</h2>
            <ul className="space-y-2 text-sm text-[var(--color-medizin-navy)]">
              <li className="flex gap-2"><span className="text-[var(--color-alpen-mint)]">✓</span> Medizinische Inhalte und Reihenfolgen sind <strong>nicht käuflich</strong>. Kein Sponsor, kein Zentrum erhält einen Ranking-Vorteil.</li>
              <li className="flex gap-2"><span className="text-[var(--color-alpen-mint)]">✓</span> Jede kommerzielle Beziehung ist <strong>sichtbar gekennzeichnet</strong> („Anzeige", „Verifiziert", „Unterstützt durch …").</li>
              <li className="flex gap-2"><span className="text-[var(--color-alpen-mint)]">✓</span> Wir machen <strong>keine</strong> Publikumswerbung für verschreibungspflichtige Medikamente und keine verdeckte Beeinflussung.</li>
            </ul>
          </div>

          <div className="space-y-8 text-[var(--color-muted)] leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">1. Hinweise auf klinische Studien</h2>
              <p>
                Auf Krankheitsseiten zeigen wir laufende klinische Studien aus dem öffentlichen Register ClinicalTrials.gov.
                Wenn wir mit einem Studiensponsor bei der Information über Rekrutierung zusammenarbeiten, kennzeichnen wir das.
                Eine Studienteilnahme besprichst du immer mit deiner Ärztin oder deinem Arzt — wir treffen keine Vorauswahl in
                deinem Namen und geben ohne deine ausdrückliche Einwilligung keine Daten weiter.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">2. Verifizierte Zentrumsprofile</h2>
              <p>
                Spezialzentren können ihr Profil verifizieren und erweitern lassen. Das <strong>„Verifiziert"-Badge</strong> bedeutet
                ausschließlich: Wir haben die Angaben bestätigt. Es bedeutet <strong>nicht</strong>, dass ein Zentrum bezahlt hat, um
                bevorzugt angezeigt zu werden — die Sortierung folgt allein der medizinischen Relevanz und Region.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">3. Geförderte Aufklärungsinhalte</h2>
              <p>
                Die redaktionelle Aufbereitung einzelner Erkrankungen kann gefördert werden, etwa durch Pharmaunternehmen oder
                Stiftungen. Solche Einträge tragen sichtbar den Hinweis <strong>„Unterstützt durch …"</strong>. Der Inhalt bleibt
                vollständig in unserer redaktionellen Hand; Förderer erhalten kein Mitspracherecht an medizinischen Aussagen.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Fragen oder Hinweise?</h2>
              <p>
                Wenn dir etwas auffällt, das gegen diese Regeln verstößt, schreib uns:{' '}
                <a href="mailto:kontakt@wohinmedizin.at" className="text-[var(--color-donau-blau)] underline">kontakt@wohinmedizin.at</a>.
              </p>
            </section>
          </div>

          <div className="mt-10">
            <Link href="/datenschutz" className="text-sm font-medium text-[var(--color-donau-blau)] hover:underline">Zur Datenschutzerklärung →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
