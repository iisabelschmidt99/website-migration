"use client";

// Referenz-Karten als gestapelte Liste mit scroll-gebundenem Fade/Scale –
// 1:1 zur Webflow-Interaktion: die zentrierte Karte ist voll sichtbar,
// darüber/darunter liegende Karten werden blasser (opacity → ~0.15) und
// leicht verkleinert (scale → 0.9).

import { useEffect, useRef } from "react";
import CaseCard from "./CaseCard";
import {
  referenceProjects,
  type ReferenceProject,
} from "@/data/reference-projects";

type ReferenceRevealListProps = {
  projects?: ReferenceProject[];
};

export default function ReferenceRevealList({
  projects = referenceProjects,
}: ReferenceRevealListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal-item"),
    );
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
      return;
    }

    let ticking = false;

    function update() {
      const viewportCenter = window.innerHeight / 2;
      const fadeRange = window.innerHeight * 0.6;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);
        const norm = Math.min(1, distance / fadeRange);

        const opacity = Math.max(0.15, 1 - norm * 0.85);
        const scale = 1 - norm * 0.1;

        item.style.opacity = opacity.toFixed(3);
        item.style.transform = `scale(${scale.toFixed(3)})`;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-20">
      {projects.map((project, index) => (
        <div
          key={`${project.heading}-${index}`}
          className="reveal-item will-change-[opacity,transform]"
          style={{ transformOrigin: "center center" }}
        >
          <CaseCard {...project} />
        </div>
      ))}
    </div>
  );
}
