"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PhaseTab = {
  id: string;
  label: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

type InventarisierungPhaseTabsProps = {
  heading?: string;
  introLead?: string;
  introBody?: string;
  tabs: PhaseTab[];
  variant?: "dark" | "light";
  /** true = scroll-gesteuert (Sticky-Sektion, großes Bild). Sonst klassische Klick-Tabs. */
  scrollDriven?: boolean;
};

function renderBody(body: string, isLight = false) {
  return body.split("\n\n").map((paragraph) => (
    <p
      key={paragraph.slice(0, 24)}
      className={`text-base sm:text-lg leading-relaxed ${isLight ? "text-black/75" : "text-white/85"}`}
    >
      {paragraph.split("\n").map((line, i, arr) => (
        <span key={line.slice(0, 20)}>
          {line}
          {i < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  ));
}

function HeadingBlock({
  heading,
  introLead,
  introBody,
  isLight,
}: {
  heading?: string;
  introLead?: string;
  introBody?: string;
  isLight: boolean;
}) {
  if (!heading) return null;
  return (
    <div className="max-w-3xl mb-10 sm:mb-14">
      <h2
        id="tabs-heading"
        className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-5 text-signal"
      >
        {heading}
      </h2>
      {introLead || introBody ? (
        <div
          className={`text-base leading-relaxed space-y-4 ${isLight ? "text-black/75" : "text-mist"}`}
        >
          {introLead ? (
            <p>
              <strong className={`font-semibold ${isLight ? "text-black" : "text-white"}`}>
                {introLead}
              </strong>
            </p>
          ) : null}
          {introBody ? <p>{introBody}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

/** Phasen-Sektion (Webflow section_challenges): Klick-Tabs oder scroll-gesteuert. */
export default function InventarisierungPhaseTabs({
  heading,
  introLead,
  introBody,
  tabs,
  variant = "dark",
  scrollDriven = false,
}: InventarisierungPhaseTabsProps) {
  const isLight = variant === "light";
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollActive, setScrollActive] = useState(false);

  // Scroll-Steuerung nur, wenn gewünscht, genug Phasen und keine Reduced-Motion.
  useEffect(() => {
    if (!scrollDriven || tabs.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setScrollActive(true);

    let raf = 0;
    const update = () => {
      raf = 0;
      // Section bei jedem Aufruf frisch auslesen (wird beim Moduswechsel neu gemountet).
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setActiveIndex(0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      setActiveIndex(Math.min(tabs.length - 1, Math.floor(progress * tabs.length)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Nach dem Umschalten in den Scroll-Modus einmal initial berechnen.
    const initial = window.setTimeout(update, 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollDriven, tabs.length]);

  const goTo = (i: number) => {
    if (scrollActive && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const y = window.scrollY + rect.top + ((i + 0.5) / tabs.length) * total;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
    setActiveIndex(i);
  };

  const sectionClass = isLight
    ? "bg-white inv-phase-tabs--light"
    : "inv-section--dark inv-dark-tabs";

  const nav = (
    <div className="inv-tabs__nav" role="tablist" aria-label="Phasen">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          className={`inv-tab-btn${i === activeIndex ? " is-active" : ""}`}
          onClick={() => goTo(i)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // ── Scroll-gesteuert: hohe Sektion + Sticky-Inhalt, großes Bild ──
  if (scrollActive) {
    return (
      <section
        ref={sectionRef}
        className={`relative ${sectionClass}`}
        style={{ height: `${tabs.length * 85}vh` }}
        aria-labelledby={heading ? "tabs-heading" : undefined}
      >
        <div className="sticky top-[72px] flex min-h-[calc(100vh-72px)] items-center py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <HeadingBlock
              heading={heading}
              introLead={introLead}
              introBody={introBody}
              isLight={isLight}
            />
            {nav}
            <div className="grid items-center gap-8 lg:gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)]">
              {/* Text-Spalte: Phasen gestapelt, feste Mindesthöhe gegen Springen */}
              <div className="relative min-h-[15rem] lg:min-h-[17rem]">
                {tabs.map((tab, i) => (
                  <div
                    key={tab.id}
                    aria-hidden={i !== activeIndex}
                    className={`transition-opacity duration-500 ease-out ${
                      i === activeIndex
                        ? "opacity-100"
                        : "opacity-0 absolute inset-0 pointer-events-none"
                    }`}
                  >
                    <h3
                      className={`text-3xl sm:text-5xl font-heading tracking-[-0.02em] mb-6 ${
                        isLight ? "text-black" : "text-signal"
                      }`}
                    >
                      {tab.title}
                    </h3>
                    <div className="space-y-3">{renderBody(tab.body, isLight)}</div>
                  </div>
                ))}
              </div>

              {/* Bild-Spalte: Phasen gestapelt, nur Deckkraft wechselt (kein Neu-Mounten = kein Flackern) */}
              <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[34rem] overflow-hidden">
                {tabs.map((tab, i) => (
                  <Image
                    key={tab.id}
                    src={tab.imageSrc}
                    alt={tab.imageAlt}
                    fill
                    priority
                    unoptimized
                    className={`object-cover object-center transition-opacity duration-500 ease-out ${
                      i === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Klassisch: Klick-Tabs (unverändertes Verhalten für die übrigen Seiten) ──
  return (
    <section
      ref={sectionRef}
      className={`py-20 sm:py-28 ${sectionClass}`}
      aria-labelledby={heading ? "tabs-heading" : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeadingBlock
          heading={heading}
          introLead={introLead}
          introBody={introBody}
          isLight={isLight}
        />
        <div>
          {nav}
          {tabs.map((tab, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={tab.id}
                role="tabpanel"
                hidden={!isActive}
                className={`inv-tab-panel${isActive ? " is-active" : ""}`}
              >
                <div>
                  <h3
                    className={`text-2xl sm:text-4xl font-heading tracking-[-0.02em] mb-5 ${
                      isLight ? "text-black" : "text-signal"
                    }`}
                  >
                    {tab.title}
                  </h3>
                  <div className={`space-y-3 ${isLight ? "text-black/75" : ""}`}>
                    {renderBody(tab.body, isLight)}
                  </div>
                </div>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={tab.imageSrc}
                    alt={tab.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
