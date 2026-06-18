'use client'

import { useEffect } from 'react'

const RECENT_KEY = 'wohin:recent'

/**
 * Merkt sich zuletzt angesehene Erkrankungen (localStorage) — speist den
 * „Zuletzt angesehen"-Block der WohinSuche. Rendert nichts.
 */
export function TrackRecent({ label, href }: { label: string; href: string }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      const list: Array<{ type: string; label: string; href: string }> = raw ? JSON.parse(raw) : []
      const next = [{ type: 'disease', label, href }, ...list.filter((i) => i.href !== href)].slice(0, 6)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch { /* localStorage nicht verfügbar */ }
  }, [label, href])
  return null
}
