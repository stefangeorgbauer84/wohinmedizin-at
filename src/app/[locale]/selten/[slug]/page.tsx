import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getDiseaseBySlug, findRelatedDiseases } from '@/lib/diseases'
import { findMatchingCenters, findMatchingOrganizations } from '@/lib/care-pathway'
import { RichText, hasLexicalContent } from '@/lib/lexical'
import { FinderMatch } from '@/components/FinderMatch'
import { PrintButton } from '@/components/PrintButton'
import { BookmarkButton } from '@/components/BookmarkButton'
import { BackToTop } from '@/components/BackToTop'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { jsonLdString } from '@/lib/seo'
import { getTrialsForDisease, trialsSearchUrl } from '@/lib/clinical-trials'
import { getLiteratureForDisease, pubmedSearchUrl } from '@/lib/pubmed'

// Organsystem-Wert → URL-Slug der Hub-Seite (für Breadcrumb & internes Linking)
const ORGAN_SLUG: Record<string, string> = {
  neurological: 'neurologisch', cardiovascular: 'herz-gefaesse', musculoskeletal: 'bewegungsapparat',
  hematological_immunological: 'blut-immunsystem', endocrine_metabolic: 'stoffwechsel', dermatological: 'haut',
  gastrointestinal: 'magen-darm', respiratory: 'atemwege', urogenital: 'niere-harnwege', visual: 'augen',
  auditory: 'ohren', psychiatric: 'psychiatrisch', multisystemic: 'multisystemisch', oncological: 'onkologisch',
  reproductive: 'reproduktion',
}

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

// ISR: Krankheitsseiten 1h cachen statt bei jedem Aufruf 10 DB-Abfragen zu fahren
export const revalidate = 3600
export const dynamicParams = true

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const disease = await getDiseaseBySlug(slug, locale)
  if (!disease) return { title: 'Erkrankung nicht gefunden' }

  const title = `${disease.name} — Symptome & Anlaufstellen in Österreich | WohinMedizin.at`
  const topSymptoms = disease.symptoms.slice(0, 3).map((s) => s.name).join(', ')
  const description = (
    disease.brief_description
      ? `${disease.brief_description.slice(0, 110)} `
      : `${disease.name} (${disease.orpha_code ?? 'seltene Erkrankung'}). `
  ) + `${topSymptoms ? `Typische Anzeichen: ${topSymptoms}. ` : ''}Symptome, Vererbung und Spezialzentren in Österreich.`.slice(0, 200)
  const canonicalPath = locale === 'de' ? `/selten/${slug}` : `/${locale}/selten/${slug}`
  const canonical = `${SITE_URL}${canonicalPath}`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'WohinMedizin.at',
      locale: locale === 'de' ? 'de_AT' : locale,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

const ORGAN_LABELS: Record<string, string> = {
  neurological:               'Neurologisch',
  cardiovascular:             'Herz & Gefäße',
  musculoskeletal:            'Bewegungsapparat',
  hematological_immunological:'Blut & Immunsystem',
  endocrine_metabolic:        'Stoffwechsel',
  dermatological:             'Haut',
  gastrointestinal:           'Magen-Darm',
  respiratory:                'Atemwege',
  urogenital:                 'Niere & Harnwege',
  visual:                     'Augen',
  auditory:                   'Ohren',
  reproductive:               'Reproduktion',
  psychiatric:                'Psychiatrisch',
  multisystemic:              'Multisystemisch',
  oncological:                'Onkologisch',
}

const INHERITANCE_LABELS: Record<string, string> = {
  autosomal_dominant:  'Autosomal-dominant',
  autosomal_recessive: 'Autosomal-rezessiv',
  x_dominant:          'X-chromosomal dominant',
  x_recessive:         'X-chromosomal rezessiv',
  mitochondrial:       'Mitochondrial',
  multifactorial:      'Multifaktoriell',
  de_novo:             'De novo',
  non_genetic:         'Nicht genetisch',
  unknown:             'Unbekannt',
}

const ONSET_LABELS: Record<string, string> = {
  congenital:   'Angeboren',
  neonatal:     'Neugeborenenperiode',
  infancy:      'Säuglingsalter',
  childhood:    'Kindesalter',
  adolescence:  'Jugendalter',
  young_adult:  'Frühes Erwachsenenalter',
  middle_age:   'Mittleres Erwachsenenalter',
  elderly:      'Höheres Alter',
  all_ages:     'Alle Altersgruppen',
}

const CATEGORY_LABELS: Record<string, string> = {
  very_common: 'Sehr häufig (>80%)',
  common:      'Häufig (30–79%)',
  occasional:  'Gelegentlich (5–29%)',
  rare:        'Selten (1–4%)',
}

