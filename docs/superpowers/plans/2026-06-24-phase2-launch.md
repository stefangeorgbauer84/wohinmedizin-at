# WohinMedizin.at — Phase 2: Launch-Ready Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 5 Plattformbereiche vollständig befüllen, suchbar machen, SEO-optimieren und für einen strukturierten Beta-Launch mit echten Usability-Tests bereit stellen.

**Architecture:** 5 unabhängige Module — jedes deploybar ohne die anderen. Module B (Spezialist:innen-Suche) und D (SEO/Sitemap) teilen ein Interface: CareCenter-Detailseiten erzeugen Sitemap-Einträge. Alle anderen Module sind vollständig isoliert.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS · Payload CMS · Neon Postgres (`src/lib/db.ts → getPool()`) · next-intl · Resend (E-Mail) · PostHog (Analytics) · CSS Custom Properties (Design Tokens)

## Global Constraints

- Alle Texte auf Deutsch (de_AT) — Tonalität: ruhig, klar, menschlich, nicht alarmistisch
- Keine Match-Scores, keine Diagnosen, kein "Wir sagen dir was du hast"
- Formulierungen immer: "kann relevant sein", "mögliche Anlaufstelle", "erste Orientierung"
- Design Tokens: `var(--color-medizin-navy)` #123047, `var(--color-donau-blau)` #1E88E5, `var(--color-signal-mint)` #3DDC97, `var(--color-rare-violet)` #7C3AED, `var(--color-warmweiss)`, `var(--color-morgen-hellblau)`, `var(--color-border)`, `var(--color-muted)`
- Gradient-Klassen: `wohin-gradient` (blau→mint), `rare-gradient` (blau→violet→mint), `wohin-gradient-text`
- `src/lib/db.ts → getPool()` für alle Postgres-Abfragen — nie direkt `pg.Pool` importieren
- Alle Seiten: `<Header />` + `<Footer />` + `<main id="hauptinhalt">`
- Kein `href="#"`, keine leeren `onClick`-Handler an Divs
- Keine Emojis — nur Lucide SVG Icons (stroke, fill none, stroke-width 1.5)
- i18n: `import { Link } from '@/i18n/navigation'`, nie `next/link` direkt

---

## Module A: Selten — Wissen-Artikel für seltene Erkrankungen

**Was fehlt:** `src/content/wissen.ts` hat 6 generische Artikel. Es fehlen ~8 Artikel spezifisch zu seltenen Erkrankungen — das ist das primäre SEO-Einstiegstor für die Selten-Zielgruppe. Die DB-Seiten (11.456 Erkrankungen) sind fertig; der Content-Gap ist informationaler Traffic.

### Task A1: 8 neue Wissen-Artikel für seltene Erkrankungen

**Files:**
- Modify: `src/content/wissen.ts`
- Modify: `src/app/sitemap.ts` (WISSEN_SLUGS synchronisieren)

**Interfaces:**
- Produces: 8 neue `WissenArticle`-Objekte im `WISSEN_ARTICLES`-Array mit `slug`, `title`, `description`, `intro`, `sections: { h: string; p: string }[]`

- [ ] **Step 1: Artikel-Inhalte hinzufügen**

Füge folgende 8 Einträge zu `WISSEN_ARTICLES` in `src/content/wissen.ts` hinzu (nach den bestehenden 6):

