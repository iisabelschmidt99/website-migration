"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type DesignV1TimelineChapterProps = {
  title: string;
  bullets: string[];
  imageSrc: string;
  imageAlt?: string;
  align?: "left" | "right";
};

/** V1 Timeline-Kapitel: abgedunkelt, Titel + animierte Bullets ohne Box. */
export default function DesignV1TimelineChapter({
  title,
  bullets,
  imageSrc,
  imageAlt = "",
  align = "left",
}: DesignV1TimelineChapterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          el.classList.toggle("is-visible", entry.isIntersecting);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`leistung-card leistung-card--bleed dv1-timeline-chapter${
        align === "right" ? " leistung-card--align-end" : ""
      }`}
    >
      <div className="leistung-card__media dv1-timeline-chapter__media">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center dv1-timeline-chapter__img"
          sizes="100vw"
          loading="lazy"
        />
        <div className="dv1-timeline-chapter__scrim" aria-hidden="true" />
      </div>
      <div className="leistung-card__inner dv1-timeline-chapter__inner">
        <div className="dv1-timeline-chapter__copy">
          <h3 className="dv1-timeline-chapter__title">{title}</h3>
          <ul className="dv1-timeline-chapter__bullets">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
