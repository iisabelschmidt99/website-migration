import { createClient } from "@/lib/supabase/server";
import { ADMIN_FEATURE } from "@/lib/admin/adminPermissionKeys";

export async function assertAnalyticsApiAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Nicht angemeldet.", status: 401 };

  const { data, error } = await supabase.rpc("get_my_admin_permissions");
  if (error || !Array.isArray(data) || !data.includes(ADMIN_FEATURE.analytics)) {
    return { ok: false as const, error: "Kein Zugriff auf Analytics.", status: 403 };
  }
  return { ok: true as const, user };
}