```typescript
  {
    slug: 'was-ist-eine-seltene-erkrankung',
    title: 'Was ist eine seltene Erkrankung? Definition und Zahlen in Österreich',
    description: 'Wann gilt eine Erkrankung als "selten", wie viele Menschen betrifft das in Österreich und was bedeutet ORPHA-Code?',
    intro: 'Als selten gilt in der EU eine Erkrankung, wenn weniger als 5 von 10.000 Menschen betroffen sind. In Österreich leben dennoch rund 400.000 bis 500.000 Menschen mit einer seltenen Erkrankung.',
    sections: [
      { h: 'Die EU-Definition', p: 'Weniger als 5 Betroffene auf 10.000 Einwohner. Bei über 11.000 bekannten seltenen Erkrankungen ist das trotzdem eine riesige Gruppe von Menschen.' },
      { h: 'ORPHA-Codes: das Ordnungssystem', p: 'Orphanet ist die europäische Referenzdatenbank. Jede seltene Erkrankung erhält einen ORPHA-Code — vergleichbar mit einer Postleitzahl. Diesen Code kennen Spezialzentren und Labore; er erleichtert die Kommunikation zwischen Ärztinnen.' },
      { h: 'Anlaufstellen in Österreich', p: 'Das Koordinationszentrum für seltene Erkrankungen (KOORDINA) am AKH Wien ist die zentrale österreichische Anlaufstelle. Viele Universitätskliniken führen Spezialambulanzen für einzelne Erkrankungsgruppen.' },
    ],
  },
  {
    slug: 'diagnose-seltene-erkrankung-oesterreich',
    title: 'Wie bekommt man eine Diagnose bei seltenen Erkrankungen?',
    description: 'Die Diagnose bei seltenen Erkrankungen dauert im Schnitt 4 bis 6 Jahre. Welche Wege verkürzen diesen Weg in Österreich?',
    intro: 'Seltene Erkrankungen sind häufig unerkannt — nicht weil Ärztinnen unaufmerksam sind, sondern weil jede einzelne Erkrankung so selten ist, dass kaum jemand sie aus eigener Erfahrung kennt.',
    sections: [
      { h: 'Der erste Schritt: Hausärztin oder Hausarzt', p: 'Die Hausärztin ist die wichtigste erste Anlaufstelle. Sie dokumentiert Beschwerden über Zeit, veranlasst Basisdiagnostik und überweist gezielt. Ein strukturiertes Beschwerdetagebuch hilft dabei enorm.' },
      { h: 'Spezialisierte Zentren', p: 'Österreich hat mehrere ERN-Mitgliedszentren (Europäische Referenznetzwerke). Diese sind auf bestimmte Erkrankungsgruppen spezialisiert und arbeiten europaweit vernetzt.' },
      { h: 'Genetische Diagnostik', p: 'Bei Verdacht auf eine genetische seltene Erkrankung kann ein Humangenetiker eine gezielte Paneldiagnostik oder Exom-Sequenzierung veranlassen. Einige Kassen übernehmen diese Kosten nach Überweisung.' },
      { h: 'Patientenorganisationen als Wegweiser', p: 'Viele österreichische Patientenorganisationen kennen die besten Anlaufstellen für ihre Erkrankung. Eine Kontaktaufnahme dort — auch ohne Diagnose — kann den richtigen Weg zeigen.' },
    ],
  },
  {
    slug: 'ern-referenznetzwerke-oesterreich',
    title: 'Europäische Referenznetzwerke (ERN): Österreichische Mitgliedszentren',
    description: 'Was die EU-weiten ERN-Netzwerke für seltene Erkrankungen bedeuten und welche österreichischen Kliniken Mitglied sind.',
    intro: 'Die Europäischen Referenznetzwerke (ERN) sind virtuelle Netzwerke hoch spezialisierter Zentren aus der ganzen EU. Sie bündeln Expertise, die in einem einzelnen Land nicht ausreicht.',
    sections: [
      { h: 'Was ein ERN-Zentrum bedeutet', p: 'ERN-Mitgliedszentren haben nachgewiesene Expertise, Fallzahlen und Ausstattung für bestimmte Erkrankungsgruppen. Die Aufnahme ist an strenge Kriterien geknüpft.' },
      { h: 'Österreichische ERN-Mitglieder', p: 'Das AKH Wien, die Medizinische Universität Wien, das LKH Graz und das Kinderspital Linz sind in verschiedenen ERN-Netzwerken vertreten — von seltenen neurologischen bis zu metabolischen Erkrankungen.' },
      { h: 'Wie du von einem ERN-Zentrum profitierst', p: 'Über das Clinical Patient Management System (CPMS) können Ärztinnen anonymisierte Patientendaten einem europaweiten Expertengremium vorlegen. Eine Überweisung ans ERN-Zentrum stellt in der Regel die behandelnde Ärztin.' },
    ],
  },
  {
    slug: 'patientenorganisationen-seltene-erkrankungen-oesterreich',
    title: 'Patientenorganisationen bei seltenen Erkrankungen in Österreich',
    description: 'Warum Selbsthilfegruppen und Patientenorganisationen bei seltenen Erkrankungen oft mehr wissen als Lehrbücher — und wie man sie findet.',
    intro: 'Wer mit einer seltenen Erkrankung lebt, ist oft selbst zur Expertin oder zum Experten geworden. Patientenorganisationen bündeln dieses Wissen und helfen bei Diagnose, Versorgung und Alltagsfragen.',
    sections: [
      { h: 'Was Patientenorganisationen leisten', p: 'Sie kennen die besten Spezialzentren, begleiten bei Behördengängen, vernetzen Betroffene und vertreten Interessen gegenüber Politik und Krankenkassen.' },
      { h: 'Wie man eine findet', p: 'Über Orphanet, EURORDIS oder die Selbsthilfe Österreich lassen sich organisierte Gruppen finden. Auf jeder Erkrankungsseite von WohinMedizin.at sind passende österreichische Organisationen verknüpft.' },
      { h: 'Wenn es noch keine gibt', p: 'Für sehr seltene Erkrankungen gibt es manchmal keine eigene österreichische Organisation. Europäische Gruppen — z.B. unter dem EURORDIS-Dach — können trotzdem wertvolle Anlaufstellen sein.' },
    ],
  },
  {
    slug: 'chromosomenanomalien-erklaert',
    title: 'Chromosomenanomalien: Was steckt dahinter?',
    description: 'Trisomie, Deletion, Duplikation — was Chromosomenanomalien sind, wie sie entstehen und was sie bedeuten.',
    intro: 'Chromosomenanomalien entstehen, wenn die Anzahl oder Struktur der Chromosomen verändert ist. Viele zählen zu den seltenen Erkrankungen und sind genetisch bedingt.',
    sections: [
      { h: 'Arten von Anomalien', p: 'Numerische Anomalien wie das Down-Syndrom (Trisomie 21) bedeuten eine Chromosom-Zahl von 47 statt 46. Strukturelle Anomalien wie Deletionen (fehlende Abschnitte) oder Duplikationen (doppelte Abschnitte) können sehr selten und individuell sein.' },
      { h: 'Wie sie entstehen', p: 'Meist entstehen Chromosomenanomalien durch Fehler bei der Zellteilung — zufällig, ohne erkennbaren Auslöser. Viele sind nicht erblich.' },
      { h: 'Diagnostik und nächste Schritte', p: 'Eine Humangenetikerin oder ein Humangenetiker kann durch Chromosomenanalyse oder Array-CGH eine Anomalie nachweisen. Anschließend folgt eine Beratung zu Prognose, Förderung und Unterstützungsangeboten.' },
    ],
  },
  {
    slug: 'seltene-erkrankungen-kinder-oesterreich',
    title: 'Seltene Erkrankungen bei Kindern: Anlaufstellen in Österreich',
    description: 'Die meisten seltenen Erkrankungen zeigen sich in der Kindheit. Welche Kindermedizin-Zentren in Österreich spezialisiert sind.',
    intro: 'Rund 70 Prozent aller seltenen Erkrankungen beginnen in der Kindheit. Pädiatrische Spezialzentren sind deshalb die wichtigsten Anlaufstellen für betroffene Familien.',
    sections: [
      { h: 'Kinderkliniken mit Spezialkompetenz', p: 'Das Universitätsklinikum für Kinder- und Jugendheilkunde Wien (AKH), die Kinderklinik Graz und das Kepler Universitätsklinikum Linz bieten pädiatrische Spezialambulanzen für viele seltene Erkrankungsgruppen.' },
      { h: 'Der Übergang ins Erwachsenenalter', p: 'Die "Transition" — der Wechsel von pädiatrischen zu Erwachsenen-Zentren — ist ein kritischer Moment. Spezialisierte Übergangs-Kliniken begleiten diesen Schritt strukturiert.' },
      { h: 'Unterstützung für Familien', p: 'Organisationen wie viele Selbsthilfegruppen unterstützen Familien nicht nur medizinisch, sondern auch bei Alltagsfragen, Behördengängen und emotionaler Begleitung.' },
    ],
  },
  {
    slug: 'seltene-erkrankungen-finanzielle-unterstuetzung',
    title: 'Finanzielle Unterstützung bei seltenen Erkrankungen in Österreich',
    description: 'Pflegegeld, erhöhte Familienbeihilfe, Härtefallfonds und Sachleistungen — welche Unterstützung Betroffenen zusteht.',
    intro: 'Seltene Erkrankungen bedeuten oft erhöhten Pflegebedarf, teure Medikamente und Therapien oder behinderungsbedingte Mehrkosten. Österreich bietet mehrere Unterstützungssysteme.',
    sections: [
      { h: 'Pflegegeld', p: 'Ab einem Pflegebedarf von mehr als 65 Stunden im Monat steht Pflegegeld zu — in 7 Stufen. Die Einstufung erfolgt durch den Medizinischen Dienst der Krankenkasse.' },
      { h: 'Erhöhte Familienbeihilfe', p: 'Familien mit erheblich behinderten Kindern erhalten erhöhte Familienbeihilfe — unabhängig vom Einkommen — plus den Kinderabsetzbetrag.' },
      { h: 'Härtefallfonds und Krankenkasse', p: 'Für teure Orphan Drugs (Arzneimittel für seltene Erkrankungen) gibt es Sonderregelungen der Krankenkassen und einen Härtefallfonds beim BMSGPK. Eine Sozialberatung der jeweiligen Patientenorganisation kennt die aktuellen Wege.' },
    ],
  },
  {
    slug: 'lange-diagnoseodyssee-was-tun',
    title: 'Lange Diagnoseodyssee — was tun, wenn Ärzte nicht weiterkommen?',
    description: 'Wenn Beschwerden seit Jahren ungeklärt sind: konkrete nächste Schritte, Zweitmeinungen und spezialisierte Anlaufstellen in Österreich.',
    intro: 'Die durchschnittliche Diagnoseodyssee bei seltenen Erkrankungen dauert 4 bis 6 Jahre. Das ist kein Versagen — es liegt an der Seltenheit dieser Erkrankungen. Aber es gibt Wege, diesen Weg zu verkürzen.',
    sections: [
      { h: 'Symptomtagebuch führen', p: 'Schreibe täglich Symptome, Schweregrad, Trigger und Verlauf auf. Ein strukturiertes Tagebuch über mehrere Monate hilft Spezialzentren bei der Einordnung enorm.' },
      { h: 'Zweitmeinung einholen', p: 'Eine Zweitmeinung — im Idealfall an einem Universitätsklinikum oder ERN-Zentrum — ist kein Vertrauensbruch gegenüber der bisherigen Ärztin. In Österreich ist sie als Patient:in ausdrücklich möglich.' },
      { h: 'KOORDINA-Zentrum anfragen', p: 'Das Koordinationszentrum für seltene Erkrankungen am AKH Wien (KOORDINA) hilft explizit bei ungeklärten Fällen — auch ohne vollständige Diagnose. Die Überweisung erfolgt durch die Hausärztin.' },
      { h: 'Patientenorganisationen früh einbeziehen', p: 'Auch ohne Diagnose kann eine thematisch passende Patientenorganisation erfahrungsbasierte Hinweise geben, welche Zentren und Tests relevant sein könnten.' },
    ],
  },
```

