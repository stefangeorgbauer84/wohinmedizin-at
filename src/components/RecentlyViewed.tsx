'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

interface Item { type: string; label: string; href: string }
const RECENT_KEY = 'wohin:recent'

/**
 * „Weiter, wo du warst" — zeigt zuletzt angesehene Erkrankungen (localStorage).
 * Rendert nichts, wenn es keine gibt. Wiedereinstieg ohne Suche/Tippen.
 */
export function RecentlyViewed() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      setItems(raw ? (JSON.parse(raw) as Item[]).slice(0, 6) : [])
    } catch { setItems([]) }
  }, [])

  if (items.length === 0) return null

  return (
    <section className="bg-white border-b border-[var(--color-border)] py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Weiter, wo du warst</p>
        <div className="flex flex-wrap gap-2">
          {items.map((i) => (
            <Link key={i.href} href={i.href}
              className="inline-flex items-center gap-2 text-sm bg-[var(--color-warmweiss)] border border-[var(--color-border)] text-[var(--color-medizin-navy)] px-3 py-1.5 rounded-full hover:border-[var(--color-selten-violett)] hover:text-[var(--color-selten-violett)] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8" /></svg>
              {i.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
