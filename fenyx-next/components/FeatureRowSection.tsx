import Image from "next/image";
import CtaButton from "./CtaButton";

type FeatureRowSectionProps = {
  heading: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  ctaLabel?: string;
  ctaHref?: string;
  reverse?: boolean;
  dark?: boolean;
  bgClassName?: string;
  /** Größere Typo, Bilder und Container (Webflow-Original). */
  size?: "default" | "large";
};

/** Text-Bild-Zeile (CTA-Band) für Leistungsunterseiten. */
export default function FeatureRowSection({
  heading,
  body,
  imageSrc,
  imageAlt,
  ctaLabel = "Jetzt beraten lassen",
  ctaHref = "/#kontakt",
  reverse = false,
  dark = false,
  bgClassName = "bg-white",
  size = "default",
}: FeatureRowSectionProps) {
  const isLarge = size === "large";

  return (
    <section
      className={`cta-band-section ${isLarge ? "cta-band-section--large" : "py-20 sm:py-28"} ${bgClassName} ${
        dark ? "cta-band-section--dark" : ""
      }`}
    >
      <div className={isLarge ? "wf-padding-global" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <div className={isLarge ? "wf-container-large" : undefined}>
          <div
            className={`feature-row ${isLarge ? "feature-row--large" : ""} ${reverse ? "feature-row--reverse" : ""} ${
              dark ? "feature-row--dark" : ""
            }`}
          >
            <div className="feature-row-content">
              <h2 className={isLarge ? "font-heading tracking-[-0.03em]" : undefined}>{heading}</h2>
              <p>{body}</p>
              <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
            </div>
            <div
              className={`feature-row-media relative aspect-[4/3] ${
                isLarge ? "feature-row-media--large" : "min-h-[14rem]"
              }`}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-center"
                sizes={isLarge ? "(max-width: 1024px) 100vw, 48vw" : "(max-width: 1024px) 100vw, 50vw"}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
