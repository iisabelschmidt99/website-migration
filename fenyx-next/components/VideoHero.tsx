import CtaButton from "./CtaButton";

type VideoHeroProps = {
  heading: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  videoSrc: string;
  posterSrc: string;
};

/** Vollbild-Video-Hero (Webflow section_hero). */
export default function VideoHero({
  heading,
  description,
  ctaHref = "#kontakt",
  ctaLabel = "Kontakt aufnehmen",
  videoSrc,
  posterSrc,
}: VideoHeroProps) {
  return (
    <section
      className="relative min-h-[100svh] flex items-center bg-abyss-deep overflow-hidden text-white"
      aria-labelledby="video-hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss-deep/92 via-abyss-deep/70 to-abyss-deep/25" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-0">
        <div className="max-w-2xl">
          <h1
            id="video-hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading tracking-[-0.03em] mb-5 leading-[1.08]"
          >
            {heading.split("\n").map((line, i, arr) => (
              <span key={line.slice(0, 24)}>
                {line}
                {i < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-8">
            {description.split("\n").map((line, i, arr) => (
              <span key={line.slice(0, 24)}>
                {line}
                {i < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
          <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
        </div>
      </div>
    </section>
  );
}
