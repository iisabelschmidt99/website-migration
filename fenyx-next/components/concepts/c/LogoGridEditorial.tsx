import Image from "next/image";
import homepageLogos from "@/data/homepage-logos.json";

type Logo = { alt: string; src: string };

/**
 * Konzept C – Editoriale Logo-Wand.
 *
 * Statt des dichten 14-Spalten-Rasters eine ruhige „Museumswand": wenige große
 * Logos, viel Weißraum, eine kleine Versalien-Bildunterschrift darüber.
 * Hover: dezenter Opazitäts-/Graustufen-Wechsel (kein Scale).
 *
 * Server-Komponente (reine CSS-Hover-Interaktion).
 */

// Bewusst kuratierte, wiedererkennbare Auswahl (6 Logos, eine Reihe / zwei auf
// Mobile). Reihenfolge aus dem zentralen Logo-Datensatz gezogen.
const FEATURED = [
  "SIGNAL IDUNA",
  "Universal",
  "Trade Republic",
  "Fielmann",
  "Beiersdorf AG",
  "Otto",
];

const logos: Logo[] = FEATURED.map((alt) => {
  const match = (homepageLogos as Logo[]).find((logo) => logo.alt === alt);
  return match ?? { alt, src: "" };
}).filter((logo) => logo.src);

export default function LogoGridEditorial() {
  return (
    <section
      className="dc-logo-grid wf-padding-section-large"
      aria-labelledby="dc-logos-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <p id="dc-logos-heading" className="dc-eyebrow mb-16 sm:mb-20">
            Ausgewählte Partnerschaften.
          </p>

          <ul className="grid grid-cols-2 gap-x-10 gap-y-16 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-14">
            {logos.map((logo) => (
              <li
                key={logo.src}
                className="flex items-center justify-center"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={200}
                  height={64}
                  className="dc-logo h-10 w-auto max-w-[9rem] object-contain sm:h-12"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
