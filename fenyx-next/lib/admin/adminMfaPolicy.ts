/** MFA-Erzwingung: admin/super_admin immer; sonst per user_admin_access_settings. */

export const STAFF_ROLES = new Set([
  "super_admin",
  "admin",
  "editor",
  "viewer",
]);

export const ALWAYS_MFA_ROLES = new Set(["admin", "super_admin"]);

export function isStaffRole(role: string) {
  return STAFF_ROLES.has(role);
}

export function shouldEnforceAdminMfa(opts: {
  roles: string[];
  requireMfa?: boolean | null;
}) {
  if (opts.roles.some((r) => ALWAYS_MFA_ROLES.has(r))) return true;
  return opts.requireMfa === true;
}
