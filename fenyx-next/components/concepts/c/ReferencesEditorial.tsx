import Image from "next/image";
import Link from "next/link";
import type { ReferenceProject } from "@/data/reference-projects";

/**
 * Konzept C – Editoriale Referenzen.
 *
 * Einspaltiger Magazin-Stapel (kein Bento, kein Raster, kein Horizontal-Scroll):
 * jede Referenz ist ein redaktioneller Artikel mit großem 16:9-Bild, Eyebrow +
 * Firmenname in großer Telegraf, Fließtext und EINEM prominenten KPI (erste
 * Statistik). Der „Zum Projekt"-Link ist – anders als die CaseCard-Variante –
 * ein editorialer Text-Link mit Pfeil statt Button.
 *
 * Server-Komponente: Reveal-Staffelung via .dc-reveal + --dc-i (CSS / IO-Fallback).
 */

type ReferencesEditorialProps = {
  projects: ReferenceProject[];
};

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
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

export default function ReferencesEditorial({
  projects,
}: ReferencesEditorialProps) {
  return (
    <section className="dc-refs wf-padding-section-large" aria-labelledby="dc-refs-heading">
      <div className="wf-padding-global">
        <div className="wf-container-large">
          {/* Redaktioneller Auftakt mit Bildporträt (sculptural chair). */}
          <header className="dc-reveal mb-20 grid items-end gap-10 lg:mb-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="dc-eyebrow mb-6">Referenzen</p>
              <h2 id="dc-refs-heading" className="dc-ref-title max-w-[14ch]">
                Was bleibt, wenn ein Büro neu gedacht wird.
              </h2>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/assets/concepts/c/c-references.png"
                alt="Skulpturales Porträt eines aufbereiteten Bürostuhls."
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40rem"
                loading="lazy"
              />
            </div>
          </header>

          <div className="flex flex-col">
            {projects.map((project, index) => {
              const kpi = project.stats[0];
              const slug = project.href.split("/").filter(Boolean).at(-1);

              return (
                <article
                  key={project.href}
                  className="dc-reveal border-t border-[color:var(--dc-rule)] py-16 first:border-t-0 lg:py-24"
                  style={{ "--dc-i": index % 3 } as React.CSSProperties}
                >
                  {/* Großes Bild über die volle Breite (16:9). */}
                  <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden lg:mb-14">
                    <Image
                      src={project.imageSrc}
                      alt={project.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 90rem"
                      loading="lazy"
                    />
                  </div>

                  <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
                    <div>
                      <p className="dc-eyebrow mb-5">{project.eyebrow}</p>
                      <h3 className="dc-ref-title mb-7">{project.heading}</h3>
                      <p className="dc-body mb-9">{project.body}</p>
                      <Link
                        href={project.href}
                        className="dc-link"
                        data-track-event="select_item"
                        data-track-id={`dc_reference__open__${slug}`}
                        data-track-item-type="reference"
                        data-track-item-slug={slug}
                        data-track-label={project.heading}
                      >
                        Zum Projekt
                        <ArrowRight />
                      </Link>
                    </div>

                    {/* EIN prominenter KPI (erste Statistik), groß gesetzt. */}
                    {kpi && (
                      <div className="lg:border-l lg:border-[color:var(--dc-rule)] lg:pl-12">
                        <p className="dc-kpi__value mb-3">{kpi.value}</p>
                        <p className="dc-kpi__label">{kpi.label}</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
