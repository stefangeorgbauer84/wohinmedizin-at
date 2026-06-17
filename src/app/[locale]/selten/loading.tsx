import { Header } from '@/components/Header'

export default function Loading() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
          <div className="h-8 w-1/2 bg-[var(--color-border)] rounded mb-6" />
          <div className="h-12 w-full max-w-xl bg-[var(--color-border)] rounded mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-[var(--color-border)] h-28" />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
