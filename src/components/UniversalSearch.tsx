'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import { isRedFlag } from '@/lib/red-flags'

// Kurze Inline-Antworten für häufige Orientierungsfragen (Schlagwort → Antwort + Ziel)
const QUICK_ANSWERS: Array<{ match: RegExp; answer: string; href: string; cta: string }> = [
  { match: /kassenarzt|wahlarzt|kasse|selbstbehalt/i, answer: 'Kassenärzt:innen rechnen direkt mit der ÖGK ab. Bei Wahlärzt:innen zahlst du zuerst selbst und bekommst rund 80 % des Kassentarifs zurück.', href: '/wissen/kassenarzt-wahlarzt-unterschied', cta: 'Mehr zum Unterschied' },
  { match: /überweisung|zuweisung|zuweis/i, answer: 'Für viele Fachärzt:innen brauchst du eine Überweisung der Hausärztin. Manche Fächer (z.B. Gynäkologie, Augen) gehen auch ohne.', href: '/wissen/ueberweisung-oesterreich', cta: 'Überweisung erklärt' },
  { match: /dermatolog|hautarzt|haut\b/i, answer: 'Zur Dermatologie bei anhaltenden Hautveränderungen, neuen oder wachsenden Muttermalen oder hartnäckigem Juckreiz.', href: '/wissen/wann-zur-dermatologie', cta: 'Wann zur Dermatologie?' },
  { match: /rheumatolog|rheuma|gelenkschmerz/i, answer: 'Zur Rheumatologie bei länger als 6 Wochen anhaltenden Gelenkschmerzen, Morgensteifigkeit oder Schwellungen.', href: '/wissen/wann-zur-rheumatologie', cta: 'Wann zur Rheumatologie?' },
]

interface Result { type: 'disease' | 'symptom' | 'page'; label: string; sublabel?: string; href: string }
interface Results {
  diseases: Result[]; symptoms: Result[]; pages: Result[]
  bodyPart?: { label: string; hub: string; id: string } | null
  didYouMean?: { label: string; href: string } | null
}

const EMPTY: Results = { diseases: [], symptoms: [], pages: [], bodyPart: null, didYouMean: null }
const SEARCH_HISTORY_KEY = 'wohin:searches'

// Kuratierte häufig gesuchte Begriffe — erscheinen im leeren Suchfeld
const TRENDING = [
  'Marfan-Syndrom', 'Hämophilie', 'Mukoviszidose', 'Lupus', 'Ehlers-Danlos',
  'POTS', 'Seltene Lebererkrankung', 'Neurofibromatose',
]
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

function readSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY)
    return raw ? (JSON.parse(raw) as string[]).slice(0, 5) : []
  } catch { return [] }
}