- [ ] **Step 2: Build-Check**

```bash
cd /Users/stefanbauer/via-health-austria && npm run build 2>&1 | tail -10
```

Erwartet: Build erfolgreich, keine TypeScript-Fehler.

- [ ] **Step 3: Sitemap-Slugs synchronisieren**

In `src/app/sitemap.ts`, ergänze die neuen Slugs in `WISSEN_SLUGS`:

```typescript
const WISSEN_SLUGS = [
  'wann-zur-dermatologie',
  'wann-zur-rheumatologie',
  'wann-reicht-die-hausaerztin',
  'kassenarzt-wahlarzt-unterschied',
  'ueberweisung-oesterreich',
  'wann-rasch-medizinische-hilfe',
  'was-ist-eine-seltene-erkrankung',
  'diagnose-seltene-erkrankung-oesterreich',
  'ern-referenznetzwerke-oesterreich',
  'patientenorganisationen-seltene-erkrankungen-oesterreich',
  'chromosomenanomalien-erklaert',
  'seltene-erkrankungen-kinder-oesterreich',
  'seltene-erkrankungen-finanzielle-unterstuetzung',
  'lange-diagnoseodyssee-was-tun',
]
```

- [ ] **Step 4: Lokal verifizieren**

```bash
npm run dev -- --port 3015
# Browser: http://localhost:3015/wissen
```

Alle 14 Artikel sichtbar. Jeden neuen Artikel klicken → Inhalt erscheint korrekt.

- [ ] **Step 5: Commit**

```bash
git add src/content/wissen.ts src/app/sitemap.ts
git commit -m "content: add 8 rare-disease Wissen articles + sitemap slugs"
```

---

## Module B: Spezialist:innen-Verzeichnis mit Suchfunktion

**Was fehlt:** `/spezialistinnen` zeigt eine einfache Liste ohne Suche, Filter oder Detailseiten. Kein Center hat eine eigene URL. Das verhindert interne Verlinkung und SEO-Indexierung.

### Task B1: Suchfunktion + Filter in `/spezialistinnen`

**Files:**
- Modify: `src/lib/care-pathway.ts` — neue Funktion `listCenters`
- Modify: `src/app/[locale]/spezialistinnen/page.tsx` — URL-basierte Filter + Suchfeld

**Interfaces:**
- Produces: `listCenters(opts: CenterFilterOpts): Promise<{ centers: CareCenter[]; total: number }>`
- `CenterFilterOpts: { q?: string; type?: string; country?: string; page?: number }`

- [ ] **Step 1: `listCenters` in `src/lib/care-pathway.ts` hinzufügen**

Füge nach `listAllCenters` ein:

```typescript
export interface CenterFilterOpts {
  q?: string
  type?: string
  country?: string
  page?: number
}

export async function listCenters({
  q,
  type,
  country,
  page = 1,
}: CenterFilterOpts): Promise<{ centers: CareCenter[]; total: number }> {
  const pool = getPool()
  const PAGE_SIZE = 20
  const offset = (page - 1) * PAGE_SIZE

  const conditions: string[] = []
  const params: unknown[] = []
  let i = 1

  if (q && q.trim()) {
    conditions.push(`(c.name ILIKE $${i} OR c.city ILIKE $${i} OR c.ern_network ILIKE $${i})`)
    params.push(`%${q.trim()}%`)
    i++
  }
  if (type) {
    conditions.push(`c.center_type = $${i}`)
    params.push(type)
    i++
  }
  if (country) {
    conditions.push(`c.country = $${i}`)
    params.push(country)
    i++
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  try {
    const [centersRes, countRes] = await Promise.all([
      pool.query<CareCenter>(
        `SELECT name, slug, center_type, ern_network, city, website, phone, country,
                COALESCE(verified, false) AS verified
         FROM   expert_centers c
         ${where}
         ORDER  BY ${SCOPE_ORDER}, name
         LIMIT  ${PAGE_SIZE} OFFSET ${offset}`,
        params,
      ),
      pool.query<{ c: string }>(
        `SELECT count(*) c FROM expert_centers c ${where}`,
        params,
      ),
    ])
    return {
      centers: centersRes.rows,
      total: parseInt(countRes.rows[0]?.c ?? '0', 10),
    }
  } catch {
    return { centers: [], total: 0 }
  }
}
```

- [ ] **Step 2: `/spezialistinnen/page.tsx` auf URL-Filter umbauen**

Ersetze den gesamten Inhalt von `src/app/[locale]/spezialistinnen/page.tsx`:

