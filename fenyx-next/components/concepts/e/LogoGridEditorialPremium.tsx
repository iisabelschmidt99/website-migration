import Image from "next/image";
import homepageLogos from "@/data/homepage-logos.json";

type Logo = { alt: string; src: string };

// Konzept E — Logo-Grid als museumswand-ähnliche Kuratierung.
// 6 Logos groß auf mist-soft, mit Caption und dünnem Raster. Hover = Grayscale → Farbe.

const CURATED = (homepageLogos as Logo[]).slice(0, 6);

export default function LogoGridEditorialPremium() {
  return (
    <section
      className="de-logos"
      aria-labelledby="de-logos-heading"
    >
      <div className="de-logos__inner">
        <p className="de-logos__caption">
          <span id="de-logos-heading">Ausgewählte Partnerschaften</span>
        </p>
        <ul className="de-logos__grid" role="list">
          {CURATED.map((logo) => (
            <li key={logo.src} className="de-logos__cell">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={140}
                height={36}
                loading="lazy"
                className="de-logos__img"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
