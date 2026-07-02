# visuals-hires — Ablage für hochauflösende Original-Visuals

Leg hier die **Original-Bilddateien in voller Auflösung** ab (per Finder, nicht
über einen Chat-Agent). Von hier werden sie in den Website-Ordner
`fenyx-next/public/assets/...` übernommen.

## Warum dieser Ordner

Bilder, die über den Chat gepastet werden, kommen heruntergerechnet an (~1024 px)
→ unscharf. Und selbst 1344 px reichen für full-bleed Hero-Hintergründe auf
Retina-Displays nicht. Deshalb: Originale hier ablegen, so groß wie möglich.

## Auflösungs-Richtwerte

| Verwendung                        | Mindestbreite | Ideal        |
|-----------------------------------|---------------|--------------|
| Full-bleed Hero / Timeline-BG     | 2000 px       | 2560–3000 px |
| Halbe Breite / Karten             | 1200 px       | 1600 px      |
| Kleine Thumbnails / Logos         | 600 px        | 800 px       |

Retina-Displays (MacBook) haben 2× Pixeldichte — ein full-bleed Bild braucht real
das Doppelte der CSS-Breite. Darunter wird es sichtbar unscharf.

## Wenn dein Tool nur 1344 px ausgibt

- Beim Generieren eine **„Upscale" / „HD" / „2×"**-Option suchen, oder
- nachträglich hochskalieren: **Topaz Gigapixel** (beste Qualität),
  **Real-ESRGAN** (kostenlos), oder online-Upscaler.
- Ziel: ~2560 px Breite, dann als PNG oder hochwertiges WebP speichern.

## Namens- und Zuordnungs-Konvention

Benenne die Datei nach ihrem Ziel, dann ist die Zuordnung eindeutig:

| Datei hier (visuals-hires/)      | Ziel im Projekt                                          |
|----------------------------------|----------------------------------------------------------|
| `j-bestandsmanagement.png`       | `fenyx-next/public/assets/concepts/j/bestandsmanagement.png` |
| `j-verwertung-lift.png`          | `fenyx-next/public/assets/concepts/j/verwertung-lift.png`    |
| `j-einrichtung.png`              | `fenyx-next/public/assets/concepts/j/einrichtung.png`        |

Sag mir danach einfach „übernimm die neuen Visuals" — dann kopiere ich sie an die
richtige Stelle und du kannst committen.