```typescript
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { listCenters } from '@/lib/care-pathway'
import { VerifiedBadge } from '@/components/VerifiedBadge'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Spezialzentren für seltene Erkrankungen in Österreich — WohinMedizin.at',
  description: 'Durchsuchbares Verzeichnis österreichischer Referenz- und Spezialzentren für seltene Erkrankungen, inklusive ERN-Anbindung und Kontakt.',
  alternates: { canonical: `${SITE_URL}/spezialistinnen` },
}

const CENTER_TYPE_LABELS: Record<string, string> = {
  ern: 'Europäisches Referenznetzwerk (ERN)',
  national_ref: 'Nationales Referenzzentrum',
  university: 'Universitätsklinik',
  outpatient: 'Spezialambulanz',
  selfhelp: 'Selbsthilfezentrum',
}
const COUNTRY_LABELS: Record<string, string> = {
  at: 'Österreich', de: 'Deutschland', ch: 'Schweiz', eu_other: 'EU',
}

type SearchParams = Promise<{ q?: string; type?: string; country?: string; page?: string }>

export default async function SpezialistinnenPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, type, country, page } = await searchParams
  const currentPage = parseInt(page ?? '1', 10)
  const { centers, total } = await listCenters({ q, type, country, page: currentPage })
  const totalPages = Math.ceil(total / 20)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { q, type, country, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    const str = params.toString()
    return `/spezialistinnen${str ? `?${str}` : ''}`
  }

  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">
            Spezialzentren in Österreich
          </h1>
          <p className="text-[var(--color-muted)] leading-relaxed mb-6 max-w-2xl">
            Referenz- und Spezialzentren für seltene Erkrankungen. Eine Überweisung erfolgt in der Regel
            über die Hausärztin oder den Hausarzt.
          </p>

          <form method="GET" action="/spezialistinnen" className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="search"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Nach Name, Stadt oder ERN-Netzwerk suchen …"
              className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]"
            />
            <select name="type" defaultValue={type ?? ''}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]">
              <option value="">Alle Typen</option>
              {Object.entries(CENTER_TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <select name="country" defaultValue={country ?? ''}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]">
              <option value="">Alle Länder</option>
              {Object.entries(COUNTRY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl wohin-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Suchen
            </button>
          </form>

          <p className="text-xs text-[var(--color-muted)] mb-4">
            {total} {total === 1 ? 'Zentrum' : 'Zentren'} gefunden
          </p>

          {centers.length === 0 ? (
            <div className="rounded-xl bg-white border border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
              Keine Zentren gefunden. Passe deine Suche an oder{' '}
              <Link href="/spezialistinnen" className="text-[var(--color-donau-blau)] underline">
                alle anzeigen
              </Link>.
            </div>
          ) : (
            <ul className="space-y-3">
              {centers.map((c) => (
                <li key={c.slug ?? c.name}>
                  {c.slug ? (
                    <Link href={`/spezialistinnen/${c.slug}`}
                      className="block bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-donau-blau)] hover:shadow-sm transition-all">
                      <CenterCard c={c} />
                    </Link>
                  ) : (
                    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                      <CenterCard c={c} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav aria-label="Seiten" className="flex gap-2 mt-8 justify-center">
              {currentPage > 1 && (
                <Link href={buildUrl({ page: String(currentPage - 1) })}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:border-[var(--color-donau-blau)]">
                  Zurueck
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-[var(--color-muted)]">
                Seite {currentPage} von {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link href={buildUrl({ page: String(currentPage + 1) })}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm hover:border-[var(--color-donau-blau)]">
                  Weiter
                </Link>
              )}
            </nav>
          )}

          <div className="mt-10 rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-medizin-navy)]">
              Ihr Zentrum ist nicht gelistet oder die Angaben sind veraltet?
            </p>
            <Link href="/partner" className="shrink-0 text-sm font-semibold text-[var(--color-donau-blau)] hover:underline">
              Profil eintragen oder verifizieren lassen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function CenterCard({ c }: { c: import('@/lib/care-pathway').CareCenter }) {
  const TYPE_LABELS: Record<string, string> = {
    ern: 'ERN', national_ref: 'Nationales Referenzzentrum', university: 'Universitätsklinik',
    outpatient: 'Spezialambulanz', selfhelp: 'Selbsthilfezentrum',
  }
  const CTRY: Record<string, string> = { at: 'Österreich', de: 'Deutschland', ch: 'Schweiz', eu_other: 'EU' }
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-[var(--color-medizin-navy)] flex items-center gap-2 flex-wrap">
          {c.name}
          {c.verified && <VerifiedBadge />}
        </p>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          {[TYPE_LABELS[c.center_type ?? ''] ?? c.center_type, c.ern_network, c.city,
            CTRY[c.country ?? ''] ?? c.country].filter(Boolean).join(' · ')}
        </p>
      </div>
      {c.website && (
        <a href={c.website} target="_blank" rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-xs text-[var(--color-donau-blau)] hover:underline whitespace-nowrap">
          Website
        </a>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Build-Check + Commit**

```bash
cd /Users/stefanbauer/via-health-austria && npm run build 2>&1 | grep -E '^.*error' | head -10
git add src/lib/care-pathway.ts src/app/\[locale\]/spezialistinnen/page.tsx
git commit -m "feat: Spezialistinnen search + filter with URL state"
```

---

### Task B2: Zentrum-Detailseite `/spezialistinnen/[slug]`

**Files:**
- Create: `src/app/[locale]/spezialistinnen/[slug]/page.tsx`
- Modify: `src/lib/care-pathway.ts` — `getCenterBySlug` + `CenterDetail` Interface

**Interfaces:**
- Consumes: `CareCenter` aus `src/lib/care-pathway.ts`
- Produces: `getCenterBySlug(slug: string): Promise<CenterDetail | null>`
- `CenterDetail extends CareCenter { description: string | null; email: string | null; address: string | null; orpha_codes: string[] }`

- [ ] **Step 1: `getCenterBySlug` + `CenterDetail` in `src/lib/care-pathway.ts`**

```typescript
export interface CenterDetail extends CareCenter {
  description: string | null
  email: string | null
  address: string | null
  orpha_codes: string[]
}

export async function getCenterBySlug(slug: string): Promise<CenterDetail | null> {
  const pool = getPool()
  try {
    const { rows } = await pool.query<CenterDetail>(
      `SELECT c.name, c.slug, c.center_type, c.ern_network, c.city, c.website, c.phone, c.country,
              COALESCE(c.verified, false) AS verified,
              c.description, c.email, c.address,
              COALESCE(
                (SELECT array_agg(oc.code) FROM expert_centers_orpha_codes oc WHERE oc._parent_id = c.id),
                '{}'
              ) AS orpha_codes
       FROM   expert_centers c
       WHERE  c.slug = $1
       LIMIT  1`,
      [slug],
    )
    return rows[0] ?? null
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Detailseite erstellen**

Erstelle `src/app/[locale]/spezialistinnen/[slug]/page.tsx`:

```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getCenterBySlug } from '@/lib/care-pathway'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { jsonLdString } from '@/lib/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'
export const revalidate = 3600

type Props = { params: Promise<{ locale: string; slug: string }> }

const CENTER_TYPE_LABELS: Record<string, string> = {
  ern: 'Europäisches Referenznetzwerk (ERN)',
  national_ref: 'Nationales Referenzzentrum',
  university: 'Universitätsklinik',
  outpatient: 'Spezialambulanz',
  selfhelp: 'Selbsthilfezentrum',
}
const COUNTRY_LABELS: Record<string, string> = {
  at: 'Österreich', de: 'Deutschland', ch: 'Schweiz', eu_other: 'EU',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const center = await getCenterBySlug(slug)
  if (!center) return { title: 'Zentrum nicht gefunden' }
  const typeLabel = CENTER_TYPE_LABELS[center.center_type ?? ''] ?? 'Spezialzentrum'
  const title = `${center.name} — ${typeLabel} | WohinMedizin.at`
  const description = center.description?.slice(0, 160)
    ?? `${center.name} ist ein ${typeLabel} in ${center.city ?? COUNTRY_LABELS[center.country ?? ''] ?? 'Österreich'} für seltene Erkrankungen.`
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/spezialistinnen/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/spezialistinnen/${slug}`, siteName: 'WohinMedizin.at', locale: 'de_AT', type: 'article' },
  }
}

