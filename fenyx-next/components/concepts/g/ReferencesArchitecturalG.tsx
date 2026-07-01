"use client";

// Konzept G — Referenzen (basiert auf f/ReferencesArchitectural).
// Änderungen vs. f: 6. statische Ernst-Klett-Kachel als Fallback,
// schwarzer Hintergrund, Text-Farben für dark-bg angepasst.

import Image from "next/image";
import Link from "next/link";
import { CountUp, ClipReveal, Stagger, Rise, splitKpi } from "@/components/concepts/shared/anim";
import type { ReferenceProject } from "@/data/reference-projects";

type Props = { projects: ReferenceProject[] };

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

export default function ReferencesArchitecturalG({ projects }: Props) {
  const base = projects.slice(0, 5);
  const tiles = base.length < 6 ? [...base, STATIC_SIXTH] : projects.slice(0, 6);

  return (
    <section className="df-refs dg-refs df-root" aria-labelledby="dg-refs-heading">
      <div className="df-refs__intro">
        <Rise tag="h2" className="df-refs__heading dg-refs__heading" delay={80}>
          <span id="dg-refs-heading">Unsere Kunden setzen neue Standards für Nachhaltigkeit.</span>
        </Rise>
        <Rise tag="p" className="dg-refs__body" delay={180}>
          <span>
            Führende Unternehmen aus diversen Branchen und mit individuellen Anforderungen
            setzen auf die Zusammenarbeit mit Fenyx.
          </span>
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
                  sizes={span === "big" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
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
