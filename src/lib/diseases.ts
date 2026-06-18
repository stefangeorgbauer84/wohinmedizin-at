import { getPool } from './db'

export interface DiseaseListItem {
  id: number
  slug: string
  name: string
  orpha_code: string
  icd10_code: string | null
  prevalence: string | null
  brief_description: string | null
  organ_systems: string[]
  editorial_status: string | null
}

export interface DiseaseDetail extends DiseaseListItem {
  published_at: string | null
  reviewed_at: string | null
  omim_code: string | null
  primary_etiology: string | null
  course_modifier: string | null
  hpo_terms: Array<{ hpo_id: string; hpo_label: string }>
  inheritance: string[]
  age_of_onset: string[]
  symptoms: Array<{ name: string; hpo_code: string; category: string }>
  aliases: string[]
  disclaimer: string | null
  // Redaktioneller Langtext (Lexical-richText, JSON) + Metadaten
  causes_description: unknown
  diagnosis_description: unknown
  treatment_description: unknown
  daily_life_description: unknown
  doctor_questions: unknown
  symptoms_description: unknown
  diagnosis_delay: string | null
  next_review_at: string | null
  genes: Array<{ symbol: string; full_name: string | null }>
  name_en: string | null
  sponsor_name: string | null
  sponsor_url: string | null
}

export interface DiseaseListResult {
  diseases: DiseaseListItem[]
  total: number
}

const PAGE_SIZE = 24

export async function listDiseases(opts: {
  q?: string
  organ?: string
  organs?: string[]
  page?: number
  locale?: string
}): Promise<DiseaseListResult> {
  const pool = getPool()
  const { q, locale = 'de' } = opts
  // Allowlist: nur bekannte Organ-System-Werte zulassen
  const VALID_ORGANS = new Set([
    'neurological', 'cardiovascular', 'musculoskeletal', 'hematological_immunological',
    'endocrine_metabolic', 'dermatological', 'gastrointestinal', 'respiratory',
    'urogenital', 'visual', 'auditory', 'reproductive', 'psychiatric', 'multisystemic', 'oncological',
  ])
  const organ = opts.organ && VALID_ORGANS.has(opts.organ) ? opts.organ : undefined
  // Schnittmengen-Filter: nur gültige Werte, max. 2 Bereiche
  const organs = (opts.organs ?? []).filter((o) => VALID_ORGANS.has(o)).slice(0, 2)
  // NaN-Guard: ungültige page-Werte auf 1 zurücksetzen
  const rawPage = opts.page ?? 1
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1
  const offset = (page - 1) * PAGE_SIZE

  const params: unknown[] = [locale]
  let where = 'WHERE dl._locale = $1'
  let paramIdx = 2

  // Suche mit Tippfehler-Toleranz: exakter Teiltreffer (ILIKE) ODER trigram-ähnlich
  let orderBy = 'ORDER BY dl.name'
  if (q) {
    const ilikeIdx = paramIdx++
    const simIdx = paramIdx++
    where += ` AND (dl.name ILIKE $${ilikeIdx} OR word_similarity($${simIdx}, dl.name) > 0.5)`
    params.push(`%${q}%`, q)
    // Exakte Treffer zuerst, dann nach Ähnlichkeit
    orderBy = `ORDER BY (dl.name ILIKE $${ilikeIdx}) DESC, word_similarity($${simIdx}, dl.name) DESC, dl.name`
  }
  if (organ) {
    where += ` AND EXISTS (
      SELECT 1 FROM diseases_organ_systems dos
      WHERE dos.parent_id = d.id AND dos.value = $${paramIdx++}
    )`
    params.push(organ)
  }
  // Schnittmenge: Erkrankung muss ALLE angegebenen Bereiche betreffen
  if (organs.length > 0) {
    for (const o of organs) {
      where += ` AND EXISTS (
        SELECT 1 FROM diseases_organ_systems dos
        WHERE dos.parent_id = d.id AND dos.value::text = $${paramIdx++}
      )`
      params.push(o)
    }
  }

  const countSql = `
    SELECT COUNT(DISTINCT d.id)
    FROM diseases d
    JOIN diseases_locales dl ON dl._parent_id = d.id
    ${where}
  `
  const dataSql = `
    SELECT
      d.id, d.slug, dl.name,
      d.codes_orpha_code   AS orpha_code,
      d.codes_icd10_code   AS icd10_code,
      d.epidemiology_prevalence AS prevalence,
      LEFT(dl.brief_description, 180) AS brief_description,
      d.status AS editorial_status,
      COALESCE(
        (SELECT array_agg(dos.value::text ORDER BY dos."order")
         FROM diseases_organ_systems dos WHERE dos.parent_id = d.id),
        ARRAY[]::text[]
      ) AS organ_systems
    FROM diseases d
    JOIN diseases_locales dl ON dl._parent_id = d.id
    ${where}
    ${orderBy}
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `

  const [countRes, dataRes] = await Promise.all([
    pool.query(countSql, params),
    pool.query(dataSql, params),
  ])

  return {
    diseases: dataRes.rows,
    total: parseInt(countRes.rows[0]?.count ?? '0', 10),
  }
}

