import Image from "next/image";
import CtaButton from "@/components/CtaButton";

/**
 * Konzept C – Editorialer Hero („Editorial Quiet").
 *
 * Vollflächiger, warm-papierner Hintergrund; das c-hero.png liegt nur als
 * leiser, stark übermalter Hintergrund darunter – im Vordergrund steht die
 * überdimensionierte Telegraf-Headline. Single-Column, viel Weißraum.
 *
 * Server-Komponente: der zeilenweise Auftritt der Headline ist eine reine
 * CSS-Lade-Animation (`.dc-rise`, siehe concept.css) und braucht kein JS.
 */
export default function HeroEditorial() {
  // Headline bewusst in drei Zeilen gesetzt (redaktioneller Umbruch).
  const headlineLines = [
    "Nachhaltige",
    "Bürotransformationen",
    "aus einer Hand.",
  ];

  return (
    <section
      className="dc-hero relative flex min-h-[100svh] items-center"
      aria-labelledby="dc-hero-heading"
    >
      {/* Hintergrundbild – bewusst zurückgenommen (das Wort führt, nicht das Bild). */}
      <Image
        src="/assets/concepts/c/c-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="dc-hero__img"
      />
      <div className="dc-hero__veil" aria-hidden="true" />

      <div className="relative w-full wf-padding-global py-32 sm:py-40">
        <div className="wf-container-large">
          <div className="max-w-[60rem]">
            <p className="dc-eyebrow dc-rise mb-8" style={{ "--dc-i": 0 } as React.CSSProperties}>
              Fenyx — Büromanufaktur für nachhaltige Transformation
            </p>

            <h1 id="dc-hero-heading" className="dc-display mb-10">
              {headlineLines.map((line, i) => (
                <span
                  key={line}
                  className="dc-rise block"
                  style={{ "--dc-i": i + 1 } as React.CSSProperties}
                >
                  {line}
                </span>
              ))}
            </h1>

            <p
              className="dc-lede dc-rise mb-12"
              style={{ "--dc-i": 4 } as React.CSSProperties}
            >
              Von digitalem Bestandsmanagement über die nachhaltige Verwertung
              zur schlüsselfertigen Einrichtung.
            </p>

            <div
              className="dc-rise"
              style={{ "--dc-i": 5 } as React.CSSProperties}
            >
              <CtaButton href="/c#kontakt">Kontakt aufnehmen</CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
