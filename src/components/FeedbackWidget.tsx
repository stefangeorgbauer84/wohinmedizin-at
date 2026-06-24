'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

type Step = 'closed' | 'rating' | 'comment' | 'done'

export function FeedbackWidget() {
  const [step, setStep] = useState<Step>('closed')
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const pathname = usePathname()

  async function submitFeedback(r: number, c?: string) {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: r, comment: c ?? comment, page: pathname }),
      })
      if (!res.ok) {
        console.error('Feedback submission failed:', res.status, res.statusText)
        setStep('closed')
        return
      }
      setStep('done')
    } catch (err) {
      console.error('Feedback submission error:', err)
      setStep('closed')
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" aria-live="polite">
      {step === 'closed' && (
        <button
          onClick={() => setStep('rating')}
          aria-label="Feedback geben"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--color-border)] shadow-md text-sm text-[var(--color-medizin-navy)] hover:border-[var(--color-donau-blau)] transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Feedback
        </button>
      )}

      {step === 'rating' && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-lg p-5 w-72">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-[var(--color-medizin-navy)]">War diese Seite hilfreich?</p>
            <button onClick={() => setStep('closed')} aria-label="Schließen"
              className="text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)] w-6 h-6 flex items-center justify-center rounded">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => { setRating(n); setStep('comment') }}
                className="w-9 h-9 rounded-full border border-[var(--color-border)] text-sm font-medium hover:border-[var(--color-donau-blau)] hover:bg-[var(--color-morgen-hellblau)] transition-all"
                aria-label={`Bewertung ${n} von 5`}>
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-muted)] text-center mt-2">1 = wenig hilfreich · 5 = sehr hilfreich</p>
        </div>
      )}

      {step === 'comment' && rating !== null && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-lg p-5 w-72">
          <p className="text-sm font-semibold text-[var(--color-medizin-navy)] mb-3">Danke! Noch ein Kommentar?</p>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            rows={3} maxLength={2000} placeholder="Optional — was hat geholfen, was fehlte?"
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]" />
          <div className="flex gap-2 mt-3">
            <button onClick={() => submitFeedback(rating)}
              className="flex-1 py-2 rounded-lg wohin-gradient text-white text-sm font-medium hover:opacity-90">
              Absenden
            </button>
            <button onClick={() => setStep('closed')}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:border-[var(--color-donau-blau)]">
              Schließen
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-md p-4 w-64 text-sm text-[var(--color-medizin-navy)] text-center">
          Danke für dein Feedback.
        </div>
      )}
    </div>
  )
}
