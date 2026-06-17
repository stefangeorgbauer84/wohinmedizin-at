/**
 * Serialisiert ein JSON-LD-Objekt sicher für die Einbettung in ein <script>-Tag.
 * Escaped `<`, damit ein `</script>` in dynamischen Werten (z.B. Krankheitsnamen)
 * nicht aus dem Skript-Kontext ausbrechen und XSS auslösen kann.
 */
export function jsonLdString(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}
