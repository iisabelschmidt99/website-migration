import type { SupabaseClient } from "@supabase/supabase-js";
import type { AssignableRole } from "@/lib/admin/accessControlModel";

/**
 * Setzt die Backend-Rolle für einen Nutzer (Service-Role).
 * Entfernt die Default-`viewer`-Zeile vom Signup-Trigger und legt die Zielrolle an.
 * `profiles.role` wird über den DB-Trigger sync_profile_role_from_user_roles aktualisiert.
 */
export async function assignStaffRole(
  adminClient: SupabaseClient,
  userId: string,
  role: AssignableRole,
) {
  if (role !== "viewer") {
    const { error: delErr } = await adminClient
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "viewer");
    if (delErr) throw delErr;
  }

  const { error: insErr } = await adminClient.from("user_roles").upsert(
    { user_id: userId, role },
    { onConflict: "user_id,role" },
  );
  if (insErr) throw insErr;
}
