"use client";

import Image from "next/image";
import { useState } from "react";

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
};

/** Grüne Kosteneinsparungs-Section mit vertikalen Tabs. */
export default function GreenBenefitsTabs({
  heading,
  description,
  tabs,
}: GreenBenefitsTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  return (
    <section
      id="vorteile"
      className="inv-green-section"
      aria-labelledby="vorteile-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="inv-green-tabs">
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
                  onClick={() => setActiveId(tab.id)}
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

          <div className="inv-green-tabs__media" aria-live="polite">
            {tabs.map((tab) => (
              <Image
                key={tab.id}
                src={tab.imageSrc}
                alt={tab.imageAlt}
                width={800}
                height={600}
                className={activeId === tab.id ? "is-active" : ""}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
