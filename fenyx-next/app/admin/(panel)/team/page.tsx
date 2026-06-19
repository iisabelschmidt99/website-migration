import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminTeam() {
  const supabase = await createClient();
  const { data: members, error } = await supabase
    .from("team_members")
    .select("id, slug, name, position, sort_order, published")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading">Team</h1>
        <Link
          href="/admin/team/neu"
          className="px-4 py-2.5 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition"
        >
          + Neues Team-Mitglied
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-400">Fehler beim Laden: {error.message}</p>
      )}

      {!error && (!members || members.length === 0) && (
        <p className="text-mist text-sm">Noch keine Team-Einträge.</p>
      )}

      {members && members.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-mist border-b border-white/10">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Position</th>
              <th className="py-2 pr-4 font-medium">Reihenfolge</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-white/5">
                <td className="py-2.5 pr-4 text-white">{m.name}</td>
                <td className="py-2.5 pr-4 text-mist">{m.position}</td>
                <td className="py-2.5 pr-4 text-mist">{m.sort_order}</td>
                <td className="py-2.5 pr-4">
                  {m.published ? (
                    <span className="text-signal">● veröffentlicht</span>
                  ) : (
                    <span className="text-white/40">○ Entwurf</span>
                  )}
                </td>
                <td className="py-2.5 pr-4">
                  <Link href={`/admin/team/${m.id}`} className="text-mist hover:text-signal">
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
