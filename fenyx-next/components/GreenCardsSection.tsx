type GreenCard = {
  title: string;
  body: string;
};

type GreenCardsSectionProps = {
  heading: string;
  intro?: string;
  cards: GreenCard[];
  variant?: "signal" | "dark";
};

/** Drei Vorteils-Karten auf Signal-Grün (Webflow section_cards signal) bzw. dunkle Variante. */
export default function GreenCardsSection({
  heading,
  intro,
  cards,
  variant = "signal",
}: GreenCardsSectionProps) {
  if (variant === "dark") {
    return (
      <section
        className="inv-section--dark py-20 sm:py-28"
        aria-labelledby="green-cards-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2
              id="green-cards-heading"
              className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-4 text-white"
            >
              {heading}
            </h2>
            {intro ? (
              <p className="text-base leading-relaxed text-mist">{intro}</p>
            ) : null}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {cards.map((card) => (
              <article key={card.title} className="bg-abyss p-8 text-center">
                <h3 className="text-xl font-heading tracking-[-0.02em] mb-3 text-white">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-mist">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20 sm:py-28 bg-signal text-abyss-deep"
      aria-labelledby="green-cards-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2
            id="green-cards-heading"
            className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-4"
          >
            {heading}
          </h2>
          {intro ? (
            <p className="text-base leading-relaxed text-abyss-deep/80">{intro}</p>
          ) : null}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <article key={card.title}>
              <h3 className="text-lg font-heading tracking-[-0.02em] mb-3">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-abyss-deep/85">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
