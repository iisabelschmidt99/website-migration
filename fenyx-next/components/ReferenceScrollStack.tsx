"use client";

// Sticky Scroll-Stack für Referenz-Karten – Logik aus ref-scroll-stack.js.

import { useEffect, useRef } from "react";
import CaseCard from "./CaseCard";
import {
  referenceProjects,
  type ReferenceProject,
} from "@/data/reference-projects";

type ReferenceScrollStackProps = {
  projects?: ReferenceProject[];
};

export default function ReferenceScrollStack({
  projects = referenceProjects,
}: ReferenceScrollStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stack = stackRef.current;
    if (!stack) return;

    const items = stack.querySelectorAll<HTMLElement>(".ref-scroll-item");
    if (!items.length) return;

    const stickyTop = 88;
    const fadeDistance = 520;
    let ticking = false;

    function updateRefStack() {
      items.forEach((item, i) => {
        const card = item.querySelector<HTMLElement>(".ref-scroll-card");
        if (!card) return;

        let opacity = 1;
        let scale = 1;
        const nextItem = items[i + 1];

        item.style.zIndex = String(i + 1);

        if (nextItem) {
          const nextTop = nextItem.getBoundingClientRect().top;
          const overlap = stickyTop + fadeDistance - nextTop;
          if (overlap > 0) {
            const fade = Math.min(1, overlap / fadeDistance);
            opacity = Math.max(0.18, 1 - fade * 0.82);
            scale = Math.max(0.94, 1 - fade * 0.05);
          }
        }

        card.style.opacity = String(opacity);
        card.style.transform = `scale(${scale.toFixed(3)})`;
      });
    }

    function onScrollFrame() {
      updateRefStack();
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScrollFrame);
      }
    }

    updateRefStack();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateRefStack, { passive: true });
    window.addEventListener("load", updateRefStack);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateRefStack);
      window.removeEventListener("load", updateRefStack);
    };
  }, []);

  return (
    <div id="ref-scroll-stack" ref={stackRef} className="ref-scroll-stack">
      {projects.map((project, index) => (
        <div
          key={project.href}
          className="ref-scroll-item"
          data-stack-index={index}
        >
          <div className="ref-scroll-card">
            <CaseCard {...project} />
          </div>
        </div>
      ))}
    </div>
  );
}
