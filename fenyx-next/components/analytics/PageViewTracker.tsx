"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { setTrackingContext } from "@/lib/analytics/context";
import { pushVirtualPageView } from "@/lib/analytics/dataLayer";
import { trackPageView } from "@/lib/analytics/events";
import { classifyPage } from "@/lib/analytics/pageClassifier";
import { buildTrackedPagePath } from "@/lib/analytics/pagePath";
import { resetPageVisit } from "@/lib/analytics/tracker";

export default function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    resetPageVisit();
    const context = classifyPage(pathname);
    setTrackingContext(context);
    const pagePath = buildTrackedPagePath(pathname, search.toString());
    trackPageView({ page_path: pagePath, ...context });
    pushVirtualPageView(pagePath, document.title);
  }, [pathname, search]);

  return null;
}
