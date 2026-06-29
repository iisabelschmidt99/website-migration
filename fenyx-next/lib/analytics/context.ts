"use client";

import type { TrackingContext } from "./types";

declare global {
  interface Window {
    fenyxTrackingContext?: TrackingContext;
  }
}

export function setTrackingContext(context: TrackingContext) {
  window.fenyxTrackingContext = context;
}

export function getTrackingContext(): TrackingContext {
  if (typeof window === "undefined") return {};
  return window.fenyxTrackingContext ?? {};
}
