import Image from "next/image";
import { validHomepageLogos } from "@/components/concepts/shared/logos";

/**
* Konzept E – Editoriale Logo-Galerie (asymmetrisch).
*
* Alle Partner in einer Magazin-Spread-Anordnung: einige Logos groß (span 2),
* die meisten klein. Default Graustufen, Hover → Originalfarbe + leichtes Scale.
* Passt zur Patina/Editorial-Premium-Persona (Fotografie als Subjekt).
*
* Spans deterministisch per Index vergeben – stabile SSR/CSR-Ausgabe.
* Server-Komponente (reine CSS-Interaktion).
*/

const LOGOS = validHomepageLogos;

// Span-Muster: alle 8 / 13 / 21 Logos wird eine Kachel groß (span 2 × 2),
// alle 5 eine Kachel breit (span 2 × 1). Wiederholt sich periodisch und
// erzeugt eine unregelmäßige, aber balancierte Magazin-Anordnung.
function spanFor(i: number): string {
  if (i % 13 === 0) return "de-gal__cell--big";
  if (i % 8 === 5) return "de-gal__cell--wide";
  if (i % 21 === 11) return "de-gal__cell--tall";
  return "";
}

export default function LogoGridEditorialPremium() {
  return (
    <section className="de-gal" aria-labelledby="de-gal-heading">
      <div className="de-gal__inner">
        <header className="de-gal__head">
          <p id="de-gal-heading" className="de-gal__eyebrow">
            Partnerschaften
          </p>
          <h2 className="de-gal__title">
            {LOGOS.length} Marken, die auf Fenyx vertrauen.
          </h2>
        </header>

        <ul className="de-gal__grid" role="list">
          {LOGOS.map((logo, i) => (
            <li key={logo.src} className={`de-gal__cell ${spanFor(i)}`.trim()}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={48}
                loading="lazy"
                className="de-gal__img"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
