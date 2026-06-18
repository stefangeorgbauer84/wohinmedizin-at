import { getPool } from './db'
import { getPickableSymptoms } from './symptom-finder'

/**
 * Universal-Suche („WohinSuche") — bündelt Erkrankungen, Anzeichen, Anlaufstellen
 * und Wissensseiten in einer einzigen, tippfehlertoleranten Abfrage. Grundlage für
 * den adaptiven Eingang, der dem Nutzer den Moduswechsel erspart.
 */

export interface SearchResult {
  type: 'disease' | 'symptom' | 'page'
  label: string
  sublabel?: string
  href: string
}

export interface UniversalResults {
  diseases: SearchResult[]
  symptoms: SearchResult[]
  pages: SearchResult[]
  bodyPart?: { label: string; hub: string; id: string } | null
  didYouMean?: { label: string; href: string } | null
}

// Körperregion-Erkennung: Tipp-Begriff → passende BodyMap-Region
const BODY_PART_MAP: Array<{ keywords: string[]; id: string; hub: string; label: string }> = [
  { keywords: ['herz', 'kardio', 'gefäß', 'aorta', 'herzrhythmus', 'herzfehler', 'herzklappe'], id: 'brust', hub: 'herz-gefaesse', label: 'Herz & Gefäße' },
  { keywords: ['lunge', 'atem', 'bronch', 'mukoviszidose', 'lungenfibros'], id: 'lunge', hub: 'atemwege', label: 'Atemwege' },
  { keywords: ['magen', 'darm', 'leber', 'dünndarm', 'dickdarm', 'bauch', 'gastro'], id: 'bauch', hub: 'magen-darm', label: 'Magen & Darm' },
  { keywords: ['gehirn', 'nerv', 'kopf', 'neuro', 'epileps', 'migräne', 'ms ', 'multiple sklerose'], id: 'kopf', hub: 'neurologisch', label: 'Kopf & Nerven' },
  { keywords: ['auge', 'sehen', 'netzhaut', 'makula', 'hornhaut', 'optik'], id: 'augen', hub: 'augen', label: 'Augen' },
  { keywords: ['ohr', 'hören', 'taubheit', 'gehör', 'vestibular'], id: 'ohren', hub: 'ohren', label: 'Ohren' },
  { keywords: ['niere', 'harnweg', 'blase', 'urolog'], id: 'niere', hub: 'niere-harnwege', label: 'Niere & Harnwege' },
  { keywords: ['muskel', 'gelenk', 'knochen', 'skelett', 'rheuma', 'ortho', 'wirbel'], id: 'gelenke', hub: 'bewegungsapparat', label: 'Muskeln & Gelenke' },
  { keywords: ['haut', 'derma', 'juck', 'blasen', 'ausschlag', 'ekzem'], id: 'haut', hub: 'haut', label: 'Haut' },
  { keywords: ['ganzkörper', 'multisystem', 'metabol', 'stoffwechsel', 'genetisch'], id: 'ganz', hub: 'multisystemisch', label: 'Ganzer Körper' },
]

// Statische Seiten/Hilfen, die mitdurchsucht werden (Label + Schlagworte)
const PAGES: Array<{ label: string; href: string; keywords: string }> = [
  { label: 'Navigator — Anliegen frei beschreiben', href: '/navigator', keywords: 'navigator anliegen frei beschreiben hilfe orientierung wohin arzt' },
  { label: 'Symptom-Finder', href: '/finden', keywords: 'symptom finder anzeichen beschwerden finden' },
  { label: 'Seltene Erkrankungen — Übersicht', href: '/selten', keywords: 'seltene erkrankungen krankheiten liste übersicht orpha' },
  { label: 'Spezialzentren in Österreich', href: '/spezialistinnen', keywords: 'spezialzentren zentren ärzte spezialisten klinik ambulanz anlaufstelle' },
  { label: 'Wissen — Orientierung im Gesundheitssystem', href: '/wissen', keywords: 'wissen ratgeber gesundheitssystem kassenarzt wahlarzt überweisung' },
  { label: 'Wann zur Dermatologie?', href: '/wissen/wann-zur-dermatologie', keywords: 'dermatologie hautarzt haut wann' },
  { label: 'Wann zur Rheumatologie?', href: '/wissen/wann-zur-rheumatologie', keywords: 'rheumatologie gelenke rheuma wann' },
  { label: 'Kassenarzt vs. Wahlarzt', href: '/wissen/kassenarzt-wahlarzt-unterschied', keywords: 'kassenarzt wahlarzt unterschied kosten kasse' },
  { label: 'Wie funktioniert eine Überweisung?', href: '/wissen/ueberweisung-oesterreich', keywords: 'überweisung zuweisung facharzt' },
]

