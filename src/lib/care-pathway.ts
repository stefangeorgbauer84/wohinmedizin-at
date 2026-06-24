import { getPool } from './db'

/**
 * Care-Pathway-Abfragen — die Brücke von einer Erkrankung zu den Stellen,
 * die sie in Österreich behandeln bzw. begleiten.
 *
 * Verknüpfung läuft über zwei Wege:
 *   1. ORPHA-Code (direkter, präziser Bezug)
 *   2. Organsystem (breiterer Bezug, falls kein direkter Code hinterlegt ist)
 *
 * Hinweis: Die Join-Tabellen (expert_centers_organ_systems etc.) entstehen erst
 * nach einem Payload-Schema-Push. Bis dahin liefern die Abfragen leere Listen,
 * ohne die Seite zu unterbrechen.
 */

export interface CareCenter {
  name: string
  slug: string | null
  center_type: string | null
  ern_network: string | null
  city: string | null
  website: string | null
  phone: string | null
  country: string | null
  verified: boolean
}

export interface CareOrganization {
  name: string
  slug: string | null
  website: string | null
  email: string | null
  phone: string | null
  country: string | null
}

const SCOPE_ORDER = `CASE country::text WHEN 'at' THEN 0 WHEN 'de' THEN 1 WHEN 'ch' THEN 2 WHEN 'eu' THEN 3 ELSE 4 END`

/** Spezialzentren, die zu ORPHA-Code oder Organsystem der Erkrankung passen. */
export async function findMatchingCenters(
  orphaCode: string | null,
  organSystems: string[],
): Promise<CareCenter[]> {
  const pool = getPool()
  const orphaNum = orphaCode?.replace('ORPHA:', '') ?? null

  try {
    const { rows } = await pool.query<CareCenter>(
      `
      SELECT DISTINCT ON (c.id)
             c.name, c.slug, c.center_type, c.ern_network, c.city, c.website, c.phone, c.country,
             COALESCE(c.verified, false) AS verified
      FROM   expert_centers c
      LEFT   JOIN expert_centers_organ_systems os ON os.parent_id = c.id
      LEFT   JOIN expert_centers_orpha_codes   oc ON oc._parent_id = c.id
      WHERE  ($1::text IS NOT NULL AND oc.code = $1)
         OR  ($2::text[] IS NOT NULL AND os.value::text = ANY($2))
      ORDER  BY c.id, ${SCOPE_ORDER}
      LIMIT  12
      `,
      [orphaNum, organSystems.length ? organSystems : null],
    )
    // Österreich zuerst
    return rows.sort((a, b) => scopeRank(a.country) - scopeRank(b.country))
  } catch {
    return []
  }
}

/** Patientenorganisationen, die zu ORPHA-Code oder Organsystem passen. */
export async function findMatchingOrganizations(
  orphaCode: string | null,
  organSystems: string[],
): Promise<CareOrganization[]> {
  const pool = getPool()
  const orphaNum = orphaCode?.replace('ORPHA:', '') ?? null

  try {
    const { rows } = await pool.query<CareOrganization>(
      `
      SELECT DISTINCT ON (o.id)
             o.name, o.slug, o.website, o.email, o.phone, o.country
      FROM   patient_organizations o
      LEFT   JOIN patient_organizations_organ_systems os ON os.parent_id = o.id
      LEFT   JOIN patient_organizations_orpha_codes   oc ON oc._parent_id = o.id
      WHERE  ($1::text IS NOT NULL AND oc.code = $1)
         OR  ($2::text[] IS NOT NULL AND os.value::text = ANY($2))
      ORDER  BY o.id, ${SCOPE_ORDER}
      LIMIT  8
      `,
      [orphaNum, organSystems.length ? organSystems : null],
    )
    return rows.sort((a, b) => scopeRank(a.country) - scopeRank(b.country))
  } catch {
    return []
  }
}

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

/** Alle Spezialzentren (für das Verzeichnis), Österreich zuerst. */
export async function listAllCenters(): Promise<CareCenter[]> {
  const pool = getPool()
  try {
    const { rows } = await pool.query<CareCenter>(
      `SELECT name, slug, center_type, ern_network, city, website, phone, country,
              COALESCE(verified, false) AS verified
       FROM expert_centers
       ORDER BY ${SCOPE_ORDER}, name`,
    )
    return rows
  } catch {
    return []
  }
}

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

function scopeRank(country: string | null): number {
  switch (country) {
    case 'at': return 0
    case 'de': return 1
    case 'ch': return 2
    case 'eu': return 3
    default: return 4
  }
}