// Organsystem → passende Facharztrichtung (für den Versorgungspfad)
const SPECIALTY_BY_ORGAN: Record<string, string> = {
  neurological:                'Neurologie',
  cardiovascular:             'Kardiologie',
  musculoskeletal:            'Orthopädie / Rheumatologie',
  hematological_immunological:'Hämatologie / Immunologie',
  endocrine_metabolic:        'Endokrinologie / Stoffwechselmedizin',
  dermatological:             'Dermatologie',
  gastrointestinal:           'Gastroenterologie',
  respiratory:                'Pneumologie',
  urogenital:                 'Nephrologie / Urologie',
  visual:                     'Augenheilkunde',
  auditory:                   'HNO-Heilkunde',
  reproductive:               'Gynäkologie / Andrologie',
  psychiatric:                'Psychiatrie',
  multisystemic:              'Innere Medizin (interdisziplinär)',
  oncological:                'Onkologie',
}

const CENTER_TYPE_LABELS: Record<string, string> = {
  ern:          'Europäisches Referenznetzwerk (ERN)',
  national_ref: 'Nationales Referenzzentrum',
  university:   'Universitätsklinik',
  outpatient:   'Spezialambulanz',
  selfhelp:     'Selbsthilfezentrum',
}

const COUNTRY_LABELS: Record<string, string> = {
  at: 'Österreich', de: 'Deutschland', ch: 'Schweiz', eu: 'Europa', intl: 'International', eu_other: 'EU',
}

/** Übersetzt die Prävalenz in eine verständliche Einordnung. */
function prevalencePlain(prevalence: string | null): string | null {
  if (!prevalence) return null
  const p = prevalence.toLowerCase()
  if (p.includes('<1 / 1 000 000') || p.includes('1 / 1 000 000')) return 'Extrem selten — weniger als 1 von einer Million Menschen ist betroffen.'
  if (p.includes('1-9 / 1 000 000')) return 'Sehr selten — einige wenige von einer Million Menschen sind betroffen.'
  if (p.includes('1-9 / 100 000')) return 'Selten — etwa 1 bis 9 von 100.000 Menschen sind betroffen.'
  if (p.includes('1-5 / 10 000') || p.includes('6-9 / 10 000')) return 'Selten, aber innerhalb seltener Erkrankungen vergleichsweise häufiger.'
  if (p.includes('unknown') || p.includes('unbekannt')) return 'Die genaue Häufigkeit ist nicht bekannt — typisch für viele seltene Erkrankungen.'
  return null
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'orpha' | 'icd' | 'omim' }) {
  const styles = {
    default: 'bg-[var(--color-morgen-hellblau)] text-[var(--color-donau-blau)]',
    orpha:   'bg-purple-50 text-purple-700',
    icd:     'bg-blue-50 text-blue-700',
    omim:    'bg-amber-50 text-amber-700',
  }
  return (
    <span className={`inline-flex items-center font-mono text-xs px-2.5 py-1 rounded-full ${styles[variant]}`}>
      {children}
    </span>
  )
}

function PathStep({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="shrink-0 w-8 h-8 rounded-full wohin-gradient text-white font-bold text-sm flex items-center justify-center">
        {n}
      </span>
      <div className="pt-0.5">
        <p className="text-sm font-semibold text-[var(--color-medizin-navy)] mb-0.5">{title}</p>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">{children}</p>
      </div>
    </li>
  )
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
      <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-3">{title}</h2>
      {children}
    </div>
  )
}

function SidebarItem({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">
        {hint ? (
          <abbr title={hint} className="no-underline border-b border-dotted border-[var(--color-muted)] cursor-help">{label}</abbr>
        ) : label}
      </dt>
      <dd>{children}</dd>
    </div>
  )
}

