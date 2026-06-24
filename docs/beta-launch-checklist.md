# WohinMedizin.at — Beta-Launch Checklist

---

## Tech & Deployment

### Vercel Setup
- [ ] Vercel Projekt angelegt und mit GitHub-Repo verbunden
- [ ] `NEXT_PUBLIC_SITE_URL=https://wohinmedizin.at` in Vercel Production gesetzt
- [ ] `DATABASE_URL` (Neon Postgres) in Vercel Production gesetzt (nicht in Preview)
- [ ] `RESEND_API_KEY` in Vercel Production gesetzt
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` in Vercel Production gesetzt
- [ ] `NEXT_PUBLIC_POSTHOG_HOST` in Vercel Production gesetzt (EU Region: `https://eu.posthog.com`)

### Domain & SSL
- [ ] Domain `wohinmedizin.at` auf Vercel zeigend (DNS A/CNAME-Einträge geprüft)
- [ ] SSL-Zertifikat aktiv und gültig (Vercel automatisch via Let's Encrypt)
- [ ] HTTPS erzwingt Redirect von HTTP (browser zeigt Lock-Icon)
- [ ] Test: `curl -I https://wohinmedizin.at/` → 200 OK

### Build & Runtime
- [ ] `npm run build` lokal erfolgreich ohne Fehler oder Warnungen
- [ ] Vercel Production Deployment erfolgreich durchgelaufen (grüner Haken)
- [ ] Vercel Preview Deployments aktiviert (für Future PRs)
- [ ] Build Timeout auf mindestens 60 Sekunden gesetzt (falls Standard zu kurz)

---

## Content-Check

### Wissen-Bereich
- [ ] Mindestens 10 Wissen-Artikel veröffentlicht (in Payload CMS published:true)
- [ ] Jeder Artikel hat: Titel, Slug, Content, Metadaten (SEO-Tags)
- [ ] Test: `/wissen` Seite zeigt alle 10+ Artikel

### Selten-Bereich
- [ ] Mindestens 5 seltene Erkrankungen mit vollständigen Daten in DB
- [ ] Jede Erkrankung hat: Name, Slug, Symptome, Zentrum-Verknüpfung, Metadaten
- [ ] Suche funktioniert: "Marfan" eingeben → Marfan-Syndrom in Ergebnissen
- [ ] Filter funktioniert: Zentren nach Region filterbar
- [ ] Detailseite funktioniert: `/selten/marfan-syndrom` öffnet mit allen Infos

### Spezialist:innen-Bereich
- [ ] Mindestens 5 Zentren mit vollständigen Daten eingegeben
- [ ] Jedes Zentrum hat: Name, Slug, Adresse, Telefon, E-Mail, ERN-Status, Spezialisierungen
- [ ] Filter nach ERN-Status funktioniert
- [ ] Filter nach Region (Wien, Linz, Graz, etc.) funktioniert
- [ ] Detailseite funktioniert: `/spezialistinnen/zentrum-slug` öffnet und zeigt alle Infos

### Navigator-Bereich
- [ ] Navigator Logik implementiert und getestet
- [ ] Navigator gibt sinnvolle Ergebnisse aus
- [ ] Navigator macht klar, dass es KEINE medizinische Diagnose ist

### Partner-Bereich
- [ ] Partner-Seite existiert und ist öffentlich erreichbar
- [ ] Partner-Formular functional: Name, E-Mail, Nachricht, Submit-Button
- [ ] Formular validiert Eingaben (E-Mail-Format)
- [ ] Formular sendet E-Mail an: partner@wohinmedizin.at
- [ ] Formular zeigt Bestätigung: "Danke, wir melden uns bald"

### Rechtliche Seiten
- [ ] Impressum vollständig: Name/Adresse GF, E-Mail, Telefon, UID (falls Firma)
- [ ] Datenschutzerklärung aktuell und vollständig
  - [ ] PostHog erwähnt (Analytics-Tool, EU-Region)
  - [ ] Resend erwähnt (E-Mail-Versand)
  - [ ] Cookie-Policy (falls Cookies gesetzt werden)
  - [ ] Nutzerrechte (Auskunft, Löschung, Portabilität)
- [ ] Transparenz-Seite (Quellen, Mediziner, Datenstand)

---

## SEO & Technical

### Sitemap & Robots
- [ ] `https://wohinmedizin.at/robots.txt` erreichbar und nicht blockierend
- [ ] `https://wohinmedizin.at/sitemap.xml` erreichbar
- [ ] Sitemap enthält mindestens 100 Einträge (alle Artikel, Zentren, Erkrankungen)
- [ ] Sitemap hat `<lastmod>` Zeitstempel
- [ ] Test: `curl https://wohinmedizin.at/sitemap.xml | grep -c "<url>"` → min. 100

### Meta Tags & OG-Tags
- [ ] Jede Hauptseite hat: `<title>`, `<meta name="description">`
- [ ] Canonical Tag auf allen Seiten gesetzt
- [ ] OG-Tags auf Hauptseiten:
  - [ ] Homepage
  - [ ] Wissen-Index
  - [ ] Selten-Index
  - [ ] Spezialist:innen-Index
  - [ ] Partner-Seite
- [ ] OG Image Tag (Social-Media Preview)

### Google Search Console
- [ ] Google Search Console Projekt erstellt
- [ ] Eigentumsverifizierung durchgeführt (DNS/HTML-Tag/Google Analytics)
- [ ] Sitemap eingereicht: XML Sitemap URL hinzugefügt
- [ ] Mobile-Usability prüfen (sollte 0 Fehler haben)

---

## Funktionstest (Manuell oder E2E)

### Selten-Bereich Flow
- [ ] `/selten` öffnet und zeigt Suchfeld
- [ ] Suche "Marfan" eingeben → Marfan-Syndrom in Ergebnissen
- [ ] Auf Ergebnis klicken → `/selten/marfan-syndrom` lädt
- [ ] Detailseite zeigt: Symptome, Zentren, Links, Metadaten
- [ ] "Zurück" Button funktioniert

### Spezialist:innen Flow
- [ ] `/spezialistinnen` öffnet und zeigt Filter + Liste
- [ ] Filter "ERN" wählen → nur ERN-Zentren angezeigt
- [ ] Filter "Wien" wählen → nur Wien-Zentren angezeigt
- [ ] Auf Zentrum klicken → Detailseite mit allen Infos öffnet
- [ ] Kontaktbutton (Telefon/E-Mail) funktioniert

### Navigator Flow
- [ ] `/navigator` öffnet
- [ ] Fragen werden nacheinander gestellt
- [ ] Navigator zeigt Ergebnis mit Anlaufstellen
- [ ] Disclaimer "keine Diagnose" ist sichtbar
- [ ] Zurück-Navigation funktioniert

### Partner-Formular Flow
- [ ] `/partner` öffnet
- [ ] Formular-Felder: Name (Text), E-Mail (E-Mail), Nachricht (Textarea)
- [ ] Formular ohne Eingaben submitten → Validierungsfehler zeigen
- [ ] Gültige Eingaben → Submit erfolgreich
- [ ] E-Mail erhält an partner@wohinmedizin.at
- [ ] Bestätigungsmeldung angezeigt

### Feedback-Widget Flow
- [ ] Feedback-Widget auf jeder Seite sichtbar (unten rechts)
- [ ] Auf Smiley oder Rating klicken → Widget-Form öffnet
- [ ] Optional-Nachricht eingeben + Smiley 4–5 (zufrieden) wählen
- [ ] Submit → E-Mail erhält (oder in Datenbank gespeichert)
- [ ] Bestätigungsmeldung angezeigt

### Mobile-Responsive Test
- [ ] Alle Seiten auf 390px (iPhone SE) brauchbar
- [ ] Navigation responsive (Hamburger-Menü oder Stack-Layout)
- [ ] Formen touchbar und nicht zu klein
- [ ] Bilder responsive und nicht übergroß
- [ ] Test mit Chrome DevTools: Device Emulation → iPhone SE

### Performance & Ladezeiten
- [ ] Lighthouse Score: mindestens 80 auf Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Test: `npm run build` → `npx lighthouse https://wohinmedizin.at`

---

## Rechtliches (Österreich/DSGVO)

### Heilmittelwerbegesetz (HWG)
- [ ] Kein Diagnoseversprechen auf Navigator, Selten, oder Spezialist:innen
- [ ] Kein "Garantie auf Heilung" irgendwo
- [ ] Impressum mit Gf, Adresse, UID sichtbar
- [ ] Disclaimer auf Navigator: "Dies ist keine medizinische Diagnose"

### DSGVO
- [ ] Datenschutzerklärung aktuell (alle Tools aufgelistet)
- [ ] PostHog Configuration: `persistence: 'memory'` (kein Cookie-Banner nötig)
- [ ] Resend API Key secure (nicht in .env.example, nur in Vercel)
- [ ] Nutzer-Rechte dokumentiert (Auskunft, Löschung, Widerspruch)

### Österreich-spezifisch
- [ ] Barrierefreiheitsgesetz AT: WCAG 2.1 AA angestrebt
- [ ] Test: `axe DevTools` oder `axe-core` auf Startseite → sollte 0 Critical Errors haben

---

## E-Mail Setup (Resend)

### Resend Domain Verifizierung
- [ ] Resend Account erstellt
- [ ] Domain `wohinmedizin.at` in Resend hinzugefügt
- [ ] DNS TXT/MX Records gesetzt (Resend zeigt genau welche)
- [ ] Verifikation bestätigt (grüner Haken in Resend Dashboard)
- [ ] Test E-Mail versandt (curl oder Resend API Test)

### E-Mail Sender
- [ ] `From` Adresse: `noreply@wohinmedizin.at` oder `info@wohinmedizin.at`
- [ ] Test: E-Mail-Template für Partner-Formular getestet
- [ ] Test: E-Mail-Template für Feedback Widget getestet
- [ ] E-Mails landen in Inbox (nicht Spam)

---

## Analytics & Monitoring

### PostHog Setup
- [ ] PostHog Account erstellt
- [ ] EU Region gewählt (für DSGVO Compliance)
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` und `NEXT_PUBLIC_POSTHOG_HOST` in .env.production
- [ ] PostHog Initialization im Root Layout getestet
- [ ] Dashboard: Erste Pageviews sichtbar nach Launch
- [ ] Events getestet: Pageviews, Button Clicks (mindestens 5 Seiten)

### Vercel Analytics
- [ ] Vercel Analytics aktiviert (Pro Plan)
- [ ] Analytics Dashboard zeigt: Pageviews, Core Web Vitals, Edge Requests
- [ ] Vercel Build Fehler Alerts eingerichtet (Slack oder E-Mail)

### Fehlertracking
- [ ] Error-Handling auf Form-Submits (try/catch + Toast)
- [ ] Error-Handling auf API-Calls (Database, Resend)
- [ ] Vercel Build-Logs prüfen auf Warnings

---

## Pre-Launch Smoke Tests

### Happy Path: Neue User
1. [ ] User öffnet Homepage
2. [ ] User nutzt Navigator (1–2 Fragen)
3. [ ] Navigator zeigt Ergebnis mit Links
4. [ ] User klickt auf "Mehr über Erkrankung"
5. [ ] Detailseite öffnet mit Zentren
6. [ ] User sendet Feedback-Widget
7. [ ] Bestätigung angezeigt

### Datenbank-Konnektivität
- [ ] Selten-Suche funktioniert (abfrage aus Neon DB)
- [ ] Spezialist:innen Filter funktioniert (abfrage aus Neon DB)
- [ ] Detailseiten laden (Zentrum, Artikel)
- [ ] Neon Console: aktive Connections prüfen (sollte < 20 sein)

### E-Mail-Versand
- [ ] Partner-Formular absenden → E-Mail bei partner@wohinmedizin.at ankommt
- [ ] Feedback Widget absenden (mit Nachricht) → E-Mail ankommt
- [ ] E-Mails haben korrekte Absenderadresse, nicht im Spam

---

## Launch-Tag Checkliste (30 Minuten vor Go-Live)

- [ ] Vercel Production Deployment grün
- [ ] DNS propagiert (TTL 3600 Sekunden, max 24h)
- [ ] Alle Vercel Env Vars gesetzt und gültig
- [ ] PostHog Dashboard live und erste Events sichtbar
- [ ] Resend API Key funktioniert (Test-E-Mail versandt)
- [ ] Hauptseite öffnet: `https://wohinmedizin.at` → 200 OK
- [ ] Sitemap abrufbar: `https://wohinmedizin.at/sitemap.xml` → 200 OK
- [ ] Google Search Console Sitemap eingereicht
- [ ] Announce via LinkedIn, E-Mail an Partners

---

## Post-Launch Monitoring (7 Tage)

- [ ] Täglich Vercel Build Logs prüfen (0 Fehler)
- [ ] PostHog Events prüfen: Pageviews, Conversions
- [ ] Feedback Widget Nachrichten prüfen (Trend positiv?)
- [ ] Partner-E-Mails prüfen (landen alle?)
- [ ] Lighthouse Score täglich prüfen (sollte nicht < 75 fallen)
- [ ] Google Search Console: neue URLs crawlbar?
- [ ] Vercel Edge Requests prüfen auf Spikes oder Fehler

---

## Notizen

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

**Launch Genehmigung erteilt am:** ___________________

**Freigegeben durch:** ___________________________________
