'use client'

import { useState, useEffect } from 'react'

/**
 * Progressive-Enhancement-Suche für den Symptom-Finder: filtert die bereits
 * server-gerenderten Chips (per data-symptom-name) clientseitig. Ohne JavaScript
 * bleibt die vollständige Liste samt Formular nutzbar.
 */
export function SymptomSearchBox() {
  const [q, setQ] = useState('')

  useEffect(() => {
    const term = q.trim().toLowerCase()
    const labels = document.querySelectorAll<HTMLElement>('[data-symptom-name]')
    const groups = document.querySelectorAll<HTMLDetailsElement>('details[data-symptom-group]')

    if (!term) {
      labels.forEach((el) => { el.style.display = '' })
      groups.forEach((g) => { g.style.display = '' })
      return
    }

    groups.forEach((g) => {
      let anyVisible = false
      g.querySelectorAll<HTMLElement>('[data-symptom-name]').forEach((el) => {
        const match = (el.dataset.symptomName ?? '').includes(term)
        el.style.display = match ? '' : 'none'
        if (match) anyVisible = true
      })
      g.style.display = anyVisible ? '' : 'none'
      if (anyVisible) g.open = true
    })
  }, [q])

  return (
    <div className="mb-4">
      <label htmlFor="symptom-search" className="sr-only">Symptome durchsuchen</label>
      <input
        id="symptom-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Anzeichen durchsuchen (z.B. Müdigkeit, Schmerz, Krampf …)"
        className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-selten-violett)]"
      />
    </div>
  )
}
