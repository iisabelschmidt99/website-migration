"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  shuffledLogos,
  splitRows,
  validHomepageLogos,
} from "@/components/concepts/shared/logos";

/**
* Konzept H – Depth Columns mit echtem Scroll-Parallax.
*
* 6 vertikale Spalten, ALLE Logos uniform scharf (kein Blur auf den Logos,
* keine pro-Spalte-Deckkraft). Bokeh lebt nur als backdrop-filter-Fleck
* HINTER dem Text. Scroll-Parallax ist EIN Versatz für die ganze Wand
* (nicht pro Spalte), Text bekommt leichten Gegendrift. Zusätzlich sehr
* langsamer vertikaler Auto-Drift als ambiance.
*
* Vergleichsvariante zu /g (vertikale Spalten statt horizontaler Reihen).
*/

const COLUMNS = 6;
const cols = splitRows(shuffledLogos(20260703), COLUMNS);

const DRIFT_DURATIONS_S = [200, 250, 300];

// Deutlich spürbar – Wand gleitet nach oben, Text leicht nach unten.
const WALL_DRIFT_PX = -140;
const COPY_DRIFT_PX = 28;

export default function LogoWallColumns() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const colsRef = useRef<HTMLDivElement | null>(null);
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
      if (colsRef.current) {
        colsRef.current.style.transform = `translateY(${(progress * WALL_DRIFT_PX).toFixed(2)}px)`;
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
    <section ref={sectionRef} className="dh-wall-spacer" aria-labelledby="dh-wall-heading">
      <div className="dh-wall-sticky">
        <div ref={colsRef} className="dh-wall-cols" aria-hidden="true">
          {cols.map((colLogos, c) => {
            const dir = c % 2 === 0 ? "up" : "down";
            return (
              <div key={c} className="dh-wall-col">
                <div
                  className={`dh-wall-col-inner dh-wall-col-inner--${dir}`}
                  style={
                    {
                      "--dh-col-duration": `${DRIFT_DURATIONS_S[c % DRIFT_DURATIONS_S.length]}s`,
                    } as React.CSSProperties
                  }
                >
                  <ul className="dh-wall-track" role="list">
                    {colLogos.map((logo) => (
                      <li key={logo.src} className="dh-wall-cell">
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={160}
                          height={46}
                          loading="lazy"
                          className="dh-wall-img"
                        />
                      </li>
                    ))}
                  </ul>
                  <ul className="dh-wall-track" role="list">
                    {colLogos.map((logo) => (
                      <li key={`${logo.src}-dup`} className="dh-wall-cell">
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={160}
                          height={46}
                          loading="lazy"
                          className="dh-wall-img"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dh-wall-scrim" aria-hidden="true" />

        <div ref={copyRef} className="dh-wall-copy">
          <p className="dh-wall-eyebrow">02 / 03 — Partner</p>
          <h2 id="dh-wall-heading" className="dh-wall-heading">
            {validHomepageLogos.length} Marken weltweit vertrauen auf Fenyx.
          </h2>
        </div>
      </div>

      <ul className="sr-only">
        {validHomepageLogos.map((logo) => (
          <li key={logo.src}>{logo.alt}</li>
        ))}
      </ul>
    </section>
  );
}
