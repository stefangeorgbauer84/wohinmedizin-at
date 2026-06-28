'use client'

import { useEffect, useState } from 'react'
import { UniversalSearch } from './UniversalSearch'

/**
 * Command-Palette-Auslöser für den Header: ein Klick (oder ⌘K / Strg-K / „/")
 * öffnet die WohinSuche als Overlay — überall, ohne Moduswechsel, wenige Klicks.
 * Auf Mobile: Vollbild-Overlay (pt-0, inset-0 ohne padding-top).
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false)
  const [isMac, setIsMac] = useState(true)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC') || navigator.userAgent.includes('Mac'))
  }, [])

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

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Suche öffnen (⌘K)"
        aria-keyshortcuts="Meta+k Control+k"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-muted)] hover:border-[var(--color-selten-violett)] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden md:inline">Suche</span>
        <kbd className="hidden lg:inline text-[10px] border border-[var(--color-border)] rounded px-1 py-0.5 text-[var(--color-muted)]">
          {isMac ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col sm:items-start sm:justify-start bg-black/40 sm:bg-black/30 sm:px-4 sm:pt-[12vh]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="WohinSuche"
        >
          {/* Mobile: Vollbild-Header mit Schließen-Button */}
          <div className="flex sm:hidden items-center justify-between px-4 py-3 bg-white border-b border-[var(--color-border)]">
            <span className="text-sm font-medium text-[var(--color-medizin-navy)]">Suche</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Suche schließen"
              className="p-1.5 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-warmweiss)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile: weißer Hintergrund füllt den Rest; Desktop: schwebende Box */}
          <div
            className="flex-1 sm:flex-none w-full sm:max-w-xl bg-white sm:bg-transparent overflow-auto sm:overflow-visible"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-0">
              <UniversalSearch autoFocus placeholder="Symptom, Krankheit oder Frage eingeben …" />
            </div>
          </div>

          <p className="hidden sm:block mt-3 text-center text-xs text-white/90 w-full max-w-xl mx-auto">
            Tippen zum Suchen · ↵ öffnen · Esc schließen
          </p>
        </div>
      )}
    </>
  )
}
