import Image from "next/image";
import { alphabeticalLogos } from "@/components/concepts/shared/logos";

/**
* Konzept C – Editoriale Logo-Index (Colophon).
*
* Alle Partner als mehrspaltiger alphabetischer Index – wie ein Impressum/
* Colophon am Ende eines Magazins. Kein Scale, kein lauter Hover: nur feine
* Opazitäts-/Graustufen-Wechsel. Passt zur ruhigen Editorial-Quiet-Persona.
*
* Server-Komponente (reine CSS-Interaktion).
*/

const logos = alphabeticalLogos();

export default function LogoGridEditorial() {
  return (
    <section
      className="dc-logo-index wf-padding-section-large"
      aria-labelledby="dc-logos-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <header className="dc-logo-index__head">
            <p id="dc-logos-heading" className="dc-eyebrow">
              Partner-Verzeichnis.
            </p>
            <p className="dc-logo-index__count">
              {logos.length} Unternehmen aus verschiedenen Branchen
            </p>
          </header>

          <ul className="dc-logo-index__grid" role="list">
            {logos.map((logo) => (
              <li key={logo.src} className="dc-logo-index__item">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={32}
                  loading="lazy"
                  className="dc-logo-index__img"
                />
                <span className="dc-logo-index__name">{logo.alt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
