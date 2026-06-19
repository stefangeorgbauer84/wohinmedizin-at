'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

interface Item { slug: string; name: string }
const KEY = 'wohin:merkliste'

export function MerklisteList() {
  const [items, setItems] = useState<Item[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(KEY)
        setItems(raw ? (JSON.parse(raw) as Item[]) : [])
      } catch {
        setItems([])
      }
      setReady(true)
    }
    load()
    window.addEventListener('wohin:merkliste-changed', load)
    return () => window.removeEventListener('wohin:merkliste-changed', load)
  }, [])

  function remove(slug: string) {
    const next = items.filter((i) => i.slug !== slug)
    setItems(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
      window.dispatchEvent(new Event('wohin:merkliste-changed'))
    } catch { /* ignore */ }
  }

  if (!ready) return null

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
        Noch nichts gemerkt. Auf jeder Krankheitsseite findest du den Button <strong>„Merken"</strong>.
        <div className="mt-4">
          <Link href="/selten" className="text-[var(--color-donau-blau)] underline">Zur Krankheitsübersicht</Link>
        </div>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.slug} className="flex items-center justify-between gap-3 bg-white rounded-xl border border-[var(--color-border)] p-4">
          <Link href={`/selten/${i.slug}`} className="font-medium text-[var(--color-medizin-navy)] hover:text-[var(--color-selten-violett)] transition-colors">
            {i.name}
          </Link>
          <button
            type="button"
            onClick={() => remove(i.slug)}
            className="text-sm text-[var(--color-muted)] hover:text-red-600 transition-colors shrink-0"
            aria-label={`${i.name} aus der Merkliste entfernen`}
          >
            Entfernen
          </button>
        </li>
      ))}
    </ul>
  )
}
