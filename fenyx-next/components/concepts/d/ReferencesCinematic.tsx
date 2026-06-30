"use client";

// Konzept D — Referenzen als cineastischer Showcase.
// Jede Referenz = großflächige Frame-Reihe: Bild mit clip-path-Wipe + Parallax,
// hochzählende KPI-Zahl, gestaffelt einsteigende Metadaten. Alternierend.
// Element-Animation: ClipReveal (Bild), CountUp (Zahl), Stagger (Text), Hover-Zoom.

import Image from "next/image";
import Link from "next/link";
import { CountUp, ClipReveal, Stagger, Rise, splitKpi } from "@/components/concepts/shared/anim";
import type { ReferenceProject } from "@/data/reference-projects";

type Props = { projects: ReferenceProject[] };

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function ReferencesCinematic({ projects }: Props) {
  return (
    <section className="dd-refs" aria-labelledby="dd-refs-heading">
      <div className="dd-refs__intro">
        <Rise tag="p" className="dd-refs__eyebrow">Ergebnisse aus der Praxis</Rise>
        <Rise tag="h2" className="dd-refs__heading" delay={120}>
          <span id="dd-refs-heading">Was bleibt, wenn ein Büro neu gedacht wird.</span>
        </Rise>
      </div>

      <div className="dd-refs__list">
        {projects.map((project, index) => {
          const kpi = project.stats[0];
          const flip = index % 2 === 1;
          const slug = project.href.split("/").filter(Boolean).at(-1);

          return (
            <article
              key={project.href}
              className={`dd-ref ${flip ? "dd-ref--flip" : ""}`}
              aria-labelledby={`dd-ref-${slug}-heading`}
            >
              <ClipReveal
                className="dd-ref__media"
                direction={flip ? "right" : "left"}
                parallax={42}
                durationMs={1200}
              >
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center dd-ref__img"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  loading="lazy"
                />
                <div className="dd-ref__media-scrim" aria-hidden="true" />
                <span className="dd-ref__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </ClipReveal>

              <Stagger className="dd-ref__body" step={110} y={32}>
                <p className="dd-ref__eyebrow anim-stagger">{project.eyebrow}</p>
                <h3 className="dd-ref__company anim-stagger" id={`dd-ref-${slug}-heading`}>
                  {project.heading}
                </h3>
                {kpi && (() => {
                  const { number, caption } = splitKpi(kpi);
                  return (
                    <div className="dd-ref__kpi anim-stagger">
                      <CountUp className="dd-ref__kpi-value" value={number} />
                      <span className="dd-ref__kpi-label">{caption}</span>
                    </div>
                  );
                })()}
                <p className="dd-ref__quote anim-stagger">{project.body}</p>
                <Link
                  href={project.href}
                  className="dd-ref__link anim-stagger"
                  data-track-event="select_item"
                  data-track-id={`dd_reference__open__${slug}`}
                  data-track-item-type="reference"
                  data-track-item-slug={slug}
                  data-track-label={project.heading}
                >
                  Zum Projekt
                  <ArrowRight />
                </Link>
              </Stagger>
            </article>
          );
        })}
      </div>
    </section>
  );
}
