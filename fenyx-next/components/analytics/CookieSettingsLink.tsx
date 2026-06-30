"use client";

/** Öffnet das Cookie-Einstellungs-Panel (Footer-Link). */
export default function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("fenyx:cookie-settings"))}
      className="hover:text-signal transition-colors"
      data-track-event="cta_click"
      data-track-id="footer__legal__cookie_settings"
    >
      Cookie-Einstellungen
    </button>
  );
}
