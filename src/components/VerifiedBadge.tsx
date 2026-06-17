/**
 * „Verifiziert"-Badge für Zentren/Organisationen. Bedeutet: Angaben wurden von
 * WohinMedizin bestätigt — KEINE bezahlte Platzierung und kein Ranking-Vorteil.
 * Diese Bedeutung steht transparent im Tooltip und auf der Transparenzseite.
 */
export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      title="Angaben von WohinMedizin bestätigt. Kein Ranking-Vorteil, keine bezahlte Platzierung."
      className={`inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      Verifiziert
    </span>
  )
}
