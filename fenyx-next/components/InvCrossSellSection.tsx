import Image from "next/image";
import CtaButton from "./CtaButton";

type InvCrossSellSectionProps = {
  heading: string;
  body: string;
  href: string;
  cta: string;
  imageSrc: string;
};

/** Cross-Sell CTA mit Vollbild-Hintergrund (Webflow section_cta). */
export default function InvCrossSellSection({
  heading,
  body,
  href,
  cta,
  imageSrc,
}: InvCrossSellSectionProps) {
  return (
    <section
      className="inv-crosssell relative overflow-hidden"
      aria-labelledby="crosssell-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
          loading="lazy"
        />
        <div className="inv-crosssell__overlay" />
      </div>

      <div className="relative z-[1] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-40">
        <div className="inv-crosssell__content">
          <h2 id="crosssell-heading" className="inv-crosssell__heading">
            {heading.split("\n").map((line, i, arr) => (
              <span key={line.slice(0, 24)}>
                {line}
                {i < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <div className="inv-crosssell__body">
            {body.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <div className="inv-crosssell__actions">
            <CtaButton href={href} className="text-sm tracking-[0.08em] px-7 py-3">
              {cta}
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