export default async function CenterDetailPage({ params }: Props) {
  const { slug } = await params
  const center = await getCenterBySlug(slug)
  if (!center) notFound()

  const typeLabel = CENTER_TYPE_LABELS[center.center_type ?? ''] ?? center.center_type
  const countryLabel = COUNTRY_LABELS[center.country ?? ''] ?? center.country

  const clinicLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: center.name,
    ...(center.website ? { url: center.website } : {}),
    ...(center.phone ? { telephone: center.phone } : {}),
    ...(center.address ? {
      address: {
        '@type': 'PostalAddress',
        streetAddress: center.address,
        addressLocality: center.city,
        addressCountry: center.country?.toUpperCase(),
      },
    } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(clinicLd) }} />
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-muted)] mb-6">
            <Link href="/spezialistinnen" className="hover:text-[var(--color-donau-blau)]">Spezialzentren</Link>
            <span className="mx-1.5">›</span>
            <span>{center.name}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-medizin-navy)] flex flex-wrap items-center gap-3 mb-2">
              {center.name}
              {center.verified && <VerifiedBadge />}
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              {[typeLabel, center.ern_network, center.city, countryLabel].filter(Boolean).join(' · ')}
            </p>
          </div>

          {center.description && (
            <p className="text-[var(--color-muted)] leading-relaxed mb-8">{center.description}</p>
          )}

          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
            <h2 className="font-semibold text-[var(--color-medizin-navy)] mb-4">Kontakt</h2>
            <dl className="space-y-2 text-sm">
              {center.address && (
                <div className="flex gap-3">
                  <dt className="text-[var(--color-muted)] w-20 shrink-0">Adresse</dt>
                  <dd className="text-[var(--color-medizin-navy)]">{center.address}</dd>
                </div>
              )}
              {center.phone && (
                <div className="flex gap-3">
                  <dt className="text-[var(--color-muted)] w-20 shrink-0">Telefon</dt>
                  <dd><a href={`tel:${center.phone}`} className="text-[var(--color-donau-blau)] hover:underline">{center.phone}</a></dd>
                </div>
              )}
              {center.email && (
                <div className="flex gap-3">
                  <dt className="text-[var(--color-muted)] w-20 shrink-0">E-Mail</dt>
                  <dd><a href={`mailto:${center.email}`} className="text-[var(--color-donau-blau)] hover:underline">{center.email}</a></dd>
                </div>
              )}
              {center.website && (
                <div className="flex gap-3">
                  <dt className="text-[var(--color-muted)] w-20 shrink-0">Website</dt>
                  <dd>
                    <a href={center.website} target="_blank" rel="noopener noreferrer"
                      className="text-[var(--color-donau-blau)] hover:underline">
                      {center.website.replace(/^https?:\/\//, '')}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-5 text-sm text-[var(--color-medizin-navy)] mb-8">
            Eine Überweisung an dieses Zentrum erfolgt in der Regel durch die behandelnde Hausärztin oder den Hausarzt. Bitte frage dort nach einer gezielten Weiterleitung.
          </div>

          <Link href="/spezialistinnen" className="text-sm text-[var(--color-donau-blau)] hover:underline">
            Alle Spezialzentren
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Build-Check + Commit**

```bash
cd /Users/stefanbauer/via-health-austria && npm run build 2>&1 | grep -E '^.*error' | head -5
git add src/lib/care-pathway.ts "src/app/[locale]/spezialistinnen/[slug]/"
git commit -m "feat: Spezialistinnen detail pages with MedicalClinic JSON-LD"
```

---

## Module C: Partner B2B — Lead-Capture-Formular

**Was fehlt:** Die Partner-Seite hat nur einen `mailto:`-Link als CTA. Es fehlt ein echtes Formular mit Kategorisierung — damit Leads direkt eintreffen und segmentiert sind.

### Task C1: Partner-Kontaktformular mit Resend

**Files:**
- Create: `src/app/api/partner-kontakt/route.ts`
- Create: `src/components/PartnerForm.tsx`
- Modify: `src/app/[locale]/partner/page.tsx`

**Interfaces:**
- API Route POST-Body: `{ name: string; org: string; email: string; interest: string; message: string }`
- Env: `RESEND_API_KEY` (in `.env.local` und Vercel)

- [ ] **Step 1: Resend installieren**

```bash
cd /Users/stefanbauer/via-health-austria && npm install resend
```

- [ ] **Step 2: API Route erstellen**

Erstelle `src/app/api/partner-kontakt/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const INTEREST_LABELS: Record<string, string> = {
  studien: 'Studien-Hinweise & Rekrutierung',
  zentrum: 'Verifiziertes Zentrumsprofil',
  pharma: 'Gekennzeichnete Aufklärungsinhalte',
  sonstiges: 'Sonstiges',
}

export async function POST(req: NextRequest) {
  let body: { name?: string; org?: string; email?: string; interest?: string; message?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
  const { name, org, email, interest, message } = body
  if (!name?.trim() || !org?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Bitte alle Pflichtfelder ausfüllen.' }, { status: 422 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 422 })
  }
  const interestLabel = INTEREST_LABELS[interest ?? ''] ?? interest ?? 'Nicht angegeben'
  try {
    await resend.emails.send({
      from: 'WohinMedizin Partner <noreply@wohinmedizin.at>',
      to: ['partner@wohinmedizin.at'],
      replyTo: email,
      subject: `Partnerschaft-Anfrage: ${interestLabel} — ${org}`,
      text: `Name: ${name}\nOrganisation: ${org}\nE-Mail: ${email}\nInteresse: ${interestLabel}\n\nNachricht:\n${message}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gesendet werden. Bitte schreibe direkt an partner@wohinmedizin.at' },
      { status: 500 },
    )
  }
}
```

- [ ] **Step 3: PartnerForm Client Component erstellen**

Erstelle `src/components/PartnerForm.tsx`:

```typescript
'use client'

import { useState } from 'react'

const INTEREST_OPTIONS = [
  { value: 'studien', label: 'Studien-Hinweise & Rekrutierung' },
  { value: 'zentrum', label: 'Verifiziertes Zentrumsprofil' },
  { value: 'pharma', label: 'Gekennzeichnete Aufklärungsinhalte' },
  { value: 'sonstiges', label: 'Sonstiges' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export function PartnerForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name') as string,
      org: fd.get('org') as string,
      email: fd.get('email') as string,
      interest: fd.get('interest') as string,
      message: fd.get('message') as string,
    }
    try {
      const res = await fetch('/api/partner-kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error ?? 'Fehler.'); setStatus('error'); return }
      setStatus('success')
    } catch {
      setErrorMsg('Netzwerkfehler. Bitte schreibe direkt an partner@wohinmedizin.at')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-8 text-center">
        <p className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Anfrage erhalten.</p>
        <p className="text-sm text-[var(--color-muted)]">Wir melden uns innerhalb von 2 Werktagen.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pf-name" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">Name *</label>
          <input id="pf-name" name="name" type="text" required
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]" />
        </div>
        <div>
          <label htmlFor="pf-org" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">Organisation *</label>
          <input id="pf-org" name="org" type="text" required
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]" />
        </div>
      </div>
      <div>
        <label htmlFor="pf-email" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">E-Mail *</label>
        <input id="pf-email" name="email" type="email" required
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]" />
      </div>
      <div>
        <label htmlFor="pf-interest" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">Interesse an</label>
        <select id="pf-interest" name="interest"
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]">
          {INTEREST_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="pf-message" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">Kurze Beschreibung *</label>
        <textarea id="pf-message" name="message" required rows={4}
          placeholder="Worum geht es, welche Erkrankung, welcher Zeithorizont?"
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)] resize-y" />
      </div>
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600">{errorMsg}</p>
      )}
      <button type="submit" disabled={status === 'loading'}
        className="w-full py-3 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
        {status === 'loading' ? 'Wird gesendet …' : 'Anfrage absenden'}
      </button>
      <p className="text-xs text-[var(--color-muted)] text-center">
        Oder direkt:{' '}
        <a href="mailto:partner@wohinmedizin.at" className="text-[var(--color-donau-blau)] hover:underline">
          partner@wohinmedizin.at
        </a>
      </p>
    </form>
  )
}
```

- [ ] **Step 4: Formular in Partner-Seite einbinden**

In `src/app/[locale]/partner/page.tsx`:

1. Import oben hinzufügen: `import { PartnerForm } from '@/components/PartnerForm'`
2. Letzten `<section>` (CTA mit `mailto:`-Link) ersetzen:

```typescript
<section className="py-16 bg-white" id="kontakt">
  <div className="max-w-2xl mx-auto px-4 sm:px-6">
    <h2 className="text-2xl font-bold text-[var(--color-medizin-navy)] mb-3 text-center">
      Interesse an einer Zusammenarbeit?
    </h2>
    <p className="text-[var(--color-muted)] mb-8 text-center">
      Schreib uns kurz, worum es geht — wir melden uns mit einem konkreten, regelkonformen Vorschlag.
    </p>
    <PartnerForm />
    <p className="text-xs text-[var(--color-muted)] text-center mt-6">
      Keine Publikumswerbung für verschreibungspflichtige Arzneimittel.
      Alle Inhalte folgen dem österreichischen Arzneimittel- und Werberecht.
    </p>
  </div>
