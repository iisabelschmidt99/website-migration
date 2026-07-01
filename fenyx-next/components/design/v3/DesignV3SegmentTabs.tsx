"use client";

import { useState } from "react";
import Link from "next/link";

const SEGMENTS = [
  {
    id: "gross",
    label: "Großunternehmen",
    title: "Standorte kosteneffizient und nachhaltig betreiben.",
    body: "Errichten und betreiben Sie Ihre Standorte kosteneffizient und nachhaltig – mit einem Partner für den gesamten Lebenszyklus.",
    href: "/fenyx-fuer-sie/grossunternehmen",
  },
  {
    id: "mittel",
    label: "Mittelstand",
    title: "Ihr Büro so flexibel wie Ihr Geschäft.",
    body: "Gestalten Sie Ihr Büro genauso schnell und flexibel wie Ihr Geschäft – ohne Kompromisse bei Qualität und Nachhaltigkeit.",
    href: "/fenyx-fuer-sie/mittelstand",
  },
  {
    id: "scale",
    label: "Scale-Ups",
    title: "EU-weites Projektmanagement aus einer Hand.",
    body: "Erhalten Sie EU-weites nachhaltiges Projektmanagement aus einer Hand – skalierbar mit Ihrem Wachstum.",
    href: "/fenyx-fuer-sie/start-up-scale-up",
  },
  {
    id: "cowork",
    label: "Co-Working",
    title: "Zukunftsfähige Büros, schonende Ressourcen.",
    body: "Machen Sie Ihr Büro zukunftsfähig und schonen Sie dabei Ressourcen – zirkulär statt Wegwerf-Logik.",
    href: "/fenyx-fuer-sie/co-working-space",
  },
];

/** V3: Zielgruppen-Switcher – concular-inspiriert, techy. */
export default function DesignV3SegmentTabs() {
  const [activeId, setActiveId] = useState(SEGMENTS[0].id);
  const active = SEGMENTS.find((s) => s.id === activeId) ?? SEGMENTS[0];

  return (
    <section className="dv3-segments wf-padding-section-large" aria-labelledby="dv3-segments-heading">
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <h2 id="dv3-segments-heading" className="wf-heading-h2 mb-8 text-white">
            Fenyx für Sie.
          </h2>

          <div className="dv3-segments__nav" role="tablist" aria-label="Zielgruppen">
            {SEGMENTS.map((seg) => (
              <button
                key={seg.id}
                type="button"
                role="tab"
                aria-selected={activeId === seg.id}
                className={`dv3-segments__tab${activeId === seg.id ? " is-active" : ""}`}
                onClick={() => setActiveId(seg.id)}
              >
                {seg.label}
              </button>
            ))}
          </div>

          <div role="tabpanel">
            <h3 className="dv3-segments__panel-title">{active.title}</h3>
            <p className="dv3-segments__panel-body">{active.body}</p>
            <Link
              href={active.href}
              className="inline-flex mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-signal hover:brightness-110 transition-all"
            >
              Mehr erfahren →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
