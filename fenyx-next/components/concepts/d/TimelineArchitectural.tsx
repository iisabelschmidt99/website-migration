"use client";

// Konzept D – Timeline „Architectural Quiet"
// Brand-DNA: die grüne Scroll-Linie (SVG stroke-dashoffset, Logik aus
// LifecycleTrack übernommen), hier aber verfeinert: 1px-Linie bei 60 % Deckkraft,
// ECKIGE Punkte (rect statt circle), nummerierte Kapitel-Captions.
// Alternierende full-bleed-Bilder mit schlankem Text-Panel + Spec-Tabelle.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Spec = { label: string; value: string };

type Chapter = {
  step: number;
  eyebrow: string;
  title: string;
  body: string;
  specs: Spec[];
  href: string;
  imageSrc: string;
  imageAlt: string;
  align: "left" | "right";
};

const CHAPTERS: Chapter[] = [
  {
    step: 1,
    eyebrow: "Digitales Bestandsmanagement",
    title: "Voller Überblick. Digitale Präzision.",
    body:
      "Wir erfassen, bewerten und klassifizieren jeden Möbelgegenstand Ihres Bestands – digital, objektgenau und nachverfolgbar, bevor etwas entsorgt oder neu beschafft wird.",
    specs: [
      { label: "Erfassung", value: "digital & nachverfolgbar" },
      { label: "Bewertung", value: "objektgenau" },
      { label: "Datenbasis", value: "ESG-konform" },
    ],
    href: "/bestandsmanagement",
    imageSrc: "/assets/concepts/d/d-timeline.png",
    imageAlt:
      "Materialquerschnitt eines Büromöbels als technische Darstellung.",
    align: "left",
  },
  {
    step: 2,
    eyebrow: "Ganzheitliche Verwertung",
    title: "Maximaler Erlös. Null Aufwand.",
    body:
      "Von der kostenlosen Erstbesichtigung über den Mitarbeiterverkauf bis zur lückenlosen Dokumentation für Ihren ESG-Bericht – wir übernehmen die vollständige Verwertung.",
    specs: [
      { label: "Erstbesichtigung", value: "kostenlos vor Ort" },
      { label: "Erlössteigerung", value: "bis zu 42 %" },
      { label: "Übergabe", value: "100 % sorgenfrei" },
    ],
    href: "/verwertung/bueroaufloesung",
    imageSrc: "/assets/timeline/verwertung-besichtigung.webp",
    imageAlt:
      "Fenyx-Mitarbeitende bei der Besichtigung und Angebotserstellung vor Ort.",
    align: "right",
  },
  {
    step: 3,
    eyebrow: "Schlüsselfertige Einrichtung",
    title: "Ein Partner. Ein Prozess. Null Stress.",
    body:
      "Vom Konzept bis zur Montage richten wir Ihr Büro mit einem nachhaltigen Mix aus Bestand, Refurbished und Neu ein – termingerecht, budgetsicher und ESG-konform.",
    specs: [
      { label: "Materialmix", value: "Bestand · Refurbished · Neu" },
      { label: "CO₂ eingespart", value: "⌀ 125 kg / Platz" },
      { label: "Übergabe", value: "schlüsselfertig" },
    ],
    href: "/einrichtung/bueroeinrichtung",
    imageSrc: "/assets/timeline/Einrichtung-Header-Dropdown-Bild.webp",
    imageAlt: "Schlüsselfertig eingerichtetes, modernes Büro von Fenyx.",
    align: "left",
  },
];

function StepCaption({ active }: { active: number }) {
  return (
    <p className="dd-tl-steps" aria-label={`Schritt ${active} von 3`}>
      {[1, 2, 3].map((n, i) => (
        <span key={n} className="inline-flex items-center gap-2">
          <span
            className={`dd-tl-steps__n ${
              n === active ? "dd-tl-steps__n--active" : ""
            }`}
          >
            {String(n).padStart(2, "0")}
          </span>
          {i < 2 && <span aria-hidden="true">→</span>}
        </span>
      ))}
    </p>
  );
}

