"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type TimelineStep = {
  num: string;
  title: string;
  body: string;
  align: "left" | "right";
  cta?: { label: string; href: string };
};

type InventarisierungTimelineProps = {
  heading: string;
  steps: TimelineStep[];
  backgroundSrc?: string;
  backgroundAlt?: string;
  variant?: "dark" | "light" | "cinematic";
  /** Grüne Linie scrollt mit und aktiviert Punkte nacheinander. */
  scrollAnimated?: boolean;
};

function StepBody({ body, cinematic }: { body: string; cinematic?: boolean }) {
  const className = cinematic
    ? "inv-timeline__step-body"
    : "inv-timeline__card-body";

  return body.split("\n\n").map((paragraph) => (
    <p key={paragraph.slice(0, 24)} className={className}>
      {paragraph.split("\n").map((line, i, arr) => (
        <span key={line.slice(0, 20)}>
          {line}
          {i < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  ));
}

/** 6-Schritte-Timeline mit Hintergrundbild (Webflow section_timeline). */
export default function InventarisierungTimeline({
  heading,
  steps,
  backgroundSrc,
  backgroundAlt = "",
  variant = "dark",
  scrollAnimated = false,
}: InventarisierungTimelineProps) {
  const isCinematic = variant === "cinematic";
  const isDark = variant === "dark" || isCinematic;
  const trackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotPositionsRef = useRef<number[]>([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (!scrollAnimated || !trackRef.current) return;

    const track = trackRef.current;
    const lineFill = lineFillRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const getRows = () =>
      rowRefs.current.filter((row): row is HTMLLIElement => row !== null);
    const getDots = () =>
      dotRefs.current.filter((dot): dot is HTMLSpanElement => dot !== null);

    const measure = () => {
      dotPositionsRef.current = [];

      getRows().forEach((row, i) => {
        const dotWrap = row.querySelector<HTMLElement>(".inv-timeline__dot-wrap");
        const center =
          row.offsetTop + (dotWrap?.offsetTop ?? 0) + (dotWrap?.offsetHeight ?? 0) / 2;
        dotPositionsRef.current.push(center);
      });

      if (lineFill) {
        lineFill.style.height = reducedMotion ? "100%" : "0";
      }
    };

    const update = () => {
      tickingRef.current = false;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.82;
      const end = -(rect.height - vh * 0.18);
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(1, Math.max(0, progress));

      const trackHeight = track.offsetHeight;
      const drawn = trackHeight * progress;

      if (lineFill) {
        lineFill.style.height = reducedMotion ? "100%" : `${drawn}px`;
      }

      getRows().forEach((row, i) => {
        const threshold = dotPositionsRef.current[i] ?? 0;
        const isActive = reducedMotion || drawn >= threshold - 4;
        row.classList.toggle("is-visible", isActive);
        const dot = getDots()[i];
        if (dot) dot.classList.toggle("is-active", isActive);
      });
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();

    if (!reducedMotion) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize, { passive: true });

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(track);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
    };
  }, [scrollAnimated, steps.length]);

  const sectionClass = [
    "inv-timeline",
    isCinematic ? "inv-timeline--cinematic" : "",
    !isDark && !isCinematic ? "inv-timeline--light" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const headingClass = isCinematic
    ? "inv-timeline__heading inv-section-heading font-heading tracking-[-0.03em] text-center mb-14 sm:mb-20"
    : "inv-section-heading font-heading tracking-[-0.03em] text-center text-signal mb-14 sm:mb-20";

  return (
    <section className={sectionClass} aria-labelledby="inv-timeline-heading">
      {backgroundSrc ? (
        <div className="inv-timeline__bg" aria-hidden="true">
          <Image
            src={backgroundSrc}
            alt={backgroundAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            loading="lazy"
            priority={isCinematic}
          />
          <div className="inv-timeline__bg-overlay" />
        </div>
      ) : null}

      <div className="inv-timeline__inner relative z-[1] inv-container py-20 sm:py-28">
        <h2 id="inv-timeline-heading" className={headingClass}>
          {heading}
        </h2>

        <div ref={trackRef} className="inv-timeline__track">
          {scrollAnimated ? (
            <>
              <div className="inv-timeline__line-bg" aria-hidden="true" />
              <div ref={lineFillRef} className="inv-timeline__line-fill" aria-hidden="true" />
            </>
          ) : (
            <div className="inv-timeline__line" aria-hidden="true" />
          )}

          <ol className="inv-timeline__list">
            {steps.map((step, index) => (
              <li
                key={step.num}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className={`inv-timeline__row inv-timeline__row--${step.align}${
                  scrollAnimated ? "" : " is-visible"
                }`}
              >
                <div className="inv-timeline__spacer" aria-hidden="true" />
                <div className="inv-timeline__dot-wrap" aria-hidden="true">
                  <span
                    ref={(el) => {
                      dotRefs.current[index] = el;
                    }}
                    className={`inv-timeline__dot${scrollAnimated ? "" : " is-active"}`}
                  />
                </div>

                {isCinematic ? (
                  <article className="inv-timeline__step">
                    <p className="inv-timeline__step-num">Schritt {step.num}</p>
                    <h3 className="inv-timeline__step-title">{step.title}</h3>
                    <StepBody body={step.body} cinematic />
                    {step.cta ? (
                      <Link href={step.cta.href} className="inv-timeline__step-link">
                        {step.cta.label}
                        <svg
                          width="16"
                          height="16"
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
                      </Link>
                    ) : null}
                  </article>
                ) : (
                  <article className="inv-timeline__card">
                    <h3 className="inv-timeline__card-title">
                      {step.num}. {step.title}
                    </h3>
                    <StepBody body={step.body} />
                    {step.cta ? (
                      <div className="mt-6">
                        <Link
                          href={step.cta.href}
                          className="inline-flex items-center gap-2 text-signal text-[11px] font-bold uppercase tracking-[0.1em] hover:gap-3 transition-all duration-200"
                        >
                          {step.cta.label}
                        </Link>
                      </div>
                    ) : null}
                  </article>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
