"use client";

// Konzept F — Bento-Referenzen mit echten Photos + großem KPI pro Kachel.
// Variierende Span-Größen (big/wide/tall), Hover = image scale 1.04.

import Image from "next/image";
import Link from "next/link";
import type { ReferenceProject } from "@/data/reference-projects";

type ReferencesArchitecturalProps = {
  projects: ReferenceProject[];
};

// Bento-Rhythmus für bis zu 6 Kacheln.
const SPAN_BY_INDEX = ["big", "wide", "", "tall", "wide", ""] as const;

export default function ReferencesArchitectural({
  projects,
}: ReferencesArchitecturalProps) {
  const tiles = projects.slice(0, 6);

  return (
    <section
      className="df-refs df-root"
      aria-labelledby="df-refs-heading"
    >
      <div className="df-refs__intro">
        <p className="df-refs__eyebrow">
          <span>03 / 03 — Ergebnisse aus der Praxis</span>
        </p>
        <h2 id="df-refs-heading" className="df-refs__heading">
          Was bleibt, wenn ein Büro neu gedacht wird.
        </h2>
      </div>

      <div className="df-refs__grid">
        {tiles.map((project, index) => {
          const span = SPAN_BY_INDEX[index] ?? "";
          const kpi = project.stats[0];
          const slug = project.href.split("/").filter(Boolean).at(-1);
          return (
            <Link
              key={project.href}
              href={project.href}
              data-span={span || undefined}
              className={`df-ref-tile ${span ? `df-ref-tile--${span}` : ""}`}
              aria-label={`Referenz ${project.heading} ansehen`}
              data-track-event="select_item"
              data-track-id={`df_reference__open__${slug}`}
              data-track-item-type="reference"
              data-track-item-slug={slug}
              data-track-label={project.heading}
            >
              <div className="df-ref-tile__img">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes={
                    span === "big"
                      ? "(max-width: 768px) 100vw, 50vw"
                      : span === "wide" || span === "tall"
                        ? "(max-width: 768px) 100vw, 25vw"
                        : "(max-width: 768px) 100vw, 25vw"
                  }
                  loading="lazy"
                />
              </div>
              <div className="df-ref-tile__scrim" aria-hidden="true" />
              <div className="df-ref-tile__body">
                <p className="df-ref-tile__eyebrow">{project.eyebrow}</p>
                <h3 className="df-ref-tile__company">{project.heading}</h3>
                {kpi && (
                  <div className="df-ref-tile__kpi">
                    <span className="df-ref-tile__kpi-value">
                      {kpi.value}
                    </span>
                    <span className="df-ref-tile__kpi-label">
                      {kpi.label}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
