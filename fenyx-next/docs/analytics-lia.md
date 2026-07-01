# Legitimate Interest Assessment — Cookieless Analytics

Stand: Juni 2026. Technische Arbeitsgrundlage, keine Rechtsberatung.

## Zweck

Fenyx misst Reichweite, Seitenqualität und Lead-Funnel der Website, um Inhalte,
Kampagnen und Kontaktwege zu verbessern.

## System A

Die First-Party-Reichweitenmessung speichert keine Cookies, keinen Local Storage
und keinen Session Storage für Tracking-Zwecke. Der Browser sendet nur Ereignisse
mit Seitenpfad, Event-Typ und Kontext. Die Session-Signatur entsteht serverseitig aus:

```text
SHA256(HMAC(SALT_SECRET, UTC-Datum) | IP/24 | reduzierte Browserkennung | Host)[0:16]
```

- Roh-IP wird nicht gespeichert.
- Die Signatur rotiert täglich.
- `Sec-GPC: 1` und `DNT: 1` führen zu Opt-out vor Hash-Bildung.
- System-A-Daten werden nicht an Werbenetzwerke geteilt.

Am Cloudflare-Ingress werden zusätzlich **aggregierte Netzwerk-Metadaten** ergänzt
(Land, Region/Bundesland, Rechenzentrum, ASN, Bot-Einstufung). Es werden keine
Roh-IP-Adressen und keine punktgenauen Geo-Koordinaten gespeichert.

Core Web Vitals werden als anonyme Performance-Events (`web_vital`) erfasst —
echte Besucher-Messwerte, nicht das aggregierte Google-CrUX-Felddata.

Technische Details: [`analytics-systems.md`](./analytics-systems.md).

## Rechtsgrundlage

Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse): aggregierte technische
Reichweitenmessung und Verbesserung der Website. Kein Zugriff auf Endgeräte im
Sinne des § 25 Abs. 1 TDDDG, da keine Tracking-Informationen auf dem Endgerät
gespeichert oder ausgelesen werden.

## Abwägung

| Interesse der betroffenen Person | Maßnahme |
|---|---|
| Keine dauerhafte Wiedererkennung | tägliche Rotation |
| Keine Roh-IP-Verarbeitung in der DB | /24-Kürzung vor Hash |
| Kein Werbeprofiling | Trennung System A / System B |
| Widerspruch | GPC/DNT respektiert |

## System B

Google Tag Manager und Marketing-Tags laden nur nach Einwilligung über das
Fenyx-CMP. Consent Mode v2 startet mit `denied` für Analytics- und Ads-Storage.
