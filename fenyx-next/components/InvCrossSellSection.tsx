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
          loading="lazy"
        />
        <div className="inv-crosssell__overlay" />
      </div>

      <div className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-xl">
          <h2
            id="crosssell-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-heading tracking-[-0.03em] mb-5 text-white"
          >
            {heading.split("\n").map((line, i, arr) => (
              <span key={line.slice(0, 24)}>
                {line}
                {i < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <div className="text-mist text-base leading-relaxed mb-8 space-y-4">
            {body.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <CtaButton href={href}>{cta}</CtaButton>
        </div>
      </div>
    </section>
  );
}