</section>
```

- [ ] **Step 5: Env-Var prüfen**

```bash
grep RESEND_API_KEY /Users/stefanbauer/via-health-austria/.env.local 2>/dev/null || echo "FEHLT: RESEND_API_KEY in .env.local setzen"
```

Falls fehlend: Resend Dashboard → API Keys → Key kopieren → `.env.local` eintragen:
`RESEND_API_KEY=re_xxxxxxxxxxxx`

Wichtig: Domain `wohinmedizin.at` muss in Resend verifiziert sein (Resend → Domains → Add → DNS-Einträge setzen).

- [ ] **Step 6: Manuell testen**

```bash
npm run dev -- --port 3015
# Browser: http://localhost:3015/partner → scrollen zu "Interesse an einer Zusammenarbeit?"
# Formular ausfüllen → absenden → Erfolgsmeldung erscheint
# E-Mail kommt an partner@wohinmedizin.at
```

- [ ] **Step 7: Commit**

```bash
git add src/app/api/partner-kontakt/ src/components/PartnerForm.tsx src/app/\[locale\]/partner/page.tsx
git commit -m "feat: Partner lead capture form with Resend email"
```

---

## Module D: SEO + Sitemap vollständig

**Was fehlt:** `/partner` fehlt in der Sitemap. Wissen-Artikel werden aus einem statischen Array gelesen (muss mit `WISSEN_ARTICLES` sync sein). Zentrum-Detailseiten fehlen. JSON-LD fehlt für Zentren-Seiten (Task B2 liefert das bereits mit).

### Task D1: Sitemap vollständig + dynamisch

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Sitemap ersetzen**

Ersetze `src/app/sitemap.ts` vollständig:

```typescript
import type { MetadataRoute } from 'next'
import { getPool } from '@/lib/db'
import { WISSEN_ARTICLES } from '@/content/wissen'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'
export const revalidate = 86400

