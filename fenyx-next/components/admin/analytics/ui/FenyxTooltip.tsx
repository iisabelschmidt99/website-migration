"use client";

type TooltipEntry = { name?: string; value?: number; color?: string };

export default function FenyxTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-white/10 bg-abyss-deep px-3 py-2 text-xs shadow-lg">
      {label != null ? <p className="mb-1 font-semibold text-white">{String(label)}</p> : null}
      {payload.map((entry) => (
        <p key={String(entry.name)} className="text-mist-soft">
          {entry.name}: <span className="text-signal">{entry.value?.toLocaleString("de-DE")}</span>
        </p>
      ))}
    </div>
  );
}
