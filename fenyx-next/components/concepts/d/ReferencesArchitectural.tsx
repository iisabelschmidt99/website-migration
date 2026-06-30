"use client";

// Konzept D – Referenzen „Architectural Quiet"
// Bento-Grid mit variierenden Kachelgrößen (desktop), einspaltig auf mobil.
// Jede Kachel: Bild füllt die Kachel, Overlay mit Firmenname + EINER großen KPI
// unten links. Hover: Bild skaliert 1.03, Overlay dunkelt nach.
// Reveal: primär CSS Scroll-Driven (concept.css), Fallback per
// IntersectionObserver (nur wenn animation-timeline nicht unterstützt wird).

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ReferenceProject } from "@/data/reference-projects";

type ReferencesArchitecturalProps = {
  projects: ReferenceProject[];
};

// Bento-Rhythmus für bis zu 6 Kacheln (Index → Span-Variante).
const SPAN_BY_INDEX = ["big", "wide", "", "", "full", "wide"] as const;

export default function ReferencesArchitectural({
  projects,
}: ReferencesArchitecturalProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const tiles = projects.slice(0, 6);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const supportsScrollDriven =
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: view()");

    // CSS übernimmt den Reveal bereits (scroll-driven) oder Bewegung ist aus.
    if (reduced || supportsScrollDriven) return;

    // Fallback: IntersectionObserver
    grid.classList.add("dd-io-on");
    const items = Array.from(
      grid.querySelectorAll<HTMLElement>(".dd-reveal")
    );

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("dd-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("dd-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="dd-refs wf-padding-section-large"
      aria-labelledby="dd-refs-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="dd-rule mb-6" aria-hidden="true" />
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="dd-eyebrow text-mist">
                <span>Referenzen</span>
              </p>
              <h2
                id="dd-refs-heading"
                className="mt-4 font-heading text-h3 leading-tight tracking-[-0.02em] text-white"
              >
                Ergebnisse aus der Praxis.
              </h2>
            </div>
            <Link
              href="/referenzen"
              className="dd-focus group inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-mist transition-colors hover:text-signal"
            >
              Alle Referenzen
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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

          <div ref={gridRef} className="dd-bento">
            {tiles.map((project, index) => {
              const span = SPAN_BY_INDEX[index] ?? "";
              const kpi = project.stats[0];
              const isBig = span === "big";
              return (
                <Link
                  key={project.href}
                  href={project.href}
                  data-span={span || undefined}
                  className="dd-tile dd-reveal dd-focus group cursor-pointer"
                  style={{ ["--dd-delay" as string]: `${index * 70}ms` }}
                  aria-label={`Referenz ${project.heading} ansehen`}
                >
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    fill
                    sizes={
                      isBig
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 25vw"
                    }
                    loading="lazy"
                    className="dd-tile__img"
                  />
                  <div className="dd-tile__scrim" aria-hidden="true" />
                  <div className="dd-tile__body">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-mist-soft/80">
                      {project.eyebrow}
                    </p>
                    <p
                      className={`mt-1 font-heading tracking-[-0.02em] text-white ${
                        isBig ? "text-2xl" : "text-lg"
                      }`}
                    >
                      {project.heading}
                    </p>
                    {kpi && (
                      <div className="mt-4 flex items-baseline gap-2">
                        <span
                          className={`font-heading leading-none text-signal ${
                            isBig ? "text-5xl" : "text-3xl"
                          }`}
                        >
                          {kpi.value}
                        </span>
                        <span className="max-w-[16ch] font-sans text-[11px] leading-tight text-mist-soft/70">
                          {kpi.label}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
