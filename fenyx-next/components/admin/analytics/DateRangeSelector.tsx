"use client";

export type DateRange = { from: Date; to: Date; label: string };

const PRESETS: { label: string; hours: number }[] = [
  { label: "Heute", hours: 24 },
  { label: "7 Tage", hours: 24 * 7 },
  { label: "30 Tage", hours: 24 * 30 },
  { label: "90 Tage", hours: 24 * 90 },
];

export function getDefaultDateRange(): DateRange {
  const to = new Date();
  const from = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return { from, to, label: "Letzte 24 Stunden" };
}

export function presetToRange(hours: number, label: string): DateRange {
  const to = new Date();
  const from = new Date(Date.now() - hours * 60 * 60 * 1000);
  return { from, to, label };
}

export default function DateRangeSelector({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-[0.12em] text-mist">Zeitraum</span>
      {PRESETS.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onChange(presetToRange(p.hours, p.label))}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${
            value.label === p.label ? "bg-signal text-black" : "border border-white/10 text-mist"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function filterByDateRange<T>(
  items: T[],
  range: DateRange,
  key: keyof T,
): T[] {
  const fromMs = range.from.getTime();
  const toMs = range.to.getTime();
  return items.filter((item) => {
    const raw = item[key] as string | null | undefined;
    if (!raw) return true;
    const t = new Date(raw).getTime();
    return t >= fromMs && t <= toMs;
  });
}
