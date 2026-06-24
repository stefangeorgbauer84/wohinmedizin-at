import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  let body: { rating?: number; comment?: string; page?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  const { rating, comment, page } = body
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating 1-5 erforderlich' }, { status: 422 })
  }
  if (comment && comment.length > 2000) {
    return NextResponse.json({ error: 'Kommentar zu lang (max. 2000 Zeichen).' }, { status: 422 })
  }
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const rl = checkRateLimit(ip, 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Zu viele Anfragen. Bitte versuche es später noch einmal.' }, { status: 429 })
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Server-Konfiguration fehlerhaft. Bitte kontaktiere den Support.' },
      { status: 500 }
    )
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'WohinMedizin Feedback <noreply@wohinmedizin.at>',
      to: ['stefan.bauer@digitale-zukunftsbildung.eu'],
      subject: `[Feedback] ${rating}/5 — ${page ?? 'unbekannte Seite'}`,
      text: `Bewertung: ${rating}/5\nSeite: ${page ?? '-'}\n\nKommentar:\n${comment ?? '-'}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json(
      { error: 'Feedback konnte nicht gesendet werden. Bitte versuche es später noch einmal.' },
      { status: 500 },
    )
  }
}
