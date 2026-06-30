// Easter egg: Konami code opens debug overlay. Reduced-motion safe.
// Sequenz: ↑ ↑ ↓ ↓ ← → ← → B A. Schließen mit ESC. Auf der Seite gibt es
// bewusst keinen sichtbaren Hinweis – es soll entdeckt, nicht aufgedrängt werden.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

const SWATCHES = [
  { key: "abyss", cls: "de-debug__chip--abyss" },
  { key: "abyss-deep", cls: "de-debug__chip--abyss-deep" },
  { key: "signal", cls: "de-debug__chip--signal" },
  { key: "mist", cls: "de-debug__chip--mist" },
  { key: "mist-soft", cls: "de-debug__chip--mist-soft" },
] as const;

export default function DebugEasterEgg() {
  const [open, setOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState("–");
  const seqRef = useRef<number>(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Tasten-Sequenz global mitlauschen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[seqRef.current];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        seqRef.current += 1;
        if (seqRef.current === KONAMI.length) {
          seqRef.current = 0;
          setOpen(true);
        }
      } else {
        // Neustart – erlaubt aber sofortigen Re-Match der ersten Taste.
        seqRef.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ESC schließt das Overlay; Fokus aufs Schließen-Element.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Live-Scroll-% und aktive Sektion nur bei geöffnetem Overlay tracken.
  useEffect(() => {
    if (!open) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-de-section]"),
    );

    let raf = 0;
    const update = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        setScrollPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);

        const mid = window.innerHeight / 2;
        let best: { name: string; dist: number } | null = null;
        for (const el of sections) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - mid);
          if (!best || dist < best.dist) {
            best = { name: el.dataset.deSection ?? "–", dist };
          }
        }
        if (best) setActiveSection(best.name);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  if (!open) return null;

  return (
    <div
      className="de-debug"
      role="dialog"
      aria-modal="true"
      aria-label="Fenyx Debug-Overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="de-debug__panel">
        <div className="de-debug__inner">
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="de-debug__close focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
            aria-label="Debug-Overlay schließen"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>

          <h2 className="de-debug__title">FENYX DEBUG</h2>

          <div className="de-debug__row">
            <span className="de-debug__key de-eyebrow">Scroll</span>
            <span className="de-debug__val">
              {String(scrollPct).padStart(3, "0")} %
            </span>
          </div>
          <div className="de-debug__row">
            <span className="de-debug__key de-eyebrow">Section</span>
            <span className="de-debug__val">{activeSection}</span>
          </div>
          <div className="de-debug__row">
            <span className="de-debug__key de-eyebrow">Konzept</span>
            <span className="de-debug__val">E / Signal Quiet</span>
          </div>

          <div className="de-debug__swatches">
            {SWATCHES.map((s) => (
              <div key={s.key} className="de-debug__swatch">
                <span
                  className={`de-debug__chip ${s.cls}`}
                  aria-hidden="true"
                />
                <span className="de-eyebrow text-mist">{s.key}</span>
              </div>
            ))}
          </div>

          <p className="de-debug__hint de-eyebrow">ESC zum Schließen</p>
        </div>
      </div>
    </div>
  );
}