export async function getDiseaseBySlug(
  slug: string,
  locale = 'de',
): Promise<DiseaseDetail | null> {
  const pool = getPool()

  const main = await pool.query<DiseaseDetail & { id: number }>(
    `SELECT
       d.id, d.slug,
       dl.name,
       d.codes_orpha_code   AS orpha_code,
       d.codes_icd10_code   AS icd10_code,
       d.codes_omim_code    AS omim_code,
       d.epidemiology_prevalence AS prevalence,
       d.primary_etiology,
       d.modifiers_course_modifier AS course_modifier,
       d.status AS editorial_status,
       d.published_at,
       d.reviewed_at,
       d.next_review_at,
       d.diagnosis_delay,
       dl.brief_description,
       dl.disclaimer,
       dl.causes_description,
       dl.diagnosis_description,
       dl.treatment_description,
       dl.daily_life_description,
       dl.doctor_questions,
       dl.symptoms_description
     FROM diseases d
     JOIN diseases_locales dl ON dl._parent_id = d.id AND dl._locale = $2
     WHERE d.slug = $1`,
    [slug, locale],
  )
  if (!main.rows[0]) return null
  const d = main.rows[0]

  const [hpoRes, inheritRes, onsetRes, orgRes, symRes, aliasRes, genesRes, enNameRes, sponsorRes] = await Promise.all([
    pool.query(
      `SELECT hpo_id, hpo_label FROM diseases_codes_hpo_terms
       WHERE _parent_id = $1 ORDER BY _order LIMIT 30`,
      [d.id],
    ),
    pool.query(
      `SELECT value FROM diseases_epidemiology_inheritance WHERE parent_id = $1 ORDER BY "order"`,
      [d.id],
    ),
    pool.query(
      `SELECT value FROM diseases_epidemiology_age_of_onset WHERE parent_id = $1 ORDER BY "order"`,
      [d.id],
    ),
    pool.query(
      `SELECT value FROM diseases_organ_systems WHERE parent_id = $1 ORDER BY "order"`,
      [d.id],
    ),
    pool.query(
      `SELECT sl.name, s.hpo_code, s.category
       FROM diseases_rels dr
       JOIN symptoms s ON s.id = dr.symptoms_id
       JOIN symptoms_locales sl ON sl._parent_id = s.id AND sl._locale = $2
       WHERE dr.parent_id = $1 AND dr.path = 'symptomsRelationship'
       ORDER BY dr.order LIMIT 20`,
      [d.id, locale],
    ),
    pool.query(
      `SELECT alias FROM diseases_aliases WHERE _parent_id = $1 ORDER BY _order LIMIT 5`,
      [d.id],
    ),
    // Beteiligte Gene — defensiv gekapselt, falls Relation noch leer/abweichend
    pool.query<{ symbol: string; full_name: string | null }>(
      `SELECT g.symbol, g.full_name
       FROM diseases_rels dr
       JOIN genes g ON g.id = dr.genes_id
       WHERE dr.parent_id = $1 AND dr.path = 'genesRelationship'
       ORDER BY dr.order LIMIT 10`,
      [d.id],
    ).catch(() => ({ rows: [] as Array<{ symbol: string; full_name: string | null }> })),
    // Englischer Name für externe Datenbanken (ClinicalTrials.gov, PubMed)
    pool.query<{ name: string }>(
      `SELECT name FROM diseases_locales WHERE _parent_id = $1 AND _locale = 'en' LIMIT 1`,
      [d.id],
    ).catch(() => ({ rows: [] as Array<{ name: string }> })),
    // Transparente Förderung — gekapselt, da Spalten erst nach Schema-Push existieren
    pool.query<{ sponsor_name: string | null; sponsor_url: string | null }>(
      `SELECT sponsor_name, sponsor_url FROM diseases WHERE id = $1`,
      [d.id],
    ).catch(() => ({ rows: [] as Array<{ sponsor_name: string | null; sponsor_url: string | null }> })),
  ])

  return {
    ...d,
    hpo_terms:   hpoRes.rows,
    inheritance: inheritRes.rows.map((r) => r.value),
    age_of_onset:onsetRes.rows.map((r) => r.value),
    organ_systems:orgRes.rows.map((r) => r.value),
    symptoms:    symRes.rows,
    aliases:     aliasRes.rows.map((r) => r.alias),
    genes:       genesRes.rows,
    name_en:     enNameRes.rows[0]?.name ?? null,
    sponsor_name: sponsorRes.rows[0]?.sponsor_name ?? null,
    sponsor_url:  sponsorRes.rows[0]?.sponsor_url ?? null,
  }
}

