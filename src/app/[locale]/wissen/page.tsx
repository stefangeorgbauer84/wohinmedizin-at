import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WISSEN_ARTICLES } from '@/content/wissen'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Wissen — Orientierung im Gesundheitssystem | WohinMedizin.at',
  description:
    'Verständliche Antworten auf häufige Fragen: Wann zu welcher Fachrichtung, Kassenarzt vs. Wahlarzt, Überweisungen und Warnzeichen in Österreich.',
  alternates: { canonical: `${SITE_URL}/wissen` },
}

export default function WissenIndex() {
  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">Wissen</h1>
          <p className="text-[var(--color-muted)] leading-relaxed mb-8">
            Verständliche Antworten auf häufige Unsicherheiten im österreichischen Gesundheitssystem.
          </p>
          <ul className="space-y-3">
            {WISSEN_ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link href={`/wissen/${a.slug}`}
                  className="block bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-donau-blau)] hover:shadow-sm transition-all">
                  <span className="block font-semibold text-[var(--color-medizin-navy)]">{a.title}</span>
                  <span className="block text-sm text-[var(--color-muted)] mt-1">{a.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
