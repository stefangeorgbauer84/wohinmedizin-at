import { ImageResponse } from 'next/og'
import { getDiseaseBySlug } from '@/lib/diseases'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'WohinMedizin.at — Seltene Erkrankungen'

export default async function OgImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  let name = 'Seltene Erkrankung'
  let code = ''
  try {
    const d = await getDiseaseBySlug(slug, locale ?? 'de')
    if (d) {
      name = d.name
      code = d.orpha_code ?? ''
    }
  } catch {
    // Fallback auf Standardtitel
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #123047 0%, #1E5A82 100%)',
          padding: '72px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, opacity: 0.9 }}>
          WohinMedizin.at · Seltene Erkrankungen
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{name}</div>
          {code && <div style={{ fontSize: 32, marginTop: 24, opacity: 0.85 }}>{code}</div>}
        </div>
        <div style={{ display: 'flex', fontSize: 26, opacity: 0.85 }}>
          Symptome · Vererbung · Spezialzentren in Österreich
        </div>
      </div>
    ),
    size,
  )
}