// Alltagssprache → Fachbegriff, damit Laien auch ohne korrekten Namen finden
const SYNONYMS: Record<string, string> = {
  glasknochen: 'Osteogenesis imperfecta',
  'schmetterlingskrankheit': 'Epidermolysis bullosa',
  mukoviszidose: 'Zystische Fibrose',
  bluterkrankheit: 'Hämophilie',
  bluter: 'Hämophilie',
  'weichteilrheuma': 'Fibromyalgie',
  zuckerkrankheit: 'Diabetes',
  knochenschwund: 'Osteoporose',
  nervenwasser: 'Multiple Sklerose',
  'wasserkopf': 'Hydrozephalus',
  elefantenmensch: 'Neurofibromatose',
  'vampirkrankheit': 'Porphyrie',
  'steinmann': 'Fibrodysplasia ossificans progressiva',
}

export async function universalSearch(qRaw: string, locale = 'de'): Promise<UniversalResults> {
  const q = qRaw.trim()
  if (q.length < 2) return { diseases: [], symptoms: [], pages: [], bodyPart: null, didYouMean: null }
  const lower = q.toLowerCase()
  // Körperregion-Erkennung
  const bodyPart = BODY_PART_MAP.find((b) => b.keywords.some((kw) => lower.includes(kw))) ?? null
  // Synonym-Treffer: Schlüssel als Teilstring der Eingabe?
  const synonymTerm = Object.entries(SYNONYMS).find(([key]) => lower.includes(key))?.[1] ?? null

  // 1) Erkrankungen — tippfehlertolerant (ILIKE + trigram)
  let diseases: SearchResult[] = []
  try {
    const pool = getPool()
    const { rows } = await pool.query<{ slug: string; name: string; orpha_code: string | null }>(
      `SELECT d.slug, dl.name, d.codes_orpha_code AS orpha_code
       FROM diseases d
       JOIN diseases_locales dl ON dl._parent_id = d.id AND dl._locale = $2
       WHERE dl.name ILIKE $3
          OR word_similarity($1, dl.name) > 0.5
          OR ($4::text IS NOT NULL AND dl.name ILIKE $4)
          OR d.codes_orpha_code ILIKE $5
          OR d.codes_icd10_code ILIKE $5
       ORDER BY (dl.name ILIKE $3) DESC, word_similarity($1, dl.name) DESC, length(dl.name)
       LIMIT 6`,
      [q, locale, `%${q}%`, synonymTerm ? `%${synonymTerm}%` : null, `%${q.replace(/^orpha:?/i, '').trim()}%`],
    )
    diseases = rows.map((r) => ({
      type: 'disease' as const,
      label: r.name,
      sublabel: r.orpha_code ?? undefined,
      href: `/selten/${r.slug}`,
    }))
  } catch {
    diseases = []
  }

  // 2) Anzeichen — aus dem kuratierten Symptomkatalog (gecacht), führen in den Finder
  let symptoms: SearchResult[] = []
  try {
    const cats = await getPickableSymptoms(locale)
    const hits: SearchResult[] = []
    for (const cat of cats) {
      for (const s of cat.symptoms) {
        if (s.name.toLowerCase().includes(lower)) {
          hits.push({
            type: 'symptom',
            label: s.name,
            sublabel: cat.label,
            href: `/finden?s=${encodeURIComponent(s.hpo_code)}`,
          })
        }
        if (hits.length >= 5) break
      }
      if (hits.length >= 5) break
    }
    symptoms = hits
  } catch {
    symptoms = []
  }

  // 3) Seiten/Hilfen
  const pages: SearchResult[] = PAGES.filter(
    (p) => p.label.toLowerCase().includes(lower) || p.keywords.includes(lower),
  )
    .slice(0, 4)
    .map((p) => ({ type: 'page' as const, label: p.label, href: p.href }))

  // „Meintest du?" — bei Tippfehler/Synonym: Eingabe taucht in keinem Treffernamen auf
  let didYouMean: { label: string; href: string } | null = null
  if (q.length >= 3 && diseases.length > 0) {
    const isCodeQuery = /^[a-z]*:?\s*[\d.]+$/i.test(q)
    const directHit = diseases.some((d) => d.label.toLowerCase().includes(lower))
    if (!isCodeQuery && !directHit) {
      didYouMean = { label: diseases[0].label, href: diseases[0].href }
    }
  }

  return { diseases, symptoms, pages, bodyPart: bodyPart ? { label: bodyPart.label, hub: bodyPart.hub, id: bodyPart.id } : null, didYouMean }
}
