"use client";

// Konzept E — Referenzen als redaktionelle, asymmetrische Galerie.
// Bild enthüllt per Up-Wipe (clip-path), KPI zählt hoch mit Signal-Unterstrich
// der von links einläuft, Pull-Quote groß gesetzt. Versetzte Spalten.
// Element-Animation: ClipReveal (up), CountUp, underline-draw, Stagger.

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

export default function ReferencesEditorialPremium({ projects }: Props) {
  return (
    <section className="de-refs" aria-labelledby="de-refs-heading">
      <div className="de-refs__intro">
        <Rise tag="p" className="de-refs__eyebrow">Ergebnisse aus der Praxis</Rise>
        <Rise tag="h2" className="de-refs__heading" delay={120}>
          <span id="de-refs-heading">Was bleibt, wenn ein Büro neu gedacht wird.</span>
        </Rise>
      </div>

      <div className="de-refs__gallery">
        {projects.map((project, index) => {
          const kpi = project.stats[0];
          // Asymmetrisches Magazin-Raster: Position rotiert über 3 Muster.
          const variant = index % 3; // 0 = breit, 1 = links versetzt, 2 = rechts versetzt
          const slug = project.href.split("/").filter(Boolean).at(-1);

          return (
            <article
              key={project.href}
              className={`de-ref de-ref--v${variant}`}
              aria-labelledby={`de-ref-${slug}-heading`}
            >
              <ClipReveal
                className="de-ref__media"
                direction="up"
                parallax={28}
                durationMs={1100}
              >
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center de-ref__img"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  loading="lazy"
                />
              </ClipReveal>

              <Stagger className="de-ref__body" step={100} y={26}>
                <p className="de-ref__eyebrow anim-stagger">{project.eyebrow}</p>
                <h3 className="de-ref__company anim-stagger" id={`de-ref-${slug}-heading`}>
                  {project.heading}
                </h3>
                <p className="de-ref__quote anim-stagger">„{project.body}“</p>
                {kpi && (() => {
                  const { number, caption } = splitKpi(kpi);
                  return (
                    <div className="de-ref__kpi anim-stagger">
                      <CountUp className="de-ref__kpi-value" value={number} />
                      <span className="de-ref__kpi-underline" aria-hidden="true" />
                      <span className="de-ref__kpi-label">{caption}</span>
                    </div>
                  );
                })()}
                <Link
                  href={project.href}
                  className="de-ref__link anim-stagger"
                  data-track-event="select_item"
                  data-track-id={`de_reference__open__${slug}`}
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
