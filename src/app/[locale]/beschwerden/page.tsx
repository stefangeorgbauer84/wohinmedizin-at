import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BodyMap } from '@/components/BodyMap'
import { getOrganCounts } from '@/lib/diseases'

export const revalidate = 86400

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export const metadata: Metadata = {
  title: 'Beschwerden & Symptome einordnen — WohinMedizin.at',
  description:
    'Du hast Symptome, weißt aber nicht, was dahintersteckt? Ordne deine Anzeichen ein und finde heraus, welche Erkrankungen dazu passen könnten und wer in Österreich hilft.',
  alternates: { canonical: `${SITE_URL}/beschwerden` },
  openGraph: {
    title: 'Beschwerden & Symptome einordnen — WohinMedizin.at',
    description: 'Anzeichen einordnen und passende Erkrankungen sowie Anlaufstellen in Österreich finden.',
    url: `${SITE_URL}/beschwerden`,
    type: 'website',
  },
}

const BEREICHE: Array<{ label: string; slug: string }> = [
  { label: 'Nerven & Gehirn', slug: 'neurologisch' },
  { label: 'Herz & Gefäße', slug: 'herz-gefaesse' },
  { label: 'Muskeln & Gelenke', slug: 'bewegungsapparat' },
  { label: 'Haut', slug: 'haut' },
  { label: 'Stoffwechsel', slug: 'stoffwechsel' },
  { label: 'Magen-Darm', slug: 'magen-darm' },
  { label: 'Augen', slug: 'augen' },
  { label: 'Blut & Immunsystem', slug: 'blut-immunsystem' },
]

export default async function BeschwerdenPage() {
  const organCounts = await getOrganCounts()
  return (
    <>
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-medizin-navy)] mb-3">
            Beschwerden einordnen
          </h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
            Anhaltende oder unklare Beschwerden sind belastend — besonders, wenn niemand eine Erklärung findet.
            WohinMedizin.at hilft dir, deine Anzeichen zu ordnen und herauszufinden, welche Erkrankungen dazu passen
            könnten und an wen du dich in Österreich wenden kannst. Das ist keine Diagnose, sondern eine Orientierung.
          </p>

          <div className="rounded-2xl wohin-gradient p-6 md:p-8 text-white mb-10">
            <h2 className="text-xl font-bold mb-2">Anzeichen auswählen</h2>
            <p className="text-white/85 mb-5 text-sm leading-relaxed">
              Wähle im Symptom-Finder aus, was du spürst. Du bekommst eine Liste von Erkrankungen, die dazu passen
              könnten — sortiert nach Bezug zu deinen Angaben.
            </p>
            <Link href="/finden" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[var(--color-selten-violett)] font-semibold text-sm hover:bg-white/90 transition-colors">
              Zum Symptom-Finder →
            </Link>
          </div>

          <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-4">Nach Körperregion</h2>
          <div className="rounded-2xl bg-white border border-[var(--color-border)] p-6 mb-6">
            <BodyMap counts={organCounts} />
          </div>

          <p className="text-sm text-[var(--color-muted)] mb-3">Oder direkt wählen:</p>
          <div className="flex flex-wrap gap-2 mb-10">
            {BEREICHE.map((b) => (
              <Link key={b.slug} href={`/selten/bereich/${b.slug}`}
                className="text-sm bg-white border border-[var(--color-border)] text-[var(--color-medizin-navy)] px-3 py-1.5 rounded-full hover:border-[var(--color-selten-violett)] hover:text-[var(--color-selten-violett)] transition-colors">
                {b.label}
              </Link>
            ))}
          </div>

          <div className="rounded-xl bg-white border border-[var(--color-border)] p-5 text-sm text-[var(--color-muted)]">
            <p className="font-medium text-[var(--color-medizin-navy)] mb-1">Lieber frei beschreiben?</p>
            Im <Link href="/navigator" className="text-[var(--color-donau-blau)] underline">Navigator</Link> kannst du dein
            Anliegen in eigenen Worten schildern und bekommst eine erste Einordnung, an wen du dich wenden kannst.
          </div>

          <p className="text-xs text-[var(--color-muted)] mt-8 leading-relaxed">
            Bei akuten, starken oder plötzlichen Beschwerden warte nicht — wähle den Notruf 144 oder geh in die nächste
            Notaufnahme.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