/**
 * Verwandte Erkrankungen über gemeinsame Organsysteme — für internes Linking
 * (mehr Seiten pro Sitzung, tiefere Crawl-Pfade, bessere Themen-Cluster).
 */
/** Anzahl Erkrankungen je Organsystem (für die Körperkarte). */
export async function getOrganCounts(): Promise<Record<string, number>> {
  const pool = getPool()
  try {
    const { rows } = await pool.query<{ value: string; c: string }>(
      `SELECT value::text AS value, count(DISTINCT parent_id) AS c
       FROM diseases_organ_systems GROUP BY value`,
    )
    const out: Record<string, number> = {}
    for (const r of rows) out[r.value] = parseInt(r.c, 10)
    return out
  } catch {
    return {}
  }
}

/** Plattform-Kennzahlen für Trust-Sektionen (gecacht). */
export async function getPlatformStats(): Promise<{ diseases: number; hpo: number; icd11: number }> {
  const pool = getPool()
  const fallback = { diseases: 11456, hpo: 4335, icd11: 6143 }
  try {
    const { rows } = await pool.query<{ diseases: string; hpo: string; icd11: string }>(`
      SELECT
        (SELECT count(*) FROM diseases) AS diseases,
        (SELECT count(DISTINCT _parent_id) FROM diseases_codes_hpo_terms) AS hpo,
        (SELECT count(*) FROM diseases WHERE codes_icd11_chapter_anchor IS NOT NULL AND codes_icd11_chapter_anchor <> '') AS icd11
    `)
    const r = rows[0]
    return {
      diseases: parseInt(r?.diseases ?? '0', 10) || fallback.diseases,
      hpo: parseInt(r?.hpo ?? '0', 10) || fallback.hpo,
      icd11: parseInt(r?.icd11 ?? '0', 10) || fallback.icd11,
    }
  } catch {
    return fallback
  }
}

/** Ausgewählte, allgemein bekannte Erkrankungen (für Startseite — interne Verlinkung & Aktivierung). */
export async function getFeaturedDiseases(
  orphaCodes: string[],
  locale = 'de',
): Promise<Array<{ slug: string; name: string; orpha_code: string | null }>> {
  const pool = getPool()
  try {
    const codes = orphaCodes.map((c) => `ORPHA:${c}`)
    const { rows } = await pool.query<{ slug: string; name: string; orpha_code: string | null }>(
      `SELECT d.slug, dl.name, d.codes_orpha_code AS orpha_code
       FROM diseases d
       JOIN diseases_locales dl ON dl._parent_id = d.id AND dl._locale = $2
       WHERE d.codes_orpha_code = ANY($1) AND d.slug IS NOT NULL
       ORDER BY array_position($1, d.codes_orpha_code)`,
      [codes, locale],
    )
    return rows
  } catch {
    return []
  }
}

export async function findRelatedDiseases(
  organSystems: string[],
  excludeId: number,
  locale = 'de',
  limit = 6,
): Promise<Pick<DiseaseListItem, 'slug' | 'name' | 'orpha_code'>[]> {
  if (!organSystems.length) return []
  const pool = getPool()
  try {
    const { rows } = await pool.query<Pick<DiseaseListItem, 'slug' | 'name' | 'orpha_code'>>(
      `
      SELECT DISTINCT ON (d.id) d.slug, dl.name, d.codes_orpha_code AS orpha_code
      FROM   diseases d
      JOIN   diseases_organ_systems dos ON dos.parent_id = d.id
      JOIN   diseases_locales dl ON dl._parent_id = d.id AND dl._locale = $2
      WHERE  dos.value::text = ANY($1)
        AND  d.id <> $3
        AND  dl.name IS NOT NULL
      ORDER  BY d.id
      LIMIT  $4
      `,
      [organSystems, locale, excludeId, limit],
    )
    return rows
  } catch {
    return []
  }
}
