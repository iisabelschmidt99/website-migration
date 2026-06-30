"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Spec = { label: string; value: string };

type Chapter = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  specs: Spec[];
  href: string;
  imageSrc: string;
  imageAlt: string;
};

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    eyebrow: "Digitales Bestandsmanagement",
    title: "Voller Überblick. Digitale Präzision.",
    body: "Wir erfassen, bewerten und klassifizieren jeden Möbelgegenstand Ihres Bestands – digital, präzise, nachverfolgbar. Bevor irgendetwas entsorgt oder neu bestellt wird.",
    specs: [
      { label: "Erfassung", value: "100 % digital" },
      { label: "Ankaufsangebote", value: "⌀ 42 % höher" },
      { label: "Wiederverwertung", value: "⌀ 29 % besser" },
    ],
    href: "/bestandsmanagement",
    imageSrc: "/assets/concepts/e/e-timeline.png",
    imageAlt: "Wireframe-Darstellung eines Bürostuhls auf dunklem Grund.",
  },
  {
    index: "02",
    eyebrow: "Ganzheitliche Verwertung",
    title: "Maximaler Erlös. Null Aufwand.",
    body: "Wir übernehmen die vollständige Verwertung – von der kostenlosen Erstbesichtigung über den Mitarbeiterverkauf bis zur lückenlosen Dokumentation für Ihren ESG-Bericht.",
    specs: [
      { label: "Erstbesichtigung", value: "kostenlos" },
      { label: "Erlössteigerung", value: "bis zu 42 %" },
      { label: "Übergabe", value: "100 % sorgenfrei" },
    ],
    href: "/verwertung/bueroaufloesung",
    imageSrc: "/assets/timeline/verwertung-besichtigung.webp",
    imageAlt: "Besichtigung und Angebotserstellung bei einer Büroauflösung.",
  },
  {
    index: "03",
    eyebrow: "Schlüsselfertige Einrichtung",
    title: "Ein Partner. Ein Prozess. Null Stress.",
    body: "Vom Konzept bis zur Montage richten wir Ihr Büro mit einem nachhaltigen Mix aus Bestand, Refurbished und Neu ein – termingerecht, budgetsicher, ESG-konform.",
    specs: [
      { label: "Kostenersparnis", value: "⌀ 58 %" },
      { label: "CO₂ / Arbeitsplatz", value: "⌀ 125 kg" },
      { label: "Übergabe", value: "schlüsselfertig" },
    ],
    href: "/einrichtung/bueroeinrichtung",
    imageSrc: "/assets/timeline/Einrichtung-Header-Dropdown-Bild.webp",
    imageAlt: "Schlüsselfertig eingerichtetes, modernes Büro.",
  },
];

export default function TimelineSignal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  // Scroll-getriebener Fortschritt (0–1) über die gesamte Sektion.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        const scrolled = -rect.top;
        const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
        setProgress(p);
        setActive(rect.top < vh * 0.5 && rect.bottom > vh * 0.5);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Kapitel-Einblendung via IntersectionObserver (transform/opacity).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const chapters = section.querySelectorAll<HTMLElement>(".de-timeline__chapter");
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.25 },
    );
    chapters.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="de-timeline"
      data-de-section="Leistungen"
      aria-labelledby="de-timeline-heading"
    >
      <h2 id="de-timeline-heading" className="sr-only">
        Der Fenyx-Prozess in drei Kapiteln
      </h2>

      {/* Numerischer Fortschritt links (ersetzt die grüne SVG-Linie) */}
      <div
        className={`de-timeline__progress hidden lg:flex${active ? " is-active" : ""}`}
        aria-hidden="true"
      >
        <span className="de-timeline__progress-num">
          {String(Math.round(progress * 100)).padStart(2, "0")}%
        </span>
        <span className="de-timeline__progress-track">
          <span
            className="de-timeline__progress-fill"
            style={{ "--de-progress": progress } as React.CSSProperties}
          />
        </span>
        <span className="de-timeline__progress-cap">Prozess</span>
      </div>

      {CHAPTERS.map((ch) => (
        <article key={ch.index} className="de-timeline__chapter">
          <p className="de-timeline__index" aria-hidden="true">
            {ch.index}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%]">
            <div className="de-timeline__panel wf-padding-global py-16 lg:py-24">
              <div className="max-w-xl lg:pr-10">
                <p className="de-eyebrow text-signal/70">{ch.eyebrow}</p>
                <h3 className="de-timeline__title">{ch.title}</h3>
                <p className="de-timeline__body">{ch.body}</p>

                <dl className="de-spec">
                  {ch.specs.map((spec) => (
                    <div key={spec.label} className="de-spec__row">
                      <dt className="de-spec__label de-eyebrow">{spec.label}</dt>
                      <dd className="de-spec__value">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href={ch.href}
                  className="group mt-8 inline-flex min-h-[44px] items-center gap-2 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-abyss-deep"
                >
                  Mehr erfahren
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="de-timeline__media">
              <Image
                src={ch.imageSrc}
                alt={ch.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="de-timeline__media-img"
              />
              <div className="de-timeline__media-scrim" aria-hidden="true" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
