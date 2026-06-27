'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

export function MedicalDisclaimer() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 bg-amber-50 border-t border-amber-200 px-4 py-3 flex items-center justify-between gap-4 text-sm text-amber-900"
    >
      <p className="flex-1">
        <strong>Medizinischer Hinweis:</strong> Diese Plattform ersetzt keine ärztliche Beratung. Bei gesundheitlichen Beschwerden wenden Sie sich an eine Ärztin oder einen Arzt.
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Hinweis schließen"
        className="shrink-0 text-amber-700 hover:text-amber-900"
      >
        <X width={14} height={14} strokeWidth={1.5} fill="none" aria-hidden="true" />
      </button>
    </div>
  )
}
