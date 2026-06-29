"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/analytics/consent";
import { trackEvent } from "@/lib/analytics/tracker";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [preferences, setPreferences] = useState(false);

  useEffect(() => {
    setVisible(!getConsent());
  }, []);

  function save(next: { analytics: boolean; marketing: boolean; preferences: boolean }) {
    const consent = setConsent(next);
    trackEvent("consent_update", {
      consent_analytics: consent.analytics,
      consent_marketing: consent.marketing,
      consent_preferences: consent.preferences,
      consent_version: consent.version,
      consent_updated_at: consent.updatedAt,
    });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-abyss-deep text-white shadow-2xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-signal">
            Datenschutz & Tracking
          </p>
          <p className="text-sm leading-relaxed text-mist">
            Wir messen Besucherzahlen cookielos und ohne Geräte-Speicherung –
            unabhängig von dieser Auswahl. Marketing-Tags (z. B. Google Tag
            Manager) laden wir nur mit deiner Einwilligung.
          </p>
          {settingsOpen ? (
            <div className="mt-4 grid gap-3 text-sm text-mist sm:grid-cols-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="accent-[#c8ff00]"
                />
                Statistik
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="accent-[#c8ff00]"
                />
                Marketing
              </label>
              <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                    className="accent-[#c8ff00]"
                  />
                Präferenzen
              </label>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            className="border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-mist hover:border-signal hover:text-white"
          >
            Einstellungen
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false, preferences: false })}
            className="border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-mist hover:border-signal hover:text-white"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => save({ analytics, marketing, preferences })}
            className="border border-signal px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-signal"
          >
            Auswahl speichern
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true, preferences: true })}
            className="bg-signal px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-black"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
