"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import CookieBanner from "@/components/analytics/CookieBanner";
import GtmLoader from "@/components/analytics/GtmLoader";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { initAnalyticsTracker } from "@/lib/analytics/tracker";
import { initWebVitals } from "@/lib/analytics/webVitals";

export default function ClientTrackers() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    initAnalyticsTracker();
    initWebVitals();
  }, [isAdmin]);

  if (isAdmin) return null;

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
