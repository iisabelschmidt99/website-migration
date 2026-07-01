"use client";

// Konzept H (Klon von F) — Referenzen als technisches Bento-Raster.
// Kacheln treten gestaffelt mit Scale+Clip ein, KPI zählt hoch, Hover hebt
// die Kachel an + zoomt das Bild + blendet die Caption ein.
// Element-Animation: Stagger (Kacheln), ClipReveal (scale), CountUp, Hover.

import Image from "next/image";
import Link from "next/link";
import { CountUp, ClipReveal, Stagger, Rise, splitKpi } from "@/components/concepts/shared/anim";
import type { ReferenceProject } from "@/data/reference-projects";

type Props = { projects: ReferenceProject[] };

// Bento-Rhythmus: variierende Kachelgrößen (max. 6).
const SPAN = ["big", "wide", "", "tall", "wide", ""] as const;

export default function ReferencesArchitectural({ projects }: Props) {
  const tiles = projects.slice(0, 6);

  return (
    <section className="dh-refs dh-root" aria-labelledby="dh-refs-heading">
      <div className="dh-refs__intro">
        <Rise tag="p" className="dh-refs__eyebrow">
          <span>03 / 03 — Ergebnisse aus der Praxis</span>
        </Rise>
        <Rise tag="h2" className="dh-refs__heading" delay={120}>
          <span id="dh-refs-heading">Was bleibt, wenn ein Büro neu gedacht wird.</span>
        </Rise>
      </div>

      <Stagger className="dh-refs__grid" step={110} y={36}>
        {tiles.map((project, index) => {
          const span = SPAN[index] ?? "";
          const kpi = project.stats[0];
          const slug = project.href.split("/").filter(Boolean).at(-1);
          return (
            <Link
              key={project.href}
              href={project.href}
              data-span={span || undefined}
              className={`dh-ref-tile anim-stagger ${span ? `dh-ref-tile--${span}` : ""}`}
              aria-label={`Referenz ${project.heading} ansehen`}
              data-track-event="select_item"
              data-track-id={`df_reference__open__${slug}`}
              data-track-item-type="reference"
              data-track-item-slug={slug}
              data-track-label={project.heading}
            >
              <ClipReveal
                className="dh-ref-tile__media"
                direction="scale"
                durationMs={1000}
              >
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center dh-ref-tile__img"
                  sizes={span === "big" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                  loading="lazy"
                />
              </ClipReveal>
              <div className="dh-ref-tile__scrim" aria-hidden="true" />
              <div className="dh-ref-tile__body">
                <p className="dh-ref-tile__eyebrow">{project.eyebrow}</p>
                <h3 className="dh-ref-tile__company">{project.heading}</h3>
                {kpi && (() => {
                  const { number, caption } = splitKpi(kpi);
                  return (
                    <div className="dh-ref-tile__kpi">
                      <CountUp className="dh-ref-tile__kpi-value" value={number} />
                      <span className="dh-ref-tile__kpi-label">{caption}</span>
                    </div>
                  );
                })()}
              </div>
            </Link>
          );
        })}
      </Stagger>
    </section>
  );
}
