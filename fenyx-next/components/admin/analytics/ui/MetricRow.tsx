"use client";

import MiniSparkline from "./MiniSparkline";

export type MetricItem = {
  label: string;
  value: string | number;
  sparkline?: Array<Record<string, unknown>>;
  delta?: string;
};

export default function MetricRow({ items }: { items: MetricItem[] }) {
  return (
    <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="bg-abyss-deep p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-mist">{item.label}</p>
          <div className="mt-1 flex items-end justify-between gap-2">
            <p className="text-2xl font-heading text-white">
              {typeof item.value === "number" ? item.value.toLocaleString("de-DE") : item.value}
            </p>
            {item.delta ? <span className="text-xs text-signal">{item.delta}</span> : null}
          </div>
          {item.sparkline?.length ? (
            <div className="mt-2">
              <MiniSparkline data={item.sparkline} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
