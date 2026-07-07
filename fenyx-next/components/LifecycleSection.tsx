import TimelineCinematicG from "@/components/concepts/g/TimelineCinematicG";
import "@/components/concepts/shared/anim.css";
import "@/app/d/concept.css";
import "@/app/f/concept.css";
import "@/app/g/concept.css";
import "@/app/home-lifecycle.css";

/** Leistungen-Abschnitt: Intro + Timeline im /j-Stil (Vollbild-Kapitel, Gradient-Scrim). */
export default function LifecycleSection() {
  return (
    <div id="leistungen" className="dg-page home-lifecycle">
      <section className="dg-intro" aria-labelledby="leistungen-heading">
        <div className="dg-intro__inner wf-padding-global">
          <div className="wf-container-large">
            <h2 id="leistungen-heading" className="dg-intro__heading">
              Wenn Nachhaltigkeit sich auch wirtschaftlich lohnt.
            </h2>
            <p className="dg-intro__body">
              Nachhaltige Bürotransformation bedeutet mehr als Produktzertifikate.
              Mit Fenyx gewinnen Sie einen Partner, der Kosteneinsparungen messbar macht,
              Nachhaltigkeit transparent dokumentiert und Ihr Projekt strukturiert begleitet
              – von der Analyse bis zur Umsetzung.
            </p>
            <a href="/#kontakt" className="dg-intro__cta">
              Kontakt aufnehmen <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <TimelineCinematicG
        bestandImageSrc="/assets/homepage/bestandsmanagement.png"
        verwertungImageSrc="/assets/homepage/verwertung-lift.png"
        einrichtungImageSrc="/assets/homepage/einrichtung.png"
      />
    </div>
  );
}
