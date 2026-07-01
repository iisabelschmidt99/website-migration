"use client";

import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

export default function ChartCard({
  title,
  subtitle,
  height = 300,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  height?: number;
  children: ReactElement;
  className?: string;
}) {
  return (
    <div className={`border border-white/10 bg-white/[0.02] p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs text-mist">{subtitle}</p> : null}
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
