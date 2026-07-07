import CtaButton from "./CtaButton";
import LifecycleCard from "./LifecycleCard";
import LifecycleTrack from "./LifecycleTrack";

/** Leistungen-Abschnitt: zirkulärer Büro-Lebenszyklus mit drei Hauptkarten. */
export default function LifecycleSection() {
  return (
    <section
      id="leistungen"
      className="wf-padding-section-medium bg-white overflow-hidden"
      aria-labelledby="leistungen-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="text-center wf-max-width-large wf-align-center">
            <h2
              id="leistungen-heading"
              className="wf-heading-h2 mb-5 text-black"
            >
              Wenn Nachhaltigkeit sich auch wirtschaftlich lohnt.
            </h2>
            <p className="text-black text-base sm:text-lg leading-relaxed">
              Nachhaltige Bürotransformation bedeutet mehr als Produktzertifikate.
              Mit Fenyx gewinnen Sie einen Partner, der Kosteneinsparungen messbar
              macht, Nachhaltigkeit transparent dokumentiert und Ihr Projekt
              strukturiert begleitet – von der Analyse bis zur Umsetzung.
            </p>
            <CtaButton href="/#kontakt" className="mt-8">
              Kontakt aufnehmen
            </CtaButton>
          </div>
        </div>
      </div>

      <div className="wf-spacer-xxlarge" aria-hidden="true" />

      <LifecycleTrack>
        <LifecycleCard
          id="bestandsmanagement"
          title="Digitales Bestandsmanagement."
          description="Schaffen Sie durch digitale Inventarisierung Transparenz über Ihren Bestand und legen Sie das Fundament für die weitere, nachhaltige, interne Nutzung durch professionelle Aufbereitung und neue Konzepte."
          bullets={[
            "Interne Weiternutzung nach Aufbereitung",
            "⌀ 42% höhere Ankaufsangebote",
            "⌀ 29% bessere Wiederverwertungsrate",
          ]}
          imageSrc="/assets/timeline/Home-Digitales-Bestandsmanagement.webp"
          imageAlt="Person, die eine Smartphone-App nutzt, um eine Kategorie aus Optionen wie Bürostuhl, anderer Stuhl, Tisch und Aufbewahrung auszuwählen."
          href="/bestandsmanagement"
          align="left"
        />

        <LifecycleCard
          id="verwertung"
          title="Ganzheitliche Verwertung."
          description="Maximieren Sie die Wiederverwertungsquote und den Verkaufserlös Ihres nicht mehr gebrauchten Bestands. Die Fenyx Plattform garantiert die optimale Veräußerung, unabhängig von Hersteller, Kategorie und Zustand."
          bullets={[
            "Kostenlose Vor-Ort-Besichtigung",
            "Bis zu 42% höherer Erlös",
            "100% sorgenfreie Übergabe",
          ]}
          imageSrc="/assets/timeline/verwertung-lift.jpg"
          imageAlt="Möbellift hebt Bürostühle in einen LKW im Innenhof eines Bürogebäudes."
          href="/verwertung/bueroaufloesung"
          align="right"
        />

        <LifecycleCard
          id="einrichtung"
          title="Schlüsselfertige Einrichtung."
          description="Planen Sie mit uns Ihr neues Büro. Wir analysieren Ihre Anforderungen & Wünsche und übersetzen diese in ein anspruchsvolles Konzept. In der Umsetzung nutzen wir einen Hybrid aus Bestand, refurbished und neuen Büromöbeln."
          bullets={[
            "Ein Partner. Ein Prozess. Null Stress.",
            "⌀ 58% sparen bei innovativer Büroeinrichtung",
            "⌀ 125 kg CO₂ pro Arbeitsplatz sparen",
          ]}
          imageSrc="/assets/timeline/Einrichtung-Header-Dropdown-Bild.webp"
          imageAlt="Moderner Büroarbeitsplatz mit zwei schwarzen ergonomischen Stühlen, einem weißen Schreibtisch und grünen schallabsorbierenden Paneelen."
          href="/einrichtung/bueroeinrichtung"
          align="left"
        />
      </LifecycleTrack>
    </section>
  );
}
