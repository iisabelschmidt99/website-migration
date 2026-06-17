import Image from "next/image";

type ParallaxIntroSectionProps = {
  heading: string;
  body: string;
  imageSrcs?: string[];
};

/** Intro-Band mit Text und Bildcollage (Webflow section_parallax, vereinfacht). */
export default function ParallaxIntroSection({
  heading,
  body,
  imageSrcs = [],
}: ParallaxIntroSectionProps) {
  return (
    <section className="parallax-intro" aria-labelledby="parallax-intro-heading">
      <div className="parallax-intro__media" aria-hidden="true">
        {imageSrcs.slice(0, 2).map((src, i) => (
          <div key={src} className={`parallax-intro__image parallax-intro__image--${i + 1}`}>
            <Image src={src} alt="" fill className="object-cover" sizes="50vw" loading="lazy" />
          </div>
        ))}
        <div className="parallax-intro__overlay" />
      </div>

      <div className="relative z-[1] max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <h2
          id="parallax-intro-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-heading tracking-[-0.03em] text-white mb-5"
        >
          {heading}
        </h2>
        <p className="text-white/88 text-base sm:text-lg leading-relaxed">{body}</p>
      </div>
    </section>
  );
}
