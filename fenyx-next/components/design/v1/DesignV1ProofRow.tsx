"use client";

import { useEffect, useRef, useState } from "react";

type ProofStat = {
  id: string;
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  staggerMs?: number;
};

const PROOF_STATS: ProofStat[] = [
  {
    id: "refurbished",
    prefix: "⌀",
    value: 58,
    suffix: "%",
    label: "Kostenersparnis durch refurbished Möbel",
    staggerMs: 0,
  },
  {
    id: "ankauf",
    prefix: "⌀",
    value: 42,
    suffix: "%",
    label: "höhere Ankaufsangebote",
    staggerMs: 100,
  },
  {
    id: "wiederverwertung",
    prefix: "⌀",
    value: 29,
    suffix: "%",
    label: "bessere Wiederverwertungsrate",
    staggerMs: 200,
  },
  {
    id: "co2",
    value: 125,
    suffix: "kg",
    label: "CO₂ pro Arbeitsplatz gespart",
    staggerMs: 300,
  },
];

function ProofStatItem({ stat }: { stat: ProofStat }) {
  const ref = useRef<HTMLLIElement>(null);
  const [display, setDisplay] = useState(0);
  const [active, setActive] = useState(false);
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cancelAnimation = () => {
      window.clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };

    const runCountUp = () => {
      cancelAnimation();
      setActive(true);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        setDisplay(stat.value);
        return;
      }

      setDisplay(0);
      const delay = stat.staggerMs ?? 0;
      const duration = 1400;

      timeoutRef.current = window.setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(stat.value * eased));
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      }, delay);
    };

    const reset = () => {
      cancelAnimation();
      setActive(false);
      setDisplay(0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            runCountUp();
          } else {
            reset();
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);

    return () => {
      cancelAnimation();
      observer.disconnect();
    };
  }, [stat.staggerMs, stat.value]);

  return (
    <li
      ref={ref}
      className={`dv1-proof-row__item${active ? " is-active" : ""}`}
      aria-label={`${stat.prefix ?? ""}${stat.value}${stat.suffix ?? ""} ${stat.label}`}
    >
      <p className="dv1-proof-row__value">
        {stat.prefix ? (
          <span className="dv1-proof-row__prefix">{stat.prefix}</span>
        ) : null}
        <span className="dv1-proof-row__num">{display}</span>
        {stat.suffix ? (
          <span className="dv1-proof-row__suffix">{stat.suffix}</span>
        ) : null}
      </p>
      <p className="dv1-proof-row__label">{stat.label}</p>
    </li>
  );
}

/** V1: vier Kennzahlen – Count-up wiederholt sich beim erneuten Scroll in die Section. */
export default function DesignV1ProofRow() {
  return (
    <section
      className="dv1-proof-row wf-padding-section-large"
      aria-labelledby="dv1-proof-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <h2 id="dv1-proof-heading" className="wf-heading-h2 mb-12 text-white sm:mb-16">
            Belege statt Versprechen.
          </h2>
          <ol className="dv1-proof-row__grid">
            {PROOF_STATS.map((stat) => (
              <ProofStatItem key={stat.id} stat={stat} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
