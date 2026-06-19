import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MerklisteList } from '@/components/MerklisteList'

export const metadata: Metadata = {
  title: 'Meine Merkliste — WohinMedizin.at',
  robots: { index: false },
}

export default function MerklistePage() {
  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-bold text-[var(--color-medizin-navy)] mb-2">Meine Merkliste</h1>
          <p className="text-[var(--color-muted)] mb-8">
            Hier findest du die Erkrankungen, die du gemerkt hast. Die Liste wird nur in deinem Browser gespeichert — kein Konto nötig.
          </p>
          <MerklisteList />
        </div>
      </main>
      <Footer />
    </>
  )
}
