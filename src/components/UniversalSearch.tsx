'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'

interface Result { type: 'disease' | 'symptom' | 'page'; label: string; sublabel?: string; href: string }
interface Results { diseases: Result[]; symptoms: Result[]; pages: Result[] }

const EMPTY: Results = { diseases: [], symptoms: [], pages: [] }

const GROUP_META: Record<Result['type'], { title: string; icon: React.ReactNode }> = {
  disease: {
    title: 'Erkrankungen',
    icon: <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 8v8M8 12h8" />,
  },
  symptom: {
    title: 'Anzeichen',
    icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />,
  },
  page: {
    title: 'Anlaufstellen & Wissen',
    icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8" />,
  },
}

export function UniversalSearch({
  size = 'lg',
  placeholder = 'Symptom, Krankheit oder Frage eingeben …',
  autoFocus = false,
}: {
  size?: 'lg' | 'sm'
  placeholder?: string
  autoFocus?: boolean
}) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Results>(EMPTY)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reqRef = useRef(0)

  const flat: Result[] = [...results.diseases, ...results.symptoms, ...results.pages]

  const runSearch = useCallback((value: string) => {
    if (value.trim().length < 2) {
      setResults(EMPTY)
      setLoading(false)
      return
    }
    setLoading(true)
    const reqId = ++reqRef.current
    fetch(`/api/search?q=${encodeURIComponent(value)}`)
      .then((r) => r.json())
      .then((data: Results) => {
        if (reqId !== reqRef.current) return // veraltete Antwort verwerfen
        setResults(data ?? EMPTY)
        setActive(0)
        setLoading(false)
      })
      .catch(() => { if (reqId === reqRef.current) setLoading(false) })
  }, [])

  function onChange(value: string) {
    setQ(value)
    setOpen(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(value), 180)
  }

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); setOpen(true) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[active]) go(flat[active].href)
      else if (q.trim().length >= 2) go(`/selten?q=${encodeURIComponent(q.trim())}`)
    }
  }

  // Klick außerhalb schließt
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const hasResults = flat.length > 0
  const showPanel = open && q.trim().length >= 2
  let runningIndex = -1

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="universal-search-list"
          aria-autocomplete="list"
          aria-label="Symptom, Krankheit oder Frage suchen"
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => q.trim().length >= 2 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full rounded-2xl border border-[var(--color-border)] bg-white pl-12 pr-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-selten-violett)] ${
            size === 'lg' ? 'py-4 text-base shadow-sm' : 'py-2.5 text-sm'
          }`}
        />
      </div>

      {showPanel && (
        <div
          id="universal-search-list"
          role="listbox"
          className="absolute z-50 mt-2 w-full max-h-[60vh] overflow-auto rounded-2xl border border-[var(--color-border)] bg-white shadow-lg"
        >
          {loading && !hasResults && (
            <p className="px-4 py-4 text-sm text-[var(--color-muted)]">Suche …</p>
          )}
          {!loading && !hasResults && (
            <div className="px-4 py-4 text-sm text-[var(--color-muted)]">
              Keine direkten Treffer.{' '}
              <button onClick={() => go(`/selten?q=${encodeURIComponent(q.trim())}`)} className="text-[var(--color-donau-blau)] underline">
                In allen Erkrankungen suchen
              </button>{' '}oder im{' '}
              <button onClick={() => go('/navigator')} className="text-[var(--color-donau-blau)] underline">Navigator</button> frei beschreiben.
            </div>
          )}
          {(['disease', 'symptom', 'page'] as const).map((type) => {
            const items = type === 'disease' ? results.diseases : type === 'symptom' ? results.symptoms : results.pages
            if (items.length === 0) return null
            return (
              <div key={type} className="py-1">
                <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  {GROUP_META[type].title}
                </p>
                {items.map((item) => {
                  runningIndex++
                  const idx = runningIndex
                  const isActive = idx === active
                  return (
                    <button
                      key={`${item.type}-${item.href}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(item.href)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
                        isActive ? 'bg-[var(--color-morgen-hellblau)]' : 'hover:bg-[var(--color-warmweiss)]'
                      }`}
                    >
                      <svg className="shrink-0 text-[var(--color-donau-blau)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {GROUP_META[item.type].icon}
                      </svg>
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-[var(--color-medizin-navy)]">{item.label}</span>
                        {item.sublabel && <span className="block truncate text-xs text-[var(--color-muted)]">{item.sublabel}</span>}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
