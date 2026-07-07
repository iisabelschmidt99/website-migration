export type ContactFormVariant = "A" | "B";

export const CONTACT_FORM_VARIANT_KEY = "fenyx_contact_form_variant_v2";

/** Persistente 50/50-Zuweisung pro Besucher (localStorage). */
export function pickContactFormVariant(
  forced?: ContactFormVariant,
): ContactFormVariant {
  if (forced) return forced;
  if (typeof window === "undefined") return "A";

  const params = new URLSearchParams(window.location.search);
  const urlOverride = params.get("cf");
  if (urlOverride === "A" || urlOverride === "B") return urlOverride;

  const stored = localStorage.getItem(CONTACT_FORM_VARIANT_KEY);
  if (stored === "A" || stored === "B") return stored;

  const variant: ContactFormVariant = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(CONTACT_FORM_VARIANT_KEY, variant);
  return variant;
}
