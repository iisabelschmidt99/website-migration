"use client";

// Konzept D — Referenzen als cineastischer Single-Column-Stack.
// Pro Referenz: großes 16:11-Bild (blur-to-sharp), Pull-Quote, ein großer KPI.
// Word-by-word mask-reveal auf Firmennamen. Alternierend links/rechts auf Desktop.

import Image from "next/image";
import Link from "next/link";
import { Reveal, WordReveal } from "./Reveal";
import type { ReferenceProject } from "@/data/reference-projects";

type ReferencesCinematicProps = {
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

export default function ReferencesCinematic({
  projects,
}: ReferencesCinematicProps) {
  return (
    <section
      className="dd-refs"
      aria-labelledby="dd-refs-heading"
    >
      <div className="dd-refs__intro">
        <p className="dd-refs__eyebrow">Ergebnisse aus der Praxis</p>
        <WordReveal
          tag="h2"
          text="Was bleibt, wenn ein Büro neu gedacht wird."
          className="dd-refs__heading"
          id="dd-refs-heading"
        />
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
              <div className="dd-ref__media dd-img">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  loading="lazy"
                />
              </div>

              <div className="dd-ref__body">
                <p className="dd-ref__eyebrow">{project.eyebrow}</p>
                <WordReveal
                  tag="h3"
                  text={project.heading}
                  className="dd-ref__company"
                  id={`dd-ref-${slug}-heading`}
                />
                <Reveal tag="p" className="dd-ref__quote" delay={300}>
                  {project.body}
                </Reveal>
                {kpi && (
                  <Reveal className="dd-ref__kpi-row" delay={500}>
                    <span className="dd-ref__kpi-value">{kpi.value}</span>
                    <span className="dd-ref__kpi-label">{kpi.label}</span>
                  </Reveal>
                )}
                <Reveal delay={700}>
                  <Link
                    href={project.href}
                    className="dd-ref__link"
                    data-track-event="select_item"
                    data-track-id={`dd_reference__open__${slug}`}
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
