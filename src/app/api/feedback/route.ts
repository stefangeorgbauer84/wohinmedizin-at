import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  let body: { rating?: number; comment?: string; page?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  const { rating, comment, page } = body
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating 1-5 erforderlich' }, { status: 422 })
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
