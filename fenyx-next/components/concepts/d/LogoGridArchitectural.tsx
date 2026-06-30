// Konzept D – Logo-Grid „Architectural Quiet"
// 7-Spalten-Raster mit dünnen 1px-Trennern. Jedes Logo in eigener Zelle,
// vertikal zentriert, Graustufen → beim Hover warmer Hauch + volle Farbe.
// Server-Komponente (keine Interaktivität nötig, Hover rein über CSS).

import Image from "next/image";
import Link from "next/link";
import homepageLogos from "@/data/homepage-logos.json";

type Logo = { alt: string; src: string };

// Kuratiertes 7×3-Raster (21 Zellen) aus dem Partner-Datensatz.
const GRID_LOGOS: Logo[] = (homepageLogos as Logo[]).slice(0, 21);

export default function LogoGridArchitectural() {
  return (
    <section
      className="dd-logo-grid wf-padding-section-large"
      aria-labelledby="dd-logos-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          {/* Eyebrow + Headline, architektonisch klein gehalten */}
          <div className="dd-rule--mist dd-rule mb-6" aria-hidden="true" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="dd-eyebrow text-abyss/55">
                <span className="dd-eyebrow__num">02 / 03</span>
                <span aria-hidden="true">—</span>
                <span>Partner</span>
              </p>
              <h2
                id="dd-logos-heading"
                className="mt-4 max-w-[28ch] font-heading text-2xl leading-tight tracking-[-0.02em] text-abyss sm:text-3xl"
              >
                Weltweit führenden Unternehmen vertrauen auf Fenyx.
              </h2>
            </div>
          </div>

          {/* 7-Spalten-Raster mit dünnen Trennern */}
          <ul className="dd-logo-cells dd-reveal mt-10 list-none">
            {GRID_LOGOS.map((logo) => (
              <li key={logo.src} className="dd-logo-cell">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140}
                  height={36}
                  loading="lazy"
                  className="dd-logo-cell__img"
                />
              </li>
            ))}
          </ul>

          {/* Abschluss-Regel mit Zählung links + Link rechts */}
          <div className="mt-px flex items-center justify-between border-t border-mist/15 pt-5">
            <span className="dd-eyebrow text-abyss/45">
              <span className="dd-eyebrow__num">01 — 07</span>
              <span aria-hidden="true">/</span>
              <span>{(homepageLogos as Logo[]).length} Partner</span>
            </span>
            <Link
              href="/referenzen"
              className="dd-focus group inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-abyss transition-colors hover:text-abyss/60"
            >
              Alle Partner
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
