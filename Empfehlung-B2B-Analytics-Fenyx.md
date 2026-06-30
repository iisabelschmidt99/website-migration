# Empfehlung: B2B-Ausbau des Fenyx-Analytics-Systems

**Erstellt für:** Fenyx GmbH
**Thema:** Weiterentwicklung der Website-Analyse in Richtung B2B-Vertriebsintelligenz
**Stand:** Juni 2026

---

## 1. Ausgangslage

Die Website `fenyx-office.de` (Staging: `fenyx-office.netlify.app`) verfügt bereits über ein **zweigleisiges Analyse-System**, das datenschutzkonform aufgebaut ist:

- **System A – Eigenes, cookieloses Tracking (First-Party):**
  Misst Besuche, Seitenaufrufe, Klickwege, Scrolltiefe, Kontaktanfragen und technische Performance (Core Web Vitals) – **ohne Cookies und ohne Gerätespeicherung**. Läuft unabhängig von der Cookie-Einwilligung und ist live bestätigt.
- **System B – Google Tag Manager / Google Analytics (einwilligungsbasiert):**
  Lädt **ausschließlich nach aktiver Zustimmung** über das Cookie-Banner und dient dem klassischen Marketing-Reporting und Retargeting.

Zusätzlich werden eingehende Besuche bereits am Server (Cloudflare) angereichert: **Land, Bundesland/Region, technischer Standort des Rechenzentrums, Netzbetreiber-Kennung (ASN), Verbindungstyp und eine Bot-Einstufung.**

**Wichtig:** Das heutige System beantwortet sehr gut die Frage *„Wie viele Personen waren auf der Seite und was haben sie getan?“* – aber noch nicht die für den B2B-Vertrieb entscheidende Frage *„Welche **Unternehmen** mit welcher **Kaufabsicht** waren auf der Seite?“*. Genau hier setzt diese Empfehlung an.

---

## 2. Warum ein B2B-Fokus für Fenyx besonders sinnvoll ist

Fenyx verkauft keine Produkte über einen Online-Warenkorb, sondern gewinnt **hochwertige Projektkunden** für nachhaltige Bürotransformation – belegt durch Referenzen wie **SIGNAL IDUNA, Universal Music Group, The Nunatak Group, Reneo Group** und **The Delta Campus**.

Daraus ergeben sich drei Besonderheiten, die das Standard-Webtracking nicht abbildet:

1. **Lange, mehrstufige Entscheidungswege.** Ein Bürofläche-Projekt entsteht nicht in einer Sitzung. Die gleiche Einkaufsabteilung besucht die Seite über Wochen mehrfach.
2. **Wenige, aber sehr wertvolle Leads.** Eine einzige Standortauflösung (z. B. 4.500 Möbelstücke wie bei SIGNAL IDUNA) wiegt hunderte anonyme Besuche auf. Es geht um **Lead-Qualität**, nicht um Reichweite.
3. **Klare Zielsegmente.** Die Seite adressiert bereits explizit **Großunternehmen, Mittelstand, Start-up/Scale-up und Co-Working-Spaces** – sowie drei Leistungsbereiche (Bestandsmanagement, Verwertung, Einrichtung) mit jeweils festen Ansprechpartnern (Anina, Thomas, Marius).

**Ziel der folgenden Maßnahmen:** anonyme Besuche in **firmen- und absichtsbezogene Vertriebshinweise** verwandeln – damit das Team weiß, *welche Art von Unternehmen* sich *für welche Leistung* interessiert und *wie heiß* der Kontakt ist.

---

## 3. Empfohlene Maßnahmen

### Maßnahme 1 — Firmenerkennung aus dem Netzbetreiber (Quick Win)

**Was:** Wir lesen zusätzlich die bereits vorhandene Netzwerk-Organisation (`asOrganization`) aus. Damit lässt sich oft unterscheiden, ob ein Besuch aus einem **Firmennetz** (z. B. „BMW AG“) oder über einen **Privatanschluss** (z. B. „Deutsche Telekom“, „Vodafone“) kommt.

**Warum für Fenyx:** Besuche aus Firmennetzen sind potenzielle Projektkunden. Private Provider lassen sich herausfiltern, sodass das Vertriebsteam die **geschäftlich relevanten Besuche** zuerst sieht.

