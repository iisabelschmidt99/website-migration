// Ankauf-LP: „Wie berechnet sich Ihr Erlös?" – A − B = C.
import CtaButton from "./CtaButton";

type Card = { label: string; title: string; body: string };

const CARDS: Card[] = [
  {
    label: "A",
    title: "Was sind Ihre Möbel wert?",
    body: "Wir bewerten Ihren Bestand präzise nach Modell, Menge, Zustand und Marktpotenzial.",
  },
  {
    label: "B",
    title: "Unsere Dienstleistungen",
    body: "Räumung, Demontage, Logistik, Vermarktung und Verwertung werden transparent kalkuliert.",
  },
  {
    label: "C",
    title: "Ihr Erlös",
    body: "Aus Möbelwert minus Leistungen ergibt sich ein klar nachvollziehbarer Nettoerlös.",
  },
];

function ErloesCard({ card }: { card: Card }) {
  return (
    <div className="flex-1 bg-black px-8 py-10 text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl">
      <p className="text-signal font-heading text-xl font-bold mb-3">{card.label}</p>
      <h3 className="font-heading text-lg font-bold text-white mb-3">{card.title}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{card.body}</p>
    </div>
  );
}

export default function AnkaufErloesRechnung() {
  return (
    <section className="bg-abyss-deep text-white py-16 sm:py-24">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="wf-heading-h2 text-white text-center mb-12 sm:mb-16">
          Wie berechnet sich Ihr Erlös bei einer Büroauflösung?
        </h2>

        <div className="flex flex-col items-stretch justify-center gap-6 lg:gap-8 lg:flex-row lg:items-center">
          <ErloesCard card={CARDS[0]} />
          <span className="text-signal text-3xl font-bold text-center" aria-hidden="true">
            −
          </span>
          <ErloesCard card={CARDS[1]} />
          <span className="text-signal text-3xl font-bold text-center" aria-hidden="true">
            =
          </span>
          <ErloesCard card={CARDS[2]} />
        </div>

        <div className="text-center mt-10">
          <CtaButton href="/#kontakt">Unternehmenspräsentation herunterladen</CtaButton>
        </div>
      </div>
    </section>
  );
}
