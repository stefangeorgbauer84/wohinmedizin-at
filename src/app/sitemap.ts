import type { MetadataRoute } from 'next'
import { getPool } from '@/lib/db'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

// Täglich neu generieren (cachebar) statt bei jedem Crawl die DB zu treffen
export const revalidate = 86400

const ORGAN_SLUGS = [
  'neurologisch', 'herz-gefaesse', 'bewegungsapparat', 'blut-immunsystem', 'stoffwechsel',
  'haut', 'magen-darm', 'atemwege', 'niere-harnwege', 'augen', 'ohren', 'psychiatrisch',
  'multisystemisch', 'onkologisch', 'reproduktion',
]

const WISSEN_SLUGS = [
  'wann-zur-dermatologie', 'wann-zur-rheumatologie', 'wann-reicht-die-hausaerztin',
  'kassenarzt-wahlarzt-unterschied', 'ueberweisung-oesterreich', 'wann-rasch-medizinische-hilfe',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Krankheits-URLs aus der DB — build-resilient: ist die DB zur Build-Zeit nicht
  // erreichbar (z.B. fehlende DATABASE_URI in der Preview), liefern wir nur die
  // statischen Seiten und revalidieren die volle Sitemap zur Laufzeit.
  let rows: Array<{ slug: string; updated_at: string | null }> = []
  try {
    const pool = getPool()
    const res = await pool.query<{ slug: string; updated_at: string | null }>(`
      SELECT slug, updated_at
      FROM   diseases
      WHERE  slug IS NOT NULL
      ORDER  BY id
      LIMIT  60000
    `)
    rows = res.rows
  } catch {
    rows = []
  }

  const diseasEntries: MetadataRoute.Sitemap = rows.map((r) => ({
    url: `${SITE_URL}/selten/${r.slug}`,
    lastModified: r.updated_at ? new Date(r.updated_at) : new Date('2025-01-01'),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/selten`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/navigator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/spezialistinnen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/finden`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/beschwerden`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/wissen`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/transparenz`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/partner`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const organPages: MetadataRoute.Sitemap = ORGAN_SLUGS.map((s) => ({
    url: `${SITE_URL}/selten/bereich/${s}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const wissenPages: MetadataRoute.Sitemap = WISSEN_SLUGS.map((s) => ({
    url: `${SITE_URL}/wissen/${s}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...organPages, ...wissenPages, ...diseasEntries]
}
