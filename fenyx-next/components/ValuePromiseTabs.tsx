"use client";

import Image from "next/image";
import { useState } from "react";

type ValueTab = {
  id: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

type ValuePromiseTabsProps = {
  heading: string;
  tabs: ValueTab[];
};

/** Werteversprechen-Tabs auf weißem Hintergrund (Webflow section_guarantee, white). */
export default function ValuePromiseTabs({
  heading,
  tabs,
}: ValuePromiseTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  return (
    <section className="value-promise" aria-labelledby="value-promise-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <h2
          id="value-promise-heading"
          className="value-promise__heading text-center"
        >
          {heading}
        </h2>

        <div className="value-promise__layout">
          <div
            className="value-promise__nav"
            role="tablist"
            aria-label="Fenyx Werteversprechen"
          >
            {tabs.map((tab) => {
              const isActive = activeId === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`value-promise__tab${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveId(tab.id)}
                >
                  <span className="value-promise__tab-title">{tab.title}</span>
                  {isActive ? (
                    <p className="value-promise__tab-body">{tab.body}</p>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="value-promise__media" aria-live="polite">
            {tabs.map((tab) => (
              <Image
                key={tab.id}
                src={tab.imageSrc}
                alt={tab.imageAlt}
                width={900}
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
