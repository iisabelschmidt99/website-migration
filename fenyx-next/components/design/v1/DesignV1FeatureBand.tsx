import Image from "next/image";
import CtaButton from "@/components/CtaButton";

type DesignV1FeatureBandProps = {
  heading: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  dark?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
};

/** V1 Feature-Zeile: Text + Bild im Proof-Stil (eckig, ruhig). */
export default function DesignV1FeatureBand({
  heading,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
  dark = false,
  ctaHref = "#kontakt",
  ctaLabel = "Jetzt beraten lassen",
}: DesignV1FeatureBandProps) {
  return (
    <section
      className={`dv1-feature-band wf-padding-section-large${
        dark ? " dv1-feature-band--dark" : ""
      }`}
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div
            className={`dv1-feature-band__grid${
              reverse ? " dv1-feature-band__grid--reverse" : ""
            }`}
          >
            <div className="dv1-feature-band__content">
              <h2 className="wf-heading-h2 mb-5 text-inherit">{heading}</h2>
              <p className="text-base leading-relaxed sm:text-lg">{body}</p>
              <CtaButton href={ctaHref} className="mt-8">
                {ctaLabel}
              </CtaButton>
            </div>
            <div className="dv1-feature-band__media">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
