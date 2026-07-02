# Bildsprache B — „Am Arbeiten" (dunkel, Menschen im Prozess)

**Zweck:** Referenz-/Skill-Dokument für die Agentur, um mit AI-Bildgeneratoren (Midjourney,
Firefly, o.ä.) konsistente Visuals für die **Timeline (Fenyx-Lebenszyklus)** zu erzeugen.
Dies ist **Variante B** von zwei Bildsprachen – beide zeigen dieselbe Timeline, A und B werden
gegeneinander verglichen (siehe `bildsprache-A-hell-clean.md`).

> Prompt-Sprache: Die fertigen Prompt-Bausteine sind bewusst auf **Englisch** – Bildmodelle
> liefern damit deutlich stabilere Ergebnisse. Die Erklärungen bleiben deutsch.

---

## 1. Essenz in einem Satz
Ehrliche, dunkle, konzentrierte Arbeitsmomente – echte Menschen, die anpacken, verwerten,
tragen. Kraft und Handwerk statt Hochglanz, aber ruhig und würdevoll inszeniert.

## 2. Grundhaltung / Mood
Erdig, kompetent, glaubwürdig, ein bisschen „techy" und rau. Es geht um **den Prozess** und
die Menschen dahinter: Tragehelfer, Demontage, Sortierung, Aufbereitung, Logistik. Emotion
entsteht durch Fokus und Körpereinsatz – aber kontrolliert, nicht chaotisch. Menschen sind
präsent und aktiv, jedoch nie gestellt-lächelnd; eher dokumentarisch, konzentriert.

Stimmungs-Keywords: *cinematic, documentary, grounded, industrious, focused, moody, tactile,
low-key, honest craft.*

## 3. Motive je Timeline-Phase
Dieselbe Timeline wie Variante A, aber aus der „Arbeit & Prozess"-Perspektive:

- **Phase 1 – Bestand/Erfassung:** Menschen erfassen/scannen Bestand vor Ort, Tablet/Scanner
  in der Hand, Blick auf Möbel im noch belegten Büro; konzentriertes Sichten.
- **Phase 2 – Verwertung:** der Kern dieser Bildsprache – Tragehelfer in Arbeitskleidung,
  Möbel demontieren, verpacken, tragen, verladen; Sortierung im Lager; Aufbereitung/Reinigung
  mit den Händen. Bewegung, Körpereinsatz, Teamarbeit.
- **Phase 3 – (Neu-)Einrichtung:** Aufbau/Montage im neuen Büro – Menschen richten ein,
  justieren, tragen letzte Teile; der Übergang zum fertigen Raum, noch „im Werden".

## 4. Komposition & Framing
Dokumentarisch, näher dran. Hände, Gesten, Körper in Bewegung. Leichte Unordnung erlaubt (sie
erzählt die Arbeit), aber Bildaufbau bleibt klar – ein Fokuspunkt, Rest fällt in den Schatten.
Auch Detail-Crops (Hände am Gurt, Werkzeug, Karton mit Etikett). Eye-level oder leicht tief
für Präsenz.

## 5. Licht
Low-key, kontrastreich, gerichtet. Ein Fenster oder eine Lichtquelle modelliert die Szene;
Schatten dürfen tief sein. Cinematic, aber nicht schwarz-abgesoffen – Gesichter/Hände bleiben
lesbar. Kein flaches Gleichlicht.

## 6. Farbe & Palette (Fotos farblich NEUTRAL)
Dunkle, erdige Palette: Anthrazit, Schiefergrau, tiefes Braun, Beton, verwittertes Metall,
gedämpftes Blau-Grau, Arbeitskleidungs-Töne. **Kein Signal-Grün und keine plakativen
Farbakzente im Bild** – der Markenakzent kommt später aus UI/Layout. Farben bleiben gedämpft
und realistisch, kein knalliger Teal-Orange-Filmlook.

## 7. Materialien & Texturen
Karton, Packdecken, Spanngurte, Werkzeug, rohes Holz, Metallregale, Staub, Beton, Arbeits-
handschuhe. Taktil und echt. Gebrauchsspuren sind hier ausdrücklich erwünscht (im Gegensatz
zu Variante A).

## 8. Kamera / technische Anmutung
Reportage-/Cinematic-Look: 35–85 mm, offene Blende (f/2–f/4) für Tiefenunschärfe und Fokus
auf Person/Hand, dezente Bewegungsunschärfe erlaubt. Feines bis mittleres Korn, natürlicher
Kontrast. Keine Überschärfung, kein HDR.

## 9. Ready-to-use Prompt-Formel
```
[subject + timeline phase], real workers in workwear, focused documentary moment,
office clearance / furniture handling, cinematic low-key lighting, single directional
light source, deep shadows, dark earthy palette (charcoal, slate, concrete, worn metal,
brown), tactile textures, shallow depth of field, candid and grounded, shot on 50mm,
subtle film grain --ar 16:9 --style raw
```
Negative / vermeiden:
```
--no neon colors, green tint, oversaturated, teal-orange grade, HDR, staged smiling
stock models, flat lighting, clean showroom, text, logos, watermark
```

## 10. Beispiel-Prompts je Phase
- **Phase 1:** `worker scanning office furniture with a handheld tablet in a dim occupied
  office, focused documentary moment, low-key directional light, dark earthy palette, shallow
  depth of field, cinematic, 50mm, film grain --ar 16:9`
- **Phase 2:** `two workers in workwear carrying a dismantled office desk through a warehouse,
  focused teamwork, straps and gloves, cinematic low-key lighting, deep shadows, concrete and
  worn metal tones, candid documentary photography, shallow depth of field --ar 16:9`
- **Phase 3:** `workers assembling and adjusting furniture in a half-finished new office,
  late afternoon directional light, tools and cardboard around, grounded documentary moment,
  dark muted palette, 35mm, film grain --ar 16:9`

## 11. Konsistenz-Regeln (wichtig für die Timeline-Serie)
- Gleiches Seitenverhältnis wie Variante A wählen, damit A/B fair vergleichbar sind
  (Empfehlung 16:9 oder 4:5 – über beide Bildsprachen identisch halten).
- Gleiche Lichtlogik, gleiche Palette, gleiche Brennweite über alle Phasen → Serienwirkung.
- Immer Menschen aktiv im Bild, immer dokumentarisch (nicht gestellt). Immer farbneutral
  (kein Grün im Bild).
- Bei Midjourney: identischen `--style`/`--sref`-Seed über die Serie verwenden.

## 12. Do / Don't
- **Do:** echte Arbeit, Hände & Körper, gerichtetes Licht, gedämpfte reale Farben,
  Gebrauchsspuren, Fokus auf einen Moment.
- **Don't:** grelle Farben, Grün im Foto, gestellte lächelnde Stockmodels, cleaner Showroom
  (das ist Variante A), Teal-Orange-Filter, chaotische überladene Szenen.
