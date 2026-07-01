"use client";

// Stat-Achse (Design V1 "Stiller Beweis"):
// Drei große Einzel-Kennzahlen, je eine Zahl + eine pointierte Zeile.
// Eine dünne signal-Achse verbindet die Blöcke; ein eckiger signal-Marker
// "füllt" sich, sobald ein Block ins Bild scrollt. Die Zahlen zählen dezent
// hoch (Mono-Count-up). prefers-reduced-motion wird respektiert.

import { useEffect, useRef, useState } from "react";

type Stat = {
  index: string;
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
};

// Zahlen 1:1 aus den bestehenden Lifecycle-Bullets (nichts erfunden).
const STATS: Stat[] = [
  {
    index: "01",
    prefix: "⌀ ",
    value: 42,
    suffix: " %",
    label: "höhere Ankaufsangebote für Ihren Bestand.",
  },
  {
    index: "02",
    prefix: "⌀ ",
    value: 29,
    suffix: " %",
    label: "bessere Wiederverwertungsrate.",
  },
  {
    index: "03",
    value: 125,
    suffix: " kg",
    label: "CO₂ pro Arbeitsplatz gespart.",
  },
];

function StatBlock({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLLIElement>(null);
  const [display, setDisplay] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setDisplay(stat.value);
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(true);

          const duration = 1100;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(stat.value * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);

          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <li
      ref={ref}
      className={`dv1-stat-axis__item${active ? " is-active" : ""}`}
    >
      <span aria-hidden="true" className="dv1-stat-axis__marker" />
      <span className="dv1-stat-axis__index">{stat.index}</span>
      <p className="dv1-stat-axis__value">
        {stat.prefix}
        {display}
        {stat.suffix}
      </p>
      <p className="dv1-stat-axis__label">{stat.label}</p>
    </li>
  );
}

/** Drei ruhige Kennzahlen entlang einer dezenten signal-Achse. */
export default function StatAxisSection() {
  return (
    <section
      className="bg-abyss wf-padding-section-large"
      aria-labelledby="belege-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <h2
            id="belege-heading"
            className="wf-heading-h2 mb-16 max-w-2xl text-white sm:mb-24"
          >
            Belege statt Versprechen.
          </h2>

          <ol className="dv1-stat-axis">
            <span aria-hidden="true" className="dv1-stat-axis__line" />
            {STATS.map((stat) => (
              <StatBlock key={stat.index} stat={stat} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
