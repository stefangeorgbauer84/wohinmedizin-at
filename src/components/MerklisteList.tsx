'use client'

import { useEffect, useState, useCallback } from 'react'
import { Link } from '@/i18n/navigation'
import { Card } from './ui'

interface Item { slug: string; name: string; orphaCode?: string }
const KEY = 'wohinmedizin:bookmarks'

function readList(): Item[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Item[]) : []
  } catch {
    return []
  }
}

function writeList(items: Item[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('wohin:merkliste-changed'))
  } catch { /* ignore */ }
}

export function MerklisteList() {
  const [items, setItems] = useState<Item[]>([])
  const [ready, setReady] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [shareStatus, setShareStatus] = useState<Record<string, 'idle' | 'copied'>>({})

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(KEY)
      setItems(raw ? (JSON.parse(raw) as Item[]) : [])
    } catch {
      setItems([])
    }
    setReady(true)
  }, [])

  useEffect(() => {
    load()
    window.addEventListener('wohin:merkliste-changed', load)
    return () => window.removeEventListener('wohin:merkliste-changed', load)
  }, [load])

  function remove(slug: string) {
    const next = items.filter((i) => i.slug !== slug)
    setItems(next)
    writeList(next)
  }

  function clearAll() {
    if (!confirmClear) { setConfirmClear(true); return }
    setItems([])
    writeList([])
    setConfirmClear(false)
  }

  async function share(item: Item) {
    const url = `${window.location.origin}/selten/${item.slug}`
    try {
      await navigator.clipboard.writeText(url)
      setShareStatus((s) => ({ ...s, [item.slug]: 'copied' }))
      setTimeout(() => setShareStatus((s) => ({ ...s, [item.slug]: 'idle' })), 2000)
    } catch { /* clipboard not available */ }
  }

  if (!ready) return null

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <svg className="mx-auto mb-4 text-[var(--color-muted)]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <p className="text-[var(--color-medizin-navy)] font-medium mb-1">Noch nichts gemerkt</p>
        <p className="text-sm text-[var(--color-muted)] mb-6">
          Auf jeder Krankheitsseite findest du den Button <strong>„Merken"</strong>. Die Liste wird nur in deinem Browser gespeichert — kein Konto nötig.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/selten"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-selten-violett)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Alle seltenen Erkrankungen
          </Link>
          <Link
            href="/navigator"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-medizin-navy)] hover:border-[var(--color-selten-violett)] transition-colors"
          >
            Navigator starten
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div>
      {/* Header: Anzahl + Alle löschen */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-muted)]">
          <span className="font-semibold text-[var(--color-medizin-navy)]">{items.length}</span>
          {' '}{items.length === 1 ? 'Erkrankung' : 'Erkrankungen'} gemerkt
        </p>
        <button
          type="button"
          onClick={clearAll}
          onBlur={() => setConfirmClear(false)}
          className={`text-sm transition-colors ${
            confirmClear
              ? 'font-medium text-red-600 hover:text-red-700'
              : 'text-[var(--color-muted)] hover:text-red-600'
          }`}
          aria-label="Alle Einträge aus der Merkliste löschen"
        >
          {confirmClear ? 'Wirklich alle löschen?' : 'Alle löschen'}
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((item) => {
          const orphaNum = item.orphaCode?.replace('ORPHA:', '')
          const copied = shareStatus[item.slug] === 'copied'
          return (
            <li key={item.slug}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/selten/${item.slug}`}
                      className="font-medium text-[var(--color-medizin-navy)] hover:text-[var(--color-selten-violett)] transition-colors"
                    >
                      {item.name}
                    </Link>
                    {orphaNum && (
                      <span className="mt-1 block text-xs text-[var(--color-muted)]">
                        ORPHA:{orphaNum}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Teilen-Button */}
                    <button
                      type="button"
                      onClick={() => share(item)}
                      aria-label={`Link zu ${item.name} kopieren`}
                      title="Link kopieren"
                      className="p-1.5 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-warmweiss)] hover:text-[var(--color-donau-blau)] transition-colors"
                    >
                      {copied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      )}
                    </button>
                    {/* Entfernen-Button */}
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      className="p-1.5 rounded-lg text-[var(--color-muted)] hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label={`${item.name} aus der Merkliste entfernen`}
                      title="Entfernen"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
