// Ankauf-LP: „Von der Bewertung bis zur Verwertung." – 4 Kacheln (Foto + schwarze Textbox).
import Image from "next/image";

type Tile = { title: string; body: string; imageSrc: string };

const A = "/assets/leistungen/ankauf";

const TILES: Tile[] = [
  {
    title: "Möbelwert erkennen.",
    body: "Wir bewerten Ihren Bestand präzise nach Modell, Menge und Marktpotenzial – und erstellen darauf basierend ein belastbares Angebot.",
    imageSrc: `${A}/tile-moebelwert.webp`,
  },
  {
    title: "Gezielt vermarkten.",
    body: "Ihr Bestand wird gezielt über unser Netzwerk von über 120+ geprüften Bietern platziert – Sie erhalten ein klares, geprüftes Angebot mit maximalem Erlös. Auf Wunsch organisieren wir einen internen Mitarbeiterverkauf.",
    imageSrc: `${A}/tile-vermarkten.webp`,
  },
  {
    title: "Logistik effizient steuern.",
    body: "Wir übernehmen Demontage, Abtransport, Zwischenlagerung und termingerechte Abwicklung – abgestimmt auf Ihre Projektzeitpläne und Flächenverfügbarkeit.",
    imageSrc: `${A}/tile-logistik.webp`,
  },
  {
    title: "Ein persönlicher Ansprechpartner.",
    body: "Mit Fenyx erreichen Sie per Kurzwahl Ihren festen Ansprechpartner, der den gesamten Prozess zentral steuert – zuverlässig, transparent und mit minimalem Aufwand für Ihr Team.",
    imageSrc: `${A}/tile-ansprechpartner.webp`,
  },
];

export default function AnkaufFeatureTiles() {
  return (
    <section className="bg-mist-soft py-16 sm:py-24">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="wf-heading-h2 text-black text-center mb-12 sm:mb-16">
          Von der Bewertung bis zur Verwertung.
        </h2>
        <div className="grid gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile) => (
            <article
              key={tile.title}
              className="flex flex-col transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={tile.imageSrc}
                  alt={tile.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="flex-1 bg-black text-white px-6 py-7 text-center">
                <h3 className="font-heading text-lg font-bold mb-3">{tile.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{tile.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
