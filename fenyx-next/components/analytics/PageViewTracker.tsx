"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { setTrackingContext } from "@/lib/analytics/context";
import { pushVirtualPageView } from "@/lib/analytics/dataLayer";
import { trackPageView } from "@/lib/analytics/events";
import { classifyPage } from "@/lib/analytics/pageClassifier";
import { buildTrackedPagePath } from "@/lib/analytics/pagePath";
import { resetPageVisit } from "@/lib/analytics/tracker";

export default function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const pagePath = buildTrackedPagePath(pathname, search.toString());
    if (lastTrackedPath.current === pagePath) return;
    lastTrackedPath.current = pagePath;

    resetPageVisit();
    const context = classifyPage(pathname);
    setTrackingContext(context);
    trackPageView({ page_path: pagePath, ...context });
    pushVirtualPageView(pagePath, document.title);
  }, [pathname, search]);

  return null;
}
