import { ADMIN_FEATURE, ALL_PERMISSION_KEYS } from "./adminPermissionKeys";

export type AssignableRole = "super_admin" | "admin" | "editor" | "viewer";

export const ORDERED_ACCESS_PRESET_ROLES: AssignableRole[] = [
  "super_admin",
  "admin",
  "editor",
  "viewer",
];

const ROLE_LABELS: Record<AssignableRole, string> = {
  super_admin: "Inhaber",
  admin: "Administrator",
  editor: "Redakteur",
  viewer: "Betrachter",
};

const ROLE_DESCRIPTIONS: Record<AssignableRole, string> = {
  super_admin: "Voller Zugriff inkl. privilegierter Rollenvergabe.",
  admin: "Voller CMS-Zugriff und Benutzerverwaltung.",
  editor: "Inhalte pflegen, keine Benutzerverwaltung.",
  viewer: "Nur Übersicht (Leserechte).",
};

/** Spiegelt default_permissions_for_role() in SQL — Fallback wenn RPC fehlt. */
export function getPresetPermissionKeys(role: AssignableRole): string[] {
  const cms = [
    ADMIN_FEATURE.overview,
    ADMIN_FEATURE.referenzen,
    ADMIN_FEATURE.blog,
    ADMIN_FEATURE.team,
    ADMIN_FEATURE.kundenstimmen,
    ADMIN_FEATURE.events,
    ADMIN_FEATURE.medien,
    ADMIN_FEATURE.sicherheit,
    ADMIN_FEATURE.analytics,
  ];

  switch (role) {
    case "super_admin":
      return [
        ...cms,
        ADMIN_FEATURE.benutzer,
        ADMIN_FEATURE.assign_staff,
        ADMIN_FEATURE.assign_privileged,
      ];
    case "admin":
      return [...cms, ADMIN_FEATURE.benutzer, ADMIN_FEATURE.assign_staff];
    case "editor":
      return cms;
    case "viewer":
      return [ADMIN_FEATURE.overview];
    default:
      return [];
  }
}

export function getRoleLabel(role: AssignableRole) {
  return ROLE_LABELS[role];
}

export function getRoleDescription(role: AssignableRole) {
  return ROLE_DESCRIPTIONS[role];
}

export function buildAccessSummary(roles: AssignableRole[]): string {
  if (roles.includes("super_admin")) return "Inhaber";
  if (roles.includes("admin")) return "Administrator";
  if (roles.length === 0) return "Kein Zugang";
  if (roles.length === 1) return ROLE_LABELS[roles[0]];
  return "Mehrere Rollen";
}

export function permissionSetsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((k) => setB.has(k));
}

export function matchesPreset(permissions: string[]): AssignableRole | "custom" {
  for (const role of ORDERED_ACCESS_PRESET_ROLES) {
    const preset = getPresetPermissionKeys(role);
    if (permissionSetsEqual(permissions, preset)) return role;
  }
  return "custom";
}

/** Overrides gegen gewählte Basis-Rolle berechnen. */
export function computeOverrides(
  baseRole: AssignableRole,
  finalPermissions: string[],
): { permission_key: string; granted: boolean }[] {
  const base = new Set(getPresetPermissionKeys(baseRole));
  const final = new Set(finalPermissions);
  const overrides: { permission_key: string; granted: boolean }[] = [];

  for (const key of ALL_PERMISSION_KEYS) {
    const inBase = base.has(key);
    const inFinal = final.has(key);
    if (inBase !== inFinal) {
      overrides.push({ permission_key: key, granted: inFinal });
    }
  }

  return overrides;
}

/** Legacy-Fallback vor RBAC-Migration. */
export function legacyPermissionsForProfileRole(
  role: "super_admin" | "admin" | "editor" | "viewer",
): string[] {
  if (role === "super_admin") return getPresetPermissionKeys("super_admin");
  if (role === "admin") return getPresetPermissionKeys("admin");
  if (role === "editor") return getPresetPermissionKeys("editor");
  return getPresetPermissionKeys("viewer");
}
