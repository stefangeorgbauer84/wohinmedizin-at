import { unstable_cache } from 'next/cache'

/**
 * Laufende klinische Studien zu einer Erkrankung — live aus der ClinicalTrials.gov
 * v2-API (öffentlich, kein Key). Ergebnisse werden 24h gecacht und Studien mit
 * Standort in AT/DE/CH/EU bevorzugt. Fehler/Timeouts liefern eine leere Liste.
 */

export interface ClinicalTrial {
  nctId: string
  title: string
  status: string
  locations: string[]
  inEurope: boolean
  url: string
}

const EU_COUNTRIES = new Set([
  'Austria', 'Germany', 'Switzerland', 'France', 'Italy', 'Spain', 'Netherlands',
  'Belgium', 'Sweden', 'Denmark', 'Finland', 'Norway', 'Poland', 'Czechia', 'Portugal',
  'Ireland', 'Hungary', 'Slovakia', 'Slovenia', 'Croatia', 'Greece', 'Romania',
])

interface CtStudy {
  protocolSection?: {
    identificationModule?: { nctId?: string; briefTitle?: string }
    statusModule?: { overallStatus?: string }
    contactsLocationsModule?: { locations?: Array<{ city?: string; country?: string }> }
  }
}

async function _getTrials(diseaseName: string): Promise<ClinicalTrial[]> {
  if (!diseaseName) return []
  const url =
    `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(diseaseName)}` +
    `&filter.overallStatus=RECRUITING,ENROLLING_BY_INVITATION&pageSize=20&countTotal=false`

  const ctrl = new AbortController()
  const tid = setTimeout(() => ctrl.abort(), 8000)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) return []
    const data = (await res.json()) as { studies?: CtStudy[] }
    const studies = data.studies ?? []

    const mapped: ClinicalTrial[] = studies.map((s) => {
      const p = s.protocolSection
      const locs = p?.contactsLocationsModule?.locations ?? []
      const countries = Array.from(new Set(locs.map((l) => l.country).filter(Boolean) as string[]))
      const inEurope = countries.some((c) => EU_COUNTRIES.has(c))
      return {
        nctId: p?.identificationModule?.nctId ?? '',
        title: p?.identificationModule?.briefTitle ?? '',
        status: p?.statusModule?.overallStatus ?? '',
        locations: countries.slice(0, 4),
        inEurope,
        url: `https://clinicaltrials.gov/study/${p?.identificationModule?.nctId ?? ''}`,
      }
    }).filter((t) => t.nctId && t.title)

    // Europäische Studien zuerst, dann nach Relevanz (API-Reihenfolge)
    mapped.sort((a, b) => Number(b.inEurope) - Number(a.inEurope))
    return mapped.slice(0, 6)
  } catch {
    return []
  } finally {
    clearTimeout(tid)
  }
}

export const getTrialsForDisease = unstable_cache(_getTrials, ['clinical-trials'], {
  revalidate: 86_400,
})

/** Link zur vollständigen, gefilterten Studiensuche. */
export function trialsSearchUrl(diseaseName: string): string {
  return `https://clinicaltrials.gov/search?cond=${encodeURIComponent(diseaseName)}&aggFilters=status:rec`
}
