/**
 * WohinMedizin — Redaktionelle Anreicherung (KI-gestützt)
 *
 * Generiert für jede Krankheit:
 *   - editorialTags      — 3–8 patientenverständliche Schlagwörter
 *   - doctorGuidance     — urgencyNote, firstContact, specialtiesNote,
 *                          diagnosticJourney, redFlagSymptoms
 *   - curatedLinks       — 5 kuratierte Links (Selbsthilfe, Klinik,
 *                          Laien, Forschung, Notfall)
 *
 * Voraussetzungen:
 *   Dev-Server muss laufen: npm run dev
 *
 * Env (.env.local):
 *   PAYLOAD_ADMIN_EMAIL    — Payload Admin E-Mail
 *   PAYLOAD_ADMIN_PASSWORD — Payload Admin Passwort
 *   PAYLOAD_URL            — Optional, Standard: http://localhost:3003
 *   ANTHROPIC_API_KEY      — Anthropic API-Schlüssel
 *
 * Ausführen:
 *   npx tsx scripts/editorial/enrich.ts --dry-run
 *   npx tsx scripts/editorial/enrich.ts --limit 5
 *   npx tsx scripts/editorial/enrich.ts --id <disease-id>
 *   npx tsx scripts/editorial/enrich.ts
 */

import Anthropic from '@anthropic-ai/sdk'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(process.cwd(), '.env.local') })

// ─── CLI-Argumente ────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const DRY_RUN  = args.includes('--dry-run')
const LIMIT    = (() => { const i = args.indexOf('--limit'); return i !== -1 ? parseInt(args[i + 1], 10) : Infinity })()
const TARGET_ID = (() => { const i = args.indexOf('--id'); return i !== -1 ? args[i + 1] : null })()
const FORCE    = args.includes('--force') // überschreibt bereits befüllte Felder

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3003'
const DELAY_MS    = 1200 // Rate-Limit-freundlich

// ─── Env-Validierung (früh — bevor irgendwas läuft) ─────────────────────────

function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) {
    console.error(`❌  Umgebungsvariable "${name}" fehlt in .env.local`)
    process.exit(1)
  }
  return val
}

// ─── Payload Auth ─────────────────────────────────────────────────────────────

async function getToken(email: string, password: string): Promise<string> {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Credentials kommen als Parameter — nie als Strings geloggt oder in Fehlertexte eingebettet
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    // HTTP-Statuscode loggen, aber KEINE Credentials in der Fehlermeldung
    throw new Error(`Payload-Login fehlgeschlagen (HTTP ${res.status}). Bitte E-Mail/Passwort in .env.local prüfen.`)
  }
  const json = await res.json() as { token: string }
  if (!json.token) throw new Error('Payload-Login: kein Token in der Antwort')
  return json.token
}

// ─── Payload API Helpers ──────────────────────────────────────────────────────