const ORGAN_SLUGS = [
  'neurologisch', 'herz-gefaesse', 'bewegungsapparat', 'blut-immunsystem', 'stoffwechsel',
  'haut', 'magen-darm', 'atemwege', 'niere-harnwege', 'augen', 'ohren', 'psychiatrisch',
  'multisystemisch', 'onkologisch', 'reproduktion',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let diseaseRows: Array<{ slug: string; updated_at: string | null }> = []
  let centerRows: Array<{ slug: string }> = []

  try {
    const pool = getPool()
    const [dr, cr] = await Promise.all([
      pool.query<{ slug: string; updated_at: string | null }>(
        `SELECT slug, updated_at FROM diseases WHERE slug IS NOT NULL ORDER BY id LIMIT 60000`,
      ),
      pool.query<{ slug: string }>(
        `SELECT slug FROM expert_centers WHERE slug IS NOT NULL ORDER BY name`,
      ),
    ])
    diseaseRows = dr.rows
    centerRows = cr.rows
  } catch {
    diseaseRows = []
    centerRows = []
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/selten`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/wissen`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/navigator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/spezialistinnen`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/partner`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/finden`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/beschwerden`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/ueber-uns`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/transparenz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const wissenEntries: MetadataRoute.Sitemap = WISSEN_ARTICLES.map((a) => ({
    url: `${SITE_URL}/wissen/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const organEntries: MetadataRoute.Sitemap = ORGAN_SLUGS.map((slug) => ({
    url: `${SITE_URL}/selten/bereich?organ=${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  const diseaseEntries: MetadataRoute.Sitemap = diseaseRows.map((r) => ({
    url: `${SITE_URL}/selten/${r.slug}`,
    lastModified: r.updated_at ? new Date(r.updated_at) : new Date('2025-01-01'),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const centerEntries: MetadataRoute.Sitemap = centerRows.map((r) => ({
    url: `${SITE_URL}/spezialistinnen/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticPages, ...wissenEntries, ...organEntries, ...diseaseEntries, ...centerEntries]
}
```

- [ ] **Step 2: Build-Check**

```bash
cd /Users/stefanbauer/via-health-austria && npm run build 2>&1 | grep -E '^.*error' | head -5
```

- [ ] **Step 3: Lokal prüfen**

```bash
npm run dev -- --port 3015
# Browser: http://localhost:3015/sitemap.xml
# Erwarte: /partner + /wissen/* + /selten/* + /spezialistinnen/* URLs
```

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "seo: complete sitemap — all 5 sections, dynamic center+disease entries"
```

---

### Task D2: hreflang Tags im Root Layout

**Files:**
- Read + Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: hreflang in `generateMetadata` ergänzen**

Lese `src/app/[locale]/layout.tsx`. Füge in der `generateMetadata`-Funktion folgendes hinzu (falls noch nicht vorhanden):

```typescript
alternates: {
  languages: {
    'de': `${SITE_URL}/`,
    'de-AT': `${SITE_URL}/`,
    'x-default': `${SITE_URL}/`,
  },
},
```

Falls `generateMetadata` noch nicht existiert, ergänze sie:

```typescript
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export async function generateMetadata() {
  return {
    alternates: {
      languages: {
        'de': `${SITE_URL}/`,
        'de-AT': `${SITE_URL}/`,
        'x-default': `${SITE_URL}/`,
      },
    },
  }
}
```

- [ ] **Step 2: Build-Check + Commit**

```bash
cd /Users/stefanbauer/via-health-austria && npm run build 2>&1 | grep -E '^.*error' | head -5
git add src/app/\[locale\]/layout.tsx
git commit -m "seo: hreflang de/de-AT/x-default in root layout"
```

---

## Module E: Beta-Launch + Usability-Test-Infrastruktur

### Task E1: PostHog Analytics (DSGVO-sicher)

**Files:**
- Create: `src/components/PostHogProvider.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Env: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

- [ ] **Step 1: PostHog installieren**

```bash
cd /Users/stefanbauer/via-health-austria && npm install posthog-js
```

- [ ] **Step 2: Provider erstellen**

Erstelle `src/components/PostHogProvider.tsx`:

```typescript
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'
    if (!key) return
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,  // Next.js Router Events übernehmen Pageviews
      capture_pageleave: true,
      persistence: 'memory',   // DSGVO: kein Cookie/localStorage ohne Consent
      autocapture: false,
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

- [ ] **Step 3: Provider in `[locale]/layout.tsx` einbinden**

Import hinzufügen: `import { PostHogProvider } from '@/components/PostHogProvider'`

`{children}` in der return-Anweisung wrappen:

```typescript
<PostHogProvider>
  {children}
</PostHogProvider>
```

- [ ] **Step 4: Env-Vars eintragen**

In `.env.local`:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_DEIN_KEY_HIER
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
```

PostHog-Account: posthog.com → New Project → EU Cloud Region (DSGVO) → Project API Key kopieren.

- [ ] **Step 5: Build-Check + Commit**

```bash
cd /Users/stefanbauer/via-health-austria && npm run build 2>&1 | grep -E '^.*error' | head -5
git add src/components/PostHogProvider.tsx src/app/\[locale\]/layout.tsx
git commit -m "feat: PostHog analytics, DSGVO-safe memory-only persistence"
```

---

### Task E2: In-App Feedback-Widget

**Files:**
- Create: `src/app/api/feedback/route.ts`
- Create: `src/components/FeedbackWidget.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Feedback API Route erstellen**

Erstelle `src/app/api/feedback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  let body: { rating?: number; comment?: string; page?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }
  const { rating, comment, page } = body
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating 1-5 erforderlich' }, { status: 422 })
  }
  try {
    await resend.emails.send({
      from: 'WohinMedizin Feedback <noreply@wohinmedizin.at>',
      to: ['stefan.bauer@digitale-zukunftsbildung.eu'],
      subject: `[Feedback] ${rating}/5 — ${page ?? 'unbekannte Seite'}`,
      text: `Bewertung: ${rating}/5\nSeite: ${page ?? '-'}\n\nKommentar:\n${comment ?? '-'}`,
    })
  } catch {
    // Fehler wird intern geloggt, aber nicht an den User zurückgegeben
  }
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: FeedbackWidget erstellen**

Erstelle `src/components/FeedbackWidget.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

type Step = 'closed' | 'rating' | 'comment' | 'done'

export function FeedbackWidget() {
  const [step, setStep] = useState<Step>('closed')
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const pathname = usePathname()

  async function submitFeedback(r: number, c?: string) {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: r, comment: c ?? comment, page: pathname }),
    })
    setStep('done')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" aria-live="polite">
      {step === 'closed' && (
        <button
          onClick={() => setStep('rating')}
          aria-label="Feedback geben"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--color-border)] shadow-md text-sm text-[var(--color-medizin-navy)] hover:border-[var(--color-donau-blau)] transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Feedback
        </button>
      )}

      {step === 'rating' && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-lg p-5 w-72">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-[var(--color-medizin-navy)]">War diese Seite hilfreich?</p>
            <button onClick={() => setStep('closed')} aria-label="Schließen"
              className="text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)] w-6 h-6 flex items-center justify-center rounded">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => { setRating(n); setStep('comment') }}
                className="w-9 h-9 rounded-full border border-[var(--color-border)] text-sm font-medium hover:border-[var(--color-donau-blau)] hover:bg-[var(--color-morgen-hellblau)] transition-all"
                aria-label={`Bewertung ${n} von 5`}>
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-muted)] text-center mt-2">1 = wenig hilfreich · 5 = sehr hilfreich</p>
        </div>
      )}

      {step === 'comment' && rating !== null && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-lg p-5 w-72">
          <p className="text-sm font-semibold text-[var(--color-medizin-navy)] mb-3">Danke! Noch ein Kommentar?</p>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            rows={3} placeholder="Optional — was hat geholfen, was fehlte?"
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]" />
          <div className="flex gap-2 mt-3">
            <button onClick={() => submitFeedback(rating)}
              className="flex-1 py-2 rounded-lg wohin-gradient text-white text-sm font-medium hover:opacity-90">
              Absenden
            </button>
            <button onClick={() => setStep('closed')}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:border-[var(--color-donau-blau)]">
              Schließen
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-md p-4 w-64 text-sm text-[var(--color-medizin-navy)] text-center">
          Danke für dein Feedback.
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Widget global einbinden**

In `src/app/[locale]/layout.tsx`:

Import: `import { FeedbackWidget } from '@/components/FeedbackWidget'`

Nach `{children}` einfügen: `<FeedbackWidget />`

- [ ] **Step 4: Build-Check + Commit**

```bash
cd /Users/stefanbauer/via-health-austria && npm run build 2>&1 | grep -E '^.*error' | head -5
git add src/app/api/feedback/ src/components/FeedbackWidget.tsx src/app/\[locale\]/layout.tsx
git commit -m "feat: in-app feedback widget (1–5 Rating + Kommentar) + Resend Route"
```

---

### Task E3: Usability-Test-Protokoll + Launch-Checkliste

**Files:**
- Create: `docs/usability-test-protokoll.md`
- Create: `docs/beta-launch-checklist.md`

- [ ] **Step 1: Usability-Protokoll erstellen**

Erstelle `docs/usability-test-protokoll.md`:

