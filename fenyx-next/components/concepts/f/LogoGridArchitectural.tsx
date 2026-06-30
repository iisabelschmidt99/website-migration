import Image from "next/image";
import homepageLogos from "@/data/homepage-logos.json";

type Logo = { alt: string; src: string };

// Konzept F — 7-Spalten Logo-Grid auf abyss mit Hover-Caption.
// Dünne Trennlinien, Hover = dezenter Signal-Hauch + Caption-Label.

const GRID = (homepageLogos as Logo[]).slice(0, 14);
const TOTAL = (homepageLogos as Logo[]).length;

// Caption = simplified company name aus alt (z.B. "Logo: X" → "X").
function toCaption(alt: string): string {
  return alt
    .replace(/^Logo:\s*/i, "")
    .replace(/^Logo\s+/i, "")
    .replace(/\s+logo$/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(" ");
}

export default function LogoGridArchitectural() {
  return (
    <section
      className="df-logos"
      aria-labelledby="df-logos-heading"
    >
      <div className="df-logos__inner">
        <div className="df-logos__header">
          <div>
            <p className="df-logos__eyebrow">02 / 03 — Partner</p>
            <h2
              id="df-logos-heading"
              className="df-logos__heading"
            >
              Weltweit führenden Unternehmen vertrauen auf Fenyx.
            </h2>
          </div>
          <p className="df-logos__count">
            {TOTAL} Partner
          </p>
        </div>

        <ul className="df-logos__grid" role="list">
          {GRID.map((logo) => (
            <li key={logo.src} className="df-logo-cell">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={140}
                height={36}
                loading="lazy"
                className="df-logo-cell__img"
              />
              <span className="df-logo-cell__caption">
                {toCaption(logo.alt)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
