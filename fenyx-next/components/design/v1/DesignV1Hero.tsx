import CtaButton from "@/components/CtaButton";
import HomeHeroVideo from "@/components/HomeHeroVideo";

/** V1 Belege: Video-Hero mit pointierter Headline. */
export default function DesignV1Hero() {
  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-abyss-deep"
      aria-labelledby="dv1-hero-heading"
    >
      <div className="absolute inset-0">
        <HomeHeroVideo />
        <div className="absolute inset-0 bg-abyss-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss-deep/70 via-abyss-deep/40 to-transparent" />
      </div>

      <div className="relative w-full wf-padding-global py-28 sm:py-36 lg:py-0">
        <div className="wf-container-xlarge">
          <h1 id="dv1-hero-heading" className="dv1-hero__title">
            Nachhaltige
            <br />
            Büro&shy;transformationen
            <br />
            aus einer Hand.
          </h1>
          <p className="dv1-hero__sub">
            Von digitalem Bestandsmanagement über die nachhaltige Verwertung
            zur schlüsselfertigen Einrichtung.
          </p>
          <CtaButton href="/design/v1#kontakt">Kontakt aufnehmen</CtaButton>
        </div>
      </div>
    </section>
  );
}
