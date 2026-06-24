import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const INTEREST_LABELS: Record<string, string> = {
  studien: 'Studien-Hinweise & Rekrutierung',
  zentrum: 'Verifiziertes Zentrumsprofil',
  pharma: 'Gekennzeichnete Aufklärungsinhalte',
  sonstiges: 'Sonstiges',
}

export async function POST(req: NextRequest) {
  let body: { name?: string; org?: string; email?: string; interest?: string; message?: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
  const { name, org, email, interest, message } = body
  if (!name?.trim() || !org?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Bitte alle Pflichtfelder ausfüllen.' }, { status: 422 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 422 })
  }
  const interestLabel = INTEREST_LABELS[interest ?? ''] ?? interest ?? 'Nicht angegeben'
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'WohinMedizin Partner <noreply@wohinmedizin.at>',
      to: ['partner@wohinmedizin.at'],
      replyTo: email,
      subject: `Partnerschaft-Anfrage: ${interestLabel} — ${org}`,
      text: `Name: ${name}\nOrganisation: ${org}\nE-Mail: ${email}\nInteresse: ${interestLabel}\n\nNachricht:\n${message}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gesendet werden. Bitte schreibe direkt an partner@wohinmedizin.at' },
      { status: 500 },
    )
  }
}
