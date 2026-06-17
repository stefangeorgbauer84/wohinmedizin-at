import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Für Ärztinnen & Ärzte — WohinMedizin.at',
  description: 'Wie WohinMedizin.at Ärztinnen, Ärzte und Gesundheitseinrichtungen in Österreich bei seltenen Erkrankungen unterstützt.',
  alternates: { canonical: `${SITE_URL}/fuer-aerzte` },
}

export default function FuerAerztePage() {
  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-4">Für Ärztinnen & Ärzte</h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
            WohinMedizin.at ist eine Orientierungshilfe für Betroffene — und ein praktisches Nachschlagewerk für die
            Zuweisung bei Verdacht auf eine seltene Erkrankung.
          </p>

          <div className="space-y-7 text-[var(--color-muted)] leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Was Sie hier finden</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Über 11.000 seltene Erkrankungen mit ORPHA-, ICD- und HPO-Bezug</li>
                <li>Österreichische Spezialzentren und ERN-Anbindungen pro Erkrankung</li>
                <li>Patientenorganisationen als Anlaufstellen für Betroffene</li>
                <li>Einen Symptom-Finder auf HPO-Basis zur ersten Orientierung</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Mitarbeit & redaktionelle Prüfung</h2>
              <p>
                Wir arbeiten mit Fachärztinnen und Fachärzten an der redaktionellen Prüfung von Krankheitseinträgen.
                Wenn Sie als medizinische Reviewerin oder Reviewer mitwirken möchten, freuen wir uns über Ihre Nachricht.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Ihr Zentrum eintragen</h2>
              <p>
                Leiten Sie ein Spezialzentrum oder eine Ambulanz für seltene Erkrankungen? Melden Sie sich, damit wir
                Ihr Angebot korrekt und auffindbar abbilden:
                {' '}<a href="mailto:kontakt@wohinmedizin.at" className="text-[var(--color-donau-blau)] underline">kontakt@wohinmedizin.at</a>.
              </p>
            </section>
          </div>

          <div className="mt-10">
            <Link href="/selten" className="px-5 py-2.5 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Zur Krankheitsübersicht
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
