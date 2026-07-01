"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  shuffledLogos,
  splitRows,
  validHomepageLogos,
} from "@/components/concepts/shared/logos";

/**
* Konzept I – Cinematic Depth Wall mit echtem Scroll-Parallax.
*
* 3 horizontale Reihen, ALLE Logos uniform scharf (kein Blur auf den Logos,
* keine pro-Reihe-Deckkraft). Bokeh lebt nur als backdrop-filter-Fleck
* HINTER dem Text (siehe .di-wall-scrim in app/i/concept.css) – dort sind
* die Logos verwaschen, überall sonst scharf.
*
* Zwei Bewegungsachsen:
*   1. Scroll-Parallax (vertikal, scroll-gebunden, EIN Versatz für die
*      ganze Wand – nicht pro Reihe): die Wand gleitet nach oben, der Text
*      bekommt einen leichten Gegendrift → 3D-Tiefe.
*   2. Sanfter horizontaler Auto-Drift (sehr langsam, ambient), leicht
*      variiert pro Reihe damit sie nicht im Gleichlauf laufen.
*/

const ROWS = 3;
const rows = splitRows(shuffledLogos(20260702), ROWS);

// Auto-Drift-Dauern pro Reihe (Sekunden) – leicht variiert.
const DRIFT_DURATIONS_S = [170, 220, 270];

// Scroll-Parallax: ein Versatz für die gesamte Wand, einer für den Text.
// Deutlich spürbar – Wand gleitet nach oben, Text leicht nach unten →
// sichtbare Tiefenbewegung. Ganz Wand (nicht pro Reihe).
const WALL_DRIFT_PX = -140;
const COPY_DRIFT_PX = 28;

export default function LogoWallHorizontal() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowsRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const progress = Math.max(0, Math.min(1, passed / total));
      if (rowsRef.current) {
        rowsRef.current.style.transform = `translateY(${(progress * WALL_DRIFT_PX).toFixed(2)}px)`;
      }
      if (copyRef.current) {
        copyRef.current.style.transform = `translateY(${(progress * COPY_DRIFT_PX).toFixed(2)}px)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="di-wall-spacer" aria-labelledby="di-wall-heading">
      <div className="di-wall-sticky">
        <div ref={rowsRef} className="di-wall-rows" aria-hidden="true">
          {rows.map((rowLogos, r) => (
            <div key={r} className="di-wall-row">
              <div
                className={`di-wall-row-inner di-wall-row-inner--${r % 2 === 0 ? "ltr" : "rtl"}`}
                style={
                  {
                    "--di-row-duration": `${DRIFT_DURATIONS_S[r % DRIFT_DURATIONS_S.length]}s`,
                  } as React.CSSProperties
                }
              >
                <ul className="di-wall-track" role="list">
                  {rowLogos.map((logo) => (
                    <li key={logo.src} className="di-wall-cell">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={200}
                        height={56}
                        loading="lazy"
                        className="di-wall-img"
                      />
                    </li>
                  ))}
                </ul>
                <ul className="di-wall-track" role="list">
                  {rowLogos.map((logo) => (
                    <li key={`${logo.src}-dup`} className="di-wall-cell">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={200}
                        height={56}
                        loading="lazy"
                        className="di-wall-img"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="di-wall-scrim" aria-hidden="true" />

        <div ref={copyRef} className="di-wall-copy">
          <p className="di-wall-eyebrow">02 / 03 — Partner</p>
          <h2 id="di-wall-heading" className="di-wall-heading">
            {validHomepageLogos.length} Marken weltweit vertrauen auf Fenyx.
          </h2>
        </div>
      </div>

      {/* Dekorative Wand ist aria-hidden – Screenreader bekommen die
          Partnerliste als reinen Text. */}
      <ul className="sr-only">
        {validHomepageLogos.map((logo) => (
          <li key={logo.src}>{logo.alt}</li>
        ))}
      </ul>
    </section>
  );
}
