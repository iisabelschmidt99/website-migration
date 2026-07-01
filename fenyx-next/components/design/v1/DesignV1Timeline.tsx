import CtaButton from "@/components/CtaButton";
import LifecycleTrack from "@/components/LifecycleTrack";
import DesignV1TimelineChapter from "@/components/design/v1/DesignV1TimelineChapter";

const CHAPTERS = [
  {
    step: "01",
    title: "Digitales Bestandsmanagement.",
    bullets: [
      "Interne Weiternutzung nach Aufbereitung",
      "⌀ 42% höhere Ankaufsangebote",
      "⌀ 29% bessere Wiederverwertungsrate",
    ],
    imageSrc: "/assets/timeline/Home-Digitales-Bestandsmanagement.webp",
    imageAlt: "Person inventarisiert Büromöbel mit einer App.",
    align: "left" as const,
  },
  {
    step: "02",
    title: "Ganzheitliche Verwertung.",
    bullets: [
      "Kostenlose Vor-Ort-Besichtigung",
      "Bis zu 42% höherer Erlös",
      "100% sorgenfreie Übergabe",
    ],
    imageSrc: "/assets/timeline/verwertung-planung-raeumung.png",
    imageAlt:
      "Team plant die Räumung am Monitor – Besprechung in einem hellen Büro.",
    align: "right" as const,
  },
  {
    step: "03",
    title: "Schlüsselfertige Einrichtung.",
    bullets: [
      "Ein Partner. Ein Prozess. Null Stress.",
      "⌀ 58% sparen bei innovativer Büroeinrichtung",
      "⌀ 125 kg CO₂ pro Arbeitsplatz sparen",
    ],
    imageSrc: "/assets/timeline/einrichtung-oranienstr.png",
    imageAlt:
      "Moderner Büroflur mit Glaswänden, Workstations und grünen Akustikpaneelen an der Decke.",
    align: "left" as const,
  },
];

/**
 * V1 Timeline – weißer Intro-Schnitt, Full-Bleed-Kapitel, reine signal-Scroll-Achse.
 */
export default function DesignV1Timeline() {
  return (
    <div className="dv1-timeline-wrap">
      <section
        className="dv1-timeline-intro bg-white wf-padding-section-medium"
        aria-labelledby="dv1-timeline-heading"
      >
        <div className="wf-padding-global">
          <div className="wf-container-large">
            <div className="text-center wf-max-width-large wf-align-center">
              <h2
                id="dv1-timeline-heading"
                className="wf-heading-h2 mb-5 text-black"
              >
                Wenn Nachhaltigkeit sich auch wirtschaftlich lohnt.
              </h2>
              <p className="text-black text-base sm:text-lg leading-relaxed">
                Nachhaltige Bürotransformation bedeutet mehr als
                Produktzertifikate. Mit Fenyx gewinnen Sie einen Partner, der
                Kosteneinsparungen messbar macht, Nachhaltigkeit transparent
                dokumentiert und Ihr Projekt strukturiert begleitet – von der
                Analyse bis zur Umsetzung.
              </p>
              <CtaButton href="/design/v1#kontakt" className="mt-8">
                Kontakt aufnehmen
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      <div className="wf-spacer-xxlarge bg-white" aria-hidden="true" />

      <section className="dv1-timeline bg-abyss-deep" aria-label="Leistungen">
        <div className="relative">
          <LifecycleTrack dotCount={3} className="dv1-lifecycle-track">
            {CHAPTERS.map((chapter) => (
              <div key={chapter.step} className="dv1-timeline__chapter">
                <DesignV1TimelineChapter
                  title={chapter.title}
                  bullets={chapter.bullets}
                  imageSrc={chapter.imageSrc}
                  imageAlt={chapter.imageAlt}
                  align={chapter.align}
                />
              </div>
            ))}
          </LifecycleTrack>
        </div>
      </section>
    </div>
  );
}
