'use client'

import { Link, usePathname } from '@/i18n/navigation'

/**
 * Navigationslink mit aria-current="page" für die aktive Route (WCAG 1.3.1).
 * `match` = 'exact' nur bei exakter Übereinstimmung, sonst Präfix (Section).
 */
export function NavLink({
  href,
  children,
  className,
  activeClassName,
  match = 'prefix',
}: {
  href: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
  match?: 'exact' | 'prefix'
}) {
  const pathname = usePathname()
  const isActive =
    match === 'exact' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`${className ?? ''} ${isActive ? activeClassName ?? '' : ''}`.trim()}
    >
      {children}
    </Link>
  )
}
