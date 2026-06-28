import Link from 'next/link'

export function NotfallBanner() {
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-4 flex-wrap">
      <span className="text-red-800 font-semibold text-sm">Notfall?</span>
      <a href="tel:144" className="font-bold text-red-700 text-sm hover:underline">
        144 Rettung
      </a>
      <span className="text-red-600 text-sm" aria-hidden="true">·</span>
      <a href="tel:1450" className="text-red-700 text-sm hover:underline">
        1450 Gesundheitsberatung
      </a>
      <Link href="/notfall" className="ml-auto text-xs text-red-600 hover:underline whitespace-nowrap">
        Alle Notrufnummern →
      </Link>
    </div>
  )
}
