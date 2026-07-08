"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type GreenTab = {
  id: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

type GreenBenefitsTabsProps = {
  heading: string;
  description: string;
  tabs: GreenTab[];
  /** Scroll zwischen Punkten statt nur Klick (Digitale Inventarisierung). */
  scrollDriven?: boolean;
  /** Höhe pro Tab in vh (Standard 85). Niedriger = weniger Scroll-Haken. */
  scrollStepVh?: number;
};

/** Grüne Kosteneinsparungs-Section mit vertikalen Tabs. */
export default function GreenBenefitsTabs({
  heading,
  description,
  tabs,
  scrollDriven = false,
  scrollStepVh = 85,
}: GreenBenefitsTabsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const [scrollActive, setScrollActive] = useState(false);

  useEffect(() => {
    if (!scrollDriven || tabs.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setScrollActive(true);

    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setActiveId(tabs[0]?.id ?? "");
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      const index = Math.min(tabs.length - 1, Math.floor(progress * tabs.length));
      setActiveId(tabs[index]?.id ?? "");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const initial = window.setTimeout(update, 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollDriven, tabs]);

  const goTo = (id: string) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    if (scrollActive && sectionRef.current && index >= 0) {
      const rect = sectionRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const y = window.scrollY + rect.top + ((index + 0.5) / tabs.length) * total;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
    setActiveId(id);
  };

  const header = (
    <header className="inv-green-section__header">
      <h2 id="vorteile-heading">
        {heading.split("\n").map((line, i, arr) => (
          <span key={line.slice(0, 24)}>
            {line}
            {i < arr.length - 1 ? <br /> : null}
          </span>
        ))}
      </h2>
      {description ? <p>{description}</p> : null}
    </header>
  );

  const nav = (
    <div
      className="inv-green-tabs__nav"
      role="tablist"
      aria-label="Vorteile der digitalen Inventarisierung"
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`inv-green-tab${isActive ? " is-active" : ""}`}
            onClick={() => goTo(tab.id)}
          >
            <span className="inv-green-tab__line" aria-hidden="true" />
            <span className="inv-green-tab__content">
              <span className="inv-green-tab__title">{tab.title}</span>
              <p className="inv-green-tab__body">{tab.body}</p>
            </span>
          </button>
        );
      })}
    </div>
  );

  const media = (
    <div className="inv-green-tabs__media" aria-live="polite">
      {tabs.map((tab) => (
        <Image
          key={tab.id}
          src={tab.imageSrc}
          alt={tab.imageAlt}
          width={1200}
          height={825}
          className={activeId === tab.id ? "is-active" : ""}
          loading="lazy"
        />
      ))}
    </div>
  );

  if (scrollActive) {
    return (
      <section
        ref={sectionRef}
        id="vorteile"
        className="inv-green-section inv-green-tabs--scroll"
        style={{ height: `${tabs.length * scrollStepVh}vh` }}
        aria-labelledby="vorteile-heading"
      >
        <div className="sticky top-[72px] flex min-h-[calc(100vh-72px)] items-center py-10 sm:py-12">
          <div className="inv-container w-full">
            {header}
            <div className="inv-green-tabs">
              {nav}
              {media}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="vorteile"
      className="inv-green-section"
      aria-labelledby="vorteile-heading"
    >
      <div className="inv-container">
        {header}
        <div className="inv-green-tabs">
          {nav}
          {media}
        </div>
      </div>
    </section>
  );
}
