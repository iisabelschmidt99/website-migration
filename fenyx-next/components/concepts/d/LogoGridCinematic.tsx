"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { validHomepageLogos } from "@/components/concepts/shared/logos";

/**
* Konzept D – Reactive Magnetic Logo-Grid.
*
* Dichtes Raster wie Live-/b — Logos direkt auf mist-soft, ohne Kästen.
* Wow: jedes Logo skaliert je nach Cursor-Nähe – nah = größer, fern = kleiner.
* Magnetfeld-Feeling wie macOS Dock.
*
* Technisch: rAF + direkte DOM-Transforms (kein React-State pro Frame).
* `prefers-reduced-motion` → statisches Grid, keine Listener.
*/

const LOGOS = validHomepageLogos;
const RADIUS = 170;     // px Einflussradius
const MAX_SCALE = 1.85; // Skala direkt unter dem Cursor
const MIN_SCALE = 0.88; // Skala am Rand / ohne Cursor

export default function LogoGridCinematic() {
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const cells = Array.from(
      grid.querySelectorAll<HTMLLIElement>(".dd-mlogo"),
    );
    const centers = cells.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    let mx = Number.POSITIVE_INFINITY;
    let my = Number.POSITIVE_INFINITY;
    let raf = 0;
    let active = false;

    const compute = () => {
      raf = 0;
      for (let i = 0; i < cells.length; i++) {
        const c = centers[i];
        const dx = mx - c.x;
        const dy = my - c.y;
        const dist = Math.hypot(dx, dy);
        let scale = MIN_SCALE;
        if (dist < RADIUS) {
          const t = 1 - dist / RADIUS;
          // ease-out quadratic für weichen Fall-off
          const e = t * t;
          scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * e;
        }
        cells[i].style.transform = `scale(${scale.toFixed(3)})`;
      }
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!active) {
        active = true;
        // Centers einmal pro Frame-Session neu messen (scroll-sicher).
        for (let i = 0; i < cells.length; i++) {
          const r = cells[i].getBoundingClientRect();
          centers[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
      }
      if (!raf) raf = requestAnimationFrame(compute);
    };

    const onLeave = () => {
      mx = Number.POSITIVE_INFINITY;
      my = Number.POSITIVE_INFINITY;
      active = false;
      if (!raf) raf = requestAnimationFrame(compute);
    };

    // Centers müssen sich nach Scroll/Resize neu orientieren.
    const onScroll = () => {
      active = false;
      for (let i = 0; i < cells.length; i++) {
        const r = cells[i].getBoundingClientRect();
        centers[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
    };

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="dd-mlogos wf-padding-section-large" aria-labelledby="dd-mlogos-heading">
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <p className="dd-mlogos__caption">
            <span id="dd-mlogos-heading">Partnerschaften</span>
            <span className="dd-mlogos__hint">— bewegen Sie den Cursor</span>
          </p>
          <ul className="dd-mlogos__grid" role="list" ref={gridRef}>
            {LOGOS.map((logo) => (
              <li key={logo.src} className="dd-mlogo">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={68}
                  height={36}
                  loading="lazy"
                  className="dd-mlogo__img"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
