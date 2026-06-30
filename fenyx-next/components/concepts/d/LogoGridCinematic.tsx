import Image from "next/image";
import { curatedLogos } from "@/components/concepts/shared/logos";

// Konzept D — Logo-Grid als kuratierte Museumswand.
// 6 Logos groß auf hellen Chips (Originalfarbe, kein Invert → keine Blöcke).

const CURATED = curatedLogos(6);

export default function LogoGridCinematic() {
  return (
    <section
      className="dd-logos"
      aria-labelledby="dd-logos-heading"
    >
      <div className="dd-logos__inner">
        <p className="dd-logos__caption">
          <span id="dd-logos-heading">Ausgewählte Partnerschaften</span>
        </p>
        <ul className="dd-logos__grid" role="list">
          {CURATED.map((logo) => (
            <li key={logo.src} className="dd-logos__cell">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={140}
                height={36}
                loading="lazy"
                className="dd-logos__img"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
