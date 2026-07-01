export const RANGE_PRESETS = [
  { id: "1d", label: "Heute", hours: 24 },
  { id: "7d", label: "7 Tage", hours: 24 * 7 },
  { id: "30d", label: "30 Tage", hours: 24 * 30 },
  { id: "90d", label: "90 Tage", hours: 24 * 90 },
] as const;

export type RangePresetId = (typeof RANGE_PRESETS)[number]["id"];

export type DateRange = { from: Date; to: Date; label: string };

export function parseRangePreset(id: string | null | undefined) {
  return RANGE_PRESETS.find((preset) => preset.id === id) ?? RANGE_PRESETS[0];
}

export function resolveRangeHours(id: string | null | undefined): number {
  return parseRangePreset(id).hours;
}

export function presetToRange(hours: number, label: string): DateRange {
  const to = new Date();
  const from = new Date(Date.now() - hours * 60 * 60 * 1000);
  return { from, to, label };
}

export function getDefaultDateRange(): DateRange {
  const preset = RANGE_PRESETS[0];
  return presetToRange(preset.hours, preset.label);
}

export function rangePresetToDateRange(id: RangePresetId): DateRange {
  const preset = parseRangePreset(id);
  return presetToRange(preset.hours, preset.label);
}
