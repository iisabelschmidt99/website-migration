// Benutzerverwaltung: nur für Admins — Profile laden, Rollen ändern, Einladungen.
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import InviteUserForm from "@/components/admin/InviteUserForm";
import UserRoleSelect from "@/components/admin/UserRoleSelect";

export const dynamic = "force-dynamic";

export type UserRole = "admin" | "editor" | "viewer";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  editor: "Redakteur",
  viewer: "Betrachter",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Server Action: Rolle per RLS (is_admin) aktualisieren
async function updateUserRole(userId: string, role: UserRole) {
  "use server";

  if (!["admin", "editor", "viewer"].includes(role)) {
    return { error: "Ungültige Rolle." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht angemeldet." };

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (myProfile?.role !== "admin") {
    return { error: "Kein Zugriff (nur Admins)." };
  }

  // Self-Lockout: Admin darf sich nicht selbst degradieren
  if (userId === user.id && role !== "admin") {
    return { error: "Du kannst dir die Admin-Rolle nicht selbst entziehen." };
  }

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/benutzer");
  return { success: true };
}

export default async function AdminBenutzer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <p className="text-mist text-sm">Nicht angemeldet.</p>
    );
  }

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (myProfile?.role !== "admin") {
    return (
      <div>
        <h1 className="text-2xl font-heading mb-2">Benutzer</h1>
        <p className="text-mist text-sm">
          Kein Zugriff — dieser Bereich ist nur für Admins.
        </p>
      </div>
    );
  }

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true });

  const rows = (profiles ?? []) as ProfileRow[];

  return (
    <div>
      <h1 className="text-2xl font-heading mb-6">Benutzer</h1>

      <InviteUserForm />

      {error && (
        <p className="text-sm text-red-400 mb-4">
          Fehler beim Laden: {error.message}
        </p>
      )}

      {!error && rows.length === 0 && (
        <p className="text-mist text-sm">Noch keine Benutzerprofile.</p>
      )}

      {rows.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-mist border-b border-white/10">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">E-Mail</th>
              <th className="py-2 pr-4 font-medium">Rolle</th>
              <th className="py-2 pr-4 font-medium">Angelegt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="py-2.5 pr-4 text-white">
                  {p.full_name || "—"}
                </td>
                <td className="py-2.5 pr-4 text-mist">{p.email ?? "—"}</td>
                <td className="py-2.5 pr-4">
                  <UserRoleSelect
                    userId={p.id}
                    currentRole={p.role}
                    currentUserId={user.id}
                    updateUserRole={updateUserRole}
                  />
                </td>
                <td className="py-2.5 pr-4 text-mist">
                  {formatDate(p.created_at)}
                  <span className="sr-only"> ({ROLE_LABELS[p.role]})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
