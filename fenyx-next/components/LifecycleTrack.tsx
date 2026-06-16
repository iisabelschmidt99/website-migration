"use client";

// Scroll-verknüpfte grüne Lifecycle-Linie (SVG stroke-dashoffset).
// Logik 1:1 aus fenyx-rebuild/index.html + js/leistung-page.js übernommen.

import { useEffect, useRef } from "react";

type LifecycleTrackProps = {
  children: React.ReactNode;
  /** Anzahl grüner Punkte entlang der Linie (Standard: 3). */
  dotCount?: number;
};

export default function LifecycleTrack({
  children,
  dotCount = 3,
}: LifecycleTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pathLengthRef = useRef(0);
  const dotPositionsRef = useRef<number[]>([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const path = pathRef.current;
    if (!track || !path) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const getCards = () =>
      track.querySelectorAll<HTMLElement>(".leistung-card");
    const getDots = () =>
      dotRefs.current.filter((dot): dot is SVGCircleElement => dot !== null);

    function resizeLifecycle() {
      if (!path || !track) return;

      const h = track.offsetHeight;
      path.setAttribute("d", `M 2 0 L 2 ${h}`);
      pathLengthRef.current = path.getTotalLength();
      path.style.strokeDasharray = String(pathLengthRef.current);
      path.style.strokeDashoffset = reducedMotion
        ? "0"
        : String(pathLengthRef.current);

      dotPositionsRef.current = [];
      const cards = getCards();
      const dots = getDots();

      cards.forEach((card, i) => {
        const cardCenter = card.offsetTop + card.offsetHeight / 2;
        dotPositionsRef.current.push(cardCenter);
        if (dots[i]) dots[i].setAttribute("cy", String(cardCenter));
      });
    }

    function updateLifecycleLine() {
      if (!path || !track || !pathLengthRef.current) return;

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = -(rect.height - vh * 0.15);
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(1, Math.max(0, progress));

      if (reducedMotion) {
        path.style.strokeDashoffset = "0";
      } else {
        path.style.strokeDashoffset = String(pathLengthRef.current * (1 - progress));
      }

      const drawnLength = pathLengthRef.current * progress;
      getDots().forEach((dot, i) => {
        const isActive =
          reducedMotion || drawnLength >= dotPositionsRef.current[i] - 8;
        dot.classList.toggle("is-active", isActive);
      });
    }

    function onScrollFrame() {
      updateLifecycleLine();
      tickingRef.current = false;
    }

    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(onScrollFrame);
      }
    }

    function onResize() {
      resizeLifecycle();
      onScrollFrame();
    }

    resizeLifecycle();
    onScrollFrame();

    if (!reducedMotion) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize);

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(track);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div id="lifecycle-track" ref={trackRef} className="relative">
      <div className="lifecycle-line hidden lg:block" aria-hidden="true">
        <svg className="lifecycle-svg" xmlns="http://www.w3.org/2000/svg">
          <path ref={pathRef} id="lifecycle-path" d="M 2 0 L 2 100" />
          {Array.from({ length: dotCount }, (_, i) => (
            <circle
              key={i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="lifecycle-dot"
              cx={2}
              cy={0}
              r={5}
            />
          ))}
        </svg>
      </div>
      {children}
    </div>
  );
}
