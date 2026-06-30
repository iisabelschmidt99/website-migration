"use client";

// Konzept E — Referenzen als editorialer Single-Column-Stack.
// Pro Referenz: 4:5-Portrait-Fotografie (Subjekt) + editorialer Textblock.
// Pull-Quote, ein KPI als Signal-Outline. Alternierend links/rechts.

import Image from "next/image";
import Link from "next/link";
import { Reveal, WordReveal } from "./Reveal";
import type { ReferenceProject } from "@/data/reference-projects";

type ReferencesEditorialPremiumProps = {
  projects: ReferenceProject[];
};

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function ReferencesEditorialPremium({
  projects,
}: ReferencesEditorialPremiumProps) {
  return (
    <section
      className="de-refs"
      aria-labelledby="de-refs-heading"
    >
      <div className="de-refs__intro">
        <p className="de-refs__eyebrow">Ergebnisse aus der Praxis</p>
        <WordReveal
          tag="h2"
          text="Was bleibt, wenn ein Büro neu gedacht wird."
          className="de-refs__heading"
          id="de-refs-heading"
        />
      </div>

      <div className="de-refs__list">
        {projects.map((project, index) => {
          const kpi = project.stats[0];
          const flip = index % 2 === 1;
          const slug = project.href.split("/").filter(Boolean).at(-1);

          return (
            <article
              key={project.href}
              className={`de-ref ${flip ? "de-ref--flip" : ""}`}
              aria-labelledby={`de-ref-${slug}-heading`}
            >
              <div className="de-ref__media de-img">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>

              <div className="de-ref__body">
                <p className="de-ref__eyebrow">{project.eyebrow}</p>
                <WordReveal
                  tag="h3"
                  text={project.heading}
                  className="de-ref__company"
                  id={`de-ref-${slug}-heading`}
                />
                <Reveal tag="p" className="de-ref__quote" delay={300}>
                  {project.body}
                </Reveal>
                {kpi && (
                  <Reveal className="de-ref__kpi-row" delay={500}>
                    <span className="de-ref__kpi-value">{kpi.value}</span>
                    <span className="de-ref__kpi-label">{kpi.label}</span>
                  </Reveal>
                )}
                <Reveal delay={700}>
                  <Link
                    href={project.href}
                    className="de-ref__link"
                    data-track-event="select_item"
                    data-track-id={`de_reference__open__${slug}`}
                    data-track-item-type="reference"
                    data-track-item-slug={slug}
                    data-track-label={project.heading}
                  >
                    Zum Projekt
                    <ArrowRight />
                  </Link>
                </Reveal>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
