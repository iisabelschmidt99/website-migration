import Image from "next/image";
import pressLogos from "@/data/press-logos.json";

type Logo = { alt: string; src: string };

type PressMarqueeProps = {
  heading?: string;
  logos?: Logo[];
  /** Zusätzliche Section-Klassen (z. B. weniger Abstand oben). */
  className?: string;
  /** Hintergrund-Token, Standard: bg-black-gradient */
  bgClassName?: string;
};

function LogoRow({ logos, hidden }: { logos: Logo[]; hidden?: boolean }) {
  return (
    <div
      className="flex items-center gap-16 shrink-0"
      aria-hidden={hidden ? true : undefined}
    >
      {logos.map((logo) => (
        <div
          key={logo.src}
          className="flex items-center justify-center h-11 min-w-[5rem] max-w-[9rem] px-1"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={128}
            height={32}
            className="w-full h-full max-h-8 max-w-[8rem] object-contain opacity-40 brightness-0 invert"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

/** „Bekannt aus“-Presse-Marquee mit Endlos-Scroll (CSS). */
export default function PressMarquee({
  heading = "Fenyx ist bekannt aus",
  logos = pressLogos,
  className = "",
  bgClassName = "bg-black-gradient",
}: PressMarqueeProps) {
  return (
    <section
      id="bekannt-aus"
      className={`wf-padding-section-small overflow-hidden ${bgClassName} ${className}`.trim()}
      aria-labelledby="bekannt-aus-heading"
    >
      <div className="wf-padding-global mb-12 sm:mb-16">
        <div className="wf-container-large">
        <h2
          id="bekannt-aus-heading"
          className="wf-text-align-center wf-heading-h3 text-white"
        >
          {heading}
        </h2>
        </div>
      </div>

      <div
        className="presse-marquee"
        role="region"
        aria-label="Presse und Medien"
      >
        <div className="presse-marquee__track">
          <LogoRow logos={logos} />
          <LogoRow logos={logos} hidden />
        </div>
      </div>
    </section>
  );
}
