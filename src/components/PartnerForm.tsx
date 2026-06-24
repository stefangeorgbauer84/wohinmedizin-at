'use client'

import { useState } from 'react'

const INTEREST_OPTIONS = [
  { value: 'studien', label: 'Studien-Hinweise & Rekrutierung' },
  { value: 'zentrum', label: 'Verifiziertes Zentrumsprofil' },
  { value: 'pharma', label: 'Gekennzeichnete Aufklärungsinhalte' },
  { value: 'sonstiges', label: 'Sonstiges' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export function PartnerForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name') as string,
      org: fd.get('org') as string,
      email: fd.get('email') as string,
      interest: fd.get('interest') as string,
      message: fd.get('message') as string,
    }
    try {
      const res = await fetch('/api/partner-kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error ?? 'Fehler.'); setStatus('error'); return }
      setStatus('success')
    } catch {
      setErrorMsg('Netzwerkfehler. Bitte schreibe direkt an partner@wohinmedizin.at')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-xl bg-[var(--color-morgen-hellblau)] border border-[var(--color-border)] p-8 text-center">
        <p className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">Anfrage erhalten.</p>
        <p className="text-sm text-[var(--color-muted)]">Wir melden uns innerhalb von 2 Werktagen.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--color-border)] p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pf-name" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">Name *</label>
          <input id="pf-name" name="name" type="text" required
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]" />
        </div>
        <div>
          <label htmlFor="pf-org" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">Organisation *</label>
          <input id="pf-org" name="org" type="text" required
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]" />
        </div>
      </div>
      <div>
        <label htmlFor="pf-email" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">E-Mail *</label>
        <input id="pf-email" name="email" type="email" required
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]" />
      </div>
      <div>
        <label htmlFor="pf-interest" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">Interesse an</label>
        <select id="pf-interest" name="interest"
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)]">
          {INTEREST_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="pf-message" className="block text-xs font-medium text-[var(--color-medizin-navy)] mb-1">Kurze Beschreibung *</label>
        <textarea id="pf-message" name="message" required rows={4}
          placeholder="Worum geht es, welche Erkrankung, welcher Zeithorizont?"
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-donau-blau)] resize-y" />
      </div>
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600">{errorMsg}</p>
      )}
      <button type="submit" disabled={status === 'loading'}
        className="w-full py-3 rounded-xl wohin-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
        {status === 'loading' ? 'Wird gesendet …' : 'Anfrage absenden'}
      </button>
      <p className="text-xs text-[var(--color-muted)] text-center">
        Oder direkt:{' '}
        <a href="mailto:partner@wohinmedizin.at" className="text-[var(--color-donau-blau)] hover:underline">
          partner@wohinmedizin.at
        </a>
      </p>
    </form>
  )
}
