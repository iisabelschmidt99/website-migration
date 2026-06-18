// Geschützte Hülle für alle Backend-Seiten (Sidebar + Inhalt).
// Server-Komponente: prüft Login UND Rolle (nur admin/editor dürfen rein).
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sicherheitsnetz (middleware leitet eigentlich schon um)
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  const isStaff = profile?.role === "admin" || profile?.role === "editor";

  // Eingeloggt, aber keine Redaktionsrolle -> Zugriff verweigern
  if (!isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-abyss-deep px-4 text-center">
        <div className="max-w-sm">
          <h1 className="text-white text-xl font-heading mb-3">Kein Zugriff</h1>
          <p className="text-mist text-sm mb-6">
            Dein Konto hat keine Redaktionsrolle. Bitte einen Admin, dir die
            Rolle „editor" oder „admin" zu geben.
          </p>
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-abyss-deep text-white flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-white/10 p-5 flex flex-col">
        <p className="text-signal text-xs font-bold uppercase tracking-[0.15em] mb-6">
          Fenyx Backend
        </p>
        <AdminNav />
        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-mist text-xs mb-2 truncate">
            {profile?.full_name || profile?.email}
            <span className="block text-white/40">Rolle: {profile?.role}</span>
          </p>
          <LogoutButton />
        </div>
      </aside>

      {/* Inhalt */}
      <main className="flex-1 p-8 max-w-5xl">{children}</main>
    </div>
  );
}
