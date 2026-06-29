"use client";

import { Suspense, useEffect } from "react";
import CookieBanner from "@/components/analytics/CookieBanner";
import GtmLoader from "@/components/analytics/GtmLoader";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { initAnalyticsTracker } from "@/lib/analytics/tracker";
import { initWebVitals } from "@/lib/analytics/webVitals";

export default function ClientTrackers() {
  useEffect(() => {
    initAnalyticsTracker();
    initWebVitals();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <GtmLoader />
      <CookieBanner />
    </>
  );
}
