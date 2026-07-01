import Image from "next/image";
import pressLogos from "@/data/press-logos.json";

/**
 * V3 Press-Row – Label links, rechts endloser Marquee-Scroll.
 * Alle Logos laufen sanft von rechts nach links.
 */
export default function DesignV3PressRow() {
  const logos = pressLogos;
  // Doppelt für nahtlosen Loop
  const doubled = [...logos, ...logos];

  return (
    <section className="dv3-press" aria-labelledby="dv3-press-heading">
      <div className="dv3-press__inner">
        {/* Linke Label-Spalte */}
        <div className="dv3-press__label-col">
          <div className="dv3-press__bracket dv3-press__bracket--tl" aria-hidden="true" />
          <div className="dv3-press__bracket dv3-press__bracket--bl" aria-hidden="true" />
          <h2 id="dv3-press-heading" className="dv3-press__heading">
            Bekannt<br />aus.
          </h2>
        </div>

        {/* Marquee-Track */}
        <div className="dv3-press__marquee-clip">
          <div className="dv3-press__marquee-track" aria-label="Presse und Medien">
            {doubled.map((logo, i) => (
              <div key={i} className="dv3-press__logo-item" aria-hidden={i >= logos.length}>
                <Image
                  src={logo.src}
                  alt={i < logos.length ? logo.alt : ""}
                  width={110}
                  height={26}
                  className="object-contain opacity-25 brightness-0 invert"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
