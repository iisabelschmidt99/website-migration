"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ReferenceProject } from "@/data/reference-projects";

type ReferencesSignalProps = {
  projects: ReferenceProject[];
};

/**
 * Referenzen „Signal Quiet" – ruhige Horizontal-Rail mit Scroll-Snap
 * (kein Endlos-Loop). Pfeil-Buttons für Tastatur/Maus, versteckte
 * Scrollbar und sanftes Rand-Fade über mask-image.
 */
export default function ReferencesSignal({ projects }: ReferencesSignalProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      rail.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const amount = Math.min(rail.clientWidth * 0.8, 420);
    rail.scrollBy({
      left: dir * amount,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  return (
    <section
      className="de-refs wf-padding-section-large"
      data-de-section="Referenzen"
      aria-labelledby="de-refs-heading"
    >
      <div className="wf-padding-global mb-10 sm:mb-14">
        <div className="wf-container-large">
          <div className="flex items-center gap-4">
            <p className="de-eyebrow text-signal/70">Ausgewählte Referenzen</p>
            <span className="de-refs__rule" aria-hidden="true" />
          </div>
          <div className="mt-5 flex items-end justify-between gap-6">
            <h2
              id="de-refs-heading"
              className="font-heading text-h3 tracking-fenyx text-white max-w-[16ch]"
            >
              Unternehmen, die wir begleitet haben.
            </h2>
            <div className="hidden shrink-0 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={atStart}
                className="de-refs__nav focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-abyss-deep cursor-pointer disabled:cursor-not-allowed"
                aria-label="Vorherige Referenzen"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 12H5M11 18l-6-6 6-6"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={atEnd}
                className="de-refs__nav focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-abyss-deep cursor-pointer disabled:cursor-not-allowed"
                aria-label="Weitere Referenzen"
              >
                <svg
                  className="h-4 w-4"
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
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="de-refs__rail wf-padding-global"
        tabIndex={0}
        role="region"
        aria-label="Referenzprojekte horizontal scrollen"
      >
        {projects.map((project) => {
          const kpi = project.stats[0];
          return (
            <article key={project.href} className="de-refs__card">
              <Link
                href={project.href}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-abyss-deep"
              >
                <div className="de-refs__card-media">
                  <span className="de-refs__card-tag de-eyebrow">
                    {project.tag}
                  </span>
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 640px) 80vw, 380px"
                    className="de-refs__card-img"
                  />
                </div>
                <div className="mt-5">
                  <p className="font-heading text-lg font-bold tracking-fenyx text-white">
                    {project.heading}
                  </p>
                  {kpi ? (
                    <p className="mt-2">
                      <span className="de-refs__card-kpi">{kpi.value}</span>
                      <span className="ml-2 text-sm text-mist">
                        {kpi.label}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-mist">{project.eyebrow}</p>
                  )}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
