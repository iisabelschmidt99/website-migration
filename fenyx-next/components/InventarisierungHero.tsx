import Image from "next/image";
import Link from "next/link";
import CtaButton from "./CtaButton";

type InventarisierungHeroProps = {
  heading: string;
  description: string;
  pills: string[];
  imageSrc: string;
  imageAlt: string;
  ctaHref?: string;
  ctaLabel?: string;
  learnMoreHref?: string;
  showLearnMore?: boolean;
};

/** Hero mit Text + Pillen links, Bild rechts (Leistungsunterseiten). */
export default function InventarisierungHero({
  heading,
  description,
  pills,
  imageSrc,
  imageAlt,
  ctaHref = "#kontakt",
  ctaLabel = "Kontakt aufnehmen",
  learnMoreHref = "#vorteile",
  showLearnMore = true,
}: InventarisierungHeroProps) {
  return (
    <section
      className="inv-hero bg-white"
      aria-labelledby="inv-hero-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h1
              id="inv-hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading tracking-[-0.03em] mb-5 leading-[1.08] uppercase"
            >
              {heading}
            </h1>
            <p className="text-black/75 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              {description}
            </p>
            <ul className="inv-hero__pills" aria-label="Vorteile">
              {pills.map((pill) => (
                <li key={pill} className="inv-pill">
                  {pill}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
              {showLearnMore ? (
                <Link
                  href={learnMoreHref}
                  className="inline-flex items-center gap-2 text-black text-[11px] font-bold uppercase tracking-[0.1em] hover:text-signal transition-colors"
                >
                  Mehr erfahren
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              ) : null}
            </div>
          </div>
          <div className="inv-hero__media relative aspect-square max-h-[28rem]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
