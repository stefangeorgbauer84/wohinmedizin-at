import { unstable_cache } from 'next/cache'
import { getPool } from './db'

/**
 * Symptom-Finder — von Alltagssprache zu möglichen Erkrankungen.
 *
 * Einstieg über die kuratierte `symptoms`-Tabelle (menschliche Namen, nach
 * Kategorie gruppiert), gemappt auf HPO-Codes. Die Zuordnung gewichtet seltene,
 * spezifische Symptome stärker als häufige (inverse Häufigkeit), damit nicht
 * „Müdigkeit" tausende Treffer erzeugt.
 *
 * WICHTIG: Dies ist KEINE Diagnose. Ergebnisse sind „Erkrankungen, die zu den
 * Angaben passen könnten" — bewusst qualitativ, ohne Prozentzahlen.
 */

export interface PickableSymptom {
  hpo_code: string
  name: string
  category: string | null
}

export interface SymptomCategory {
  category: string
  label: string
  symptoms: PickableSymptom[]
}

export interface DiseaseMatch {
  id: number
  slug: string
  name: string
  orpha_code: string | null
  match_count: number
  selected_count: number
  matched_labels: string[]
  strength: 'schwach' | 'mittel' | 'stark'
}

const CATEGORY_LABELS: Record<string, string> = {
  neurological: 'Nerven & Gehirn',
  musculoskeletal: 'Muskeln, Knochen & Gelenke',
  dermatological: 'Haut, Haare & Nägel',
  cardiovascular: 'Herz & Kreislauf',
  respiratory: 'Atmung & Lunge',
  gastrointestinal: 'Verdauung & Bauch',
  ophthalmological: 'Augen & Sehen',
  visual: 'Augen & Sehen',
  auditory: 'Ohren & Hören',
  endocrine_metabolic: 'Stoffwechsel & Hormone',
  hematological_immunological: 'Blut & Immunsystem',
  urogenital: 'Niere, Harnwege & Unterleib',
  psychiatric: 'Psyche & Verhalten',
  growth: 'Wachstum & Entwicklung',
  general: 'Allgemein & Energie',
}

/** Lädt alle kuratierten, auswählbaren Symptome – gruppiert nach Kategorie (24h gecacht). */
export const getPickableSymptoms = unstable_cache(
  _getPickableSymptoms,
  ['pickable-symptoms'],
  { revalidate: 86_400 },
)

async function _getPickableSymptoms(locale = 'de'): Promise<SymptomCategory[]> {
  const pool = getPool()
  try {
    const { rows } = await pool.query<PickableSymptom>(
      `SELECT s.hpo_code, sl.name, s.category
       FROM   symptoms s
       JOIN   symptoms_locales sl ON sl._parent_id = s.id AND sl._locale = $1
       WHERE  s.hpo_code IS NOT NULL AND s.hpo_code <> ''
       ORDER  BY s.category NULLS LAST, sl.name`,
      [locale],
    )

    const byCategory = new Map<string, PickableSymptom[]>()
    for (const r of rows) {
      const key = r.category ?? 'general'
      if (!byCategory.has(key)) byCategory.set(key, [])
      byCategory.get(key)!.push(r)
    }

    return Array.from(byCategory.entries()).map(([category, symptoms]) => ({
      category,
      label: CATEGORY_LABELS[category] ?? 'Weitere',
      symptoms,
    }))
  } catch {
    return []
  }
}

/** Findet Erkrankungen, die zu den gewählten Symptomen passen (gewichtet). */
export async function findDiseasesBySymptoms(
  hpoCodes: string[],
  locale = 'de',
): Promise<DiseaseMatch[]> {
  if (!hpoCodes.length) return []
  const pool = getPool()

  try {
    const { rows } = await pool.query<{
      id: number
      slug: string
      name: string
      orpha_code: string | null
      match_count: string
      score: string
      matched_labels: string[]
    }>(
      `
      WITH freq AS (
        SELECT hpo_id, count(DISTINCT _parent_id)::float AS f
        FROM   diseases_codes_hpo_terms
        WHERE  hpo_id = ANY($1)
        GROUP  BY hpo_id
      )
      SELECT d.id, d.slug, dl.name,
             d.codes_orpha_code AS orpha_code,
             count(DISTINCT h.hpo_id)            AS match_count,
             sum(1.0 / ln(freq.f + 2.0))         AS score,
             array_agg(DISTINCT h.hpo_label)     AS matched_labels
      FROM   diseases_codes_hpo_terms h
      JOIN   freq ON freq.hpo_id = h.hpo_id
      JOIN   diseases d ON d.id = h._parent_id
      JOIN   diseases_locales dl ON dl._parent_id = d.id AND dl._locale = $2
      WHERE  h.hpo_id = ANY($1)
      GROUP  BY d.id, d.slug, dl.name, d.codes_orpha_code
      ORDER  BY score DESC, match_count DESC
      LIMIT  25
      `,
      [hpoCodes, locale],
    )

    const selected = hpoCodes.length
    return rows.map((r) => {
      const matchCount = parseInt(r.match_count, 10)
      const ratio = matchCount / selected
      const strength: DiseaseMatch['strength'] =
        ratio >= 0.6 ? 'stark' : ratio >= 0.35 ? 'mittel' : 'schwach'
      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        orpha_code: r.orpha_code,
        match_count: matchCount,
        selected_count: selected,
        matched_labels: r.matched_labels ?? [],
        strength,
      }
    })
  } catch {
    return []
  }
}
