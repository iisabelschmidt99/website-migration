"use client";

import { useEffect, useState } from "react";
import { getConsent } from "@/lib/analytics/consent";
import { pushConsentDefaults, pushConsentUpdate } from "@/lib/analytics/dataLayer";
import { trackEvent } from "@/lib/analytics/tracker";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GTM_BASE = process.env.NEXT_PUBLIC_GTM_BASE_URL || "https://www.googletagmanager.com";

export default function GtmLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    pushConsentDefaults();
    pushConsentUpdate();

    const maybeLoad = () => {
      const consent = getConsent();
      if (loaded || !GTM_ID || (!consent?.analytics && !consent?.marketing)) return;
      const script = document.createElement("script");
      script.async = true;
      script.src = `${GTM_BASE.replace(/\/$/, "")}/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      setLoaded(true);
      trackEvent("gtm_loaded", { gtm_id: GTM_ID, transport_url: GTM_BASE });
    };

    const onConsent = () => {
      pushConsentUpdate();
      maybeLoad();
    };
    const onInteraction = () => maybeLoad();

    window.addEventListener("fenyx:consentchange", onConsent);
    window.addEventListener("pointerdown", onInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onInteraction, { once: true });
    window.addEventListener("scroll", onInteraction, { once: true, passive: true });
    const timer = window.setTimeout(maybeLoad, 4500);

    return () => {
      window.removeEventListener("fenyx:consentchange", onConsent);
      window.clearTimeout(timer);
    };
  }, [loaded]);

  return null;
}
