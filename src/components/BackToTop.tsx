'use client'

import { useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Nach oben springen"
      className="no-print fixed bottom-20 md:bottom-6 right-4 z-40 w-11 h-11 rounded-full bg-white border border-[var(--color-border)] shadow-md flex items-center justify-center text-[var(--color-medizin-navy)] hover:border-[var(--color-selten-violett)] transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
