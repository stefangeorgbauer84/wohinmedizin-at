import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NavLink } from './NavLink'
import { SearchTrigger } from './SearchTrigger'

export async function Header() {
  const t = await getTranslations('nav')

  return (
    <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
      <a
        href="#hauptinhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-medizin-navy)] focus:text-white focus:text-sm"
      >
        Zum Hauptinhalt springen
      </a>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg wohin-gradient flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="2.5" fill="white" />
                <path d="M9 3 L9 6.5 M9 11.5 L9 15 M3 9 L6.5 9 M11.5 9 L15 9"
                  stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-semibold text-[var(--color-medizin-navy)] text-lg tracking-tight">
              WohinMedizin<span className="text-[var(--color-donau-blau)]">.at</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 text-sm flex-1">
            <NavLink href="/selten"
              className="text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)] transition-colors whitespace-nowrap"
              activeClassName="!text-[var(--color-medizin-navy)] font-medium">
              {t('diseases')}
            </NavLink>
            <NavLink href="/spezialistinnen"
              className="text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)] transition-colors whitespace-nowrap"
              activeClassName="!text-[var(--color-medizin-navy)] font-medium">
              {t('specialties')}
            </NavLink>
            <NavLink href="/wissen"
              className="text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)] transition-colors whitespace-nowrap"
              activeClassName="!text-[var(--color-medizin-navy)] font-medium">
              Wissen
            </NavLink>
            <NavLink href="/finden"
              className="text-[var(--color-selten-violett)] font-medium hover:opacity-80 transition-opacity whitespace-nowrap"
              activeClassName="underline underline-offset-4">
              Symptom-Finder
            </NavLink>
            <NavLink href="/fuer-aerzte"
              className="text-[var(--color-muted)] hover:text-[var(--color-medizin-navy)] transition-colors whitespace-nowrap"
              activeClassName="!text-[var(--color-medizin-navy)] font-medium">
              {t('forDoctors')}
            </NavLink>
          </nav>

          {/* Right side: Suche + Merkliste + Language switcher + CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <SearchTrigger />
            <Link href="/merkliste" aria-label="Meine Merkliste" className="hidden sm:inline-flex p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-selten-violett)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </Link>
            {/* Language Switcher — always visible */}
            <LanguageSwitcher />

            {/* CTA button — hidden on very small screens */}
            <Link
              href="/navigator"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg wohin-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {t('startOrientation')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
