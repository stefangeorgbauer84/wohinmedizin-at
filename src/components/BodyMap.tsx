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
  // Position des Labels/Hotspots in % des Containers
  top: string
  left: string
}

const REGIONS: Region[] = [
  { id: 'kopf', label: 'Kopf & Nerven', hub: 'neurologisch', top: '4%', left: '50%' },
  { id: 'augen', label: 'Augen', hub: 'augen', top: '15%', left: '22%' },
  { id: 'ohren', label: 'Ohren', hub: 'ohren', top: '15%', left: '78%' },
  { id: 'brust', label: 'Herz & Gefäße', hub: 'herz-gefaesse', top: '33%', left: '50%' },
  { id: 'lunge', label: 'Atemwege', hub: 'atemwege', top: '30%', left: '20%' },
  { id: 'bauch', label: 'Magen & Darm', hub: 'magen-darm', top: '48%', left: '50%' },
  { id: 'niere', label: 'Niere & Harnwege', hub: 'niere-harnwege', top: '47%', left: '80%' },
  { id: 'gelenke', label: 'Muskeln & Gelenke', hub: 'bewegungsapparat', top: '62%', left: '18%' },
  { id: 'haut', label: 'Haut', hub: 'haut', top: '70%', left: '82%' },
  { id: 'ganz', label: 'Ganzer Körper', hub: 'multisystemisch', top: '88%', left: '50%' },
]

export function BodyMap() {
  const router = useRouter()
  const [hover, setHover] = useState<string | null>(null)

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
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--color-muted)] mt-4 text-center max-w-xs">
        Tippe auf die Körperregion, die dich betrifft — du siehst dann passende Erkrankungen und Anlaufstellen.
      </p>
    </div>
  )
}
