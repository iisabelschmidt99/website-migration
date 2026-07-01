"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  RANGE_PRESETS,
  type DateRange,
  type RangePresetId,
  getDefaultDateRange,
  parseRangePreset,
  presetToRange,
  rangePresetToDateRange,
} from "@/lib/analytics/dateRange";

export type { DateRange, RangePresetId };
export {
  RANGE_PRESETS,
  getDefaultDateRange,
  parseRangePreset,
  presetToRange,
  rangePresetToDateRange,
  resolveRangeHours,
} from "@/lib/analytics/dateRange";

type Props = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  label?: string;
};

export default function DateRangeSelector({ value, onChange, label = "Zeitraum · First-Party" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isControlled = value != null && onChange != null;
  const activePreset = isControlled
    ? (RANGE_PRESETS.find((preset) => preset.label === value.label) ?? RANGE_PRESETS[0])
    : parseRangePreset(searchParams.get("range"));

  const setRange = (id: RangePresetId) => {
    const preset = parseRangePreset(id);
    if (isControlled) {
      onChange(presetToRange(preset.hours, preset.label));
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", id);
    router.replace(`/admin/analytics?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-[0.12em] text-mist">{label}</span>
      {RANGE_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => setRange(preset.id)}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${
            activePreset.id === preset.id ? "bg-signal text-black" : "border border-white/10 text-mist"
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
