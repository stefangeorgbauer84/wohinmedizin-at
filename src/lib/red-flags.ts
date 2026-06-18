/**
 * Notfall-Warnzeichen — eine einzige Quelle für die clientseitige Vorabprüfung,
 * genutzt von Navigator UND WohinSuche. Bei einem Treffer wird sofort auf den
 * Notruf 144 hingewiesen; die Orientierung bleibt trotzdem erlaubt.
 *
 * Wichtig: Das ist KEINE Diagnose, sondern ein Sicherheitsnetz für offensichtliche
 * Notfallbegriffe, bevor jemand Zeit mit Recherche verliert.
 */
export const RED_FLAG_PATTERNS =
  /\b(atemnot|luftnot|ersticke|brustschmerz|herzinfarkt|schlaganfall|lähmung|gelähmt|bewusstlos|ohnmacht|krampfanfall|starke blutung|blute stark|vergiftung|suizid|selbstmord|sehverlust|plötzlich blind|nicht mehr sprechen)\b/i

export function isRedFlag(text: string): boolean {
  return RED_FLAG_PATTERNS.test(text)
}
