"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import FenyxTooltip from "./FenyxTooltip";
import { CHART_COLORS } from "./chartTheme";
import { labelPieData } from "./chartLabels";

export default function DevicePieChart({
  data,
  height = 280,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  const chartData = labelPieData(data);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          outerRadius={90}
          labelLine={false}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Legend
          formatter={(value) => <span className="text-xs text-mist">{value}</span>}
        />
        <FenyxTooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
