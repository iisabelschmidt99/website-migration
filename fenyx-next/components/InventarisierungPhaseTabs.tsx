"use client";

import Image from "next/image";
import { useState } from "react";

type PhaseTab = {
  id: string;
  label: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

type InventarisierungPhaseTabsProps = {
  heading: string;
  introLead?: string;
  introBody?: string;
  tabs: PhaseTab[];
};

function renderBody(body: string) {
  return body.split("\n\n").map((paragraph) => (
    <p key={paragraph.slice(0, 24)} className="text-sm leading-relaxed text-mist">
      {paragraph.split("\n").map((line, i, arr) => (
        <span key={line.slice(0, 20)}>
          {line}
          {i < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  ));
}

/** Dunkle Tabs: Produkterfassung, Zustand, Logistik (Webflow section_challenges). */
export default function InventarisierungPhaseTabs({
  heading,
  introLead,
  introBody,
  tabs,
}: InventarisierungPhaseTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  return (
    <section
      className="py-20 sm:py-28 inv-section--dark inv-dark-tabs"
      aria-labelledby="tabs-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <h2
            id="tabs-heading"
            className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] text-signal mb-5"
          >
            {heading}
          </h2>
          {introLead || introBody ? (
            <div className="text-mist text-base leading-relaxed space-y-4">
              {introLead ? (
                <p>
                  <strong className="text-white font-semibold">{introLead}</strong>
                </p>
              ) : null}
              {introBody ? <p>{introBody}</p> : null}
            </div>
          ) : null}
        </div>

        <div>
          <div
            className="inv-tabs__nav"
            role="tablist"
            aria-label="Inventarisierungsphasen"
          >
            {tabs.map((tab) => {
              const isActive = activeId === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`inv-tab-btn${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveId(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {tabs.map((tab) => {
            const isActive = activeId === tab.id;
            return (
              <div
                key={tab.id}
                role="tabpanel"
                hidden={!isActive}
                className={`inv-tab-panel${isActive ? " is-active" : ""}`}
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading tracking-[-0.02em] mb-4 text-signal">
                    {tab.title}
                  </h3>
                  <div className="space-y-3">{renderBody(tab.body)}</div>
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
