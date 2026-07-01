const ROWS = [
  {
    provides: "Digitale Inventarisierung und strukturierte Bestandsübersicht.",
    value: "Transparenz über Kosten, CO₂ und Wiederverwendung – statt Blindflug.",
  },
  {
    provides: "Optimale Verwertung unabhängig von Hersteller, Kategorie und Zustand.",
    value: "Bis zu 42 % höherer Erlös bei sorgenfreier Übergabe.",
  },
  {
    provides: "Schlüsselfertige Einrichtung aus Bestand, Refurbished und Neu.",
    value: "⌀ 58 % Einsparung bei innovativer Büroeinrichtung.",
  },
];

/** V3: Fenyx liefert ↔ Sie gewinnen – ailsa-inspiriert, techy-nüchtern. */
export default function DesignV3ValueDuo() {
  return (
    <section className="dv3-value-duo wf-padding-section-large" aria-labelledby="dv3-duo-heading">
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <h2 id="dv3-duo-heading" className="wf-heading-h2 mb-8 text-white sm:mb-12">
            Fenyx liefert. Sie gewinnen.
          </h2>
          {ROWS.map((row, i) => (
            <div key={i} className="dv3-value-duo__row">
              <div>
                <p className="dv3-value-duo__side-label">Fenyx liefert</p>
                <p className="dv3-value-duo__side-text">{row.provides}</p>
              </div>
              <div>
                <p className="dv3-value-duo__side-label">Ihr Nutzen</p>
                <p className="dv3-value-duo__side-text dv3-value-duo__side-text--muted">
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
