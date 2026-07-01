"use client";

import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/admin/analytics/ui/ChartCard";
import FenyxTooltip from "@/components/admin/analytics/ui/FenyxTooltip";
import { SIGNAL } from "@/components/admin/analytics/ui/chartTheme";

export default function GtmHealthPanel({ configured }: { configured: boolean }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gtm-health", { credentials: "include" });
      const json = await res.json();
      if (!res.ok && res.status !== 503) throw new Error(json.error ?? `HTTP ${res.status}`);
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
        GTM Health benötigt NEXT_PUBLIC_GTM_ID und GTM_SERVICE_ACCOUNT_JSON (optional auf Netlify).
      </div>
    );
  }

  const row = (data?.row ?? data) as Record<string, unknown> | undefined;
  const counts = [
    { name: "Container", value: row?.container_id ? 1 : 0 },
    { name: "Status", value: row?.status === "pending_credentials_wiring" ? 0 : 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-3">
        <p className="text-xs text-mist">GTM Container Health · System B (Consent-gated)</p>
        <button type="button" onClick={load} disabled={loading} className="border border-white/10 px-3 py-2 text-xs font-bold uppercase text-mist">
          {loading ? "Lädt…" : "Aktualisieren"}
        </button>
      </div>
      {error ? <p className="text-sm text-system-error">{error}</p> : null}
      {data?.message ? <p className="text-sm text-mist">{String(data.message)}</p> : null}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase text-mist">Container</p>
          <p className="mt-2 text-lg text-white">{String(row?.container_id ?? "—")}</p>
        </div>
        <div className="border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase text-mist">Status</p>
          <p className="mt-2 text-lg text-white">{String(row?.status ?? "unknown")}</p>
        </div>
        <div className="border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase text-mist">GA4 (live GTM)</p>
          <p className="mt-2 text-lg text-signal">G-E8XZKVVHG6</p>
        </div>
      </div>
      <ChartCard title="GTM Health Checks" height={200}>
        <BarChart data={counts}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
          <XAxis dataKey="name" tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <YAxis tick={{ fill: "#8da4ba", fontSize: 11 }} />
          <FenyxTooltip />
          <Bar dataKey="value" fill={SIGNAL} />
        </BarChart>
      </ChartCard>
      {data?.persistWarning ? <p className="text-xs text-system-warning">{String(data.persistWarning)}</p> : null}
    </div>
  );
}
