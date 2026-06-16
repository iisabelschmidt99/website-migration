"use client";

// HubSpot-Kontaktformular – Client-Komponente, weil das Embed-Skript
// DOM-Manipulation und SessionStorage braucht (wie in der Webflow-Vorlage).

import { useEffect } from "react";

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: Record<string, unknown>) => void;
      };
    };
  }
}

const PORTAL_ID = "143687456";
const FORM_ID = "8a7b651a-72ef-4835-b84f-1b0b416f0b7b";

function detectSearchEngine(referrer: string): string | null {
  if (!referrer) return null;
  const domain = referrer.toLowerCase().replace("www.", "");
  const engines: Record<string, string> = {
    "google.": "google",
    "bing.com": "bing",
    "yahoo.": "yahoo",
    "duckduckgo.com": "duckduckgo",
    "ecosia.org": "ecosia",
    "baidu.com": "baidu",
    "t-online.de": "t-online",
  };
  for (const [pattern, name] of Object.entries(engines)) {
    if (domain.includes(pattern)) return name;
  }
  return null;
}

function initAutoUTM() {
  if (window.location.search.includes("utm_source")) return;
  const engine = detectSearchEngine(document.referrer);
  if (!engine) return;
  const url = new URL(window.location.href);
  url.searchParams.set("utm_source", engine);
  url.searchParams.set("utm_medium", "organic");
  url.searchParams.set("utm_campaign", "seo-auto-tagging");
  window.history.replaceState({}, "", url.toString());
}

function trackUTMAndPageHistory() {
  const url = location.href;
  const params = new URLSearchParams(window.location.search);
  params.forEach((value, key) => {
    if (key.startsWith("utm_") && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, value);
    }
  });
  const history = JSON.parse(sessionStorage.getItem("pageHistory") || "[]");
  if (history.length === 0 || history[history.length - 1] !== url) {
    history.push(url);
    sessionStorage.setItem("pageHistory", JSON.stringify(history));
  }
}

function getAkquisekanalArt(): string {
  const source = sessionStorage.getItem("utm_source");
  const medium = sessionStorage.getItem("utm_medium");
  if (!source) return "";
  const name = source.charAt(0).toUpperCase() + source.slice(1);
  const paid = ["cpc", "ppc", "paid", "paidsearch", "sem"];
  const organic = ["organic", "seo"];
  if (medium && paid.includes(medium.toLowerCase())) return `${name}_SEA`;
  if (medium && organic.includes(medium.toLowerCase())) return `${name}_SEO`;
  return `${name}_SEO`;
}

export default function HubSpotForm() {
  useEffect(() => {
    initAutoUTM();
    trackUTMAndPageHistory();

    const mountForm = () => {
      if (!window.hbspt) return;
      window.hbspt.forms.create({
        portalId: PORTAL_ID,
        formId: FORM_ID,
        region: "eu1",
        target: "#hubspot-form-container",
        onFormReady: () => {
          const pageUrl = document.getElementById(
            `page_url-${FORM_ID}`
          ) as HTMLInputElement | null;
          if (pageUrl) pageUrl.value = window.location.href;

          const utmFields: Record<string, string> = {
            utm_source: `utm_source-${FORM_ID}`,
            utm_medium: `utm_medium-${FORM_ID}`,
            utm_campaign: `utm_campaign-${FORM_ID}`,
            utm_id: `utm_id-${FORM_ID}`,
            utm_term: `utm_term-${FORM_ID}`,
            utm_adgroup: `utm_adgroup-${FORM_ID}`,
            utm_content: `utm_content-${FORM_ID}`,
          };
          for (const [param, id] of Object.entries(utmFields)) {
            const value = sessionStorage.getItem(param);
            if (!value) continue;
            const field = document.getElementById(id) as HTMLInputElement | null;
            if (field) field.value = value;
          }

          const akquise = document.getElementById(
            `akquisekanal_art-${FORM_ID}`
          ) as HTMLInputElement | null;
          if (akquise) akquise.value = getAkquisekanalArt();
        },
      });
    };

    if (window.hbspt) {
      mountForm();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js-eu1.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.onload = mountForm;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return <div id="hubspot-form-container" className="hubspot-form" />;
}
