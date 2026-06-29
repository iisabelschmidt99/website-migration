"use client";

import { useEffect } from "react";
import { setTrackingContext } from "@/lib/analytics/context";
import type { TrackingContext } from "@/lib/analytics/types";

export default function TrackPage(props: TrackingContext) {
  useEffect(() => {
    setTrackingContext(props);
  }, [props.page_type, props.service_area, props.audience, props.city, props.contact_person]);

  return null;
}