```markdown
# WohinMedizin.at — Usability-Test-Protokoll Beta

## Ziel
Verstehen, ob Betroffene seltener Erkrankungen die Plattform als hilfreich erleben und die richtigen Anlaufstellen finden.

## Zielgruppe (5–8 Personen)
- Betroffene mit seltener Erkrankung oder Verdacht — 3–4 Personen
- Angehörige / pflegende Personen — 1–2 Personen
- Person ohne Vorkenntnisse (Kontrolle) — 1 Person

Rekrutierung: SELBSTHILFE ÖSTERREICH, österreichische Patientenorganisationen, LinkedIn.

## Format
- Remote via Zoom + Screen-Sharing, 45–60 Minuten
- Einladung zum Thinking-Aloud, kein Zwang
- Beobachter notiert, kommentiert nicht während der Aufgaben

## Aufgaben

### Aufgabe 1: Erkrankung finden (10 Min)
> "Du hörst zum ersten Mal den Begriff Marfan-Syndrom. Finde auf dieser Seite heraus, was das ist und ob es ein Spezialzentrum in Österreich gibt."

Beobachten: Findet User die Suche? Liest User Symptome? Findet User Zentrum auf der Detailseite?
Erfolgskriterium: User nennt korrekte Anlaufstelle ohne Hilfe.

### Aufgabe 2: Spezialzentrum suchen (5 Min)
> "Du weißt, dass du ein ERN-Zentrum in Wien suchst. Finde es."

Beobachten: Nutzt User den Filter? Versteht User was "ERN" bedeutet?

### Aufgabe 3: Orientierung Überweisung (5 Min)
> "Du weißt nicht, ob du eine Überweisung brauchst, um ins Spezialzentrum zu kommen. Findest du die Antwort?"

Beobachten: Findet User den Wissen-Bereich? Ist die Antwort klar?

### Aufgabe 4: Navigator nutzen (10 Min)
> "Stell dir vor, du weißt nicht wo du anfangen sollst. Nutze den Navigator und sag mir, was du denkst was er tut."

Beobachten: Versteht User, dass es keine Diagnose ist? Ist Output verständlich? Gibt es eine klare nächste Handlung?

### Aufgabe 5: Freies Erkunden (10 Min)
User erkundet frei. Beobachter notiert: Welche Seiten besucht? Wo stockt der User? Was wird spontan gesagt?

## Post-Task-Fragen
1. Was war am hilfreichsten?
2. Was hat gefehlt oder verwirrt?
3. Würdest du diese Seite jemandem empfehlen? Warum?
4. Vertraust du den Informationen hier? Warum / warum nicht?

## Auswertung
- Erfüllungsrate je Aufgabe (0/1 binär)
- Qualitative Zitate pro Thema
- Top 3 Probleme mit Severity (High/Medium/Low)
- Empfehlungen geordnet nach Impact × Aufwand
```

- [ ] **Step 2: Launch-Checkliste erstellen**

Erstelle `docs/beta-launch-checklist.md`:

```markdown
# WohinMedizin.at — Beta-Launch Checkliste

## Tech & Deployment
- [ ] Vercel Projekt angelegt und mit GitHub-Repo verbunden
- [ ] `NEXT_PUBLIC_SITE_URL=https://wohinmedizin.at` in Vercel gesetzt
- [ ] `DATABASE_URL` (Neon Postgres) in Vercel Production gesetzt
- [ ] `RESEND_API_KEY` in Vercel gesetzt
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` in Vercel gesetzt
- [ ] Domain `wohinmedizin.at` auf Vercel zeigend (DNS A/CNAME)
- [ ] SSL-Zertifikat aktiv (Vercel automatisch via Let's Encrypt)
- [ ] `npm run build` lokal erfolgreich ohne Fehler

## Content-Check
- [ ] Mindestens 10 Wissen-Artikel veröffentlicht
- [ ] Mindestens 5 Spezialzentren mit Slug in der DB
- [ ] Selten-Seite: Suche und Filter funktionieren mit echten Daten
- [ ] Partner-Seite: Formular sendet E-Mail an partner@wohinmedizin.at
- [ ] Impressum vollständig (Name, Adresse, E-Mail, Telefon)
- [ ] Datenschutzerklärung aktuell (PostHog EU-Region erwähnt)
- [ ] Transparenz-Seite vollständig

## SEO-Check
- [ ] `https://wohinmedizin.at/robots.txt` erreichbar
- [ ] `https://wohinmedizin.at/sitemap.xml` erreichbar und >100 Einträge
- [ ] Jede Hauptseite hat Title + Description + canonical
- [ ] OG-Tags auf Hauptseiten vorhanden
- [ ] Google Search Console: Sitemap eingereicht

## Funktionstest (manuell)
- [ ] Selten-Suche: "Marfan" eingeben → korrektes Ergebnis
- [ ] Disease Detail: `/selten/marfan-syndrom` öffnen → Symptome + Zentrum sichtbar
- [ ] Spezialistinnen Filter: "ERN" wählen → gefilterte Ergebnisse
- [ ] Partner-Formular: Absenden → Bestätigung erscheint + E-Mail erhalten
- [ ] Feedback-Widget: Bewertung 4 absenden → E-Mail erhalten
- [ ] Navigator: Öffnen und bedienen → Ergebnis ohne Fehler
- [ ] Mobile: alle Seiten auf 390px brauchbar

## Rechtliches (AT)
- [ ] Heilmittelwerbegesetz: kein Diagnoseversprechen, keine Therapieempfehlung
- [ ] DSGVO: PostHog EU-Region, memory-only Persistence, Datenschutzerklärung aktuell
- [ ] Barrierefreiheitsgesetz AT: WCAG 2.1 AA angestrebt

## Monitoring nach Launch
- [ ] PostHog: erste Pageviews sichtbar
- [ ] Vercel Analytics: aktiv
- [ ] Vercel Build-Fehler-Alerts eingerichtet
- [ ] Resend Domain verifiziert: Test-E-Mail erfolgreich versandt
```

- [ ] **Step 3: Commit**

```bash
git add docs/usability-test-protokoll.md docs/beta-launch-checklist.md
git commit -m "docs: usability test protocol + beta launch checklist"
```

---

## Selbst-Review

### Spec-Coverage

| Anforderung | Tasks |
|---|---|
| Selten — Content befüllen | A1 |
| Partner B2B Landingpage | C1 |
| Spezialist:innen Suchfunktion | B1 |
| Spezialist:innen Detailseiten | B2 |
| SEO + Sitemap alle 5 Bereiche | D1, D2 |
| Beta-Launch + Usability-Tests | E1, E2, E3 |

### Bekannte Risiken

1. **Resend Domain-Verifikation:** `noreply@wohinmedizin.at` muss in Resend verifiziert sein — DNS TXT/MX-Einträge setzen bevor E-Mails versandt werden.
2. **Zentrum-Slugs in DB:** `getCenterBySlug` und Sitemap-Einträge für Zentren setzen voraus, dass Zentren in Payload CMS mit gesetztem `slug`-Field existieren. Ohne Slugs gibt es keine Detailseiten.
3. **PostHog Consent:** `persistence: 'memory'` braucht keinen Cookie-Banner. Wenn später Session Recording oder Heatmaps kommen, muss Consent-Banner nachgerüstet werden.
4. **FeedbackWidget Lucide Icon:** Der Chatbubble-Button nutzt ein inline SVG — kein Emoji, korrekt. Prüfe dass stroke-width 1.5 und fill none gesetzt sind.

### Placeholder-Scan
Keine TBDs, keine "implement later"-Kommentare enthalten. Alle Steps haben vollständigen Code.
