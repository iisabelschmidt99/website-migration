"use client";

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

export type RegionData = {
  region_code: string;
  region_name: string;
  sessions: number;
};

const GEO_URL = "/geo/dach-states.json";

export default function DACHMap({
  data,
  totalSessions,
  className = "",
}: {
  data: RegionData[];
  totalSessions: number;
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const byRegion = useMemo(() => new Map(data.map((d) => [d.region_code, d])), [data]);
  const maxSessions = useMemo(() => (data.length ? Math.max(...data.map((d) => d.sessions)) : 0), [data]);

  const fill = (code: string) => {
    const sessions = byRegion.get(code)?.sessions ?? 0;
    if (!sessions) return "#1a2a35";
    const intensity = maxSessions ? sessions / maxSessions : 0;
    return `rgba(200, 255, 0, ${0.15 + intensity * 0.75})`;
  };

  const tooltip = (code: string) => {
    const d = byRegion.get(code);
    const sessions = d?.sessions ?? 0;
    const share = totalSessions ? Math.round((sessions / totalSessions) * 100) : 0;
    return `${d?.region_name ?? code}: ${sessions.toLocaleString("de-DE")} Sessions (${share}%)`;
  };

  return (
    <div className={`relative w-full ${className}`}>
      <ComposableMap projection="geoMercator" projectionConfig={{ center: [10.5, 50.5], scale: 1800 }} style={{ maxHeight: 400, width: "100%" }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = geo.id as string;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill(code)}
                  stroke="#ffffff33"
                  strokeWidth={0.5}
                  onMouseEnter={() => setHovered(code)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ default: { outline: "none" }, hover: { outline: "none", opacity: 0.9 }, pressed: { outline: "none" } }}
                >
                  <title>{tooltip(code)}</title>
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {hovered ? (
        <div className="absolute bottom-2 left-2 border border-white/10 bg-abyss-deep px-3 py-2 text-sm text-white">{tooltip(hovered)}</div>
      ) : null}
    </div>
  );
}
