import { Header } from '@/components/Header'

export default function Loading() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          {/* h1 skeleton */}
          <div className="h-9 w-1/2 bg-[var(--color-border)] rounded mb-4" />

          {/* paragraph skeleton */}
          <div className="h-5 w-full bg-[var(--color-border)] rounded mb-2" />
          <div className="h-5 w-3/4 bg-[var(--color-border)] rounded mb-8" />

          {/* gradient card skeleton */}
          <div className="h-32 w-full bg-[var(--color-border)]/50 rounded-2xl mb-6" />

          {/* 8 organ area card skeletons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--color-border)] rounded-xl h-20"
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
