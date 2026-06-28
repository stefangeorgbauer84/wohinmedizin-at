'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface NavLink {
  label: string
  href: string
  highlight?: boolean
}

interface MobileNavProps {
  links: readonly NavLink[]
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
        onClick={() => setIsOpen((v) => !v)}
        className="lg:hidden inline-flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors gap-[5px] p-2"
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 2L16 16M16 2L2 16" stroke="var(--color-medizin-navy)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <>
            <span className="block w-full h-[2px] bg-[var(--color-medizin-navy)] rounded-full" />
            <span className="block w-full h-[2px] bg-[var(--color-medizin-navy)] rounded-full" />
            <span className="block w-full h-[2px] bg-[var(--color-medizin-navy)] rounded-full" />
          </>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed top-0 right-0 h-full w-[min(320px,100vw)] bg-white z-[70] shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--color-border)] shrink-0">
          <span className="font-semibold text-[var(--color-medizin-navy)] text-base">
            Menü
          </span>
          <button
            type="button"
            aria-label="Menü schließen"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 2L16 16M16 2L2 16" stroke="var(--color-medizin-navy)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-5 py-4 text-base font-medium border-b border-[var(--color-border)] transition-colors ${
                link.highlight
                  ? 'text-[var(--color-selten-violett)] hover:opacity-80'
                  : 'text-[var(--color-medizin-navy)] hover:text-[var(--color-donau-blau)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA button */}
        <div className="p-5 shrink-0 border-t border-[var(--color-border)]">
          <Link
            href="/navigator"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-full px-4 py-3 rounded-lg wohin-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Orientierung starten
          </Link>
        </div>
      </div>
    </>
  )
}
