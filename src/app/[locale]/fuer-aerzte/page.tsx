import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PhysicianPageJsonLd } from '@/components/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Für Ärztinnen & Ärzte — Profil eintragen & Patienten finden — WohinMedizin.at',
  description: 'WohinMedizin.at unterstützt Ärztinnen und Ärzte in Österreich bei seltenen Erkrankungen: Spezialzentrum eintragen, Profil verifizieren lassen und von Patientinnen und Patienten gefunden werden.',
  alternates: { canonical: `${SITE_URL}/fuer-aerzte` },
  openGraph: {
    title: 'Für Ärztinnen & Ärzte — WohinMedizin.at',
    description: 'Spezialzentrum eintragen und von Betroffenen mit seltenen Erkrankungen in Österreich gefunden werden.',
    url: `${SITE_URL}/fuer-aerzte`,
    type: 'website',
  },
}

const PROFILE_TIERS = [
  {
    name: 'Basisprofil',
    price: 'kostenlos',
    highlight: false,
    features: [
      'Grunddaten: Name, Adresse, Fachbereich',
      'Verlinkung zur eigenen Website',
      'Auffindbar in der Spezialist:innen-Suche',
    ],
  },
  {
    name: 'Verifiziertes Profil',
    price: 'auf Anfrage',
    highlight: true,
    features: [
      'Alles aus Basisprofil',
      'Redaktionell geprüfter Verified-Badge',
      'ERN-Netzwerk-Zuordnung',
      'Detailseite mit Erkrankungsschwerpunkten',
      'Prioritäre Platzierung in Suchergebnissen',
    ],
  },
  {
    name: 'Spezialist:innenprofil Plus',
    price: 'auf Anfrage',
    highlight: false,
    features: [
      'Alles aus Verifiziertes Profil',
      'Erweiterte Beschreibung & Leistungsspektrum',
      'Verlinkung zu Studien & Publikationen',
      'Statistik-Dashboard (Profilaufrufe)',
      'Redaktionelle Aufnahme in Krankheitseinträge',
    ],
  },
]

export default function FuerAerztePage() {
  return (
    <>
      <PhysicianPageJsonLd url={`${SITE_URL}/fuer-aerzte`} />
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

          {/* Hero */}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-4">
            Für Ärztinnen &amp; Ärzte
          </h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-10">
            WohinMedizin.at ist ein praktisches Nachschlagewerk für die Zuweisung bei Verdacht auf eine
            seltene Erkrankung — und eine Plattform, auf der Sie Ihr Spezialzentrum sichtbar machen können.
          </p>

          {/* What you find here */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-3">Was Sie hier finden</h2>
            <ul className="space-y-2 text-[var(--color-muted)] text-sm">
              <li className="flex gap-2"><span aria-hidden>✓</span> Über 11.000 seltene Erkrankungen mit ORPHA-, ICD- und HPO-Bezug</li>
              <li className="flex gap-2"><span aria-hidden>✓</span> Österreichische Spezialzentren und ERN-Anbindungen pro Erkrankung</li>
              <li className="flex gap-2"><span aria-hidden>✓</span> Patientenorganisationen als Anlaufstellen für Betroffene</li>
              <li className="flex gap-2"><span aria-hidden>✓</span> Symptom-Finder auf HPO-Basis zur ersten Orientierung</li>
            </ul>
          </section>

          {/* Profile tiers */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-4">Profil-Optionen für Einrichtungen</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {PROFILE_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-xl border p-5 flex flex-col gap-3 ${
                    tier.highlight
                      ? 'border-[var(--color-donau-blau)] bg-[var(--color-morgen-hellblau)]'
                      : 'border-[var(--color-border)] bg-white'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-[var(--color-medizin-navy)] text-sm">{tier.name}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">{tier.price}</p>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--color-muted)]">
                    {tier.features.map((f) => (
                      <li key={f} className="flex gap-1.5"><span aria-hidden className="shrink-0">·</span>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Onboarding contact */}
          <section className="rounded-xl bg-[var(--color-warmweiss)] border border-[var(--color-border)] p-6 mb-10">
            <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Jetzt eintragen lassen</h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
              Leiten Sie ein Spezialzentrum, eine Ambulanz oder eine Praxis mit Schwerpunkt seltene Erkrankungen?
              Senden Sie uns eine kurze Anfrage — wir melden uns innerhalb von zwei Werktagen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:kontakt@wohinmedizin.at?subject=Profileintragung%20WohinMedizin.at"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Anfrage per E-Mail
              </a>
              <a
                href="mailto:redaktion@wohinmedizin.at"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-medizin-navy)] font-semibold text-sm hover:bg-white transition-colors"
              >
                redaktion@wohinmedizin.at
              </a>
            </div>
          </section>

          {/* Editorial collaboration */}
          <section className="space-y-4 text-[var(--color-muted)] text-sm leading-relaxed mb-10">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-medizin-navy)] mb-1">Mitarbeit &amp; redaktionelle Prüfung</h2>
              <p>
                Wir arbeiten mit Fachärztinnen und Fachärzten an der redaktionellen Prüfung von Krankheitseinträgen.
                Wenn Sie als medizinische Reviewerin oder Reviewer mitwirken möchten, freuen wir uns über Ihre Nachricht
                an{' '}
                <a href="mailto:redaktion@wohinmedizin.at" className="text-[var(--color-donau-blau)] underline">
                  redaktion@wohinmedizin.at
                </a>.
              </p>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href="/spezialistinnen" className="px-5 py-2.5 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Spezialist:innen-Verzeichnis
            </Link>
            <Link href="/selten" className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-medizin-navy)] font-semibold text-sm hover:bg-[var(--color-warmweiss)] transition-colors">
              Zur Krankheitsübersicht
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
