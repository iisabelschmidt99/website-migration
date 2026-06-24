import { createClient } from "@/lib/supabase/server";
import { ADMIN_FEATURE } from "@/lib/admin/adminPermissionKeys";
import type { AssignableRole } from "@/lib/admin/accessControlModel";

const PRIVILEGED_ROLES = new Set<AssignableRole>(["admin", "super_admin"]);

export type BenutzerApiAuth =
  | { ok: true; userId: string; permissions: string[] }
  | { ok: false; error: string; status: 401 | 403 };

/** Prüft Session + feature.benutzer; optional privilegierte Rollenvergabe. */
export async function assertBenutzerApiAuth(
  targetRole?: AssignableRole,
): Promise<BenutzerApiAuth> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Nicht angemeldet.", status: 401 };
  }

  const { data: perms, error } = await supabase.rpc("get_my_admin_permissions");

  if (error || !Array.isArray(perms)) {
    return {
      ok: false,
      error: "Berechtigungen konnten nicht geladen werden.",
      status: 403,
    };
  }

  if (!perms.includes(ADMIN_FEATURE.benutzer)) {
    return {
      ok: false,
      error: "Kein Zugriff auf die Benutzerverwaltung.",
      status: 403,
    };
  }

  if (
    targetRole &&
    PRIVILEGED_ROLES.has(targetRole) &&
    !perms.includes(ADMIN_FEATURE.assign_privileged)
  ) {
    return {
      ok: false,
      error: "Keine Berechtigung für Administrator-Rollen.",
      status: 403,
    };
  }

  return { ok: true, userId: user.id, permissions: perms };
}
