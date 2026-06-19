import { Header } from '@/components/Header'

export default function Loading() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
          <div className="h-8 w-1/2 bg-[var(--color-border)] rounded mb-4" />
          <div className="h-4 w-full bg-[var(--color-border)] rounded mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[var(--color-border)] h-14" />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
