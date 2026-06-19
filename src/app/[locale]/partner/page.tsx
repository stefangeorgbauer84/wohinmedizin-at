import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getPool } from '@/lib/db'
import { jsonLdString } from '@/lib/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const revalidate = 86_400

export const metadata: Metadata = {
  title: 'Partner werden — Kliniken, Zentren & Pharma | WohinMedizin.at',
  description:
    'Erreichen Sie Betroffene seltener Erkrankungen in Österreich — transparent und regelkonform: Studien-Hinweise, verifizierte Zentrumsprofile, gekennzeichnete Aufklärungsinhalte.',
  alternates: { canonical: `${SITE_URL}/partner` },
  openGraph: {
    title: 'Partner werden — WohinMedizin.at',
    description: 'Betroffene seltener Erkrankungen in Österreich transparent und regelkonform erreichen.',
    url: `${SITE_URL}/partner`,
    siteName: 'WohinMedizin.at',
    locale: 'de_AT',
    type: 'website',
  },
}

async function getStats() {
  const pool = getPool()
  const fallback = { diseases: 11456, hpo: 4335, centers: 16, orgs: 16 }
  try {
    const [d, h, c, o] = await Promise.all([
      pool.query<{ c: string }>('SELECT count(*) c FROM diseases'),
      pool.query<{ c: string }>('SELECT count(DISTINCT _parent_id) c FROM diseases_codes_hpo_terms'),
      pool.query<{ c: string }>('SELECT count(*) c FROM expert_centers'),
      pool.query<{ c: string }>('SELECT count(*) c FROM patient_organizations'),
    ])
    return {
      diseases: parseInt(d.rows[0]?.c ?? '0', 10) || fallback.diseases,
      hpo: parseInt(h.rows[0]?.c ?? '0', 10) || fallback.hpo,
      centers: parseInt(c.rows[0]?.c ?? '0', 10) || fallback.centers,
      orgs: parseInt(o.rows[0]?.c ?? '0', 10) || fallback.orgs,
    }
  } catch {
    return fallback
  }
}

const OFFERS = [
  {
    title: 'Studien-Hinweise & Rekrutierung',
    body: 'Betroffene finden auf der passenden Krankheitsseite laufende klinische Studien. Sponsoren erreichen so genau die richtige, schwer auffindbare Zielgruppe — gekennzeichnet und einwilligungsbasiert.',
    tag: 'Für Studiensponsoren',
  },
  {
    title: 'Verifizierte Zentrumsprofile',
    body: 'Spezialzentren und Ambulanzen lassen ihr Profil verifizieren und erweitern — mit „Verifiziert"-Badge und mehr Informationstiefe. Ohne Ranking-Vorteil, rein informativ.',
    tag: 'Für Kliniken & Zentren',
  },
  {
    title: 'Gekennzeichnete Aufklärungsinhalte',
    body: 'Fördern Sie die redaktionelle Aufbereitung einer Erkrankung. Sichtbar als „Unterstützt durch …", inhaltlich vollständig unabhängig. Seriöse Awareness statt Werbung.',
    tag: 'Für Pharma & Stiftungen',
  },
]

export default async function PartnerPage() {
  const s = await getStats()

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WohinMedizin.at',
    url: SITE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'partnerships',
      email: 'partner@wohinmedizin.at',
      areaServed: 'AT',
      availableLanguage: ['de', 'en'],
    },
  }

  const stats = [
    { n: s.diseases.toLocaleString('de-AT'), l: 'seltene Erkrankungen' },
    { n: s.hpo.toLocaleString('de-AT'), l: 'mit strukturierten Symptomdaten' },
    { n: String(s.centers), l: 'österreichische Spezialzentren' },
    { n: String(s.orgs), l: 'Patientenorganisationen' },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(orgLd) }} />
      <Header />
      <main id="hauptinhalt" className="flex-1">
        {/* Hero */}
        <section className="bg-[var(--color-morgen-hellblau)] border-b border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-donau-blau)] mb-3">Für Partner</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-4">
              Betroffene seltener Erkrankungen erreichen — transparent und regelkonform
            </h1>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed max-w-2xl mb-6">
              WohinMedizin.at ist die Orientierungsplattform für seltene Erkrankungen in Österreich. Wir verbinden
              Betroffene mit den richtigen Anlaufstellen — und Partner mit einer Zielgruppe, die sonst kaum erreichbar ist.
            </p>
            <a href="mailto:partner@wohinmedizin.at?subject=Partnerschaft%20WohinMedizin.at"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Gespräch anfragen
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((st) => (
              <div key={st.l}>
                <p className="text-3xl font-bold wohin-gradient-text">{st.n}</p>
                <p className="text-sm text-[var(--color-muted)] mt-1">{st.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Offers */}
        <section className="py-16 bg-[var(--color-warmweiss)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[var(--color-medizin-navy)] mb-2">Drei Wege der Zusammenarbeit</h2>
            <p className="text-[var(--color-muted)] mb-8 max-w-2xl">
              Alle Angebote folgen einer Regel: Medizinische Inhalte und Reihenfolgen bleiben unbestechlich, jede
              Zusammenarbeit ist sichtbar gekennzeichnet. <Link href="/transparenz" className="text-[var(--color-donau-blau)] underline">Mehr dazu</Link>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {OFFERS.map((o) => (
                <div key={o.title} className="bg-white rounded-xl border border-[var(--color-border)] p-6">
                  <span className="text-xs font-medium text-[var(--color-donau-blau)] bg-[var(--color-morgen-hellblau)] px-2 py-0.5 rounded-full">{o.tag}</span>
                  <h3 className="font-semibold text-[var(--color-medizin-navy)] mt-3 mb-2">{o.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{o.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-medizin-navy)] mb-3">Interesse an einer Zusammenarbeit?</h2>
            <p className="text-[var(--color-muted)] mb-6 max-w-xl mx-auto">
              Schreiben Sie uns kurz, worum es geht — wir melden uns mit einem konkreten, regelkonformen Vorschlag.
            </p>
            <a href="mailto:partner@wohinmedizin.at?subject=Partnerschaft%20WohinMedizin.at"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              partner@wohinmedizin.at
            </a>
            <p className="text-xs text-[var(--color-muted)] mt-6">
              Keine Publikumswerbung für verschreibungspflichtige Arzneimittel. Alle Inhalte folgen dem österreichischen
              Arzneimittel- und Werberecht.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
