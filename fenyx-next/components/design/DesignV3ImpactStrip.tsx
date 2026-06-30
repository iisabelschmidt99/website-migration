"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const REFS = [
  {
    img: "/assets/Referenzen/delta-campus.png",
    company: "Delta Campus",
    type: "Büroauflösung & Einrichtung",
    desc: "Vollständige Bestandsaufnahme und nachhaltige Verwertung von über 800 Arbeitsplätzen.",
    metric: "800+ Arbeitsplätze",
  },
  {
    img: "/assets/Referenzen/signal-iduna.png",
    company: "Signal Iduna",
    type: "Bestandsmanagement",
    desc: "Digitale Inventarisierung und strukturierte Weiternutzung des kompletten Büromöbelbestands.",
    metric: "⌀ 42 % Kostenersparnis",
  },
  {
    img: "/assets/Referenzen/universal-music-group.png",
    company: "Universal Music Group",
    type: "Verwertung",
    desc: "Mitarbeiterverkauf und ESG-konforme Entsorgung nach internationalem Umzug.",
    metric: "100 % ESG-dokumentiert",
  },
  {
    img: "/assets/Referenzen/nunatak-group.png",
    company: "Nunatak Group",
    type: "Schlüsselfertige Einrichtung",
    desc: "Konzeption und Umsetzung eines modernen Büros mit nachhaltigem Möbelmix.",
    metric: "⌀ 58 % Kostenersparnis",
  },
  {
    img: "/assets/Referenzen/ernst-klett-verlag.webp",
    company: "Ernst Klett Verlag",
    type: "Büroauflösung",
    desc: "Gesamte Abwicklung von der Besichtigung bis zur lückenlosen Übergabedokumentation.",
    metric: "0 % Restentsorgungskosten",
  },
  {
    img: "/assets/Referenzen/reneo-group.png",
    company: "Reneo Group",
    type: "Bestandsmanagement & Verwertung",
    desc: "Plattformgestützte Erfassung und Verwertung nach Standortkonsolidierung.",
    metric: "⌀ 29 % höhere Rücklaufquote",
  },
];

/** Dreifaches Array: Kopie A | Kopie B (Mitte) | Kopie C */
const TRIPLED = [...REFS, ...REFS, ...REFS];

/** V3 – Manuelles Endlos-Horizontal-Scroll */
export default function DesignV3ImpactStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isJumping = useRef(false);

  /* IntersectionObserver für Einblend-Animation */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Endlos-Scroll: beim Mount zur Mitte springen, beim Scrollen teleportieren */
  useEffect(() => {
    const clip = clipRef.current;
    if (!clip) return;

    /* Nach Mount zur Mitte (Kopie B) springen */
    const jumpToMiddle = () => {
      const third = clip.scrollWidth / 3;
      clip.scrollLeft = third;
    };
    jumpToMiddle();

    const onScroll = () => {
      if (isJumping.current) return;
      const { scrollLeft, scrollWidth } = clip;
      const third = scrollWidth / 3;

      /* Letztes Drittel → zurück zur Mitte */
      if (scrollLeft >= third * 2) {
        isJumping.current = true;
        clip.scrollLeft = scrollLeft - third;
        requestAnimationFrame(() => { isJumping.current = false; });
      }
      /* Erstes Drittel → vorwärts zur Mitte */
      else if (scrollLeft < third) {
        isJumping.current = true;
        clip.scrollLeft = scrollLeft + third;
        requestAnimationFrame(() => { isJumping.current = false; });
      }
    };

    clip.addEventListener("scroll", onScroll, { passive: true });
    return () => clip.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`dv3-refs${visible ? " is-visible" : ""}`}
      aria-labelledby="dv3-refs-heading"
    >
      {/* Kopfzeile */}
      <div className="dv3-refs__head wf-padding-global">
        <div className="wf-container-large">
          <p className="dv3-refs__eyebrow">Ausgewählte Referenzen</p>
          <h2 id="dv3-refs-heading" className="dv3-refs__heading">
            Unternehmen, die wir begleitet haben.
          </h2>
        </div>
      </div>

      {/* Scrollbarer Clip */}
      <div
        ref={clipRef}
        className="dv3-refs__clip"
        role="region"
        aria-label="Referenzprojekte scrollen"
      >
        <div className="dv3-refs__track">
          {TRIPLED.map((r, i) => (
            <article
              key={`${r.company}-${i}`}
              className="dv3-refs__card"
              aria-hidden={i < REFS.length || i >= REFS.length * 2}
            >
              <div className="dv3-refs__card-img">
                <Image
                  src={r.img}
                  alt={i >= REFS.length && i < REFS.length * 2 ? r.company : ""}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 600px) 80vw, 480px"
                  quality={90}
                />
                <div className="dv3-refs__card-scrim" aria-hidden="true" />
              </div>
              <div className="dv3-refs__card-body">
                <p className="dv3-refs__card-company">{r.company}</p>
                <p className="dv3-refs__card-type">{r.type}</p>
                <p className="dv3-refs__card-desc">{r.desc}</p>
                <p className="dv3-refs__card-metric">{r.metric}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
