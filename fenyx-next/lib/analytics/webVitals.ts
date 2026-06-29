"use client";

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { trackEvent } from "./tracker";

function ratingFor(metric: Metric): "good" | "needs-improvement" | "poor" {
  const value = metric.name === "CLS" ? metric.value * 1000 : metric.value;
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    INP: [200, 500],
    CLS: [100, 250],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  };
  const [good, poor] = thresholds[metric.name] ?? [0, 0];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

function report(metric: Metric) {
  trackEvent("web_vital", {
    metric_name: metric.name,
    metric_value: metric.name === "CLS" ? metric.value * 1000 : metric.value,
    rating: ratingFor(metric),
    metric_id: metric.id,
  });
}

export function initWebVitals() {
  onCLS(report);
  onFCP(report);
  onINP(report);
  onLCP(report);
  onTTFB(report);
}
