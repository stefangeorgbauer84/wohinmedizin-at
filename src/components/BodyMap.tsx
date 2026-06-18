'use client'

import { useRouter } from '@/i18n/navigation'
import { useState } from 'react'

/**
 * Körperkarte — spracharmer Einstieg: Klick/Tap auf eine Körperregion führt
 * direkt zur passenden Bereichs-Übersicht (Versorgungspfad). Ideal für geringe
 * Gesundheitskompetenz und die vielen Sprachen. Jede Region ist tastaturbedienbar.
 */

interface Region {
  id: string
  label: string
  hub: string
  value: string // Organsystem-Wert (für Anzahl-Lookup)
  hint: string  // Beispiel-Orientierung bei Hover
  top: string
  left: string
}

const REGIONS: Region[] = [
  { id: 'kopf', label: 'Kopf & Nerven', hub: 'neurologisch', value: 'neurological', hint: 'z.B. Bewegungsstörungen, neuromuskuläre Erkrankungen', top: '4%', left: '50%' },
  { id: 'augen', label: 'Augen', hub: 'augen', value: 'visual', hint: 'z.B. erbliche Netzhauterkrankungen', top: '15%', left: '22%' },
  { id: 'ohren', label: 'Ohren', hub: 'ohren', value: 'auditory', hint: 'z.B. erbliche Hörstörungen', top: '15%', left: '78%' },
  { id: 'brust', label: 'Herz & Gefäße', hub: 'herz-gefaesse', value: 'cardiovascular', hint: 'z.B. Marfan-Syndrom, Kardiomyopathien', top: '33%', left: '50%' },
  { id: 'lunge', label: 'Atemwege', hub: 'atemwege', value: 'respiratory', hint: 'z.B. Mukoviszidose, seltene Lungenfibrosen', top: '30%', left: '20%' },
  { id: 'bauch', label: 'Magen & Darm', hub: 'magen-darm', value: 'gastrointestinal', hint: 'z.B. seltene Leber- & Darmerkrankungen', top: '48%', left: '50%' },
  { id: 'niere', label: 'Niere & Harnwege', hub: 'niere-harnwege', value: 'urogenital', hint: 'z.B. seltene Nierenerkrankungen', top: '47%', left: '80%' },
  { id: 'gelenke', label: 'Muskeln & Gelenke', hub: 'bewegungsapparat', value: 'musculoskeletal', hint: 'z.B. Bindegewebs- & Knochenerkrankungen', top: '62%', left: '18%' },
  { id: 'haut', label: 'Haut', hub: 'haut', value: 'dermatological', hint: 'z.B. Epidermolysis bullosa, Ichthyosen', top: '70%', left: '82%' },
  { id: 'ganz', label: 'Ganzer Körper', hub: 'multisystemisch', value: 'multisystemic', hint: 'Erkrankungen, die mehrere Organe betreffen', top: '88%', left: '50%' },
]

export function BodyMap({ counts = {} }: { counts?: Record<string, number> }) {
  const router = useRouter()
  const [hover, setHover] = useState<string | null>(null)
  const hovered = REGIONS.find((r) => r.id === hover)

  function go(hub: string) {
    router.push(`/selten/bereich/${hub}`)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-sm aspect-[2/3]">
        {/* Einfache, freundliche Körper-Silhouette */}
        <svg viewBox="0 0 200 300" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <g fill="var(--color-morgen-hellblau)" stroke="var(--color-border)" strokeWidth="1.5">
            <circle cx="100" cy="34" r="22" />
            <rect x="78" y="56" width="44" height="14" rx="7" />
            <rect x="62" y="70" width="76" height="96" rx="26" />
            <rect x="40" y="74" width="22" height="84" rx="11" />
            <rect x="138" y="74" width="22" height="84" rx="11" />
            <rect x="68" y="160" width="28" height="118" rx="14" />
            <rect x="104" y="160" width="28" height="118" rx="14" />
          </g>
        </svg>

        {/* Klickbare Regionen */}
        {REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => go(r.hub)}
            onMouseEnter={() => setHover(r.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(r.id)}
            onBlur={() => setHover(null)}
            aria-label={`${r.label} — Erkrankungen in diesem Bereich`}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full border bg-white/95 px-2.5 py-1 text-xs font-medium shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-selten-violett)]"
            style={{
              top: r.top,
              left: r.left,
              borderColor: hover === r.id ? 'var(--color-selten-violett)' : 'var(--color-border)',
              color: hover === r.id ? 'var(--color-selten-violett)' : 'var(--color-medizin-navy)',
              zIndex: hover === r.id ? 20 : 10,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-selten-violett)]" aria-hidden="true" />
            {r.label}
            {counts[r.value] ? (
              <span className="ml-0.5 text-[10px] text-[var(--color-muted)]">{counts[r.value].toLocaleString('de-AT')}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Beispiel-Hinweis zur gerade fokussierten Region */}
      <div className="mt-4 min-h-[2.5rem] text-center max-w-sm">
        {hovered ? (
          <p className="text-sm text-[var(--color-medizin-navy)]">
            <strong>{hovered.label}:</strong> <span className="text-[var(--color-muted)]">{hovered.hint}</span>
          </p>
        ) : (
          <p className="text-xs text-[var(--color-muted)]">
            Tippe auf die Körperregion, die dich betrifft — du siehst dann passende Erkrankungen und Anlaufstellen.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => router.push('/navigator')}
        className="mt-2 text-sm font-medium text-[var(--color-donau-blau)] hover:underline"
      >
        Nicht sicher, wo? Beschreib es im Navigator →
      </button>
    </div>
  )
}
