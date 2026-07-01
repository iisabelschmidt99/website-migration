"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { SIGNAL } from "./chartTheme";

export default function MiniSparkline({
  data,
  dataKey = "v",
  color = SIGNAL,
  height = 40,
}: {
  data: Array<Record<string, unknown>>;
  dataKey?: string;
  color?: string;
  height?: number;
}) {
  if (!data.length) return <div style={{ height }} />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}33`} dot={false} strokeWidth={1.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
