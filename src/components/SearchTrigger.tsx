'use client'

import { useEffect, useState } from 'react'
import { UniversalSearch } from './UniversalSearch'

/**
 * Command-Palette-Auslöser für den Header: ein Klick (oder ⌘K / Strg-K / „/")
 * öffnet die WohinSuche als Overlay — überall, ohne Moduswechsel, wenige Klicks.
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === '/' && !open && !/INPUT|TEXTAREA/.test((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Suche öffnen"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-muted)] hover:border-[var(--color-selten-violett)] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden md:inline">Suche</span>
        <kbd className="hidden lg:inline text-[10px] border border-[var(--color-border)] rounded px-1 py-0.5 text-[var(--color-muted)]">⌘K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 px-4 pt-[12vh]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="WohinSuche"
        >
          <div className="w-full max-w-xl" onMouseDown={(e) => e.stopPropagation()}>
            <UniversalSearch autoFocus placeholder="Symptom, Krankheit oder Frage eingeben …" />
            <p className="mt-3 text-center text-xs text-white/90">Tippen zum Suchen · Esc zum Schließen</p>
          </div>
        </div>
      )}
    </>
  )
}