**Aufwand:** Sehr gering (Erweiterung des bestehenden Cloudflare-Bausteins, keine neuen Dienstleister, keine Kosten).
**Datenschutz:** Unkritisch – es wird nur der Name des Netzbetreibers gespeichert, keine personenbezogenen Daten.
**Grenze:** Mitarbeitende im Homeoffice erscheinen unter ihrem Privatanbieter; die Abdeckung ist also nicht vollständig, aber ohne Zusatzkosten wertvoll.

---

### Maßnahme 2 — Unternehmensauflösung über einen DACH-konformen Anbieter (Ausbaustufe)

**Was:** Anbindung eines spezialisierten Dienstes, der besuchende Unternehmen anhand ihrer IP-Adresse **namentlich** identifiziert und mit Firmendaten (Branche, Größe, Standort) anreichert.

**Warum für Fenyx:** Das ist der eigentliche B2B-Hebel: Statt „37 anonyme Besucher aus Hamburg“ sieht der Vertrieb „Versicherung X aus Hamburg hat dreimal die Verwertungsseite besucht“. Genau das Vorgehen, mit dem im B2B-Vertrieb aktiv Leads erschlossen werden.

**Empfehlung:** **Dealfront** (vormals Leadfeeder + Echobot). Deutsches/EU-Unternehmen, EU-Hosting, ausdrücklich für die DSGVO und den deutschen Mittelstand konzipiert – der für Fenyx passende, rechtssichere Anbieter (gegenüber US-Lösungen wie Clearbit).

**Aufwand:** Mittel (kostenpflichtiges Abo + Einrichtung).
**Datenschutz:** Erfordert sorgfältige Umsetzung (Auftragsverarbeitung, Datenschutzhinweis). Bei firmenbezogener Auswertung über einen EU-Anbieter im B2B gut vertretbar.

---

### Maßnahme 3 — Geschäftliche vs. private E-Mail bei Anfragen (Quick Win)

**Was:** Bei jeder Kontaktanfrage automatisch erkennen, ob eine **geschäftliche Domain** (`@unternehmen.de`) oder ein **Freemail-Anbieter** (`@gmail.com`, `@gmx.de` …) verwendet wurde.

**Warum für Fenyx:** Eine Anfrage von einer Firmen-Domain ist ein deutlich stärkeres Kaufsignal. Zusätzlich lässt sich aus der Domain – analog zu Maßnahme 2 – das Unternehmen anreichern. Die E-Mail-Domain ist dabei ein verlässlicheres Firmenmerkmal als die IP-Adresse.

**Aufwand:** Gering.
**Datenschutz:** Erfolgt erst nach aktiver Kontaktaufnahme durch den Nutzer (berechtigtes Interesse, Anfrage).

---

### Maßnahme 4 — Kaufabsicht-Bewertung („Intent Score“) (Quick Win bis Mittel)

**Was:** Jede Besuchssitzung erhält automatisch eine Bewertung der Kaufabsicht – auf Basis von Verhalten, das wir bereits erfassen. Heute unterscheiden wir Sitzungen schon in *abgesprungen / interessiert / kaufabsicht / Lead*. Diese Logik schärfen wir B2B-spezifisch:

- **Themenbreite:** Wer Bestandsmanagement **und** Verwertung **und** Einrichtung ansieht, ist ein Kandidat für eine Komplett-Transformation (höchster Wert).
- **Entscheidungs-Seiten:** Referenzen, „Zum Projekt", Büromöbel mieten und Standort-Landingpages werden stärker gewichtet als Blog-/Ratgeber-Seiten.
- **Segment-Signal:** Besuche der Seiten *Großunternehmen / Mittelstand / Start-up / Co-Working* zeigen dem Vertrieb direkt das passende Segment und Pitch.
- **Wiederkehr:** Mehrfachbesuche desselben Firmennetzes innerhalb weniger Tage = heißer Kontakt.

**Warum für Fenyx:** Der Vertrieb kann seine Zeit gezielt auf die heißesten Sitzungen konzentrieren, statt alle Besuche gleich zu behandeln.

**Aufwand:** Gering bis mittel (nutzt vorhandene Daten, keine neuen Dienstleister).
**Datenschutz:** Unkritisch – rein verhaltensbasiert, anonym.

---

### Maßnahme 5 — LinkedIn & B2B-Werbekanäle (einwilligungsbasiert)

**Was:** Einbindung des **LinkedIn Insight Tags** sowie optional **Microsoft/Bing-Tracking** über den bestehenden Tag Manager – aktiviert ausschließlich nach Marketing-Einwilligung.