function pushSearchHistory(term: string) {
  const t = term.trim()
  if (t.length < 3) return
  try {
    const prev = readSearchHistory().filter((x) => x.toLowerCase() !== t.toLowerCase())
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([t, ...prev].slice(0, 8)))
  } catch { /* ignore */ }
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
  const [history, setHistory] = useState<string[]>([])
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [showSlashHint, setShowSlashHint] = useState(false)
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

  const bodyPartResult: Result | null = results.bodyPart
    ? { type: 'page', label: `Körperkarte: ${results.bodyPart.label}`, sublabel: 'Erkrankungen nach Körperregion filtern', href: `/beschwerden#${results.bodyPart.id}` }
    : null

  // Notfall-Erkennung — sicherheitskritisch, identische Quelle wie der Navigator
  const emergency = !isEmpty && isRedFlag(q)
  // Inline-Schnellantwort für Orientierungsfragen
  const quickAnswer = !isEmpty ? QUICK_ANSWERS.find((a) => a.match.test(q)) ?? null : null
  // Echte Null-Treffer: nichts gefunden, kein Vorschlag, keine Bridge, keine Antwort
  const noResults = !isEmpty
    && results.diseases.length === 0 && results.symptoms.length === 0 && results.pages.length === 0
    && !results.bodyPart && !results.didYouMean && !quickAnswer

  // Screenreader-Ansage der Trefferlage (aria-live)
  let liveMessage = ''
  if (!isEmpty && !loading) {
    if (noResults) {
      liveMessage = `Keine Treffer für ${q.trim()}.`
    } else {
      const parts: string[] = []
      if (results.diseases.length) parts.push(`${results.diseases.length} Erkrankungen`)
      if (results.symptoms.length) parts.push(`${results.symptoms.length} Anzeichen`)
      if (results.pages.length) parts.push(`${results.pages.length} Anlaufstellen`)
      liveMessage = parts.length ? `${parts.join(', ')} gefunden.` : 'Vorschläge verfügbar.'
    }
  }

  const flat: Result[] = isEmpty
    ? [...recent, ...QUICK]
    : [
        ...(bodyPartResult ? [bodyPartResult] : []),
        ...results.diseases,
        ...results.symptoms,
        ...results.pages,
        { type: 'page', label: `„${q.trim()}" frei im Navigator beschreiben`, href: `/navigator?q=${encodeURIComponent(q.trim())}` },
      ]

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
  function go(href: string) {
    if (!isEmpty) pushSearchHistory(q)
    setOpen(false); router.push(href)
  }

  function onFocus() {
    setRecent(readRecent()); setHistory(readSearchHistory()); setOpen(true)
    if (showSlashHint) {
      setShowSlashHint(false)
      try { localStorage.setItem('wohin:slash-hint-seen', '1') } catch { /* ignore */ }
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); setOpen(true) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'ArrowRight' && !isEmpty) {
      // Pfeil-rechts am Zeilenende übernimmt den Top-Vorschlag (zerstört NICHT die
      // Tab-Fokusreihenfolge — wichtig für Tastatur-/Screenreader-Nutzung).
      const el = e.target as HTMLInputElement
      const atEnd = el.selectionStart === q.length && el.selectionEnd === q.length
      const top = results.diseases[0] ?? results.symptoms[0]
      if (atEnd && top && top.label.toLowerCase().startsWith(q.trim().toLowerCase()) && top.label.toLowerCase() !== q.trim().toLowerCase()) {
        e.preventDefault(); onChange(top.label)
      }
    }
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

  // Keyboard-Shortcut-Tooltip beim ersten Besuch (nur einmalig, 4 Sek.)
  useEffect(() => {
    if (size !== 'lg') return
    try {
      const seen = localStorage.getItem('wohin:slash-hint-seen')
      if (!seen) { setShowSlashHint(true); const t = setTimeout(() => setShowSlashHint(false), 4000); return () => clearTimeout(t) }
    } catch { /* ignore */ }
  }, [size])

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
        id={`wohin-opt-${idx}`}
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
      {/* Screenreader-Ansage der Trefferlage */}
      <div aria-live="polite" role="status" className="sr-only">{liveMessage}</div>
      {/* Keyboard-Shortcut-Tooltip — erster Besuch */}
      {showSlashHint && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-[var(--color-medizin-navy)] px-3 py-1.5 text-xs text-white shadow-lg animate-fade-in pointer-events-none z-50 whitespace-nowrap">
          <kbd className="font-mono bg-white/20 rounded px-1 py-0.5">/</kbd>
          <span>drücken um zu suchen</span>
        </div>
      )}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text" role="combobox" aria-expanded={showPanel} aria-controls="universal-search-list" aria-autocomplete="list"
          aria-activedescendant={showPanel && !noResults && flat[active] ? `wohin-opt-${active}` : undefined}
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
          {/* Notfall-Warnung — sicherheitskritisch, immer ganz oben */}
          {emergency && (
            <div role="alert" className="flex items-start gap-3 border-b-2 border-red-200 bg-red-50 px-4 py-3">
              <svg className="mt-0.5 shrink-0 text-red-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
              </svg>
              <div className="text-sm">
                <p className="font-bold text-red-700">Mögliches Notfallsymptom</p>
                <p className="text-red-700/90">Bei akuten Beschwerden nicht recherchieren — wähle sofort den Notruf{' '}
                  <a href="tel:144" className="font-bold underline">144</a> (Rettung) oder geh in die nächste Notaufnahme.</p>
              </div>
            </div>
          )}
          {/* Inline-Schnellantwort für Orientierungsfragen */}
          {!isEmpty && quickAnswer && (
            <div className="border-b border-[var(--color-border)] bg-[var(--color-morgen-hellblau)]/50 px-4 py-3">
              <div className="flex items-start gap-2">
                <svg className="mt-0.5 shrink-0 text-[var(--color-donau-blau)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                <div>
                  <p className="text-sm text-[var(--color-medizin-navy)] leading-relaxed">{quickAnswer.answer}</p>
                  <button type="button" onClick={() => go(quickAnswer.href)}
                    className="mt-1.5 text-xs font-medium text-[var(--color-donau-blau)] hover:underline">{quickAnswer.cta} →</button>
                </div>
              </div>
            </div>
          )}
          {isEmpty ? (
            <>
              {recent.length > 0 && (
                <div className="py-1">
                  <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Zuletzt angesehen</p>
                  {recent.map((item) => renderRow(item, item.label))}
                </div>
              )}
              {/* Letzte Suchen (Suchverlauf) */}
              {history.length > 0 && (
                <div className="px-4 pt-3 pb-1 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Letzte Suchen</p>
                    <button type="button"
                      onClick={() => { try { localStorage.removeItem(SEARCH_HISTORY_KEY) } catch { /* */ } setHistory([]) }}
                      className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)]">Löschen</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {history.map((term) => (
                      <button key={term} type="button" onClick={() => onChange(term)}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-medizin-navy)] bg-white hover:border-[var(--color-donau-blau)] hover:text-[var(--color-donau-blau)] transition-colors">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Trending-Suchen */}
              <div className="px-4 pt-3 pb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">Häufig gesucht</p>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING.map((term) => (
                    <button key={term} type="button"
                      onClick={() => { onChange(term); }}
                      className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-medizin-navy)] bg-[var(--color-warmweiss)] hover:border-[var(--color-selten-violett)] hover:text-[var(--color-selten-violett)] transition-colors">
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              <div className="py-1 border-t border-[var(--color-border)]">
                <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Schnell starten</p>
                {QUICK.map((item) => renderRow(item, item.label))}
              </div>
            </>
          ) : (
            <>
              {loading && flat.length <= 1 && <p className="px-4 py-4 text-sm text-[var(--color-muted)]">Suche …</p>}
              {/* Intelligenter Null-Treffer-Zustand */}
              {!loading && noResults && (
                <div className="px-4 py-4">
                  <p className="text-sm text-[var(--color-medizin-navy)]">
                    Keine direkten Treffer für <strong>„{q.trim()}"</strong>.
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-1 mb-3">
                    Tippfehler? Versuche es allgemeiner — oder beschreibe dein Anliegen frei.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <button type="button" onClick={() => go(`/navigator?q=${encodeURIComponent(q.trim())}`)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-donau-blau)] hover:underline">
                      → „{q.trim()}" im Navigator beschreiben
                    </button>
                    <button type="button" onClick={() => go('/selten')}
                      className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)]">
                      Alle seltenen Erkrankungen durchsuchen
                    </button>
                    <a href={`mailto:kontakt@wohinmedizin.at?subject=${encodeURIComponent(`Erkrankung fehlt: ${q.trim()}`)}`}
                      className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)]">
                      Erkrankung fehlt? Melde sie uns
                    </a>
                  </div>
                </div>
              )}
              {/* „Meintest du?" — Korrektur bei Tippfehler/Synonym */}
              {results.didYouMean && (
                <button type="button" onClick={() => go(results.didYouMean!.href)}
                  className="flex w-full items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 text-left text-sm hover:bg-[var(--color-warmweiss)]">
                  <svg className="shrink-0 text-[var(--color-donau-blau)]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 9-9M3 12l3-3M3 12l3 3" />
                  </svg>
                  <span className="text-[var(--color-muted)]">Meintest du{' '}
                    <span className="font-semibold text-[var(--color-medizin-navy)]">{results.didYouMean.label}</span>?
                  </span>
                </button>
              )}
              {/* Körperregion-Bridge — prominente erste Zeile */}
              {bodyPartResult && (
                <div className="py-1 border-b border-[var(--color-border)]">
                  {renderRow(bodyPartResult,
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-selten-violett)]">Körperkarte</span>
                      <span>{bodyPartResult.label.replace('Körperkarte: ', '')}</span>
                    </span>
                  )}
                </div>
              )}
              {(['disease', 'symptom', 'page'] as const).map((type) => {
                const items = type === 'disease' ? results.diseases : type === 'symptom' ? results.symptoms : results.pages
                if (items.length === 0) return null
                const limit = type === 'disease' ? 6 : type === 'symptom' ? 5 : 4
                const badge = items.length >= limit ? `${items.length}+` : `${items.length}`
                return (
                  <div key={type} className="py-1">
                    <p className="flex items-center gap-2 px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                      {GROUP_META[type].title}
                      <span className="rounded-full bg-[var(--color-warmweiss)] border border-[var(--color-border)] px-1.5 py-px text-[10px] font-medium normal-case tracking-normal">{badge}</span>
                    </p>
                    {items.map((item) => renderRow(item, highlight(item.label, q.trim())))}
                  </div>
                )
              })}
              {/* Frei-beschreiben-Aktion am Ende (entfällt im Null-Treffer-Zustand, dort schon enthalten) */}
              {!noResults && (
                <div className="py-1 border-t border-[var(--color-border)]">
                  {renderRow(
                    { type: 'page', label: `„${q.trim()}" frei im Navigator beschreiben`, href: `/navigator?q=${encodeURIComponent(q.trim())}` },
                    <span className="text-[var(--color-donau-blau)]">{`„${q.trim()}" frei im Navigator beschreiben`}</span>,
                  )}
                </div>
              )}
            </>
          )}

          {/* Footer: Tastatur-Hinweise + Notruf */}
          <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] px-4 py-2 text-[11px] text-[var(--color-muted)]">
            <span className="hidden sm:inline">↑↓ wählen · → ergänzen · ↵ öffnen · Esc schließen</span>
            <span className="font-medium text-red-600">Im Notfall: 144</span>
          </div>
        </div>
      )}
    </div>
  )
}
