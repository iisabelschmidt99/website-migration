# Hinweis: Bilder NICHT über den Chat einbetten

**Problem:** Wenn ein Bild in den Cursor-Chat gepastet wird und der Agent es
"ins Projekt speichern" soll, bekommt der Agent nur eine **heruntergerechnete
Version** (typisch auf ~1024 px lange Kante). Scharfe Vorlage rein → unscharfe
Datei raus. Der Schärfeverlust passiert beim Reinreichen ins Chat-Fenster, NICHT
im Code oder in der Timeline.

## Regel für Bild-Assets

1. **Originaldateien immer selbst per Finder** in den Zielordner legen
   (`public/assets/...`) — nicht den Chat-Agent die Datei erzeugen/speichern
   lassen.
2. Der Agent bekommt nur den **Dateipfad + Alt-Text**, dann baut er das `<Image>`
   ein. Er soll die Bilddatei NICHT neu schreiben, konvertieren oder "optimieren".
3. **Mindestauflösung** für full-bleed / Timeline-Hintergründe: **≥ 1600 px
   breit**, Richtwert ~2000–2400 px (wie die bestehenden Timeline-Bilder, z. B.
   `verwertung-besichtigung.webp` = 2500×1667). Next/Image rechnet beim Ausliefern
   selbst herunter — die Quelldatei darf groß sein.
4. Full-bleed-Bilder werden auf 100–112 vw gestreckt. Eine 1024-px-Quelle wird
   dabei auf ~1600 px hochskaliert → sichtbar unscharf. Auflösung der Quelle ist
   der einzige echte Hebel; `quality` und CSS können fehlende Pixel nicht ersetzen.

## Prompt-Baustein für Cursor

> Die Bilddatei liegt bereits unter `<pfad>`. Bette sie NUR per `<Image src=...>`
> ein. Erzeuge, überschreibe oder verkleinere die Datei nicht. Nutze
> `sizes="100vw"` und `quality={90}` für full-bleed-Hintergründe.