export default async function DiseaseDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const disease = await getDiseaseBySlug(slug, locale)
  if (!disease) notFound()

  // Versorgungspfad: wer behandelt / begleitet diese Erkrankung in Österreich?
  // Englischer Name verbessert die Trefferquote in den externen Datenbanken
  const externalQuery = disease.name_en ?? disease.name
  const [centers, organizations, related, trials, literature] = await Promise.all([
    findMatchingCenters(disease.orpha_code, disease.organ_systems),
    findMatchingOrganizations(disease.orpha_code, disease.organ_systems),
    findRelatedDiseases(disease.organ_systems, disease.id, locale, 6),
    getTrialsForDisease(externalQuery),
    getLiteratureForDisease(externalQuery),
  ])

  const primaryOrgan = disease.organ_systems[0]
  const organHubSlug = primaryOrgan ? ORGAN_SLUG[primaryOrgan] : undefined

  const specialties = Array.from(
    new Set(disease.organ_systems.map((o) => SPECIALTY_BY_ORGAN[o]).filter(Boolean)),
  )
  const prevalenceNote = prevalencePlain(disease.prevalence)

  const orphaNum = disease.orpha_code?.replace('ORPHA:', '')
  const orphanetUrl = orphaNum
    ? `https://www.orpha.net/consor/cgi-bin/OC_Exp.php?lng=DE&Expert=${orphaNum}`
    : null

  // ── MedicalCondition JSON-LD (schema.org) ──────────────────────────────────
  const canonicalPath = locale === 'de' ? `/selten/${slug}` : `/${locale}/selten/${slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: disease.name,
    alternateName: disease.aliases?.length ? disease.aliases : undefined,
    description: disease.brief_description ?? undefined,
    code: [
      disease.orpha_code
        ? { '@type': 'MedicalCode', codeValue: disease.orpha_code, codingSystem: 'Orphanet' }
        : null,
      disease.icd10_code
        ? { '@type': 'MedicalCode', codeValue: disease.icd10_code, codingSystem: 'ICD-10' }
        : null,
    ].filter(Boolean),
    url: `${SITE_URL}${canonicalPath}`,
    mainEntityOfPage: `${SITE_URL}${canonicalPath}`,
    ...(disease.reviewed_at ? { lastReviewed: new Date(disease.reviewed_at).toISOString().slice(0, 10) } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'WohinMedizin.at',
      url: SITE_URL,
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'WohinMedizin.at', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Seltene Erkrankungen', item: `${SITE_URL}/selten` },
      { '@type': 'ListItem', position: 3, name: disease.name, item: `${SITE_URL}${canonicalPath}` },
    ],
  }

  // FAQ-Schema → Chance auf Featured Snippets / „Nutzer fragen auch"
  const faqItems: Array<{ q: string; a: string }> = []
  if (disease.brief_description) {
    faqItems.push({ q: `Was ist ${disease.name}?`, a: disease.brief_description.slice(0, 300) })
  }
  if (specialties.length) {
    faqItems.push({ q: `Welche Ärztin oder welcher Arzt behandelt ${disease.name}?`, a: `Erste Anlaufstelle ist die Hausärztin oder der Hausarzt. Von dort erfolgt bei Bedarf eine Überweisung in Richtung ${specialties.join(', ')}. Für die Abklärung kann ein spezialisiertes Zentrum sinnvoll sein.` })
  }
  if (disease.inheritance.filter((v) => v !== 'unknown').length) {
    faqItems.push({ q: `Ist ${disease.name} vererbbar?`, a: `Für diese Erkrankung sind folgende Vererbungsmuster beschrieben: ${disease.inheritance.filter((v) => v !== 'unknown').map((v) => INHERITANCE_LABELS[v] ?? v).join(', ')}. Eine humangenetische Beratung kann Klarheit schaffen.` })
  }
  if (prevalenceNote) {
    faqItems.push({ q: `Wie häufig ist ${disease.name}?`, a: prevalenceNote })
  }
  const faqLd = faqItems.length >= 2 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(faqLd) }}
        />
      )}
      <Header />
      <main id="hauptinhalt" className="flex-1">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <Link href="/" className="hover:text-[var(--color-donau-blau)] transition-colors">WohinMedizin</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
              <Link href="/selten" className="hover:text-[var(--color-donau-blau)] transition-colors">Seltene Erkrankungen</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
              {organHubSlug && (
                <>
                  <Link href={`/selten/bereich/${organHubSlug}`} className="hover:text-[var(--color-donau-blau)] transition-colors">
                    {ORGAN_LABELS[primaryOrgan] ?? primaryOrgan}
                  </Link>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </>
              )}
              <span className="text-[var(--color-medizin-navy)] font-medium line-clamp-1">{disease.name}</span>
            </nav>
          </div>
        </div>

        {/* Geprüft-Banner */}
        {disease.editorial_status === 'published' && (
          <div className="bg-emerald-50 border-b border-emerald-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 shrink-0" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p className="text-xs text-emerald-700">
                Dieser Eintrag wurde redaktionell geprüft
                {disease.reviewed_at ? ` (${new Date(disease.reviewed_at).toLocaleDateString('de-AT')})` : ''}.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <section className="bg-white pb-8 pt-8 border-b border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {disease.orpha_code && <Badge variant="orpha">ORPHA:{orphaNum}</Badge>}
              {disease.icd10_code && <Badge variant="icd">ICD-10: {disease.icd10_code}</Badge>}
              {disease.omim_code  && <Badge variant="omim">OMIM: {disease.omim_code}</Badge>}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-medizin-navy)] mb-3 leading-tight">
              {disease.name}
            </h1>

            {disease.aliases.length > 0 && (
              <p className="text-sm text-[var(--color-muted)] mb-4">
                Auch bekannt als: {disease.aliases.join(', ')}
              </p>
            )}

            {disease.organ_systems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {disease.organ_systems.map((os) => (
                  <span key={os} className="text-xs bg-[var(--color-morgen-hellblau)] text-[var(--color-donau-blau)] border border-[var(--color-border)] px-3 py-1 rounded-full">
                    {ORGAN_LABELS[os] ?? os}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 no-print">
              <BookmarkButton slug={slug} name={disease.name} />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 bg-[var(--color-warmweiss)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Hauptinhalt */}
              <div className="lg:col-span-2 space-y-8">

                {/* Treffer aus dem Symptom-Finder (clientseitig, hält die Seite cachebar) */}
                <FinderMatch hpoTerms={disease.hpo_terms} />

                {/* Transparente Förderkennzeichnung — redaktionell unabhängig */}
                {disease.sponsor_name && (
                  <div className="rounded-xl px-5 py-3 bg-[var(--color-warmweiss)] border border-[var(--color-border)] flex items-start gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] border border-[var(--color-border)] rounded px-1.5 py-0.5 mt-0.5 shrink-0">Anzeige</span>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      Die Aufbereitung dieses Eintrags wurde unterstützt durch{' '}
                      {disease.sponsor_url
                        ? <a href={disease.sponsor_url} target="_blank" rel="noopener noreferrer sponsored" className="text-[var(--color-donau-blau)] underline">{disease.sponsor_name}</a>
                        : <strong className="text-[var(--color-medizin-navy)]">{disease.sponsor_name}</strong>}.
                      {' '}Der Sponsor hat keinen Einfluss auf den medizinischen Inhalt.{' '}
                      <Link href="/transparenz" className="underline hover:text-[var(--color-donau-blau)]">Mehr zur Transparenz</Link>.
                    </p>
                  </div>
                )}

                {/* Versorgungspfad — der rote Faden */}
                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                  <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-1">
                    Wer hilft dir weiter? Dein Weg in 4 Schritten
                  </h2>
                  <p className="text-sm text-[var(--color-muted)] mb-5">
                    So findest du Schritt für Schritt die richtige Anlaufstelle in Österreich.
                  </p>
                  <ol className="space-y-4">
                    <PathStep n={1} title="Erste Tür: Hausärztin oder Hausarzt">
                      Deine erste Anlaufstelle. Sie ordnet ein, koordiniert und überweist gezielt weiter.
                      Nimm deine Symptome und diese Seite mit.
                    </PathStep>
                    <PathStep n={2} title={specialties.length ? `Passende Fachrichtung: ${specialties.join(', ')}` : 'Passende Fachrichtung'}>
                      {specialties.length
                        ? 'Eine Überweisung in diese Richtung ist bei dieser Erkrankung typisch.'
                        : 'Die passende Fachrichtung ergibt sich aus den betroffenen Organsystemen.'}
                    </PathStep>
                    <PathStep n={3} title="Spezialzentrum">
                      {centers.length
                        ? `${centers.length} Zentren mit Bezug zu dieser Erkrankung — siehe unten.`
                        : 'Für viele seltene Erkrankungen gibt es spezialisierte Zentren. Wir ergänzen sie laufend.'}
                    </PathStep>
                    <PathStep n={4} title="Austausch & Unterstützung">
                      {organizations.length
                        ? `${organizations.length} Patientenorganisationen begleiten Betroffene — siehe unten.`
                        : 'Patientenorganisationen vernetzen Betroffene und bieten Orientierung.'}
                    </PathStep>
                  </ol>
                </div>

                {/* Kurzbeschreibung */}
                {disease.brief_description && (
                  <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-3">
                      Was ist {disease.name}?
                    </h2>
                    <p className="text-[var(--color-muted)] leading-relaxed text-sm">
                      {disease.brief_description}
                    </p>
                  </div>
                )}

                {/* Symptome (HPO) */}
                {(disease.hpo_terms.length > 0 || disease.symptoms.length > 0) && (
                  <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-4">
                      Typische Anzeichen
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(disease.symptoms.length > 0 ? disease.symptoms : []).map((s) => (
                        <span
                          key={s.hpo_code}
                          className="text-xs bg-[var(--color-warmweiss)] border border-[var(--color-border)] text-[var(--color-medizin-navy)] px-3 py-1.5 rounded-full"
                          title={`HPO: ${s.hpo_code} · ${CATEGORY_LABELS[s.category] ?? s.category}`}
                        >
                          {s.name}
                        </span>
                      ))}
                      {disease.symptoms.length === 0 && disease.hpo_terms.slice(0, 20).map((h) => (
                        <span
                          key={h.hpo_id}
                          className="text-xs bg-[var(--color-warmweiss)] border border-[var(--color-border)] text-[var(--color-medizin-navy)] px-3 py-1.5 rounded-full"
                          title={h.hpo_id}
                        >
                          {h.hpo_label}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--color-muted)] mt-3">
                      Anzeichen nach Human Phenotype Ontology (HPO). Nicht alle Betroffenen zeigen alle Anzeichen.
                    </p>
                  </div>
                )}

                {/* Ausführliche Symptombeschreibung */}
                {hasLexicalContent(disease.symptoms_description) && (
                  <ContentSection title="Anzeichen im Detail">
                    <RichText value={disease.symptoms_description} />
                  </ContentSection>
                )}

                {/* Ursachen */}
                {hasLexicalContent(disease.causes_description) && (
                  <ContentSection title="Ursachen">
                    <RichText value={disease.causes_description} />
                  </ContentSection>
                )}

                {/* Beteiligte Gene */}
                {disease.genes.length > 0 && (
                  <ContentSection title="Beteiligte Gene">
                    <div className="flex flex-wrap gap-2">
                      {disease.genes.map((g) => (
                        <a
                          key={g.symbol}
                          href={`https://www.omim.org/search?search=${encodeURIComponent(g.symbol)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={g.full_name ?? undefined}
                          className="text-sm font-mono bg-[var(--color-warmweiss)] border border-[var(--color-border)] text-[var(--color-medizin-navy)] px-3 py-1.5 rounded-full hover:border-[var(--color-donau-blau)] transition-colors"
                        >
                          {g.symbol}
                        </a>
                      ))}
                    </div>
                  </ContentSection>
                )}

                {/* Diagnose */}
                {(hasLexicalContent(disease.diagnosis_description) || disease.diagnosis_delay) && (
                  <ContentSection title="Wie wird die Erkrankung festgestellt?">
                    {disease.diagnosis_delay && (
                      <div className="flex items-start gap-2 mb-3 p-3 rounded-lg bg-[var(--color-warmweiss)] border border-[var(--color-border)]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-selten-violett)] shrink-0 mt-0.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                        <p className="text-sm text-[var(--color-medizin-navy)]"><strong>Weg zur Diagnose:</strong> {disease.diagnosis_delay}</p>
                      </div>
                    )}
                    <RichText value={disease.diagnosis_description} />
                  </ContentSection>
                )}

                {/* Behandlung */}
                {hasLexicalContent(disease.treatment_description) && (
                  <ContentSection title="Behandlung und Betreuung">
                    <RichText value={disease.treatment_description} />
                  </ContentSection>
                )}

                {/* Leben mit der Erkrankung */}
                {hasLexicalContent(disease.daily_life_description) && (
                  <ContentSection title="Leben mit der Erkrankung">
                    <RichText value={disease.daily_life_description} />
                  </ContentSection>
                )}

                {/* Wer behandelt das in Österreich — Spezialzentren */}
                {centers.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-4">
                      Wer behandelt das in Österreich?
                    </h2>
                    <ul className="space-y-3">
                      {centers.map((c) => (
                        <li key={c.slug ?? c.name} className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] last:border-0 pb-3 last:pb-0">
                          <div>
                            <p className="text-sm font-medium text-[var(--color-medizin-navy)] flex items-center gap-2 flex-wrap">{c.name}{c.verified && <VerifiedBadge />}</p>
                            <p className="text-xs text-[var(--color-muted)]">
                              {[CENTER_TYPE_LABELS[c.center_type ?? ''] ?? c.center_type, c.ern_network, c.city, COUNTRY_LABELS[c.country ?? '']].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                          {c.website && (
                            <a href={c.website} target="_blank" rel="noopener noreferrer"
                              className="shrink-0 text-xs text-[var(--color-donau-blau)] hover:underline whitespace-nowrap">
                              Website ↗
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[var(--color-muted)] mt-3">
                      Auswahl mit Bezug zur Erkrankung. Eine Überweisung erfolgt in der Regel über die Hausärztin oder den Hausarzt.
                    </p>
                  </div>
                )}

                {/* Patientenorganisationen */}
                {organizations.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-4">
                      Austausch & Unterstützung
                    </h2>
                    <ul className="space-y-3">
                      {organizations.map((o) => (
                        <li key={o.slug ?? o.name} className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] last:border-0 pb-3 last:pb-0">
                          <div>
                            <p className="text-sm font-medium text-[var(--color-medizin-navy)]">{o.name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{COUNTRY_LABELS[o.country ?? '']}</p>
                          </div>
                          {o.website && (
                            <a href={o.website} target="_blank" rel="noopener noreferrer"
                              className="shrink-0 text-xs text-[var(--color-donau-blau)] hover:underline whitespace-nowrap">
                              Website ↗
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Aktuelle klinische Studien — live aus ClinicalTrials.gov */}
                {trials.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-1">
                      Aktuelle klinische Studien
                    </h2>
                    <p className="text-xs text-[var(--color-muted)] mb-4">
                      Laufende, rekrutierende Studien aus dem öffentlichen Register ClinicalTrials.gov — europäische Standorte zuerst.
                      Eine Teilnahme besprichst du mit deiner Ärztin oder deinem Arzt; wir geben ohne deine Einwilligung keine Daten weiter.{' '}
                      <Link href="/transparenz" className="underline hover:text-[var(--color-donau-blau)]">Wie wir mit Studien umgehen</Link>.
                    </p>
                    <ul className="space-y-3">
                      {trials.map((tr) => (
                        <li key={tr.nctId} className="border-b border-[var(--color-border)] last:border-0 pb-3 last:pb-0">
                          <a href={tr.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-medium text-[var(--color-donau-blau)] hover:underline">
                            {tr.title}
                          </a>
                          <p className="text-xs text-[var(--color-muted)] mt-0.5">
                            {tr.nctId}{tr.locations.length ? ` · ${tr.locations.join(', ')}` : ''}{tr.inEurope ? ' · Europa' : ''}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <a href={trialsSearchUrl(externalQuery)} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm font-medium text-[var(--color-donau-blau)] hover:underline">
                      Alle Studien auf ClinicalTrials.gov ansehen →
                    </a>
                  </div>
                )}

                {/* Aktuelle Fachliteratur — live aus PubMed */}
                {literature.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-1">
                      Aktuelle Fachliteratur
                    </h2>
                    <p className="text-xs text-[var(--color-muted)] mb-4">
                      Neueste Übersichtsarbeiten aus PubMed. Fachtexte auf Englisch, für vertiefende Recherche oder das Arztgespräch.
                    </p>
                    <ul className="space-y-3">
                      {literature.map((a) => (
                        <li key={a.pmid} className="border-b border-[var(--color-border)] last:border-0 pb-3 last:pb-0">
                          <a href={a.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-medium text-[var(--color-donau-blau)] hover:underline">
                            {a.title}
                          </a>
                          <p className="text-xs text-[var(--color-muted)] mt-0.5">
                            {[a.journal, a.year].filter(Boolean).join(' · ')}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <a href={pubmedSearchUrl(externalQuery)} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm font-medium text-[var(--color-donau-blau)] hover:underline">
                      Weitere Übersichtsarbeiten auf PubMed →
                    </a>
                  </div>
                )}

                {/* Häufige Fragen — sichtbar passend zum FAQ-Schema */}
                {faqItems.length >= 2 && (
                  <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-4">
                      Häufige Fragen
                    </h2>
                    <div className="space-y-4">
                      {faqItems.map((f) => (
                        <div key={f.q}>
                          <h3 className="text-sm font-semibold text-[var(--color-medizin-navy)] mb-1">{f.q}</h3>
                          <p className="text-sm text-[var(--color-muted)] leading-relaxed">{f.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verwandte Erkrankungen — internes Linking */}
                {related.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-4">
                      Verwandte Erkrankungen
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {related.map((r) => (
                        <Link
                          key={r.slug}
                          href={`/selten/${r.slug}`}
                          className="text-sm bg-[var(--color-warmweiss)] border border-[var(--color-border)] text-[var(--color-medizin-navy)] px-3 py-1.5 rounded-full hover:border-[var(--color-selten-violett)] hover:text-[var(--color-selten-violett)] transition-colors"
                        >
                          {r.name}
                        </Link>
                      ))}
                    </div>
                    {organHubSlug && (
                      <Link href={`/selten/bereich/${organHubSlug}`} className="inline-block mt-4 text-sm font-medium text-[var(--color-donau-blau)] hover:underline">
                        Alle {ORGAN_LABELS[primaryOrgan] ?? ''}-Erkrankungen ansehen →
                      </Link>
                    )}
                  </div>
                )}

                {/* Hinweis auf redaktionelle Aufbereitung */}
                <div className="bg-[var(--color-morgen-hellblau)] rounded-xl p-6 border border-[var(--color-border)]">
                  <div className="flex gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-donau-blau)] shrink-0 mt-0.5" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-medizin-navy)] mb-1">
                        Dieser Eintrag wird redaktionell aufbereitet
                      </p>
                      <p className="text-sm text-[var(--color-muted)]">
                        Die Basisinformationen stammen aus der Orphanet-Datenbank. Detaillierte Beschreibungen,
                        Behandlungsoptionen und österreichische Anlaufstellen werden schrittweise ergänzt.
                      </p>
                      <a
                        href={`mailto:redaktion@wohinmedizin.at?subject=${encodeURIComponent(`Benachrichtigung bei Prüfung: ${disease.name}`)}`}
                        className="inline-block mt-2 text-sm font-medium text-[var(--color-donau-blau)] hover:underline"
                      >
                        Benachrichtige mich, wenn dieser Eintrag geprüft ist →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                {disease.disclaimer && (
                  <div className="rounded-xl border border-[var(--color-border)] p-5 bg-white">
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                      <strong className="text-[var(--color-medizin-navy)]">Medizinischer Hinweis:</strong>{' '}
                      {disease.disclaimer}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                  <h2 className="text-sm font-bold text-[var(--color-medizin-navy)] uppercase tracking-wider mb-5">
                    Klassifikation & Codes
                  </h2>
                  <dl className="space-y-4">
                    {disease.orpha_code && (
                      <SidebarItem label="ORPHA-Code" hint="Eindeutige internationale Kennnummer für seltene Erkrankungen (vergeben von Orphanet).">
                        {orphanetUrl ? (
                          <a href={orphanetUrl} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-mono text-[var(--color-selten-violett)] hover:underline">
                            {disease.orpha_code}
                          </a>
                        ) : (
                          <span className="text-sm font-mono text-[var(--color-selten-violett)]">{disease.orpha_code}</span>
                        )}
                      </SidebarItem>
                    )}
                    {disease.icd10_code && (
                      <SidebarItem label="ICD-10-Code">
                        <span className="text-sm font-mono text-[var(--color-medizin-navy)]">{disease.icd10_code}</span>
                      </SidebarItem>
                    )}
                    {disease.omim_code && (
                      <SidebarItem label="OMIM">
                        <a href={`https://www.omim.org/entry/${disease.omim_code}`} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-mono text-[var(--color-donau-blau)] hover:underline">
                          {disease.omim_code}
                        </a>
                      </SidebarItem>
                    )}
                  </dl>
                </div>

                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                  <h2 className="text-sm font-bold text-[var(--color-medizin-navy)] uppercase tracking-wider mb-5">
                    Epidemiologie
                  </h2>
                  <dl className="space-y-4">
                    {disease.prevalence && (
                      <SidebarItem label="Häufigkeit" hint="Prävalenz — wie viele Menschen in der Bevölkerung von der Erkrankung betroffen sind.">
                        <span className="text-sm text-[var(--color-medizin-navy)]">{disease.prevalence}</span>
                        {prevalenceNote && (
                          <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">{prevalenceNote}</p>
                        )}
                      </SidebarItem>
                    )}
                    {disease.inheritance.length > 0 && (
                      <SidebarItem label="Vererbung" hint="Wie die Erkrankung genetisch weitergegeben werden kann. Eine humangenetische Beratung kann das individuell einordnen.">
                        <div className="flex flex-wrap gap-1">
                          {disease.inheritance.filter((v) => v !== 'unknown').map((v) => (
                            <span key={v} className="text-xs bg-[var(--color-morgen-hellblau)] text-[var(--color-donau-blau)] px-2 py-0.5 rounded-full">
                              {INHERITANCE_LABELS[v] ?? v}
                            </span>
                          ))}
                        </div>
                      </SidebarItem>
                    )}
                    {disease.age_of_onset.length > 0 && (
                      <SidebarItem label="Erkrankungsalter">
                        <div className="flex flex-wrap gap-1">
                          {disease.age_of_onset.filter((v) => v !== 'all_ages').map((v) => (
                            <span key={v} className="text-xs bg-[var(--color-morgen-hellblau)] text-[var(--color-donau-blau)] px-2 py-0.5 rounded-full">
                              {ONSET_LABELS[v] ?? v}
                            </span>
                          ))}
                        </div>
                      </SidebarItem>
                    )}
                  </dl>
                </div>

                {/* Stand & Quellen — Vertrauenssignal, immer sichtbar */}
                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                  <h2 className="text-sm font-bold text-[var(--color-medizin-navy)] uppercase tracking-wider mb-4">
                    Stand & Quellen
                  </h2>
                  <dl className="space-y-3">
                    <SidebarItem label={disease.editorial_status === 'published' ? 'Redaktionell geprüft' : 'Datengrundlage'}>
                      <span className="text-sm text-[var(--color-medizin-navy)]">
                        {disease.reviewed_at
                          ? new Date(disease.reviewed_at).toLocaleDateString('de-AT')
                          : 'Automatisch aus Orphanet übernommen, noch nicht redaktionell geprüft'}
                      </span>
                    </SidebarItem>
                    {disease.next_review_at && (
                      <SidebarItem label="Nächste Überprüfung">
                        <span className="text-sm text-[var(--color-muted)]">{new Date(disease.next_review_at).toLocaleDateString('de-AT')}</span>
                      </SidebarItem>
                    )}
                    <SidebarItem label="Quelle">
                      <span className="text-sm text-[var(--color-muted)]">
                        Orphanet (INSERM US14), CC BY 4.0{disease.orpha_code ? ` · ${disease.orpha_code}` : ''}
                      </span>
                    </SidebarItem>
                  </dl>
                  <a
                    href={`mailto:kontakt@wohinmedizin.at?subject=${encodeURIComponent(`Fehler melden: ${disease.name}${disease.orpha_code ? ` (${disease.orpha_code})` : ''}`)}`}
                    className="inline-flex items-center gap-1.5 mt-4 text-xs text-[var(--color-muted)] hover:text-[var(--color-donau-blau)] transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>
                    Fehler oder Veralterung melden
                  </a>
                  <p className="text-[11px] text-[var(--color-muted)] mt-3 leading-relaxed border-t border-[var(--color-border)] pt-3">
                    Fachperson, Zentrum oder Förderer?{' '}
                    <Link href="/partner" className="underline hover:text-[var(--color-donau-blau)]">Diesen Eintrag unterstützen</Link>.
                  </p>
                </div>

                {/* Checkliste für den Arztbesuch */}
                <div className="bg-[var(--color-morgen-hellblau)] rounded-xl p-6 border border-[var(--color-border)]">
                  <h2 className="text-sm font-bold text-[var(--color-medizin-navy)] uppercase tracking-wider mb-4">
                    Checkliste für den Arztbesuch
                  </h2>
                  {hasLexicalContent(disease.doctor_questions) && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Empfohlene Fragen</p>
                      <RichText value={disease.doctor_questions} className="text-[var(--color-medizin-navy)]" />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Das kannst du mitnehmen</p>
                  <ul className="space-y-2 text-sm text-[var(--color-medizin-navy)]">
                    {[
                      'Seit wann bestehen die Beschwerden, und wie haben sie sich verändert?',
                      'Welche Untersuchungen gab es schon — und mit welchem Ergebnis?',
                      `Könnte ${disease.name} infrage kommen? (ORPHA-Code: ${disease.orpha_code ?? '—'})`,
                      specialties.length ? `Ist eine Überweisung in Richtung ${specialties.join(' / ')} sinnvoll?` : 'Welche Fachrichtung ist als Nächstes sinnvoll?',
                      centers.length ? 'Wäre die Abklärung in einem Spezialzentrum hilfreich?' : 'Gibt es ein spezialisiertes Zentrum für diese Frage?',
                    ].map((q) => (
                      <li key={q} className="flex gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-donau-blau)] shrink-0" aria-hidden="true" />
                        {q}
                      </li>
                    ))}
                  </ul>
                  <PrintButton />
                </div>

                {/* Externe Links */}
                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                  <h2 className="text-sm font-bold text-[var(--color-medizin-navy)] uppercase tracking-wider mb-4">
                    Weiterführende Quellen
                  </h2>
                  <ul className="space-y-3">
                    {orphanetUrl && (
                      <li>
                        <a href={orphanetUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[var(--color-donau-blau)] hover:underline">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                          Orphanet-Eintrag
                        </a>
                      </li>
                    )}
                    {disease.omim_code && (
                      <li>
                        <a href={`https://www.omim.org/entry/${disease.omim_code}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[var(--color-donau-blau)] hover:underline">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                          OMIM
                        </a>
                      </li>
                    )}
                    <li>
                      <a href={`https://clinicaltrials.gov/search?cond=${encodeURIComponent(disease.name)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[var(--color-donau-blau)] hover:underline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                        Klinische Studien (ClinicalTrials.gov)
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Attribution */}
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  Daten: Orphanet (INSERM US14) ·{' '}
                  <a href="https://creativecommons.org/licenses/by/4.0" target="_blank" rel="noopener noreferrer" className="underline">CC BY 4.0</a>
                </p>
              </aside>
            </div>
          </div>
        </section>

      </main>

      <BackToTop />

      {/* Mobile Sticky-CTA */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-[var(--color-border)] px-4 py-3 flex gap-3">
        <Link href="/navigator" className="flex-1 inline-flex items-center justify-center py-2.5 rounded-xl wohin-gradient text-white font-semibold text-sm">
          Anliegen einordnen
        </Link>
        <Link href="/finden" className="flex-1 inline-flex items-center justify-center py-2.5 rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] text-[var(--color-medizin-navy)] font-semibold text-sm">
          Symptom-Finder
        </Link>
      </div>

      <Footer />
    </>
  )
}
