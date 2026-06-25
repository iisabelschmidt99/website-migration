/** Permission keys — müssen mit default_permissions_for_role() in SQL übereinstimmen. */

export const ADMIN_FEATURE = {
  overview: "feature.overview",
  referenzen: "feature.referenzen",
  blog: "feature.blog",
  team: "feature.team",
  kundenstimmen: "feature.kundenstimmen",
  events: "feature.events",
  medien: "feature.medien",
  benutzer: "feature.benutzer",
  sicherheit: "feature.sicherheit",
  analytics: "feature.analytics",
  assign_staff: "roles.assign_staff",
  assign_privileged: "roles.assign_privileged",
} as const;

export type AdminFeatureKey = (typeof ADMIN_FEATURE)[keyof typeof ADMIN_FEATURE];

/** Nav href → permission key */
export const NAV_HREF_TO_PERMISSION: Record<string, string> = {
  "/admin": ADMIN_FEATURE.overview,
  "/admin/referenzen": ADMIN_FEATURE.referenzen,
  "/admin/blog": ADMIN_FEATURE.blog,
  "/admin/team": ADMIN_FEATURE.team,
  "/admin/kundenstimmen": ADMIN_FEATURE.kundenstimmen,
  "/admin/events": ADMIN_FEATURE.events,
  "/admin/medien": ADMIN_FEATURE.medien,
  "/admin/benutzer": ADMIN_FEATURE.benutzer,
  "/admin/sicherheit": ADMIN_FEATURE.sicherheit,
  "/admin/analytics": ADMIN_FEATURE.analytics,
};

export const ALL_PERMISSION_KEYS: AdminFeatureKey[] = Object.values(ADMIN_FEATURE);
