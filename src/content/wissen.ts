/**
 * Wissens-Artikel — Klartext-Antworten auf häufige Such­anfragen rund um das
 * österreichische Gesundheitssystem. Treiben informationale organische Suche
 * („wann zur Rheumatologie", „Kassenarzt Wahlarzt Unterschied").
 */

export interface WissenArticle {
  slug: string
  title: string
  description: string
  intro: string
  sections: { h: string; p: string }[]
}

export const WISSEN_ARTICLES: WissenArticle[] = [
  {
    slug: 'wann-zur-dermatologie',
    title: 'Wann zur Dermatologie? Hautarzt in Österreich',
    description: 'Wann ein Besuch beim Hautarzt sinnvoll ist, wann die Hausärztin reicht und welche Anzeichen rasch abgeklärt gehören.',
    intro: 'Die Dermatologie kümmert sich um Haut, Haare und Nägel. Viele Hautbeschwerden klären zunächst Hausärztinnen und Hausärzte ab — manche Anzeichen gehören aber direkt zur Fachärztin oder zum Facharzt.',
    sections: [
      { h: 'Wann ein Besuch sinnvoll ist', p: 'Bei neuen oder sich verändernden Muttermalen, anhaltendem Hautausschlag, chronischem Juckreiz, Akne, die nicht abheilt, oder Verdacht auf eine seltene Hauterkrankung ist eine dermatologische Abklärung angebracht.' },
      { h: 'Wann die Hausärztin zuerst reicht', p: 'Leichte, kurzzeitige Hautreizungen, kleine Wunden oder eindeutige Insektenstiche lassen sich oft hausärztlich behandeln. Bei Unsicherheit erfolgt von dort eine gezielte Überweisung.' },
      { h: 'Wann rasch abklären', p: 'Eine schnell wachsende, blutende oder dunkel-unregelmäßige Hautveränderung sowie großflächige, mit Fieber einhergehende Ausschläge sollten zeitnah ärztlich beurteilt werden.' },
    ],
  },
  {
    slug: 'wann-zur-rheumatologie',
    title: 'Wann zur Rheumatologie? Gelenk- und Autoimmunbeschwerden',
    description: 'Anhaltende Gelenkschmerzen, Morgensteifigkeit oder Verdacht auf eine Autoimmunerkrankung — wann die Rheumatologie der richtige Weg ist.',
    intro: 'Die Rheumatologie behandelt entzündliche Erkrankungen von Gelenken, Muskeln und Bindegewebe sowie viele Autoimmunerkrankungen. Gerade bei seltenen Erkrankungen wie systemischem Lupus ist sie eine zentrale Anlaufstelle.',
    sections: [
      { h: 'Typische Anlässe', p: 'Gelenkschmerzen über mehrere Wochen, Morgensteifigkeit länger als 30 Minuten, geschwollene Gelenke, unerklärliche Müdigkeit mit Gelenkbeteiligung oder auffällige Entzündungswerte im Blut.' },
      { h: 'Der Weg dorthin', p: 'In der Regel überweist die Hausärztin oder der Hausarzt nach einer ersten Abklärung (Blutbild, Entzündungswerte). Bei Verdacht auf eine seltene rheumatologische Erkrankung kann ein spezialisiertes Zentrum sinnvoll sein.' },
      { h: 'Was du mitbringen solltest', p: 'Eine Liste deiner Beschwerden mit Beginn und Verlauf, bisherige Befunde und eine Aufstellung deiner Medikamente erleichtern die Einordnung.' },
    ],
  },
  {
    slug: 'wann-reicht-die-hausaerztin',
    title: 'Wann reicht die Hausärztin — und wann zur Fachärztin?',
    description: 'Die Hausärztin ist die erste Anlaufstelle und Lotsin im Gesundheitssystem. Wann sie ausreicht und wann eine Überweisung sinnvoll ist.',
    intro: 'In Österreich ist die Hausärztin oder der Hausarzt die erste Anlaufstelle für fast alle gesundheitlichen Fragen. Sie ordnet ein, behandelt vieles selbst und überweist gezielt weiter.',
    sections: [
      { h: 'Was hausärztlich gut aufgehoben ist', p: 'Akute Infekte, chronische Erkrankungen wie Bluthochdruck oder Diabetes, Vorsorge, Impfungen und die Koordination weiterer Schritte.' },
      { h: 'Wann eine Überweisung sinnvoll ist', p: 'Wenn eine fachärztliche Untersuchung, spezielle Diagnostik oder eine Zweitmeinung nötig ist. Bei unklaren, anhaltenden Beschwerden ist die Hausärztin der beste Startpunkt für die weitere Abklärung.' },
      { h: 'Die Lotsenfunktion bei seltenen Erkrankungen', p: 'Gerade bei seltenen Erkrankungen koordiniert die Hausärztin die oft lange Suche nach der richtigen Diagnose und vernetzt mit spezialisierten Zentren.' },
    ],
  },
  {
    slug: 'kassenarzt-wahlarzt-unterschied',
    title: 'Kassenarzt vs. Wahlarzt — der Unterschied einfach erklärt',
    description: 'Was Kassenarzt und Wahlarzt in Österreich unterscheidet, wie die Kostenrückerstattung funktioniert und worauf du achten solltest.',
    intro: 'In Österreich gibt es Ärztinnen und Ärzte mit Kassenvertrag und solche ohne (Wahlärzte). Der Unterschied betrifft vor allem die Abrechnung und deine Kosten.',
    sections: [
      { h: 'Kassenarzt', p: 'Hat einen Vertrag mit deiner Krankenkasse. Du zahlst in der Regel nichts direkt — die Abrechnung läuft über die e-card.' },
      { h: 'Wahlarzt', p: 'Hat keinen Kassenvertrag. Du bezahlst zunächst selbst und reichst die Honorarnote bei der Kasse ein. Erstattet werden rund 80 Prozent des Kassentarifs — nicht des tatsächlich bezahlten Betrags.' },
      { h: 'Worauf achten', p: 'Frage vorab nach den Kosten und kläre, welcher Anteil erstattet wird. Bei seltenen Erkrankungen kann ein Wahlarzt manchmal raschere Termine bieten — die Mehrkosten solltest du aber einplanen.' },
    ],
  },
  {
    slug: 'ueberweisung-oesterreich',
    title: 'Wie funktioniert eine Überweisung in Österreich?',
    description: 'Wann du eine Überweisung brauchst, wie lange sie gilt und wie der Weg zur Fachärztin oder ins Spezialzentrum abläuft.',
    intro: 'Eine Überweisung ist die Empfehlung deiner Ärztin an eine andere Fachrichtung. Sie steuert den Weg durch das Gesundheitssystem und ist für viele fachärztliche Leistungen nötig.',
    sections: [
      { h: 'Wann du eine brauchst', p: 'Für die meisten kassenärztlichen Fachärztinnen brauchst du eine Überweisung der Hausärztin. Ausnahmen sind unter anderem Gynäkologie, Augenheilkunde, Zahnmedizin und Kinderheilkunde.' },
      { h: 'Gültigkeit', p: 'Eine Überweisung gilt in der Regel für das laufende Quartal bzw. einen Monat ab Ausstellung, abhängig von der Kasse. Frag im Zweifel in der Ordination nach.' },
      { h: 'Der Weg ins Spezialzentrum', p: 'Für seltene Erkrankungen kann die Hausärztin oder Fachärztin in ein spezialisiertes Referenzzentrum überweisen. Bring alle bisherigen Befunde mit, das beschleunigt die Abklärung.' },
    ],
  },
  {
    slug: 'wann-rasch-medizinische-hilfe',
    title: 'Wann rasch medizinische Hilfe holen? Warnzeichen',
    description: 'Welche Symptome sofortige medizinische Aufmerksamkeit brauchen und welche Notrufnummern in Österreich gelten.',
    intro: 'Manche Anzeichen dulden keinen Aufschub. Im Zweifel gilt: lieber einmal zu viel Hilfe holen als zu spät.',
    sections: [
      { h: 'Sofort den Notruf wählen', p: 'Bei Atemnot, Brustschmerz, plötzlicher Lähmung, Sprach- oder Sehstörungen, Bewusstlosigkeit, starken Blutungen oder Hinweisen auf einen Schlaganfall: Notruf 144 (Rettung) oder 112 (Euronotruf).' },
      { h: 'Rasch ärztlich abklären', p: 'Hohes Fieber mit starkem Krankheitsgefühl, anhaltendes Erbrechen, plötzliche starke Schmerzen oder rasch fortschreitende Beschwerden gehören zeitnah ärztlich beurteilt.' },
      { h: 'Orientierung außerhalb der Ordinationszeiten', p: 'Die Gesundheitsberatung 1450 hilft rund um die Uhr bei der Einschätzung, wohin du dich mit deinen Beschwerden wenden solltest.' },
    ],
  },
]

export function getWissenArticle(slug: string): WissenArticle | undefined {
  return WISSEN_ARTICLES.find((a) => a.slug === slug)
}
