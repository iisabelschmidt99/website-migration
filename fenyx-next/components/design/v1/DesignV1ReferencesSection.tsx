"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ReferenceProject } from "@/data/reference-projects";

type DesignV1ReferencesSectionProps = {
  projects: ReferenceProject[];
  limit?: number;
  heading?: string;
  id?: string;
};

/** Leerzeichen vor % entfernen und "ca. " / "ca." Prefix wegstreifen. */
function formatStatValue(value: string): string {
  return value.replace(/^ca\.\s*/i, "").replace(/\s+(?=%)/g, "");
}

/**
 * V1-Referenzen: Vollbild-Slider – weiße KPI-Zahl, grünes Label, 3 Stats pro Projekt.
 */
export default function DesignV1ReferencesSection({
  projects,
  limit = 5,
  heading = "Ergebnisse aus der Praxis.",
  id = "referenz-projekte",
}: DesignV1ReferencesSectionProps) {
  const featured = projects.slice(0, limit);
  const railRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const slides = Array.from(rail.querySelectorAll<HTMLElement>("[data-slide]"));
    if (!slides.length) return;

    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;

    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - railCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    updateActiveIndex();
    rail.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex, { passive: true });

    return () => {
      rail.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex, featured.length]);

  return (
    <section
      id={id}
      className="dv1-refs dv1-refs--cinema"
      aria-labelledby="dv1-refs-heading"
    >
      <div className="wf-padding-global dv1-refs__header-wrap">
        <h2 id="dv1-refs-heading" className="wf-heading-h2 text-white">
          {heading}
        </h2>
      </div>

      <ul
        ref={railRef}
        className="dv1-refs__cinema-rail"
        aria-label="Referenzprojekte"
      >
        {featured.map((project) => (
          <li key={project.href} data-slide>
            <Link href={project.href} className="dv1-refs__cinema-slide">
              <div className="dv1-refs__cinema-media">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center dv1-refs__cinema-img"
                  sizes="85vw"
                  loading="lazy"
                />
                <div className="dv1-refs__cinema-scrim" aria-hidden="true" />
              </div>
              <div className="dv1-refs__cinema-copy">
                <p className="dv1-refs__cinema-company">{project.heading}</p>
                {project.stats.length > 0 ? (
                  <ul className="dv1-refs__cinema-kpis">
                    {project.stats.map((stat) => (
                      <li key={`${project.href}-${stat.value}`}>
                        <span className="dv1-refs__cinema-kpi-value">
                          {formatStatValue(stat.label)}
                        </span>
                        <span className="dv1-refs__cinema-kpi-label">
                          {stat.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="dv1-refs__cinema-footer wf-padding-global">
        <div
          className="dv1-refs__cinema-dots"
          role="tablist"
          aria-label="Slide-Navigation"
        >
          {featured.map((project, i) => (
            <button
              key={project.href}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Slide ${i + 1}: ${project.heading}`}
              className={`dv1-refs__cinema-dot${
                i === activeIndex ? " is-active" : ""
              }`}
              onClick={() => {
                const rail = railRef.current;
                const slide =
                  rail?.querySelectorAll<HTMLElement>("[data-slide]")[i];
                slide?.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                });
              }}
            />
          ))}
        </div>
        <Link href="/referenzen" className="dv1-refs__all-link">
          Alle Referenzen
        </Link>
      </div>
    </section>
  );
}
