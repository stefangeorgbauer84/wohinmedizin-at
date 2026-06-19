import { Header } from '@/components/Header'

export default function Loading() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--color-warmweiss)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
          <div className="h-4 w-64 bg-[var(--color-border)] rounded mb-6" />
          <div className="h-8 w-2/3 bg-[var(--color-border)] rounded mb-4" />
          <div className="h-4 w-1/3 bg-[var(--color-border)] rounded mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-[var(--color-border)]">
                  <div className="h-5 w-40 bg-[var(--color-border)] rounded mb-4" />
                  <div className="h-3 w-full bg-[var(--color-border)] rounded mb-2" />
                  <div className="h-3 w-5/6 bg-[var(--color-border)] rounded mb-2" />
                  <div className="h-3 w-4/6 bg-[var(--color-border)] rounded" />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] h-40" />
              <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] h-32" />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
