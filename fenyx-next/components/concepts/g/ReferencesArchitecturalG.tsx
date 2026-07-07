"use client";

// Konzept G — Referenzen (basiert auf f/ReferencesArchitectural).
// Änderungen vs. f: 6. statische Ernst-Klett-Kachel als Fallback,
// schwarzer Hintergrund, Text-Farben für dark-bg angepasst.

import Image from "next/image";
import Link from "next/link";
import { CountUp, ClipReveal, Stagger, Rise, splitKpi } from "@/components/concepts/shared/anim";
import type { ReferenceProject } from "@/data/reference-projects";

type Props = {
  projects: ReferenceProject[];
  heading?: string;
  description?: string;
  /** Section-Anker (z. B. „referenzen“) */
  id?: string;
};

const DEFAULT_HEADING =
  "Unsere Kunden setzen neue Standards für Nachhaltigkeit.";
const DEFAULT_DESCRIPTION =
  "Führende Unternehmen aus diversen Branchen und mit individuellen Anforderungen setzen auf die Zusammenarbeit mit Fenyx.";

const SPAN = ["big", "wide", "", "tall", "wide", ""] as const;

const STATIC_SIXTH: ReferenceProject = {
  href: "/referenzen/ernst-klett-verlag",
  heading: "Ernst Klett Verlag",
  eyebrow: "Büroauflösung",
  tag: "Ganzheitliche Verwertung",
  body: "Vollständige Abwicklung von der Erstbesichtigung bis zur lückenlosen Übergabedokumentation.",
  imageSrc: "/assets/Referenzen/ernst-klett-verlag.webp",
  imageAlt: "Büroauflösung beim Ernst Klett Verlag.",
  stats: [{ value: "0 %", label: "Restentsorgungskosten" }],
};

export default function ReferencesArchitecturalG({
  projects,
  heading = DEFAULT_HEADING,
  description = DEFAULT_DESCRIPTION,
  id,
}: Props) {
  const headingId = id ? `${id}-heading` : "dg-refs-heading";
  const base = projects.slice(0, 5);
  const ordered = (base.length < 6 ? [...base, STATIC_SIXTH] : projects.slice(0, 6));
  // Universal (Index 3) und Reneo (Index 0) tauschen
  if (ordered.length > 3) {
    const tmp = ordered[0];
    ordered[0] = ordered[3];
    ordered[3] = tmp;
  }
  const tiles = ordered.map(
    (p) =>
      p.href.includes("reneo-group")
        ? {
            ...p,
            imageSrc: "/assets/Referenzen/reneo-reception.png",
            imageAlt: "Empfangsbereich der Reneo Group mit reneo-Logo an der Wand.",
          }
        : p,
  );

  return (
    <section
      id={id}
      className="df-refs dg-refs df-root"
      aria-labelledby={headingId}
    >
      <div className="df-refs__intro">
        <Rise tag="h2" className="df-refs__heading dg-refs__heading" delay={80}>
          <span id={headingId}>{heading}</span>
        </Rise>
        <Rise tag="p" className="dg-refs__body" delay={180}>
          <span>{description}</span>
        </Rise>
      </div>

      <Stagger className="df-refs__grid" step={110} y={36}>
        {tiles.map((project, index) => {
          const span = SPAN[index] ?? "";
          const kpi = project.stats[0];
          const slug = project.href.split("/").filter(Boolean).at(-1);
          return (
            <Link
              key={project.href}
              href={project.href}
              data-span={span || undefined}
              className={`df-ref-tile anim-stagger ${span ? `df-ref-tile--${span}` : ""}`}
              aria-label={`Referenz ${project.heading} ansehen`}
            >
              <ClipReveal className="df-ref-tile__media" direction="scale" durationMs={1000}>
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center df-ref-tile__img"
                  sizes={span === "big" ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 30vw"}
                  quality={100}
                  loading="lazy"
                />
              </ClipReveal>
              <div className="df-ref-tile__scrim" aria-hidden="true" />
              <div className="df-ref-tile__body">
                <p className="df-ref-tile__eyebrow">{project.eyebrow}</p>
                <h3 className="df-ref-tile__company">{project.heading}</h3>
                {kpi && (() => {
                  const { number, caption } = splitKpi(kpi);
                  return (
                    <div className="df-ref-tile__kpi">
                      <CountUp className="df-ref-tile__kpi-value" value={number} />
                      <span className="df-ref-tile__kpi-label">{caption}</span>
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
