"use client";

import { useEffect } from "react";

/**
 * Konzept C – Scroll-Reveal-Fallback.
 *
 * Moderne Browser animieren `.dc-reveal` rein über CSS
 * (animation-timeline: view(), siehe concept.css). Dieser kleine Client-Helfer
 * ist NUR der IntersectionObserver-Fallback für Browser ohne Scroll-Driven
 * Animations bzw. ohne JS-fähiges view()-Timeline. Er rendert nichts und wird
 * einmal pro Seite gemountet.
 *
 * 2026-Trend: progressive enhancement – CSS first, JS nur als Sicherheitsnetz.
 */
export default function EditorialReveal() {
  useEffect(() => {
    // Wenn der Browser Scroll-Driven Animations beherrscht, übernimmt CSS alles.
    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline", "view()");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".dc-reveal"),
    );

    // Bei Scroll-Timeline-Support oder reduzierter Bewegung: sofort sichtbar
    // lassen (CSS bzw. reduced-motion-Regel greift) und keinen Observer starten.
    if (supportsScrollTimeline || prefersReducedMotion) {
      if (prefersReducedMotion) {
        elements.forEach((el) => el.classList.add("is-visible"));
      }
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
