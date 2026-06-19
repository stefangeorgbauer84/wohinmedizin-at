import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center bg-[var(--color-warmweiss)] px-6 py-24">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-selten-violett)] mb-2">404</p>
          <h1 className="text-2xl font-bold text-[var(--color-medizin-navy)] mb-3">
            Diese Seite gibt es nicht
          </h1>
          <p className="text-[var(--color-muted)] mb-6">
            Vielleicht hilft dir einer dieser Wege weiter:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/finden" className="px-5 py-2.5 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Symptom-Finder
            </Link>
            <Link href="/selten" className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-medizin-navy)] font-semibold text-sm hover:bg-white transition-colors">
              Seltene Erkrankungen
            </Link>
            <Link href="/navigator" className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-medizin-navy)] font-semibold text-sm hover:bg-white transition-colors">
              Navigator
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