**Warum für Fenyx:** LinkedIn ist im B2B der wichtigste Kanal, um Entscheider gezielt erneut anzusprechen (Retargeting) und passende Zielgruppen (Branche, Funktion, Unternehmensgröße) aufzubauen. Bing erreicht zudem überdurchschnittlich oft ältere Entscheider-Profile.

**Aufwand:** Gering (Konfiguration im Tag Manager).
**Datenschutz:** Strikt einwilligungsbasiert, wie das bestehende GTM-Setup.

---

### Maßnahme 6 — Anbindung an das CRM / HubSpot (Ausbaustufe)

**Was:** Die anonyme Customer Journey (welche Seiten, welche Leistungen, wie oft) wird beim Absenden des Kontaktformulars an den entstehenden Datensatz im CRM angehängt.

**Warum für Fenyx:** Der Vertrieb sieht beim ersten Kontakt nicht nur Name und Nachricht, sondern den **gesamten Weg davor** – etwa „hat zweimal die Standortauflösung-Seite und die SIGNAL-IDUNA-Referenz angesehen". Das verkürzt die Qualifizierung und verbessert das Erstgespräch.

**Aufwand:** Mittel (Abhängig vom genutzten CRM/HubSpot-Setup).
**Datenschutz:** Erfolgt im Rahmen der Anfrage; sauber dokumentierbar.

---

## 4. Datenschutz (DSGVO) – Leitplanken

Alle Vorschläge sind so gewählt, dass sie zum bestehenden, bewusst datensparsamen Konzept passen:

- **Maßnahmen 1, 3, 4** sind ohne personenbezogene Daten bzw. erst nach aktiver Nutzeranfrage umsetzbar – **unkritisch**.
- **Maßnahme 5** läuft **nur mit Einwilligung** (wie das heutige GTM).
- **Maßnahmen 2 und 6** benötigen einen Auftragsverarbeitungsvertrag und einen ergänzten Datenschutzhinweis; mit einem **EU-Anbieter wie Dealfront** im B2B-Kontext gut vertretbar.
- Bewusst **nicht** empfohlen: das Speichern punktgenauer Standortdaten (Koordinaten, Postleitzahl) auf Einzelbesuch-Ebene – datenschutzrechtlich heikel und für die Vertriebssteuerung nicht nötig.

---

## 5. Priorisierung & Roadmap

| Prio | Maßnahme | Nutzen | Aufwand | Kosten | Datenschutz |
|------|----------|--------|---------|--------|-------------|
| 1 | Firmenerkennung Netzbetreiber | Firmennetze sichtbar | Sehr gering | Keine | Unkritisch |
| 2 | Geschäftliche vs. private E-Mail | Stärkeres Lead-Signal | Gering | Keine | Unkritisch |
| 3 | Kaufabsicht-Bewertung (Intent Score) | Vertrieb priorisieren | Gering–mittel | Keine | Unkritisch |
| 4 | LinkedIn / Bing (einwilligungsbasiert) | B2B-Retargeting | Gering | Werbebudget | Mit Einwilligung |
| 5 | Unternehmensauflösung (Dealfront) | Namentliche Firmen-Leads | Mittel | Abo | AV-Vertrag nötig |
| 6 | CRM-/HubSpot-Anbindung | Bessere Erstgespräche | Mittel | Je nach Setup | Im Rahmen der Anfrage |

**Empfohlener Einstieg:** Maßnahmen 1–3 zuerst umsetzen. Sie sind **kostenfrei, datenschutzkonform und sofort wirksam**, ohne neue Dienstleister. Anschließend Maßnahme 4 (LinkedIn) sowie – bei Budgetfreigabe – Maßnahme 5 (Dealfront) als großen Hebel für namentliche Firmen-Leads.

---

## 6. Zusammenfassung

Das Fenyx-Analyse-System ist technisch solide und datenschutzkonform aufgesetzt. Der nächste Entwicklungsschritt ist der Wandel von reiner Besucher-**Statistik** hin zu echter **Vertriebsintelligenz**: erkennen, **welche Unternehmen** sich **für welche Leistung** interessieren und **wie hoch die Kaufabsicht** ist. Die ersten drei Maßnahmen liefern diesen Mehrwert kostenfrei und ohne datenschutzrechtliche Hürden – ein risikoarmer Einstieg mit unmittelbarem Nutzen für den Vertrieb.
