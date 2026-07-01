"use client";

import { useCallback, useEffect, useState } from "react";
import MetricRow from "@/components/admin/analytics/ui/MetricRow";
import { formatBytes } from "@/lib/cloudflare/analytics";

export default function ZoneOverviewPanel({ configured }: { configured: boolean }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (persist = false) => {
    if (!configured) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ action: "zone-overview" });
      if (persist) params.set("persist", "1");
      const res = await fetch(`/api/cloudflare-analytics?${params}`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Abruf fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    load();
  }, [load]);

  if (!configured) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-5 text-sm text-mist">
        CLOUDFLARE_API_TOKEN und CLOUDFLARE_ZONE_ID fehlen.
      </div>
    );
  }

  const requests = Number(data?.requests ?? 0);
  const threats = Number(data?.threats ?? 0);
  const bandwidth = Number(data?.bandwidth_bytes ?? 0);
  const cacheRatio = data?.cache_ratio != null ? `${Math.round(Number(data.cache_ratio) * 1000) / 10}%` : "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-xs text-mist">Zone KPIs (24h) · {String(data?.period_start ?? "")} – {String(data?.period_end ?? "")}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => load(false)} disabled={loading} className="border border-white/10 px-3 py-2 text-xs font-bold uppercase text-mist hover:border-signal">
            Aktualisieren
          </button>
          <button type="button" onClick={() => load(true)} disabled={loading} className="border border-signal bg-signal px-3 py-2 text-xs font-bold uppercase text-black">
            Snapshot speichern
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-system-error">{error}</p> : null}
      <MetricRow
        items={[
          { label: "Requests", value: requests.toLocaleString("de-DE") },
          { label: "Bedrohungen", value: threats.toLocaleString("de-DE") },
          { label: "Bandbreite", value: formatBytes(bandwidth) },
          { label: "Cache Ratio", value: cacheRatio },
        ]}
      />
      <p className="text-xs text-mist">
        Zone muss aktiv sein (nicht pending). Bei leeren Werten DNS/Proxy in Cloudflare prüfen.
      </p>
    </div>
  );
}
