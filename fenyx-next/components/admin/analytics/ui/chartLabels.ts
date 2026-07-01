const DEVICE_LABELS: Record<string, string> = {
  desktop: "Desktop",
  mobile: "Mobil",
  tablet: "Tablet",
  unknown: "Unbekannt",
};

export function labelDevice(value: string): string {
  return DEVICE_LABELS[value.toLowerCase()] ?? value;
}

export function labelPieData(items: { name: string; value: number }[]) {
  return items.map((item) => ({
    ...item,
    label: labelDevice(item.name),
  }));
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

export function isTrackableAnalyticsPage(path: string): boolean {
  const normalized = path || "/";
  return !normalized.startsWith("/admin");
}
