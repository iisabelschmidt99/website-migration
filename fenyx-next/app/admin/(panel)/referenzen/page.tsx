// Referenzen-Übersicht im Backend: liest die Tabelle `references` aus Supabase.
// Als Redaktion (RLS) sieht man auch unveröffentlichte Einträge.
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Immer frische Daten (kein Caching im Admin)
export const dynamic = "force-dynamic";

export default async function AdminReferenzen() {
  const supabase = await createClient();
  const { data: refs, error } = await supabase
    .from("references")
    .select("id, slug, company, title, city, year, published")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading">Referenzen</h1>
        <Link
          href="/admin/referenzen/neu"
          className="px-4 py-2.5 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition"
        >
          + Neue Referenz
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-400">
          Fehler beim Laden: {error.message}
        </p>
      )}

      {!error && (!refs || refs.length === 0) && (
        <p className="text-mist text-sm">
          Noch keine Referenzen. Lege oben rechts die erste an.
        </p>
      )}

      {refs && refs.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-mist border-b border-white/10">
              <th className="py-2 pr-4 font-medium">Unternehmen</th>
              <th className="py-2 pr-4 font-medium">Titel</th>
              <th className="py-2 pr-4 font-medium">Ort / Jahr</th>
              <th className="py-2 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {refs.map((r) => (
              <tr key={r.id} className="border-b border-white/5">
                <td className="py-2.5 pr-4 text-white">{r.company}</td>
                <td className="py-2.5 pr-4 text-mist">{r.title}</td>
                <td className="py-2.5 pr-4 text-mist">
                  {[r.city, r.year].filter(Boolean).join(" · ")}
                </td>
                <td className="py-2.5 pr-4">
                  {r.published ? (
                    <span className="text-signal">● veröffentlicht</span>
                  ) : (
                    <span className="text-white/40">○ Entwurf</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
