import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'WohinMedizin.at — Medizinische Orientierung für Österreich'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #123047 0%, #1E5A82 60%, #1E88E5 100%)',
          padding: '80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.9, marginBottom: 24 }}>WohinMedizin.at</div>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>
          Finde die richtige medizinische Anlaufstelle
        </div>
        <div style={{ fontSize: 30, opacity: 0.85, marginTop: 28 }}>
          Seltene Erkrankungen · Symptom-Finder · Spezialzentren in Österreich
        </div>
      </div>
    ),
    size,
  )
}