async function fetchAll<T>(token: string, collection: string, params = ''): Promise<T[]> {
  let page = 1
  const all: T[] = []
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/${collection}?limit=100&page=${page}${params}`, {
      headers: { Authorization: `JWT ${token}` },
    })
    if (!res.ok) throw new Error(`Fehler beim Laden von ${collection}: ${res.status}`)
    const json = await res.json() as { docs: T[]; hasNextPage: boolean }
    all.push(...json.docs)
    if (!json.hasNextPage) break
    page++
  }
  return all
}

async function patchDisease(token: string, id: string, data: Record<string, unknown>): Promise<void> {
  if (DRY_RUN) { console.log(`  [DRY-RUN] PATCH diseases/${id}`, JSON.stringify(data).slice(0, 120) + '…'); return }
  const res = await fetch(`${PAYLOAD_URL}/api/diseases/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PATCH fehlgeschlagen (${id}): ${res.status} — ${err.slice(0, 200)}`)
  }
}

// ─── Lexical RichText Helper ──────────────────────────────────────────────────

function lexicalDoc(text: string) {
  // Wandelt einfachen Text (Zeilenumbrüche = neue Paragraphen) in Payload Lexical JSON um
  const paragraphs = text.split('\n').filter(l => l.trim())
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map(line => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: line, version: 1 }],
      })),
    },
  }
}

// ─── Organsystem → Fachrichtung Mapping ──────────────────────────────────────

const ORGAN_TO_SPECIALTY: Record<string, string[]> = {
  neurological:              ['Neurologie'],
  cardiovascular:            ['Kardiologie'],
  respiratory:               ['Pneumologie'],
  gastrointestinal:          ['Gastroenterologie', 'Innere Medizin'],
  endocrine_metabolic:       ['Endokrinologie', 'Diabetologie'],
  musculoskeletal:           ['Orthopädie', 'Rheumatologie', 'Physikalische Medizin'],
  dermatological:            ['Dermatologie'],
  urogenital:                ['Urologie', 'Nephrologie'],
  hematological_immunological: ['Hämatologie', 'Immunologie'],
  visual:                    ['Ophthalmologie'],
  auditory:                  ['HNO'],
  reproductive:              ['Gynäkologie', 'Urologie'],
  pediatric_neonatal:        ['Pädiatrie', 'Neonatologie'],
  psychiatric:               ['Psychiatrie', 'Neurologie'],
  multisystemic:             ['Innere Medizin'],
}

// ─── Claude Prompt ────────────────────────────────────────────────────────────

interface DiseaseDoc {
  id: string
  name?: string
  briefDescription?: string
  organSystems?: string[]
  primaryEtiology?: string
  epidemiology?: { ageOfOnset?: string[]; prevalence?: string }
  modifiers?: { courseModifier?: string; severitySpectrum?: string[] }
  editorialTags?: Array<{ tag: string }>
  doctorGuidance?: Record<string, unknown>
  curatedLinks?: Array<Record<string, unknown>>
}

interface EnrichmentResult {
  editorialTags: Array<{ tag: string }>
  urgencyNote: 'routine' | 'soon' | 'urgent' | 'emergency'
  firstContactText: string
  specialtiesNoteText: string
  diagnosticJourneyText: string
  redFlagSymptomsText: string
  curatedLinks: Array<{
    category: 'self_help' | 'clinical' | 'layperson' | 'research' | 'emergency'
    title: string
    url: string
    language: 'de' | 'en'
    description: string
  }>
}

async function generateEnrichment(claude: Anthropic, disease: DiseaseDoc): Promise<EnrichmentResult> {
  const organs = (disease.organSystems ?? []).flatMap(o => ORGAN_TO_SPECIALTY[o] ?? []).filter((v, i, a) => a.indexOf(v) === i)
  const ageOnset = disease.epidemiology?.ageOfOnset?.join(', ') ?? 'unbekannt'
  const course = disease.modifiers?.courseModifier ?? 'unbekannt'
  const prevalence = disease.epidemiology?.prevalence ?? 'selten'
  const etiology = disease.primaryEtiology ?? 'unbekannt'
  const brief = disease.briefDescription ?? ''

  const prompt = `Du bist Redakteur:in für WohinMedizin.at — eine österreichische Gesundheitsplattform für seltene Erkrankungen.
Deine Zielgruppe sind betroffene Patient:innen und Angehörige, KEINE Mediziner:innen.

KRANKHEIT: ${disease.name ?? 'unbekannt'}
Organsysteme: ${(disease.organSystems ?? []).join(', ')}
Ätiologie: ${etiology}
Verlauf: ${course}
Erkrankungsalter: ${ageOnset}
Prävalenz: ${prevalence}
Bekannte zuständige Fachrichtungen: ${organs.join(', ') || 'unklar'}
Kurztext: ${brief || '(noch kein Kurztext vorhanden)'}

Erstelle eine JSON-Antwort mit EXAKT dieser Struktur (keine Erklärungen außerhalb des JSON):

{
  "editorialTags": ["tag1", "tag2", "tag3"],
  "urgencyNote": "routine",
  "firstContactText": "...",
  "specialtiesNoteText": "...",
  "diagnosticJourneyText": "...",
  "redFlagSymptomsText": "...",
  "curatedLinks": [
    {
      "category": "self_help",
      "title": "...",
      "url": "https://...",
      "language": "de",
      "description": "..."
    }
  ]
}

Regeln:
- editorialTags: 4–7 einfache Schlagwörter aus Patientenperspektive (z.B. "Muskeln", "Kinder", "erblich", "selten", "Diagnose dauert lang")
- urgencyNote: einer von "routine" | "soon" | "urgent" | "emergency" — basierend auf typischem Schweregrad
- firstContactText: 2–4 Sätze, einfache Sprache, wer der ERSTE Ansprechpartner ist (Hausarzt? Kinderarzt? Direkt Facharzt?)
- specialtiesNoteText: 3–5 Sätze, WARUM genau diese Fachärzt:innen? Was machen sie bei dieser Krankheit?
- diagnosticJourneyText: 3–6 Sätze, typischer Weg von den ersten Beschwerden bis zur Diagnose. Gibt es eine Diagnoseverzögerung?
- redFlagSymptomsText: 2–4 Sätze oder Auflistung, bei welchen Symptomen SOFORT zum Arzt
- curatedLinks: GENAU 5 Links mit diesen Kategorien in dieser Reihenfolge:
  1. "self_help" — österreichische Selbsthilfe-/Patientenorganisation (Pro Rare Austria, BAGS, Selbsthilfe Österreich oder krankheitsspezifisch)
  2. "clinical" — Orphanet-Seite ODER offizielle Fachgesellschaft für diese Erkrankung
  3. "layperson" — gesundheit.gv.at, netdoktor.at, oder msd-manual.com/de
  4. "research" — ClinicalTrials.gov Suche ODER EURORDIS-Seite
  5. "emergency" — https://www.gesundheit.gv.at/service/gesundheitstelefon (Gesundheitstelefon 1450)

  Für URLs: verwende bekannte, stabile URLs. Orphanet-URLs: https://www.orpha.net/de/disease/detail/ORPHACODE (ersetze ORPHACODE durch die Zahl falls bekannt, sonst https://www.orpha.net/de/).
  Schreibe IMMER die vollständige URL (kein Platzhalter wie "URL einfügen").

- Alle Texte auf DEUTSCH, außer englischsprachige Ressourcen explizit angegeben
- Kein Fachjargon ohne unmittelbare Erklärung
- Keine Heilversprechen
- Kein "Sie sollten…" — direkte Ansprache mit "du" oder neutral formulieren`

  const response = await claude.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  // Extrahiere JSON aus der Antwort (manchmal mit Markdown-Codeblock)
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/)
  const jsonStr = jsonMatch ? jsonMatch[1] ?? jsonMatch[0] : raw

  let parsed: {
    editorialTags?: string[]
    urgencyNote?: string
    firstContactText?: string
    specialtiesNoteText?: string
    diagnosticJourneyText?: string
    redFlagSymptomsText?: string
    curatedLinks?: Array<{
      category: string
      title: string
      url: string
      language: string
      description: string
    }>
  }
  try {
    parsed = JSON.parse(jsonStr.trim())
  } catch {
    throw new Error(`JSON-Parsing fehlgeschlagen:\n${raw.slice(0, 500)}`)
  }

  return {
    editorialTags: (parsed.editorialTags ?? []).map((t: string) => ({ tag: t })),
    urgencyNote: (parsed.urgencyNote as EnrichmentResult['urgencyNote']) ?? 'routine',
    firstContactText: parsed.firstContactText ?? '',
    specialtiesNoteText: parsed.specialtiesNoteText ?? '',
    diagnosticJourneyText: parsed.diagnosticJourneyText ?? '',
    redFlagSymptomsText: parsed.redFlagSymptomsText ?? '',
    curatedLinks: (parsed.curatedLinks ?? []).map(l => ({
      category: l.category as EnrichmentResult['curatedLinks'][0]['category'],
      title: l.title,
      url: l.url,
      language: (l.language as 'de' | 'en') ?? 'de',
      description: l.description,
    })),
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏥 WohinMedizin — Redaktionelle Anreicherung`)
  console.log(`   Modus: ${DRY_RUN ? 'DRY-RUN (keine Änderungen)' : 'LIVE'}`)
  console.log(`   Limit: ${LIMIT === Infinity ? 'alle' : LIMIT}`)
  console.log(`   Force: ${FORCE ? 'ja (überschreibt vorhandene Daten)' : 'nein (nur leere Felder)'}`)
  if (TARGET_ID) console.log(`   Ziel-ID: ${TARGET_ID}`)
  console.log()

  // Alle Secrets früh validieren — schlägt mit klarer Meldung fehl, bevor API-Calls starten
  const anthropicKey = requireEnv('ANTHROPIC_API_KEY')
  const adminEmail   = requireEnv('PAYLOAD_ADMIN_EMAIL')
  const adminPass    = requireEnv('PAYLOAD_ADMIN_PASSWORD')

  const claude = new Anthropic({ apiKey: anthropicKey })

  console.log('🔑 Payload-Login…')
  const token = await getToken(adminEmail, adminPass)
  console.log('✅ Eingeloggt\n')

  // Alle Krankheiten laden
  let diseases: DiseaseDoc[]
  if (TARGET_ID) {
    const res = await fetch(`${PAYLOAD_URL}/api/diseases/${TARGET_ID}`, {
      headers: { Authorization: `JWT ${token}` },
    })
    if (!res.ok) throw new Error(`Krankheit ${TARGET_ID} nicht gefunden`)
    diseases = [await res.json() as DiseaseDoc]
  } else {
    console.log('📋 Lade alle Krankheiten…')
    diseases = await fetchAll<DiseaseDoc>(token, 'diseases')
    console.log(`   ${diseases.length} Krankheiten gefunden\n`)
  }

  // Filtern: bereits vollständig befüllt überspringen (außer --force)
  const todo = diseases.filter(d => {
    if (FORCE) return true
    const hasGuidance = d.doctorGuidance && Object.keys(d.doctorGuidance).length > 0
    const hasLinks = (d.curatedLinks ?? []).length > 0
    const hasTags = (d.editorialTags ?? []).length > 0
    return !hasGuidance || !hasLinks || !hasTags
  }).slice(0, LIMIT)

  console.log(`📝 ${todo.length} Krankheiten zu bearbeiten (${diseases.length - todo.length} übersprungen — bereits befüllt)\n`)

  let success = 0, errors = 0

  for (let i = 0; i < todo.length; i++) {
    const disease = todo[i]
    const label = `[${i + 1}/${todo.length}] ${disease.name ?? disease.id}`
    console.log(`\n${label}`)
    console.log(`  Organsysteme: ${(disease.organSystems ?? []).join(', ') || '—'}`)

    try {
      console.log('  → Claude generiert…')
      const enrichment = await generateEnrichment(claude, disease)

      console.log(`  ✓ Tags: ${enrichment.editorialTags.map(t => t.tag).join(', ')}`)
      console.log(`  ✓ Dringlichkeit: ${enrichment.urgencyNote}`)
      console.log(`  ✓ Links: ${enrichment.curatedLinks.length} generiert`)

      const patch = {
        editorialTags: enrichment.editorialTags,
        doctorGuidance: {
          urgencyNote: enrichment.urgencyNote,
          firstContact: lexicalDoc(enrichment.firstContactText),
          specialtiesNote: lexicalDoc(enrichment.specialtiesNoteText),
          diagnosticJourney: lexicalDoc(enrichment.diagnosticJourneyText),
          redFlagSymptoms: lexicalDoc(enrichment.redFlagSymptomsText),
        },
        curatedLinks: enrichment.curatedLinks.map(l => ({
          ...l,
          lastChecked: new Date().toISOString().split('T')[0],
        })),
      }

      await patchDisease(token, disease.id, patch)
      console.log(`  ✅ Gespeichert`)
      success++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ❌ Fehler: ${msg.slice(0, 200)}`)
      errors++
    }

    // Delay zwischen Requests
    if (i < todo.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS))
    }
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`✅ Fertig — ${success} erfolgreich, ${errors} Fehler`)
  if (DRY_RUN) console.log('ℹ️  DRY-RUN: Keine Änderungen wurden gespeichert')
  console.log()
}

main().catch(err => {
  console.error('\n💥 Unerwarteter Fehler:', err)
  process.exit(1)
})
