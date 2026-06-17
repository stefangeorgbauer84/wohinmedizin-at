'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Seitenfehler:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-warmweiss)] px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-[var(--color-medizin-navy)] mb-3">
          Etwas ist schiefgelaufen
        </h1>
        <p className="text-[var(--color-muted)] mb-6">
          Die Seite konnte gerade nicht geladen werden. Bitte versuche es noch einmal — oder kehre zur Startseite zurück.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-medizin-navy)] font-semibold text-sm hover:bg-white transition-colors"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    </main>
  )
}
