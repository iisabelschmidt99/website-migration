"use client";

import { useMemo, useState } from "react";
import WorldMap, { type DataItem } from "react-svg-worldmap";
import DACHMap, { type RegionData } from "./DACHMap";

export type CountryData = {
  country_code: string;
  country_name: string;
  sessions: number;
  leads?: number;
};

const COUNTRY_NAMES: Record<string, string> = {
  DE: "Deutschland", AT: "Österreich", CH: "Schweiz", US: "USA", GB: "Großbritannien",
  FR: "Frankreich", NL: "Niederlande", IT: "Italien", ES: "Spanien", PL: "Polen",
};

function flag(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0)));
}

export default function CountryHeatMap({
  data,
  regionData = [],
  totalSessions,
}: {
  data: CountryData[];
  regionData?: RegionData[];
  totalSessions: number;
}) {
  const [viewMode, setViewMode] = useState<"map" | "table">("map");
  const [mapScope, setMapScope] = useState<"world" | "dach">("world");

  const knownCountries = useMemo(
    () => data.filter((country) => country.country_code !== "UNKNOWN"),
    [data],
  );

  const mapData = useMemo(
    () =>
      knownCountries.map((d) => ({
        country: d.country_code.toLowerCase(),
        value: d.sessions,
      })) as DataItem[],
    [knownCountries],
  );
  const top5 = knownCountries.slice(0, 5);
  const stats = useMemo(() => {
    const top = knownCountries[0];
    return {
      countries: knownCountries.length,
      topCode: top?.country_code ?? "—",
      topShare: top && totalSessions ? Math.round((top.sessions / totalSessions) * 100) : 0,
    };
  }, [knownCountries, totalSessions]);

  const toggleBtn = (active: boolean) =>
    active ? "bg-signal text-black" : "border border-white/10 text-mist";

  if (!data.length) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-8 text-center text-mist">
        Noch keine Länderdaten — Geo erscheint nach Cloudflare-Worker-Deploy.
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">Traffic nach Land</h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setViewMode("map")} className={`px-2 py-1 text-xs font-bold uppercase ${toggleBtn(viewMode === "map")}`}>Karte</button>
          <button type="button" onClick={() => setViewMode("table")} className={`px-2 py-1 text-xs font-bold uppercase ${toggleBtn(viewMode === "table")}`}>Tabelle</button>
          {viewMode === "map" ? (
            <>
              <button type="button" onClick={() => setMapScope("world")} className={`px-2 py-1 text-xs font-bold uppercase ${toggleBtn(mapScope === "world")}`}>Welt</button>
              <button type="button" onClick={() => setMapScope("dach")} className={`px-2 py-1 text-xs font-bold uppercase ${toggleBtn(mapScope === "dach")}`}>DACH</button>
            </>
          ) : null}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Länder", value: stats.countries },
          { label: "Sessions", value: totalSessions.toLocaleString("de-DE") },
          { label: "Top Land", value: `${flag(stats.topCode)} ${stats.topCode}` },
          { label: "Top Anteil", value: `${stats.topShare}%` },
        ].map((s) => (
          <div key={s.label} className="border border-white/5 bg-abyss-deep p-3 text-center">
            <p className="text-xs text-mist">{s.label}</p>
            <p className="mt-1 text-lg font-heading text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {viewMode === "map" ? (
        <div className="min-h-[320px] w-full">
          {mapScope === "world" ? (
            <WorldMap
              color="#c8ff00"
              valueSuffix=" Sessions"
              size="responsive"
              data={mapData}
              backgroundColor="transparent"
              borderColor="#ffffff33"
                styleFunction={(ctx) => {
                const val = ctx.countryValue ?? 0;
                const intensity = ctx.maxValue > 0 ? val / ctx.maxValue : 0;
                return {
                  fill: val > 0 ? `rgba(200,255,0,${0.15 + intensity * 0.75})` : "#1a2a35",
                  stroke: "#ffffff33",
                  strokeWidth: 0.5,
                };
              }}
            />
          ) : regionData.length ? (
            <DACHMap data={regionData} totalSessions={totalSessions} />
          ) : (
            <p className="py-16 text-center text-sm text-mist">Keine DACH-Regionsdaten im Zeitraum.</p>
          )}
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase text-mist">
              <th className="pb-2">Land</th>
              <th className="pb-2 text-right">Sessions</th>
              <th className="pb-2 text-right">Anteil</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.country_code} className="border-b border-white/5">
                <td className="py-2 text-white">{flag(row.country_code)} {row.country_name}</td>
                <td className="py-2 text-right text-mist-soft">{row.sessions.toLocaleString("de-DE")}</td>
                <td className="py-2 text-right text-mist">{totalSessions ? Math.round((row.sessions / totalSessions) * 100) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {top5.map((c) => (
          <span key={c.country_code} className="border border-white/10 px-2 py-1 text-xs text-mist-soft">
            {flag(c.country_code)} {c.country_code}: {c.sessions}
          </span>
        ))}
      </div>
    </div>
  );
}
