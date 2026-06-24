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
  {
    slug: 'was-ist-eine-seltene-erkrankung',
    title: 'Was ist eine seltene Erkrankung? Definition und Zahlen in Österreich',
    description: 'Wann gilt eine Erkrankung als "selten", wie viele Menschen betrifft das in Österreich und was bedeutet ORPHA-Code?',
    intro: 'Als selten gilt in der EU eine Erkrankung, wenn weniger als 5 von 10.000 Menschen betroffen sind. In Österreich leben dennoch rund 400.000 bis 500.000 Menschen mit einer seltenen Erkrankung.',
    sections: [
      { h: 'Die EU-Definition', p: 'Weniger als 5 Betroffene auf 10.000 Einwohner. Bei über 11.000 bekannten seltenen Erkrankungen ist das trotzdem eine riesige Gruppe von Menschen.' },
      { h: 'ORPHA-Codes: das Ordnungssystem', p: 'Orphanet ist die europäische Referenzdatenbank. Jede seltene Erkrankung erhält einen ORPHA-Code — vergleichbar mit einer Postleitzahl. Diesen Code kennen Spezialzentren und Labore; er erleichtert die Kommunikation zwischen Ärztinnen.' },
      { h: 'Anlaufstellen in Österreich', p: 'Das Koordinationszentrum für seltene Erkrankungen (KOORDINA) am AKH Wien ist die zentrale österreichische Anlaufstelle. Viele Universitätskliniken führen Spezialambulanzen für einzelne Erkrankungsgruppen.' },
    ],
  },
  {
    slug: 'diagnose-seltene-erkrankung-oesterreich',
    title: 'Wie bekommt man eine Diagnose bei seltenen Erkrankungen?',
    description: 'Die Diagnose bei seltenen Erkrankungen dauert im Schnitt 4 bis 6 Jahre. Welche Wege verkürzen diesen Weg in Österreich?',
    intro: 'Seltene Erkrankungen sind häufig unerkannt — nicht weil Ärztinnen unaufmerksam sind, sondern weil jede einzelne Erkrankung so selten ist, dass kaum jemand sie aus eigener Erfahrung kennt.',
    sections: [
      { h: 'Der erste Schritt: Hausärztin oder Hausarzt', p: 'Die Hausärztin ist die wichtigste erste Anlaufstelle. Sie dokumentiert Beschwerden über Zeit, veranlasst Basisdiagnostik und überweist gezielt. Ein strukturiertes Beschwerdetagebuch hilft dabei enorm.' },
      { h: 'Spezialisierte Zentren', p: 'Österreich hat mehrere ERN-Mitgliedszentren (Europäische Referenznetzwerke). Diese sind auf bestimmte Erkrankungsgruppen spezialisiert und arbeiten europaweit vernetzt.' },
      { h: 'Genetische Diagnostik', p: 'Bei Verdacht auf eine genetische seltene Erkrankung kann ein Humangenetiker eine gezielte Paneldiagnostik oder Exom-Sequenzierung veranlassen. Einige Kassen übernehmen diese Kosten nach Überweisung.' },
      { h: 'Patientenorganisationen als Wegweiser', p: 'Viele österreichische Patientenorganisationen kennen die besten Anlaufstellen für ihre Erkrankung. Eine Kontaktaufnahme dort — auch ohne Diagnose — kann den richtigen Weg zeigen.' },
    ],
  },
  {
    slug: 'ern-referenznetzwerke-oesterreich',
    title: 'Europäische Referenznetzwerke (ERN): Österreichische Mitgliedszentren',
    description: 'Was die EU-weiten ERN-Netzwerke für seltene Erkrankungen bedeuten und welche österreichischen Kliniken Mitglied sind.',
    intro: 'Die Europäischen Referenznetzwerke (ERN) sind virtuelle Netzwerke hoch spezialisierter Zentren aus der ganzen EU. Sie bündeln Expertise, die in einem einzelnen Land nicht ausreicht.',
    sections: [
      { h: 'Was ein ERN-Zentrum bedeutet', p: 'ERN-Mitgliedszentren haben nachgewiesene Expertise, Fallzahlen und Ausstattung für bestimmte Erkrankungsgruppen. Die Aufnahme ist an strenge Kriterien geknüpft.' },
      { h: 'Österreichische ERN-Mitglieder', p: 'Das AKH Wien, die Medizinische Universität Wien, das LKH Graz und das Kinderspital Linz sind in verschiedenen ERN-Netzwerken vertreten — von seltenen neurologischen bis zu metabolischen Erkrankungen.' },
      { h: 'Wie du von einem ERN-Zentrum profitierst', p: 'Über das Clinical Patient Management System (CPMS) können Ärztinnen anonymisierte Patientendaten einem europaweiten Expertengremium vorlegen. Eine Überweisung ans ERN-Zentrum stellt in der Regel die behandelnde Ärztin.' },
    ],
  },
  {
    slug: 'patientenorganisationen-seltene-erkrankungen-oesterreich',
    title: 'Patientenorganisationen bei seltenen Erkrankungen in Österreich',
    description: 'Warum Selbsthilfegruppen und Patientenorganisationen bei seltenen Erkrankungen oft mehr wissen als Lehrbücher — und wie man sie findet.',
    intro: 'Wer mit einer seltenen Erkrankung lebt, ist oft selbst zur Expertin oder zum Experten geworden. Patientenorganisationen bündeln dieses Wissen und helfen bei Diagnose, Versorgung und Alltagsfragen.',
    sections: [
      { h: 'Was Patientenorganisationen leisten', p: 'Sie kennen die besten Spezialzentren, begleiten bei Behördengängen, vernetzen Betroffene und vertreten Interessen gegenüber Politik und Krankenkassen.' },
      { h: 'Wie man eine findet', p: 'Über Orphanet, EURORDIS oder die Selbsthilfe Österreich lassen sich organisierte Gruppen finden. Auf jeder Erkrankungsseite von WohinMedizin.at sind passende österreichische Organisationen verknüpft.' },
      { h: 'Wenn es noch keine gibt', p: 'Für sehr seltene Erkrankungen gibt es manchmal keine eigene österreichische Organisation. Europäische Gruppen — z.B. unter dem EURORDIS-Dach — können trotzdem wertvolle Anlaufstellen sein.' },
    ],
  },
  {
    slug: 'chromosomenanomalien-erklaert',
    title: 'Chromosomenanomalien: Was steckt dahinter?',
    description: 'Trisomie, Deletion, Duplikation — was Chromosomenanomalien sind, wie sie entstehen und was sie bedeuten.',
    intro: 'Chromosomenanomalien entstehen, wenn die Anzahl oder Struktur der Chromosomen verändert ist. Viele zählen zu den seltenen Erkrankungen und sind genetisch bedingt.',
    sections: [
      { h: 'Arten von Anomalien', p: 'Numerische Anomalien wie das Down-Syndrom (Trisomie 21) bedeuten eine Chromosom-Zahl von 47 statt 46. Strukturelle Anomalien wie Deletionen (fehlende Abschnitte) oder Duplikationen (doppelte Abschnitte) können sehr selten und individuell sein.' },
      { h: 'Wie sie entstehen', p: 'Meist entstehen Chromosomenanomalien durch Fehler bei der Zellteilung — zufällig, ohne erkennbaren Auslöser. Viele sind nicht erblich.' },
      { h: 'Diagnostik und nächste Schritte', p: 'Eine Humangenetikerin oder ein Humangenetiker kann durch Chromosomenanalyse oder Array-CGH eine Anomalie nachweisen. Anschließend folgt eine Beratung zu Prognose, Förderung und Unterstützungsangeboten.' },
    ],
  },
  {
    slug: 'seltene-erkrankungen-kinder-oesterreich',
    title: 'Seltene Erkrankungen bei Kindern: Anlaufstellen in Österreich',
    description: 'Die meisten seltenen Erkrankungen zeigen sich in der Kindheit. Welche Kindermedizin-Zentren in Österreich spezialisiert sind.',
    intro: 'Rund 70 Prozent aller seltenen Erkrankungen beginnen in der Kindheit. Pädiatrische Spezialzentren sind deshalb die wichtigsten Anlaufstellen für betroffene Familien.',
    sections: [
      { h: 'Kinderkliniken mit Spezialkompetenz', p: 'Das Universitätsklinikum für Kinder- und Jugendheilkunde Wien (AKH), die Kinderklinik Graz und das Kepler Universitätsklinikum Linz bieten pädiatrische Spezialambulanzen für viele seltene Erkrankungsgruppen.' },
      { h: 'Der Übergang ins Erwachsenenalter', p: 'Die "Transition" — der Wechsel von pädiatrischen zu Erwachsenen-Zentren — ist ein kritischer Moment. Spezialisierte Übergangs-Kliniken begleiten diesen Schritt strukturiert.' },
      { h: 'Unterstützung für Familien', p: 'Organisationen wie viele Selbsthilfegruppen unterstützen Familien nicht nur medizinisch, sondern auch bei Alltagsfragen, Behördengängen und emotionaler Begleitung.' },
    ],
  },
  {
    slug: 'seltene-erkrankungen-finanzielle-unterstuetzung',
    title: 'Finanzielle Unterstützung bei seltenen Erkrankungen in Österreich',
    description: 'Pflegegeld, erhöhte Familienbeihilfe, Härtefallfonds und Sachleistungen — welche Unterstützung Betroffenen zusteht.',
    intro: 'Seltene Erkrankungen bedeuten oft erhöhten Pflegebedarf, teure Medikamente und Therapien oder behinderungsbedingte Mehrkosten. Österreich bietet mehrere Unterstützungssysteme.',
    sections: [
      { h: 'Pflegegeld', p: 'Ab einem Pflegebedarf von mehr als 65 Stunden im Monat steht Pflegegeld zu — in 7 Stufen. Die Einstufung erfolgt durch den Medizinischen Dienst der Krankenkasse.' },
      { h: 'Erhöhte Familienbeihilfe', p: 'Familien mit erheblich behinderten Kindern erhalten erhöhte Familienbeihilfe — unabhängig vom Einkommen — plus den Kinderabsetzbetrag.' },
      { h: 'Härtefallfonds und Krankenkasse', p: 'Für teure Orphan Drugs (Arzneimittel für seltene Erkrankungen) gibt es Sonderregelungen der Krankenkassen und einen Härtefallfonds beim BMSGPK. Eine Sozialberatung der jeweiligen Patientenorganisation kennt die aktuellen Wege.' },
    ],
  },
  {
    slug: 'lange-diagnoseodyssee-was-tun',
    title: 'Lange Diagnoseodyssee — was tun, wenn Ärzte nicht weiterkommen?',
    description: 'Wenn Beschwerden seit Jahren ungeklärt sind: konkrete nächste Schritte, Zweitmeinungen und spezialisierte Anlaufstellen in Österreich.',
    intro: 'Die durchschnittliche Diagnoseodyssee bei seltenen Erkrankungen dauert 4 bis 6 Jahre. Das ist kein Versagen — es liegt an der Seltenheit dieser Erkrankungen. Aber es gibt Wege, diesen Weg zu verkürzen.',
    sections: [
      { h: 'Symptomtagebuch führen', p: 'Schreibe täglich Symptome, Schweregrad, Trigger und Verlauf auf. Ein strukturiertes Tagebuch über mehrere Monate hilft Spezialzentren bei der Einordnung enorm.' },
      { h: 'Zweitmeinung einholen', p: 'Eine Zweitmeinung — im Idealfall an einem Universitätsklinikum oder ERN-Zentrum — ist kein Vertrauensbruch gegenüber der bisherigen Ärztin. In Österreich ist sie als Patient:in ausdrücklich möglich.' },
      { h: 'KOORDINA-Zentrum anfragen', p: 'Das Koordinationszentrum für seltene Erkrankungen am AKH Wien (KOORDINA) hilft explizit bei ungeklärten Fällen — auch ohne vollständige Diagnose. Die Überweisung erfolgt durch die Hausärztin.' },
      { h: 'Patientenorganisationen früh einbeziehen', p: 'Auch ohne Diagnose kann eine thematisch passende Patientenorganisation erfahrungsbasierte Hinweise geben, welche Zentren und Tests relevant sein könnten.' },
    ],
  },
]

export function getWissenArticle(slug: string): WissenArticle | undefined {
  return WISSEN_ARTICLES.find((a) => a.slug === slug)
}
