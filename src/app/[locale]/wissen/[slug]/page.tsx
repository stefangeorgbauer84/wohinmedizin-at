import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WISSEN_ARTICLES, getWissenArticle } from '@/content/wissen'
import { jsonLdString } from '@/lib/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wohinmedizin.at'

export function generateStaticParams() {
  return WISSEN_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = getWissenArticle(slug)
  if (!a) return { title: 'Artikel nicht gefunden' }
  return {
    title: `${a.title} | WohinMedizin.at`,
    description: a.description,
    alternates: { canonical: `${SITE_URL}/wissen/${slug}` },
    openGraph: { title: a.title, description: a.description, url: `${SITE_URL}/wissen/${slug}`, type: 'article' },
  }
}

export default async function WissenArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getWissenArticle(slug)
  if (!a) notFound()

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    mainEntityOfPage: `${SITE_URL}/wissen/${slug}`,
    publisher: { '@type': 'Organization', name: 'WohinMedizin.at', url: SITE_URL },
  }
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.sections.map((s) => ({
      '@type': 'Question', name: s.h, acceptedAnswer: { '@type': 'Answer', text: s.p },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqLd) }} />
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-6">
            <Link href="/wissen" className="hover:text-[var(--color-donau-blau)]">Wissen</Link>
            <span aria-hidden="true">›</span>
            <span className="text-[var(--color-medizin-navy)] font-medium line-clamp-1">{a.title}</span>
          </nav>

          <h1 className="text-3xl font-bold text-[var(--color-medizin-navy)] mb-4">{a.title}</h1>
          <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">{a.intro}</p>

          <div className="space-y-7">
            {a.sections.map((s) => (
              <section key={s.h}>
                <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">{s.h}</h2>
                <p className="text-[var(--color-muted)] leading-relaxed">{s.p}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-medizin-navy)] font-medium mb-1">Noch unsicher, wohin?</p>
            <p className="text-sm text-[var(--color-muted)] mb-3">
              Der Navigator hilft dir, die passende Anlaufstelle für dein Anliegen zu finden.
            </p>
            <Link href="/navigator" className="text-sm font-semibold text-[var(--color-donau-blau)] hover:underline">
              Zum Navigator →
            </Link>
          </div>

          <p className="text-xs text-[var(--color-muted)] mt-8">
            Diese Informationen dienen der allgemeinen Orientierung und ersetzen keine ärztliche Beratung.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