export default function TimelineArchitectural() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(SVGRectElement | null)[]>([]);
  const pathLengthRef = useRef(0);
  const dotPositionsRef = useRef<number[]>([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const path = pathRef.current;
    if (!track || !path) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const getCards = () =>
      track.querySelectorAll<HTMLElement>(".dd-tl-chapter");
    const getDots = () =>
      dotRefs.current.filter((d): d is SVGRectElement => d !== null);

    function resize() {
      if (!path || !track) return;
      const h = track.offsetHeight;
      path.setAttribute("d", `M 4 0 L 4 ${h}`);
      pathLengthRef.current = path.getTotalLength();
      path.style.strokeDasharray = String(pathLengthRef.current);
      path.style.strokeDashoffset = reduced
        ? "0"
        : String(pathLengthRef.current);

      dotPositionsRef.current = [];
      const cards = getCards();
      const dots = getDots();
      cards.forEach((card, i) => {
        const center = card.offsetTop + card.offsetHeight / 2;
        dotPositionsRef.current.push(center);
        // rect: 8×8, also y = center - 4 für Mittelpunkt
        if (dots[i]) dots[i].setAttribute("y", String(center - 4));
      });
    }

    function update() {
      if (!path || !track || !pathLengthRef.current) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = -(rect.height - vh * 0.15);
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(1, Math.max(0, progress));

      path.style.strokeDashoffset = reduced
        ? "0"
        : String(pathLengthRef.current * (1 - progress));

      const drawn = pathLengthRef.current * progress;
      getDots().forEach((dot, i) => {
        const isActive = reduced || drawn >= dotPositionsRef.current[i] - 8;
        dot.classList.toggle("is-active", isActive);
      });
    }

    function onFrame() {
      update();
      tickingRef.current = false;
    }
    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(onFrame);
      }
    }
    function onResize() {
      resize();
      onFrame();
    }

    resize();
    onFrame();

    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(track);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="dd-timeline" aria-labelledby="dd-timeline-heading">
      <div className="wf-padding-global wf-padding-section-large pb-0">
        <div className="wf-container-large">
          <div className="dd-rule mb-6" aria-hidden="true" />
          <p className="dd-eyebrow text-mist">
            <span className="dd-eyebrow__num">03 / 03</span>
            <span aria-hidden="true">—</span>
            <span>Der Fenyx-Prozess</span>
          </p>
          <h2
            id="dd-timeline-heading"
            className="mt-4 max-w-[18ch] font-heading text-h3 leading-tight tracking-[-0.02em] text-white"
          >
            Drei Schritte. Ein durchgängiger Prozess.
          </h2>
        </div>
      </div>

      <div ref={trackRef} className="dd-tl-track mt-12 lg:mt-16">
        <div className="dd-tl-line hidden lg:block" aria-hidden="true">
          <svg className="dd-tl-svg" xmlns="http://www.w3.org/2000/svg">
            <path ref={pathRef} className="dd-tl-path" d="M 4 0 L 4 100" />
            {CHAPTERS.map((_, i) => (
              <rect
                key={i}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="dd-tl-dot"
                x={0}
                y={0}
                width={8}
                height={8}
              />
            ))}
          </svg>
        </div>

        {CHAPTERS.map((chapter) => (
          <article
            key={chapter.step}
            data-align={chapter.align}
            className="dd-tl-chapter"
          >
            <div className="dd-tl-media">
              <Image
                src={chapter.imageSrc}
                alt={chapter.imageAlt}
                fill
                sizes="100vw"
                loading="lazy"
                className="dd-tl-img"
              />
              <div className="dd-tl-scrim" aria-hidden="true" />
            </div>

            <div className="dd-tl-inner">
              <div className="dd-tl-panel dd-reveal">
                <StepCaption active={chapter.step} />

                <p className="mt-5 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-signal">
                  {chapter.eyebrow}
                </p>
                <h3 className="mt-3 font-heading text-2xl leading-tight tracking-[-0.02em] text-white">
                  {chapter.title}
                </h3>
                <p className="dd-measure mt-4 font-sans text-sm leading-relaxed text-mist">
                  {chapter.body}
                </p>

                <dl className="dd-spec mt-7">
                  {chapter.specs.map((spec) => (
                    <div key={spec.label} className="dd-spec__row">
                      <dt className="dd-spec__label">{spec.label}</dt>
                      <dd className="dd-spec__value">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href={chapter.href}
                  className="dd-focus group mt-8 inline-flex min-h-[44px] items-center gap-2 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-signal transition-colors duration-200"
                >
                  Mehr erfahren
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
