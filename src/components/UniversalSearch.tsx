'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'

interface Result { type: 'disease' | 'symptom' | 'page'; label: string; sublabel?: string; href: string }
interface Results { diseases: Result[]; symptoms: Result[]; pages: Result[] }

const EMPTY: Results = { diseases: [], symptoms: [], pages: [] }
const RECENT_KEY = 'wohin:recent'

const GROUP_META: Record<Result['type'], { title: string; icon: React.ReactNode }> = {
  disease: { title: 'Erkrankungen', icon: <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 8v8M8 12h8" /> },
  symptom: { title: 'Anzeichen', icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /> },
  page: { title: 'Anlaufstellen & Wissen', icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" /> },
}

// Treffer-Hervorhebung: passenden Teil fetten
function highlight(label: string, q: string): React.ReactNode {
  const i = label.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1 || q.length < 2) return label
  return (
    <>
      {label.slice(0, i)}
      <mark className="bg-transparent font-semibold text-[var(--color-selten-violett)]">{label.slice(i, i + q.length)}</mark>
      {label.slice(i + q.length)}
    </>
  )
}

function readRecent(): Result[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as Result[]).slice(0, 5) : []
  } catch { return [] }
}

export function UniversalSearch({
  size = 'lg',
  placeholder = 'Symptom, Krankheit oder Frage eingeben …',
  autoFocus = false,
}: { size?: 'lg' | 'sm'; placeholder?: string; autoFocus?: boolean }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Results>(EMPTY)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const [recent, setRecent] = useState<Result[]>([])
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reqRef = useRef(0)
  const recognitionRef = useRef<unknown>(null)

  const isEmpty = q.trim().length < 2
  // Schnellaktionen im leeren Zustand
  const QUICK: Result[] = [
    { type: 'page', label: 'Körperkarte — Region wählen', href: '/beschwerden' },
    { type: 'page', label: 'Navigator — frei beschreiben', href: '/navigator' },
    { type: 'page', label: 'Alle seltenen Erkrankungen', href: '/selten' },
  ]

  const flat: Result[] = isEmpty
    ? [...recent, ...QUICK]
    : [...results.diseases, ...results.symptoms, ...results.pages, { type: 'page', label: `„${q.trim()}" frei im Navigator beschreiben`, href: `/navigator?q=${encodeURIComponent(q.trim())}` }]

  const runSearch = useCallback((value: string) => {
    if (value.trim().length < 2) { setResults(EMPTY); setLoading(false); return }
    setLoading(true)
    const reqId = ++reqRef.current
    fetch(`/api/search?q=${encodeURIComponent(value)}`)
      .then((r) => r.json())
      .then((data: Results) => { if (reqId === reqRef.current) { setResults(data ?? EMPTY); setActive(0); setLoading(false) } })
      .catch(() => { if (reqId === reqRef.current) setLoading(false) })
  }, [])

  function onChange(value: string) {
    setQ(value); setOpen(true); setActive(0)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(value), 180)
  }
  function go(href: string) { setOpen(false); router.push(href) }

  function onFocus() { setRecent(readRecent()); setOpen(true) }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); setOpen(true) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[active]) go(flat[active].href)
      else if (!isEmpty) go(`/selten?q=${encodeURIComponent(q.trim())}`)
    }
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // Spracheingabe (Web Speech API) — nur wenn vom Browser unterstützt
  useEffect(() => {
    const SR = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
    setVoiceSupported(Boolean(SR.SpeechRecognition || SR.webkitSpeechRecognition))
  }, [])

  function toggleVoice() {
    const w = window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Ctor) return
    if (listening) {
      ;(recognitionRef.current as { stop?: () => void } | null)?.stop?.()
      setListening(false)
      return
    }
    const rec = new Ctor() as {
      lang: string; interimResults: boolean; maxAlternatives: number
      start: () => void; stop: () => void
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void
      onend: () => void; onerror: () => void
    }
    rec.lang = 'de-AT'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript ?? ''
      if (text) { setQ(text); setOpen(true); runSearch(text) }
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    setListening(true)
    rec.start()
  }

  const showPanel = open
  let runningIndex = -1
  const renderRow = (item: Result, label: React.ReactNode) => {
    runningIndex++
    const idx = runningIndex
    const isActive = idx === active
    return (
      <button
        key={`${item.type}-${item.href}-${idx}`}
        role="option" aria-selected={isActive}
        onMouseEnter={() => setActive(idx)} onClick={() => go(item.href)}
        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${isActive ? 'bg-[var(--color-morgen-hellblau)]' : 'hover:bg-[var(--color-warmweiss)]'}`}
      >
        <svg className="shrink-0 text-[var(--color-donau-blau)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {GROUP_META[item.type].icon}
        </svg>
        <span className="min-w-0">
          <span className="block truncate text-sm text-[var(--color-medizin-navy)]">{label}</span>
          {item.sublabel && <span className="block truncate text-xs text-[var(--color-muted)]">{item.sublabel}</span>}
        </span>
      </button>
    )
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text" role="combobox" aria-expanded={showPanel} aria-controls="universal-search-list" aria-autocomplete="list"
          aria-label="Symptom, Krankheit oder Frage suchen" autoFocus={autoFocus} value={q}
          onChange={(e) => onChange(e.target.value)} onFocus={onFocus} onKeyDown={onKeyDown} placeholder={placeholder}
          className={`w-full rounded-2xl border border-[var(--color-border)] bg-white pl-12 pr-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-selten-violett)] ${size === 'lg' ? 'py-4 text-base shadow-sm' : 'py-2.5 text-sm'}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {q && (
            <button type="button" onClick={() => { setQ(''); setResults(EMPTY); setActive(0) }} aria-label="Eingabe löschen"
              className="p-1.5 rounded-full text-[var(--color-muted)] hover:bg-[var(--color-warmweiss)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          )}
          {voiceSupported && (
            <button type="button" onClick={toggleVoice} aria-label={listening ? 'Spracheingabe stoppen' : 'Per Sprache suchen'} aria-pressed={listening}
              className={`p-1.5 rounded-full transition-colors ${listening ? 'bg-red-50 text-red-600 animate-pulse' : 'text-[var(--color-muted)] hover:bg-[var(--color-warmweiss)] hover:text-[var(--color-selten-violett)]'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {showPanel && (
        <div id="universal-search-list" role="listbox" className="absolute z-50 mt-2 w-full max-h-[62vh] overflow-auto rounded-2xl border border-[var(--color-border)] bg-white shadow-lg">
          {isEmpty ? (
            <>
              {recent.length > 0 && (
                <div className="py-1">
                  <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Zuletzt angesehen</p>
                  {recent.map((item) => renderRow(item, item.label))}
                </div>
              )}
              <div className="py-1">
                <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Schnell starten</p>
                {QUICK.map((item) => renderRow(item, item.label))}
              </div>
            </>
          ) : (
            <>
              {loading && flat.length <= 1 && <p className="px-4 py-4 text-sm text-[var(--color-muted)]">Suche …</p>}
              {(['disease', 'symptom', 'page'] as const).map((type) => {
                const items = type === 'disease' ? results.diseases : type === 'symptom' ? results.symptoms : results.pages
                if (items.length === 0) return null
                return (
                  <div key={type} className="py-1">
                    <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{GROUP_META[type].title}</p>
                    {items.map((item) => renderRow(item, highlight(item.label, q.trim())))}
                  </div>
                )
              })}
              {/* Frei-beschreiben-Aktion immer am Ende */}
              <div className="py-1 border-t border-[var(--color-border)]">
                {renderRow(
                  { type: 'page', label: `„${q.trim()}" frei im Navigator beschreiben`, href: `/navigator?q=${encodeURIComponent(q.trim())}` },
                  <span className="text-[var(--color-donau-blau)]">{`„${q.trim()}" frei im Navigator beschreiben`}</span>,
                )}
              </div>
            </>
          )}

          {/* Footer: Tastatur-Hinweise + Notruf */}
          <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] px-4 py-2 text-[11px] text-[var(--color-muted)]">
            <span className="hidden sm:inline">↑↓ wählen · ↵ öffnen · Esc schließen</span>
            <span className="font-medium text-red-600">Im Notfall: 144</span>
          </div>
        </div>
      )}
    </div>
  )
}
