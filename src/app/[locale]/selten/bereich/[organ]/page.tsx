import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { listDiseases } from '@/lib/diseases'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

// Slug (URL) → DB-Wert + Anzeigename + einzigartiger Einleitungstext (für SEO)
const ORGANS: Record<string, { value: string; label: string; intro: string }> = {
  neurologisch:        { value: 'neurological', label: 'Neurologische seltene Erkrankungen', intro: 'Seltene Erkrankungen des Nervensystems betreffen Gehirn, Rückenmark, Nerven und Muskeln. Hier findest du eine Übersicht mit Symptomen, ORPHA-Codes und den österreichischen Spezialzentren (u.a. ERN-RND).' },
  'herz-gefaesse':     { value: 'cardiovascular', label: 'Seltene Herz- und Gefäßerkrankungen', intro: 'Seltene kardiovaskuläre Erkrankungen reichen von erblichen Kardiomyopathien bis zu Bindegewebs- und Gefäßerkrankungen wie dem Marfan-Syndrom. Übersicht mit Anlaufstellen in Österreich (u.a. VASCERN).' },
  bewegungsapparat:    { value: 'musculoskeletal', label: 'Seltene Erkrankungen des Bewegungsapparats', intro: 'Seltene Erkrankungen von Knochen, Gelenken, Muskeln und Bindegewebe. Übersicht mit typischen Anzeichen und spezialisierten Zentren in Österreich.' },
  'blut-immunsystem':  { value: 'hematological_immunological', label: 'Seltene Blut- und Immunerkrankungen', intro: 'Seltene Erkrankungen des Blutes und des Immunsystems, von Gerinnungsstörungen bis zu Immundefekten. Übersicht mit Codes und Referenzzentren (u.a. ERN-EuroBloodNet).' },
  stoffwechsel:        { value: 'endocrine_metabolic', label: 'Seltene Stoffwechsel- und Hormonerkrankungen', intro: 'Angeborene Stoffwechselstörungen und seltene endokrine Erkrankungen. Übersicht mit Symptomen und metabolischen Spezialzentren in Österreich (u.a. MetabERN).' },
  haut:                { value: 'dermatological', label: 'Seltene Hauterkrankungen', intro: 'Seltene Erkrankungen von Haut, Haaren und Nägeln, etwa Epidermolysis bullosa oder Ichthyosen. Übersicht mit Anlaufstellen (u.a. ERN-SKIN).' },
  'magen-darm':        { value: 'gastrointestinal', label: 'Seltene Magen-Darm-Erkrankungen', intro: 'Seltene Erkrankungen des Verdauungstrakts, der Leber und der Bauchspeicheldrüse. Übersicht mit Symptomen und Spezialzentren in Österreich.' },
  atemwege:            { value: 'respiratory', label: 'Seltene Atemwegs- und Lungenerkrankungen', intro: 'Seltene Erkrankungen von Lunge und Atemwegen, etwa Mukoviszidose oder seltene Lungenfibrosen. Übersicht mit Anlaufstellen in Österreich.' },
  'niere-harnwege':    { value: 'urogenital', label: 'Seltene Nieren- und Harnwegserkrankungen', intro: 'Seltene Erkrankungen von Nieren, Harnwegen und Unterleib. Übersicht mit Codes, Symptomen und spezialisierten Zentren.' },
  augen:               { value: 'visual', label: 'Seltene Augenerkrankungen', intro: 'Seltene Erkrankungen der Augen und des Sehvermögens, von erblichen Netzhauterkrankungen bis zu seltenen Syndromen mit Augenbeteiligung. Übersicht mit Anlaufstellen.' },
  ohren:               { value: 'auditory', label: 'Seltene Ohren- und Hörerkrankungen', intro: 'Seltene Erkrankungen von Ohr und Gehör, etwa erbliche Hörstörungen. Übersicht mit Symptomen und Spezialzentren in Österreich.' },
  psychiatrisch:       { value: 'psychiatric', label: 'Seltene psychiatrische und Verhaltenserkrankungen', intro: 'Seltene Erkrankungen mit psychiatrischen oder Verhaltensaspekten. Übersicht mit Einordnung und Anlaufstellen.' },
  multisystemisch:     { value: 'multisystemic', label: 'Seltene multisystemische Erkrankungen', intro: 'Seltene Erkrankungen, die mehrere Organsysteme gleichzeitig betreffen. Übersicht mit interdisziplinären Spezialzentren in Österreich.' },
  onkologisch:         { value: 'oncological', label: 'Seltene Tumorerkrankungen', intro: 'Seltene Tumorerkrankungen und genetische Tumorsyndrome. Übersicht mit Codes und spezialisierten Zentren (u.a. ERN-GENTURIS).' },
  reproduktion:        { value: 'reproductive', label: 'Seltene Erkrankungen der Reproduktion', intro: 'Seltene Erkrankungen mit Bezug zu Fortpflanzung und Entwicklung. Übersicht mit Symptomen und Anlaufstellen.' },
}

export const revalidate = 3600

export function generateStaticParams() {
  return Object.keys(ORGANS).map((organ) => ({ organ }))
}

export async function generateMetadata({ params }: { params: Promise<{ organ: string }> }): Promise<Metadata> {
  const { organ } = await params
  const meta = ORGANS[organ]
  if (!meta) return { title: 'Bereich nicht gefunden' }
  return {
    title: `${meta.label} — WohinMedizin.at`,
    description: meta.intro.slice(0, 160),
    alternates: { canonical: `${SITE_URL}/selten/bereich/${organ}` },
    openGraph: { title: meta.label, description: meta.intro.slice(0, 160), url: `${SITE_URL}/selten/bereich/${organ}`, type: 'website' },
  }
}

export default async function OrganHubPage({ params }: { params: Promise<{ organ: string }> }) {
  const { organ } = await params
  const meta = ORGANS[organ]
  if (!meta) notFound()

  const { diseases, total } = await listDiseases({ organ: meta.value, page: 1 })

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'WohinMedizin.at', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Seltene Erkrankungen', item: `${SITE_URL}/selten` },
      { '@type': 'ListItem', position: 3, name: meta.label, item: `${SITE_URL}/selten/bereich/${organ}` },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta.label,
    numberOfItems: diseases.length,
    itemListElement: diseases.slice(0, 24).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.name,
      url: `${SITE_URL}/selten/${d.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-6">
            <Link href="/selten" className="hover:text-[var(--color-donau-blau)]">Seltene Erkrankungen</Link>
            <span aria-hidden="true">›</span>
            <span className="text-[var(--color-medizin-navy)] font-medium">{meta.label}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">{meta.label}</h1>
          <p className="text-[var(--color-muted)] leading-relaxed mb-2 max-w-3xl">{meta.intro}</p>
          <p className="text-sm text-[var(--color-muted)] mb-8">{total.toLocaleString('de-AT')} Erkrankungen in diesem Bereich.</p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {diseases.map((d) => (
              <li key={d.slug}>
                <Link href={`/selten/${d.slug}`}
                  className="block bg-white rounded-xl border border-[var(--color-border)] p-4 hover:border-[var(--color-selten-violett)] hover:shadow-sm transition-all">
                  <span className="font-medium text-[var(--color-medizin-navy)] text-sm">{d.name}</span>
                  {d.orpha_code && <span className="block text-xs text-[var(--color-muted)] mt-0.5">{d.orpha_code}</span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link href={`/selten?organ=${meta.value}`} className="text-sm font-medium text-[var(--color-donau-blau)] hover:underline">
              Alle {total.toLocaleString('de-AT')} Erkrankungen in diesem Bereich durchsuchen →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
