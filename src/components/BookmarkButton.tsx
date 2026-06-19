'use client'

import { useEffect, useState } from 'react'

const KEY = 'wohin:merkliste'

export interface BookmarkItem {
  slug: string
  name: string
}

function readList(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as BookmarkItem[]) : []
  } catch {
    return []
  }
}

function writeList(items: BookmarkItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('wohin:merkliste-changed'))
  } catch {
    /* localStorage nicht verfügbar — still ignorieren */
  }
}

export function BookmarkButton({ slug, name }: BookmarkItem) {
  const [saved, setSaved] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSaved(readList().some((i) => i.slug === slug))
    setReady(true)
  }, [slug])

  function toggle() {
    const list = readList()
    const exists = list.some((i) => i.slug === slug)
    const next = exists ? list.filter((i) => i.slug !== slug) : [...list, { slug, name }]
    writeList(next)
    setSaved(!exists)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
        saved
          ? 'bg-[var(--color-selten-violett)] text-white border-[var(--color-selten-violett)]'
          : 'bg-white text-[var(--color-medizin-navy)] border-[var(--color-border)] hover:border-[var(--color-selten-violett)]'
      }`}
      style={{ visibility: ready ? 'visible' : 'hidden' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {saved ? 'Gemerkt' : 'Merken'}
    </button>
  )
}
