"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  REFERENZEN_CATEGORY_LABELS,
  getReferenzEntryImage,
  matchesReferenzFilter,
  placeReferenzCallout,
  spreadReferenzMarkers,
  type ReferenzFilterState,
  type ReferenzFilterType,
  type ReferenzMapEntry,
} from "@/data/referenzen-entries";
import { referenzEntryHref } from "@/data/referenz-case-studies";

type ReferenzenInteractiveSectionProps = {
  heading: string;
  mapIntro: string;
  entries: ReferenzMapEntry[];
};

const MAP_SVG_SRC = "/assets/deutschlandkarte/fenyx-germany-map.svg";
const VB_W = 586;
const VB_H = 793;

function LocationPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="referenzen-cases__pin"
      aria-hidden="true"
    >
      <path
        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ReferenzenInteractiveSection({
  heading,
  mapIntro,
  entries,
}: ReferenzenInteractiveSectionProps) {
  const [filter, setFilter] = useState<ReferenzFilterState>({
    type: "all",
    category: "all",
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [callout, setCallout] = useState<{
    entry: ReferenzMapEntry;
    placement: ReturnType<typeof placeReferenzCallout>;
  } | null>(null);
  const [mapAnimated, setMapAnimated] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mapLayerRef = useRef<SVGGElement>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleEntries = useMemo(
    () => entries.filter((entry) => matchesReferenzFilter(entry, filter)),
    [entries, filter],
  );

  const positionedMarkers = useMemo(
    () => spreadReferenzMarkers(visibleEntries),
    [visibleEntries],
  );

  const positionCalloutOverlay = useCallback(
    (placement: ReturnType<typeof placeReferenzCallout>) => {
      const svg = svgRef.current;
      const container = containerRef.current;
      if (!svg || !container) return null;

      const matrix = svg.getScreenCTM();
      if (!matrix) return null;

      const containerRect = container.getBoundingClientRect();
      const pt = svg.createSVGPoint();

      const toContainer = (sx: number, sy: number) => {
        pt.x = sx;
        pt.y = sy;
        const p = pt.matrixTransform(matrix);
        return {
          x: p.x - containerRect.left,
          y: p.y - containerRect.top,
        };
      };

      const topLeft = toContainer(placement.fx, placement.fy);
      const bottomRight = toContainer(placement.fx + 228, placement.fy + 178);

      return {
        left: topLeft.x,
        top: topLeft.y,
        width: Math.max(bottomRight.x - topLeft.x, 160),
      };
    },
    [],
  );

  const showEntry = useCallback(
    (entry: ReferenzMapEntry, x: number, y: number) => {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
      const placement = placeReferenzCallout(x, y);
      setActiveId(entry.id);
      setCallout({ entry, placement });
    },
    [],
  );

  const scheduleClear = useCallback(() => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => {
      setActiveId(null);
      setCallout(null);
    }, 60);
  }, []);

  const clearSelection = useCallback(() => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    setActiveId(null);
    setCallout(null);
  }, []);

  useEffect(() => {
    const layer = mapLayerRef.current;
    if (!layer) return;

    fetch(MAP_SVG_SRC)
      .then((res) => res.text())
      .then((svgText) => {
        const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
        const inner = doc.documentElement;
        Array.from(inner.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName !== "rect") {
            layer.appendChild(document.importNode(node, true));
          }
        });
        setMapLoaded(true);
      })
      .catch(() => {
        layer.innerHTML =
          '<text x="293" y="400" text-anchor="middle" fill="#8da4ba" font-size="14">Karte konnte nicht geladen werden.</text>';
      });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !mapLoaded) return;

    const states = svg.querySelectorAll(".de-state");
    states.forEach((el, index) => {
      (el as SVGElement).style.transitionDelay = `${index * 45}ms`;
    });

    const cities = svg.querySelectorAll(".de-city");
    cities.forEach((el, index) => {
      (el as SVGElement).style.transitionDelay = `${400 + index * 35}ms`;
    });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMapAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMapAnimated(true);
            observer.unobserve(svg);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(svg);
    return () => observer.disconnect();
  }, [mapLoaded]);

  useEffect(() => {
    if (!callout) return;

    const handleResize = () => {
      setCallout((current) => (current ? { ...current } : null));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [callout]);

  useEffect(() => {
    clearSelection();
  }, [filter, clearSelection]);

  const overlayStyle = callout ? positionCalloutOverlay(callout.placement) : null;

  const setTypeFilter = (type: ReferenzFilterType) => {
    setFilter((current) => ({
      type,
      category: type === "partner" ? "all" : current.category,
    }));
  };

  const setCategoryFilter = (category: ReferenzFilterState["category"]) => {
    setFilter((current) => ({
      type: category !== "all" && current.type === "partner" ? "project" : current.type,
      category,
    }));
  };

  const handleMarkerKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    entry: ReferenzMapEntry,
    x: number,
    y: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showEntry(entry, x, y);
    }
  };

  return (
    <section
      className="referenzen-cases"
      aria-labelledby="referenzen-cases-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="referenzen-cases__intro">
          <h2
            id="referenzen-cases-heading"
            className="referenzen-cases__heading"
          >
            {heading}
          </h2>
          <p className="referenzen-cases__map-intro">{mapIntro}</p>
        </div>

        <div className="referenzen-cases__filters">
          <div className="referenzen-cases__filter-group" role="group" aria-label="Anzeigetyp">
            {(
              [
                ["all", "Alle"],
                ["project", "Referenzprojekte"],
                ["partner", "Partnernetzwerk"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`referenzen-cases__filter-btn${
                  filter.type === value ? " is-active" : ""
                }`}
                onClick={() => setTypeFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="referenzen-cases__category-filter">
            <label htmlFor="referenzen-category" className="referenzen-cases__category-label">
              Leistung
            </label>
            <select
              id="referenzen-category"
              className="referenzen-cases__select"
              value={filter.category}
              onChange={(event) =>
                setCategoryFilter(event.target.value as ReferenzFilterState["category"])
              }
            >
              <option value="all">Alle Leistungen</option>
              <option value="bestandsmanagement">Digitales Bestandsmanagement</option>
              <option value="verwertung">Ganzheitliche Verwertung</option>
              <option value="einrichtung">Schlüsselfertige Einrichtung</option>
            </select>
          </div>
        </div>

        <div className="referenzen-cases__legend" aria-hidden="true">
          <span>
            <span className="referenzen-cases__legend-dot referenzen-cases__legend-dot--project" />
            Referenzprojekt
          </span>
          <span>
            <span className="referenzen-cases__legend-dot referenzen-cases__legend-dot--partner" />
            Partner
          </span>
        </div>

        <div
          className="referenzen-cases__map-wrap"
          aria-label="Deutschlandkarte mit Projektstandorten"
        >
          <div
            ref={containerRef}
            className="referenzen-cases__map-interactive"
            onMouseLeave={clearSelection}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className={`referenzen-cases__map${mapAnimated ? " is-animated" : ""}`}
              role="img"
              aria-label="Interaktive Karte von Deutschland mit Projektstandorten"
            >
              <rect width={VB_W} height={VB_H} fill="#0b171f" />
              <g ref={mapLayerRef} aria-hidden="true" />
              <g>
                {positionedMarkers.map(({ entry, x, y }) => (
                  <g
                    key={entry.id}
                    className={`referenzen-map-marker${
                      entry.type === "partner" ? " partner" : ""
                    }${activeId === entry.id ? " is-active" : ""}`}
                    transform={`translate(${x}, ${y})`}
                    tabIndex={0}
                    role="button"
                    aria-label={`${entry.company}: ${entry.title}`}
                    onMouseEnter={() => showEntry(entry, x, y)}
                    onMouseLeave={scheduleClear}
                    onFocus={() => showEntry(entry, x, y)}
                    onBlur={scheduleClear}
                    onKeyDown={(event) => handleMarkerKeyDown(event, entry, x, y)}
                    onClick={() => showEntry(entry, x, y)}
                  >
                    <circle className="referenzen-map-marker__hit" cx={0} cy={0} r={18} />
                    <circle
                      className="referenzen-map-marker__pulse"
                      cx={0}
                      cy={0}
                      r={entry.type === "partner" ? 8 : 7}
                    />
                    <circle
                      className="referenzen-map-marker__dot"
                      cx={0}
                      cy={0}
                      r={entry.type === "partner" ? 8 : 7}
                    />
                  </g>
                ))}
              </g>
            </svg>

            <svg
              className={`referenzen-cases__callout-lines${
                callout ? " is-visible" : ""
              }`}
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {callout ? (
                <line
                  x1={callout.placement.x1}
                  y1={callout.placement.y1}
                  x2={callout.placement.x2}
                  y2={callout.placement.y2}
                />
              ) : null}
            </svg>

            <div
              className={`referenzen-cases__callout${callout ? " is-visible" : ""}`}
              style={
                overlayStyle
                  ? {
                      left: overlayStyle.left,
                      top: overlayStyle.top,
                      width: overlayStyle.width,
                    }
                  : undefined
              }
              aria-live="polite"
            >
              {callout ? (() => {
                const calloutHref = referenzEntryHref(callout.entry);
                return (
                <article className="referenzen-cases__callout-card">
                  <Image
                    src={getReferenzEntryImage(callout.entry)}
                    alt={callout.entry.company}
                    width={240}
                    height={72}
                    className="referenzen-cases__callout-img"
                  />
                  <div className="referenzen-cases__callout-body">
                    <span className="referenzen-cases__callout-tag">
                      {callout.entry.type === "partner"
                        ? "Partnernetzwerk"
                        : REFERENZEN_CATEGORY_LABELS[callout.entry.category]}
                    </span>
                    <p className="referenzen-cases__callout-company">
                      {callout.entry.company}
                    </p>
                    <p className="referenzen-cases__callout-title">
                      {callout.entry.title}
                    </p>
                    <p className="referenzen-cases__callout-city">{callout.entry.city}</p>
                    {calloutHref ? (
                      <Link
                        href={calloutHref}
                        className="referenzen-cases__callout-link"
                      >
                        Referenz ansehen
                      </Link>
                    ) : null}
                  </div>
                </article>
                );
              })() : null}
            </div>
          </div>
        </div>

        <div className="referenzen-cases__grid" role="list">
          {visibleEntries.map((entry) => {
            const href = referenzEntryHref(entry);
            const card = (
              <>
                <div className="referenzen-cases__card-image-wrap">
                  <Image
                    src={getReferenzEntryImage(entry)}
                    alt={entry.company}
                    width={480}
                    height={320}
                    className="referenzen-cases__card-image"
                    loading="lazy"
                  />
                </div>
                <div className="referenzen-cases__card-body">
                  <span className="referenzen-cases__card-tag">{entry.company}</span>
                  <h3 className="referenzen-cases__card-title">{entry.title}</h3>
                  <p className="referenzen-cases__card-city">
                    <LocationPinIcon />
                    {entry.city}
                  </p>
                </div>
              </>
            );

            return (
              <article
                key={entry.id}
                role="listitem"
                className={`referenzen-cases__card${
                  activeId === entry.id ? " is-highlight" : ""
                }${href ? " referenzen-cases__card--link" : ""}`}
                onMouseEnter={() => {
                  const marker = positionedMarkers.find((item) => item.entry.id === entry.id);
                  if (marker) showEntry(entry, marker.x, marker.y);
                }}
                onMouseLeave={scheduleClear}
              >
                {href ? (
                  <Link href={href} className="referenzen-cases__card-link">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </article>
            );
          })}
        </div>

        {visibleEntries.length === 0 ? (
          <p className="referenzen-cases__empty">
            Keine Ergebnisse für die aktuellen Filtereinstellungen.
          </p>
        ) : null}
      </div>
    </section>
  );
}
