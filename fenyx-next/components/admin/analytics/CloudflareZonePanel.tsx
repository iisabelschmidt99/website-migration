"use client";

import { useCallback, useEffect, useState } from "react";
import { formatBytes } from "@/lib/cloudflare/analytics";

type ZoneOverview = {
  configured?: boolean;
  message?: string;
  requests?: number;
  threats?: number;
  bandwidth_bytes?: number;
  cache_ratio?: number | null;
  period_start?: string;
  period_end?: string;
  error?: string;
};

type Props = {
  configured: boolean;
};

export default function CloudflareZonePanel({ configured }: Props) {
  const [data, setData] = useState<ZoneOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async (persist = false) => {
    if (!configured) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ action: "zone-overview" });
      if (persist) params.set("persist", "1");
      const res = await fetch(`/api/cloudflare-analytics?${params}`, { credentials: "include" });
      const json = (await res.json()) as ZoneOverview;
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      if (json.configured === false) {
        setData(json);
        return;
      }
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Abruf fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    if (configured) fetchOverview();
  }, [configured, fetchOverview]);

  if (!configured) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <h2 className="mb-2 text-sm font-semibold text-white">Cloudflare Zone Analytics</h2>
        <p className="text-sm text-mist">
          CLOUDFLARE_API_TOKEN und CLOUDFLARE_ZONE_ID fehlen. Zone muss aktiv sein (nicht pending).
        </p>
      </div>
    );
  }

  const cachePct =
    data?.cache_ratio != null ? `${Math.round(data.cache_ratio * 1000) / 10}%` : "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Cloudflare Zone (24h)</h2>
          <p className="mt-1 text-xs text-mist">
            {data?.period_start && data?.period_end
              ? `${data.period_start} – ${data.period_end}`
              : "Letzte 24 Stunden"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fetchOverview(false)}
            disabled={loading}
            className="border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-mist hover:border-signal hover:text-signal disabled:opacity-50"
          >
            {loading ? "Lädt…" : "Aktualisieren"}
          </button>
          <button
            type="button"
            onClick={() => fetchOverview(true)}
            disabled={loading}
            className="border border-signal bg-signal px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-black disabled:opacity-50"
          >
            Snapshot speichern
          </button>
        </div>
      </div>

      {error ? (
        <div className="border border-system-error/40 bg-system-error/10 p-4 text-sm text-system-error">
          {error}
        </div>
      ) : null}

      {data?.message ? <p className="text-sm text-mist">{data.message}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Requests" value={data?.requests?.toLocaleString("de-DE") ?? "—"} />
        <Kpi label="Bedrohungen" value={data?.threats?.toLocaleString("de-DE") ?? "—"} />
        <Kpi label="Bandbreite" value={data?.bandwidth_bytes != null ? formatBytes(data.bandwidth_bytes) : "—"} />
        <Kpi label="Cache Ratio" value={cachePct} />
      </div>

      <p className="text-xs text-mist">
        Quelle: Cloudflare GraphQL (<code className="text-mist-soft">httpRequests1dGroups</code>). Bei pending Zone
        sind Werte oft leer — dann im{" "}
        <a
          href="https://dash.cloudflare.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-signal underline"
        >
          Cloudflare Dashboard
        </a>{" "}
        prüfen.
      </p>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-mist">{label}</p>
      <p className="mt-2 text-2xl font-heading text-white">{value}</p>
    </div>
  );
}
