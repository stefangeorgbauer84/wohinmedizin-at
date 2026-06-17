'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Zeigt — wenn der Nutzer aus dem Symptom-Finder kommt (?s=HP:…) — welche der
 * eigenen Angaben zu dieser Erkrankung passen. Läuft clientseitig, damit die
 * Krankheitsseite serverseitig statisch (ISR) gecacht bleiben kann.
 */
export function FinderMatch({ hpoTerms }: { hpoTerms: { hpo_id: string; hpo_label: string }[] }) {
  const params = useSearchParams()
  const selected = params.getAll('s')
  if (selected.length === 0) return null

  const matched = hpoTerms.filter((h) => selected.includes(h.hpo_id)).map((h) => h.hpo_label)
  if (matched.length === 0) return null

  return (
    <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
      <p className="text-sm font-semibold text-violet-900 mb-1">
        {matched.length} deiner Angaben passen zu dieser Erkrankung
      </p>
      <p className="text-sm text-violet-800">{matched.slice(0, 6).join(', ')}.</p>
      <p className="text-xs text-violet-700 mt-2">
        Das ist ein Hinweis, keine Diagnose. Besprich ihn mit deiner Ärztin oder deinem Arzt.
      </p>
    </div>
  )
}
