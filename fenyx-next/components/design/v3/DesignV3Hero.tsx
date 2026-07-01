import CtaButton from "@/components/CtaButton";

/** V3 Signal: techy Hero mit Grid und signal-Akzent. */
export default function DesignV3Hero() {
  return (
    <section className="dv3-hero" aria-labelledby="dv3-hero-heading">
      <div className="dv3-hero__grid" aria-hidden="true" />
      <div className="relative w-full wf-padding-global py-28 sm:py-36">
        <div className="wf-container-xlarge">
          <span className="dv3-hero__tag">Plattform · Kreislauf · Umsetzung</span>
          <h1 id="dv3-hero-heading" className="wf-heading-h1 text-white mb-8 max-w-4xl">
            Nachhaltige{" "}
            <span className="dv3-hero__accent">Bürotransformationen</span>{" "}
            aus einer Hand.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-mist mb-10 sm:text-lg">
            Digitales Bestandsmanagement, Verwertung und Einrichtung – strukturiert,
            messbar, skalierbar.
          </p>
          <CtaButton href="/design/v3#kontakt">Demo anfragen</CtaButton>
        </div>
      </div>
    </section>
  );
}
