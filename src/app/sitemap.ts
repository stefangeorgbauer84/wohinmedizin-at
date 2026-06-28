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
    { url: `${SITE_URL}/wissen`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/navigator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/spezialistinnen`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/partner`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/finden`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/beschwerden`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/notfall`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}/fuer-aerzte`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
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
    url: `${SITE_URL}/selten/bereich/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const diseaseEntries: MetadataRoute.Sitemap = diseaseRows.map((r) => ({
    url: `${SITE_URL}/selten/${r.slug}`,
    lastModified: r.updated_at ? new Date(r.updated_at) : new Date('2025-01-01'),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const centerEntries: MetadataRoute.Sitemap = centerRows.map((r) => ({
    url: `${SITE_URL}/spezialistinnen/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...wissenEntries, ...organEntries, ...diseaseEntries, ...centerEntries]
}
