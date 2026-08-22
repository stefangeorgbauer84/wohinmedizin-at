import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { jsonLdString } from "@/lib/seo"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wohinmedizin.at"

export const metadata: Metadata = {
  title: "Notfallnummern Österreich | WohinMedizin.at",
  description:
    "Alle wichtigen Notrufnummern in Österreich: 144 Rettung, 112 Europäischer Notruf, 141 Ärztlicher Bereitschaftsdienst, 1450 Gesundheitsberatung, 142 Telefonseelsorge, 147 Rat auf Draht.",
  alternates: { canonical: `${SITE_URL}/notfall` },
  openGraph: {
    title: "Notfallnummern Österreich | WohinMedizin.at",
    description:
      "Alle wichtigen Notrufnummern in Österreich: 144 Rettung, 112 Europäischer Notruf, 141 Ärztlicher Bereitschaftsdienst, 1450 Gesundheitsberatung, 142 Telefonseelsorge, 147 Rat auf Draht.",
    url: `${SITE_URL}/notfall`,
    type: "website",
  },
}

interface EmergencyNumber {
  number: string
  name: string
  hours: string
  when: string
  color: "red" | "blue" | "violet"
}

const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    number: "144",
    name: "Rettung / Notruf",
    hours: "24/7",
    when: "Bei lebensbedrohlichen Verletzungen, Bewusstlosigkeit, Herzstillstand, Atemnot",
    color: "red",
  },
  {
    number: "112",
    name: "Europäischer Notruf",
    hours: "24/7",
    when: "Funktioniert in der gesamten EU, auch ohne SIM-Karte",
    color: "red",
  },
  {
    number: "141",
    name: "Ärztlicher Bereitschaftsdienst",
    hours: "Mo–Fr 19–7 h, Wochenende 24 h",
    when: "Bei dringenden, nicht lebensbedrohlichen Beschwerden außerhalb der Ordinationszeiten",
    color: "blue",
  },
  {
    number: "1450",
    name: "Gesundheitsberatung",
    hours: "24/7",
    when: "Telefonische Einschätzung durch Gesundheitspersonal: Wohin mit meinen Beschwerden?",
    color: "blue",
  },
  {
    number: "142",
    name: "Telefonseelsorge",
    hours: "24/7",
    when: "Bei psychischen Krisen, Suizidgedanken, emotionalen Notlagen. Anonym und kostenlos.",
    color: "violet",
  },
  {
    number: "147",
    name: "Rat auf Draht — Kinder & Jugendliche",
    hours: "24/7",
    when: "Für Kinder und Jugendliche in Not. Anonym und kostenlos.",
    color: "violet",
  },
]

const COLOR_CLASSES: Record<EmergencyNumber["color"], string> = {
  red: "bg-red-600 hover:bg-red-700",
  blue: "bg-[var(--color-donau-blau)] hover:opacity-90",
  violet: "bg-[var(--color-selten-violett)] hover:opacity-90",
}

const emergencyServicesLd = {
  "@context": "https://schema.org",
  "@graph": EMERGENCY_NUMBERS.map((n) => ({
    "@type": "EmergencyService",
    name: n.name,
    telephone: n.number,
    areaServed: { "@type": "Country", name: "Österreich" },
    openingHours: n.hours,
    description: n.when,
  })),
}

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Notfallnummern", item: `${SITE_URL}/notfall` },
  ],
}

export default function NotfallPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(emergencyServicesLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }} />
      <Header />
      <main id="hauptinhalt" className="flex-1 bg-red-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-6">
            <Link href="/" className="hover:text-[var(--color-donau-blau)]">Start</Link>
            <span aria-hidden="true">›</span>
            <span className="text-[var(--color-medizin-navy)] font-medium">Notfallnummern</span>
          </nav>

          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-medizin-navy)] mb-3">
              Notrufnummern in Österreich
            </h1>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed">
              Die wichtigsten Anlaufstellen in Notfällen — von lebensbedrohlichen Situationen bis hin zu
              psychischen Krisen und ärztlichem Bereitschaftsdienst.
            </p>
          </div>

          {/* Disclaimer */}
          <div
            role="alert"
            className="rounded-xl border-2 border-red-400 bg-red-100 px-5 py-4 mb-8 flex gap-3 items-start"
          >
            <svg
              className="flex-shrink-0 mt-0.5 text-red-700"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-red-800 font-semibold text-sm leading-relaxed">
              Diese Seite zeigt Orientierungsinformationen. Im Notfall sofort anrufen!
              Warte nicht — jede Sekunde kann entscheidend sein.
            </p>
          </div>

          {/* Emergency numbers grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {EMERGENCY_NUMBERS.map((n) => (
              <a
                key={n.number}
                href={`tel:${n.number}`}
                className={`block text-white rounded-xl p-6 transition-opacity text-center ${COLOR_CLASSES[n.color]}`}
              >
                <span className="text-4xl font-bold block mb-1">{n.number}</span>
                <span className="text-lg font-semibold block">{n.name}</span>
                <span className="text-sm opacity-90 block mt-1">{n.hours}</span>
                <span className="text-xs opacity-80 block mt-2 leading-snug">{n.when}</span>
              </a>
            ))}
          </div>

          {/* Not sure if emergency? */}
          <div className="rounded-xl bg-white border border-[var(--color-border)] px-6 py-6">
            <h2 className="text-lg font-semibold text-[var(--color-medizin-navy)] mb-2">
              Nicht sicher, ob es ein Notfall ist?
            </h2>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-4">
              Rufe{" "}
              <a href="tel:1450" className="font-semibold text-[var(--color-donau-blau)] hover:underline">
                1450
              </a>{" "}
              an — Gesundheitspersonal hilft dir einzuschätzen, welche Versorgung du benötigst.
              Oder nutze unseren Navigator für eine erste Orientierung.
            </p>
            <Link
              href="/navigator"
              className="inline-block text-sm font-semibold text-[var(--color-donau-blau)] hover:underline"
            >
              Zum Navigator →
            </Link>
          </div>

          <p className="text-xs text-[var(--color-muted)] mt-8">
            Diese Informationen dienen der allgemeinen Orientierung und ersetzen keine medizinische Beratung.
            Im Notfall sofort den Notruf 144 oder 112 wählen.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
