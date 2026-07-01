// Ankauf-LP: Prozess-Timeline – boxige dunkle Karten (Bild seitlich) + Chevrons.
import Image from "next/image";

const ASSETS = "/assets/leistungen/ankauf";

type Step = {
  eyebrow: string;
  title: string;
  body: string;
  imageSrc: string;
};

const STEPS: Step[] = [
  {
    eyebrow: "Digital erfasst & datenbasiert bewertet.",
    title: "1. Bestandsaufnahme.",
    body: "Wir erfassen Ihre Bestände strukturiert vor Ort – von Arbeitsplätzen über Sonderflächen bis hin zu einzelnen Möbelgruppen. Dabei bewerten wir nicht nur Mengen, sondern auch Möbelzustand, Wiederverwertungspotenzial, Marktgängigkeit und logistische Komplexität.",
    imageSrc: `${ASSETS}/prozess-1.webp`,
  },
  {
    eyebrow: "Weiterverwenden statt entsorgen.",
    title: "2. Möbelverwertung.",
    body: "Gut erhaltene Möbel werden nicht entsorgt, sondern gezielt weiterverwertet. Über Europas größtes Händler-Netzwerk führen wir Bestände zurück in den Markt – transparent und nachvollziehbar.",
    imageSrc: `${ASSETS}/prozess-2.webp`,
  },
  {
    eyebrow: "Projektleiter mit +20 Jahre Erfahrung.",
    title: "3. Projektplanung.",
    body: "Wir überführen die Bestandsaufnahme in einen belastbaren Projekt- und Ablaufplan. Dabei berücksichtigen wir alle logistischen Rahmenbedingungen: Zeitfenster, Gebäudezugänge, Lastenaufzüge, Flächenverfügbarkeit sowie interne Abläufe inkl. Ressourcen- und Kapazitätsplanung.",
    imageSrc: `${ASSETS}/prozess-3.webp`,
  },
  {
    eyebrow: "Mit Auge fürs Detail.",
    title: "4. Demontage & Abtransport.",
    body: "Wir kümmern uns um alle operativen Details einer Büroauflösung: Einrichtung von Halteverbotszonen, Demontage, Sicherheitsabnahmen sowie die Koordination von Aufzügen und Zugängen.",
    imageSrc: `${ASSETS}/prozess-4.webp`,
  },
  {
    eyebrow: "Termingerecht & besenrein.",
    title: "5. Übergabe.",
    body: "Zum Abschluss übergeben wir die Fläche termingerecht und besenrein. Alle Schritte sind dokumentiert und für Sie jederzeit nachvollziehbar.",
    imageSrc: `${ASSETS}/prozess-5.webp`,
  },
];

export default function AnkaufProzessTimeline() {
  return (
    <section className="bg-mist-soft py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="wf-heading-h2 text-black mb-4">
            Die Nr. 1 für Büroauflösung ab 50 Arbeitsplätzen.
          </h2>
          <p className="text-black/70 text-base sm:text-lg leading-relaxed">
            Klar strukturierter Ablauf für eine effiziente Büroauflösung – digital
            erfasst und datenbasiert bewertet.
          </p>
        </div>

        <div>
          {STEPS.map((step, i) => {
            const imageLeft = i % 2 === 0;
            return (
              <div key={step.title}>
                <article className="grid overflow-hidden bg-abyss-deep text-white md:grid-cols-2 items-stretch shadow-[0_2px_3rem_rgba(2,4,5,0.25)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_4rem_rgba(2,4,5,0.4)]">
                  <div
                    className={`relative min-h-[13rem] md:min-h-[17rem] ${
                      imageLeft ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <Image
                      src={step.imageSrc}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                  <div
                    className={`flex flex-col justify-center p-8 sm:p-10 ${
                      imageLeft ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    <p className="text-signal text-sm font-bold mb-2">{step.eyebrow}</p>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-[-0.02em] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed">{step.body}</p>
                  </div>
                </article>

                {i < STEPS.length - 1 ? (
                  <div className="flex justify-center py-4" aria-hidden="true">
                    <svg
                      className="w-8 h-8 text-abyss-deep/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
