import { unstable_cache } from 'next/cache'

/**
 * Aktuelle Übersichtsarbeiten (Reviews) zu einer Erkrankung — live über die
 * NCBI-E-utilities (öffentlich). 24h gecacht, Fehler/Timeouts → leere Liste.
 */

export interface Article {
  pmid: string
  title: string
  journal: string
  year: string
  url: string
}

async function fetchJson<T>(url: string, timeoutMs = 8000): Promise<T | null> {
  const ctrl = new AbortController()
  const tid = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(tid)
  }
}

async function _getLiterature(diseaseName: string): Promise<Article[]> {
  if (!diseaseName) return []
  const term = encodeURIComponent(`${diseaseName} AND review[pt]`)

  const search = await fetchJson<{ esearchresult?: { idlist?: string[] } }>(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${term}&retmax=5&sort=pub_date&retmode=json`,
  )
  const ids = search?.esearchresult?.idlist ?? []
  if (ids.length === 0) return []

  const summary = await fetchJson<{ result?: Record<string, unknown> }>(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`,
  )
  const result = summary?.result
  if (!result) return []

  return ids
    .map((id) => {
      const r = result[id] as { title?: string; fulljournalname?: string; source?: string; pubdate?: string } | undefined
      if (!r?.title) return null
      return {
        pmid: id,
        title: r.title.replace(/\.$/, ''),
        journal: r.fulljournalname ?? r.source ?? '',
        year: (r.pubdate ?? '').slice(0, 4),
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      } as Article
    })
    .filter((a): a is Article => a !== null)
}

export const getLiteratureForDisease = unstable_cache(_getLiterature, ['pubmed-literature'], {
  revalidate: 86_400,
})

export function pubmedSearchUrl(diseaseName: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(`${diseaseName} AND review[pt]`)}`
}
