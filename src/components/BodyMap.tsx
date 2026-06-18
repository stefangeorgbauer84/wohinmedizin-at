'use client'

import { useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'

interface Region {
  id: string
  label: string
  hub: string
  value: string
  hint: string
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

// Heatmap: Intensitätsstufe 0-3 basierend auf Krankheitszahl relativ zum Maximum
function heatLevel(count: number, max: number): 0 | 1 | 2 | 3 {
  if (!count || !max) return 0
  const ratio = count / max
  if (ratio > 0.66) return 3
  if (ratio > 0.33) return 2
  return 1
}

const HEAT_DOT: Record<0 | 1 | 2 | 3, string> = {
  0: 'bg-[var(--color-selten-violett)]/30',
  1: 'bg-[var(--color-selten-violett)]/50',
  2: 'bg-[var(--color-selten-violett)]/75',
  3: 'bg-[var(--color-selten-violett)]',
}

export function BodyMap({
  counts = {},
  topDisease = {},
  cooccurrence = {},
}: {
  counts?: Record<string, number>
  topDisease?: Record<string, { slug: string; name: string }>
  cooccurrence?: Record<string, string>
}) {
  const router = useRouter()
  const [hover, setHover] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const hovered = REGIONS.find((r) => r.id === hover)
  // Region, deren Detail-Kontext (Beispiel/Co-Region) gezeigt wird: Auswahl hat Vorrang vor Hover
  const focusId = selected[selected.length - 1] ?? hover
  const focused = REGIONS.find((r) => r.id === focusId)
  const example = focused ? topDisease[focused.value] : undefined
  const coValue = focused ? cooccurrence[focused.value] : undefined
  const coRegion = coValue ? REGIONS.find((r) => r.value === coValue) : undefined

  const maxCount = Math.max(1, ...Object.values(counts))

  // Vorselektion via URL-Hash (z.B. aus WohinSuche: /beschwerden#brust)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && REGIONS.some((r) => r.id === hash)) {
      setSelected([hash])
      setHover(hash)
    }
  }, [])

  function toggleSelect(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id] // max 2, ältere fliegt raus
      return [...prev, id]
    })
  }

  function goSingle(hub: string) {
    router.push(`/selten/bereich/${hub}`)
  }

  function goDual() {
    const values = selected.map((id) => REGIONS.find((r) => r.id === id)?.value).filter(Boolean)
    router.push(`/selten?organs=${values.join(',')}`)
  }

  const selectedRegions = REGIONS.filter((r) => selected.includes(r.id))

  return (
    <div className="flex flex-col items-center">
      {/* Dual-Selection-Banner */}
      {selected.length > 0 && (
        <div className="w-full max-w-sm mb-4 rounded-xl border border-[var(--color-selten-violett)]/40 bg-[var(--color-morgen-hellblau)] px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[var(--color-selten-violett)] mb-0.5">
              {selected.length === 1 ? '1 Bereich gewählt' : '2 Bereiche gewählt'}
            </p>
            <p className="text-sm text-[var(--color-medizin-navy)]">
              {selectedRegions.map((r) => r.label).join(' + ')}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            {selected.length === 1 ? (
              <button type="button" onClick={() => goSingle(selectedRegions[0].hub)}
                className="text-xs font-medium bg-[var(--color-selten-violett)] text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity">
                Erkrankungen →
              </button>
            ) : (
              <button type="button" onClick={goDual}
                className="text-xs font-medium bg-[var(--color-selten-violett)] text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity">
                Beide anzeigen →
              </button>
            )}
            <button type="button" onClick={() => setSelected([])}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)] transition-colors text-center">
              Auswahl löschen
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-sm aspect-[2/3]">
        {/* Körper-Silhouette */}
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

        {/* Hinweis-Text oben (nur wenn nichts ausgewählt) */}
        {selected.length === 0 && (
          <p className="absolute top-0 right-0 left-0 text-center text-[10px] text-[var(--color-muted)] pt-1 pointer-events-none">
            Tippe eine Region an — oder zwei für die Schnittmenge
          </p>
        )}

        {/* Klickbare Regionen */}
        {REGIONS.map((r) => {
          const isHovered = hover === r.id
          const isSelected = selected.includes(r.id)
          const heat = heatLevel(counts[r.value] ?? 0, maxCount)
          const dotCls = HEAT_DOT[heat]

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                if (isSelected) {
                  // 2. Klick auf bereits gewählte: direkt springen
                  setSelected([])
                  goSingle(r.hub)
                } else {
                  toggleSelect(r.id)
                }
              }}
              onMouseEnter={() => setHover(r.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(r.id)}
              onBlur={() => setHover(null)}
              aria-label={`${r.label} — Erkrankungen in diesem Bereich${counts[r.value] ? ` (${counts[r.value]})` : ''}`}
              aria-pressed={isSelected}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full border bg-white/95 px-2.5 py-1 text-xs font-medium shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-selten-violett)]"
              style={{
                top: r.top,
                left: r.left,
                borderColor: isSelected
                  ? 'var(--color-selten-violett)'
                  : isHovered
                    ? 'var(--color-donau-blau)'
                    : 'var(--color-border)',
                color: isSelected || isHovered ? 'var(--color-selten-violett)' : 'var(--color-medizin-navy)',
                zIndex: isSelected || isHovered ? 20 : 10,
                boxShadow: isSelected ? '0 0 0 2px var(--color-selten-violett)' : undefined,
              }}
            >
              {/* Heatmap-Dot */}
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls}`} aria-hidden="true" />
              {r.label}
              {counts[r.value] ? (
                <span className="ml-0.5 text-[10px] text-[var(--color-muted)]">{counts[r.value].toLocaleString('de-AT')}</span>
              ) : null}
              {isSelected && (
                <span className="ml-0.5 text-[10px] font-bold text-[var(--color-selten-violett)]">✓</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hover-/Auswahl-Hint mit konkretem Beispiel */}
      <div className="mt-4 min-h-[2.5rem] text-center max-w-sm">
        {focused ? (
          <div className="space-y-1.5">
            <p className="text-sm text-[var(--color-medizin-navy)]">
              <strong>{focused.label}:</strong>{' '}
              <span className="text-[var(--color-muted)]">{focused.hint}</span>
            </p>
            {example && (
              <p className="text-sm">
                <span className="text-[var(--color-muted)]">z.B. </span>
                <button type="button" onClick={() => router.push(`/selten/${example.slug}`)}
                  className="font-medium text-[var(--color-selten-violett)] hover:underline">
                  {example.name}
                </button>
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-muted)]">
            Tippe auf die Körperregion, die dich betrifft — du siehst dann passende Erkrankungen und Anlaufstellen.
          </p>
        )}
      </div>

      {/* „Oft gemeinsam betroffen" — datengetriebener Multisystem-Vorschlag */}
      {coRegion && focused && !selected.includes(coRegion.id) && (
        <button type="button"
          onClick={() => setSelected([focused.id, coRegion.id])}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--color-donau-blau)] hover:underline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 12h8M12 8v8" /><circle cx="12" cy="12" r="9" /></svg>
          Oft gemeinsam betroffen: {coRegion.label} hinzufügen
        </button>
      )}
      <button
        type="button"
        onClick={() => router.push('/navigator')}
        className="mt-2 text-sm font-medium text-[var(--color-donau-blau)] hover:underline"
      >
        Nicht sicher, wo? Beschreib es im Navigator →
      </button>

      {/* Heatmap-Legende */}
      {Object.keys(counts).length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-[10px] text-[var(--color-muted)]">
          <span>Weniger</span>
          {([0, 1, 2, 3] as const).map((lvl) => (
            <span key={lvl} className={`w-3 h-3 rounded-full ${HEAT_DOT[lvl]}`} aria-hidden="true" />
          ))}
          <span>Mehr Erkrankungen</span>
        </div>
      )}
    </div>
  )
}
