/** V3: Light-Break mit Mono-Kennzahlen – bewusster Kontrast zum Dark-Theme. */
export default function DesignV3MetricsBand() {
  const metrics = [
    { value: "⌀ 42 %", label: "höhere Ankaufsangebote" },
    { value: "⌀ 29 %", label: "bessere Wiederverwertungsrate" },
    { value: "125 kg", label: "CO₂ pro Arbeitsplatz gespart" },
  ];

  return (
    <section className="dv3-metrics wf-padding-section-large" aria-labelledby="dv3-metrics-heading">
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <h2 id="dv3-metrics-heading" className="font-heading text-h3 tracking-fenyx mb-12 text-abyss-deep sm:mb-16">
            Messbar. Transparent. Steuerbar.
          </h2>
          <div className="dv3-metrics__grid">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="dv3-metrics__value">{m.value}</p>
                <p className="dv3-metrics__label">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
