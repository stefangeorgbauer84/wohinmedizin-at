import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Navigator — Wo soll ich hin? | WohinMedizin.at',
  description:
    'Beschreibe dein medizinisches Anliegen — der WohinMedizin Navigator hilft dir, die richtige Anlaufstelle in Österreich zu finden. Kein Login, keine Diagnose.',
  openGraph: {
    title: 'WohinMedizin Navigator — Orientierung für dein Anliegen',
    description:
      'Beschreibe dein Anliegen und erfahre, welche Fachrichtung und Anlaufstelle in Österreich passend sein könnte.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'WohinMedizin Navigator',
    description: 'Finde die richtige Anlaufstelle für dein Anliegen in Österreich.',
  },
}

export default function NavigatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
