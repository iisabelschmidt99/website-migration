# Cloudflare einrichten – Anleitung (Fenyx)

Ziel: `fenyx-office.com` zu Cloudflare umziehen, damit Patrick seinen Analytics-Worker + Tracking aufsetzen kann. Am Ende braucht Patrick: **Zone ID + 2 API-Tokens**.

## ⚠️ Wichtig vorab
- Aktueller Stand: Registrar = **Squarespace** (ex-Google Domains), DNS = **Google Cloud DNS** (Nameserver `ns-cloud-d1…d4.googledomains.com`). Kein Cloudflare.
- Dieser Umzug betrifft die **DNS der Live-Seite (Webflow)**. Wenn die bestehenden Einträge nicht sauber übernommen werden, geht die **Live-Seite oder die E-Mail offline**. Deshalb Schritt 3 genau machen — am besten mit Patrick zusammen, der die Einträge gegenprüft.
- **Voraussetzung:** Zugriff auf das **Squarespace-Domain-Konto** (für die Nameserver-Änderung in Schritt 5). Falls das die Agentur hat → vorher Zugang holen oder sie die NS umstellen lassen.
- **Die Live-Seite bleibt auf Webflow.** Wir stellen nur die Nameserver um und legen eine Staging-Subdomain an — der öffentliche Umzug auf Netlify passiert erst beim Go-Live.

---

## Teil 1 – Cloudflare-Account & Zone (machst du)

1. **Account anlegen** auf [dash.cloudflare.com](https://dash.cloudflare.com) (Free-Plan reicht).
2. **„Add a site"** → `fenyx-office.com` eingeben → **Free**-Plan wählen.
3. **DNS-Einträge prüfen (kritisch):** Cloudflare scannt die bestehenden Einträge automatisch ein. Vergleiche die Liste mit der aktuellen Google-Cloud-DNS-Konfiguration und stelle sicher, dass **alle** übernommen sind, besonders:
   - die `A`/`CNAME`-Einträge für `www` und die Hauptdomain (zeigen auf **Webflow** → Live-Seite),
   - `MX`-Einträge (E-Mail!),
   - `TXT`-Einträge (SPF/DKIM für Mailversand),
   - alle weiteren Subdomains.
   Fehlende Einträge **manuell ergänzen**, bevor du weitermachst.
   - Tipp: Die Live-Webflow-Einträge zunächst auf **„DNS only" (graue Wolke)** stellen, nicht proxien (orange Wolke) — Webflow sitzt selbst schon hinter Cloudflare, doppeltes Proxying kann SSL-Probleme machen. Patrick kann das später feinjustieren.
4. Cloudflare zeigt dir jetzt **zwei eigene Nameserver** (z. B. `xena.ns.cloudflare.com` / `rick.ns.cloudflare.com`). Diese notieren.

## Teil 2 – Nameserver umstellen (im Squarespace-Domain-Konto)

5. In Squarespace → deine Domain → **DNS / Nameserver-Einstellungen** → **eigene Nameserver verwenden** → die vier Google-Nameserver durch die **zwei Cloudflare-Nameserver** aus Schritt 4 ersetzen, speichern.
6. **Warten:** Cloudflare schickt eine Mail, sobald die Domain **„Active"** ist (meist Minuten, kann bis 24 h dauern). Solange läuft die Seite normal weiter.

---

## Teil 3 – Was Patrick braucht (NACH Aktivierung)

### a) Zone ID
Cloudflare → `fenyx-office.com` → **Overview** → rechte Sidebar → **Zone ID** kopieren.

### b) Token A – Worker Deploy
Cloudflare → **My Profile → API Tokens → Create Token → Create Custom Token**:
- **Permissions:**
  - `Account` · **Workers Scripts** · **Edit**
  - `Zone` · **Workers Routes** · **Edit** (Workers Routes liegt bei Cloudflare unter Zone)
- **Account/Zone Resources:** auf das **Fenyx-Konto** bzw. die Zone **fenyx-office.com** beschränken.
- Erstellen → Token kopieren (wird nur einmal angezeigt).

### c) Token B – Analytics & AI-Crawler
Nochmal **Create Custom Token**:
- **Permissions:**
  - `Zone` · **Analytics** · **Read**
  - `Zone` · **Firewall Services** · **Edit**
- **Zone Resources:** Include → Specific zone → **fenyx-office.com**.
- Erstellen → Token kopieren.

### An Patrick schicken (sicher!)
Zone ID + Token A + Token B — über **Bitwarden Send** oder verschlüsselt, **nicht** offen per Chat/Mail (das sind geheime Schlüssel).

---

## Checkliste
- ☐ Cloudflare-Account angelegt, `fenyx-office.com` als Zone hinzugefügt
- ☐ Alle DNS-Einträge geprüft/übernommen (www, MX, SPF/DKIM, Subdomains) — Live-Einträge „DNS only"
- ☐ Nameserver in Squarespace auf Cloudflare umgestellt
- ☐ Cloudflare meldet „Active"
- ☐ Zone ID kopiert
- ☐ Token A (Worker Deploy) erstellt
- ☐ Token B (Analytics + Firewall) erstellt
- ☐ Zone ID + beide Tokens sicher an Patrick

> Empfehlung: Schritt 3 (DNS-Einträge) und 5 (Nameserver) am besten zusammen mit Patrick durchgehen — er kann vor/nach der Umstellung prüfen, dass Live-Seite und Mail weiterlaufen.
