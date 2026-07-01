"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Stat = {
  prefix?: string;
  value: number;
  suffix: string;
  desc: string;
};

type Category = {
  id: string;
  label: string;
  eyebrow: string;
  main: Stat;
  secondary: Stat[];
};

const CATEGORIES: Category[] = [
  {
    id: "kosten",
    label: "Kosteneinsparung",
    eyebrow: "Was Ihr Unternehmen spart",
    main: { prefix: "⌀", value: 58, suffix: "%", desc: "Kostenersparnis durch refurbished Möbel" },
    secondary: [
      { prefix: "⌀", value: 42, suffix: "%", desc: "höhere Ankaufsangebote" },
      { prefix: "⌀", value: 29, suffix: "%", desc: "bessere Wiederverwertungsrate" },
    ],
  },
  {
    id: "co2",
    label: "CO₂-Einsparung",
    eyebrow: "Was Ihr Unternehmen schützt",
    main: { value: 125, suffix: " kg", desc: "CO₂ pro Arbeitsplatz eingespart" },
    secondary: [
      { value: 100, suffix: "%", desc: "zirkuläre Möbelentsorgung" },
      { prefix: "bis zu ", value: 85, suffix: "%", desc: "weniger Neuproduktion nötig" },
    ],
  },
  {
    id: "prozess",
    label: "Prozesseffizienz",
    eyebrow: "Was Ihr Team entlastet",
    main: { value: 100, suffix: "%", desc: "sorgenfreie Übergabe – ein Ansprechpartner" },
    secondary: [
      { value: 1, suffix: " Partner", desc: "für den gesamten Lebenszyklus" },
      { prefix: "⌀", value: 3, suffix: " Wo.", desc: "Projektlaufzeit" },
    ],
  },
];

function useCountUp(target: number, active: boolean, duration = 700) {
  const [display, setDisplay] = useState(active ? target : 0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!active) { setDisplay(0); return; }
    const start = performance.now();
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active, duration]);

  return display;
}

function StatDisplay({ stat, size = "main", active }: { stat: Stat; size?: "main" | "secondary"; active: boolean }) {
  const count = useCountUp(stat.value, active, size === "main" ? 800 : 600);
  return (
    <div className={`dv3-kpi__stat dv3-kpi__stat--${size}`}>
      <p className="dv3-kpi__num">
        {stat.prefix && <span className="dv3-kpi__prefix">{stat.prefix}</span>}
        <span className="dv3-kpi__val">{count}</span>
        <span className="dv3-kpi__suffix">{stat.suffix}</span>
      </p>
      <p className="dv3-kpi__desc">{stat.desc}</p>
    </div>
  );
}

/** V3: Interaktive KPI-Sektion – Kategorie wechseln, Zahlen zählen hoch. */
export default function DesignV3KpiSwitcher() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const [animKey, setAnimKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const activate = useCallback((id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    setAnimKey((k) => k + 1);
  }, [activeId]);

  // Count-up beim Hinein-Scrollen auslösen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  return (
    <section
      ref={sectionRef}
      className={`dv3-kpi wf-padding-section-large${isVisible ? " is-visible" : ""}`}
      aria-labelledby="dv3-kpi-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          {/* Header */}
          <div className="dv3-kpi__header">
            <h2 id="dv3-kpi-heading" className="dv3-kpi__heading">
              Messbar.<br className="hidden sm:inline" /> Transparent.<br className="hidden sm:inline" /> Steuerbar.
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="dv3-kpi__tabs" role="tablist" aria-label="KPI-Kategorien">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                type="button"
                aria-selected={activeId === cat.id}
                className={`dv3-kpi__tab${activeId === cat.id ? " is-active" : ""}`}
                onClick={() => activate(cat.id)}
              >
                <span className="dv3-kpi__tab-indicator" aria-hidden="true" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div
            key={animKey}
            className="dv3-kpi__panel"
            role="tabpanel"
            aria-label={active.label}
          >
            <div className="dv3-kpi__main-wrap">
              <StatDisplay stat={active.secondary[0]} size="secondary" active={isVisible} />
              <StatDisplay stat={active.main} size="main" active={isVisible} />
              <StatDisplay stat={active.secondary[1]} size="secondary" active={isVisible} />
            </div>
          </div>

          {/* Decorative grid ticker */}
          <div className="dv3-kpi__ticker" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="dv3-kpi__tick" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
