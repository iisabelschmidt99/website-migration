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
    <section className="section_hero" aria-labelledby="video-hero-heading">
      <div className="wf-padding-global">
        <div className="wf-container-xlarge">
          <div className="hero_content">
            <div className="wf-padding-section-large">
              <div className="wf-max-width-large wf-max-width-large--hero wf-text-wrap-balance">
                <h1 id="video-hero-heading" className="wf-heading-h1">
                  {heading}
                </h1>
                <div className="wf-spacer-small" aria-hidden="true" />
                <p className="wf-text-size-medium">{description}</p>
                <div className="wf-spacer-medium" aria-hidden="true" />
                <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section_hero__video-wrap" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="section_hero__overlay" />
      </div>
    </section>
  );
}
