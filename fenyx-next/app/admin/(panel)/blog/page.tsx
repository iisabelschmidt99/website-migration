// Blog-Übersicht (Ratgeber): liest die Tabelle `blog_posts` aus Supabase.
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, category, published, published_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading">Blog (Ratgeber)</h1>
        <Link
          href="/admin/blog/neu"
          className="px-4 py-2.5 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition"
        >
          + Neuer Artikel
        </Link>
      </div>

      {error && <p className="text-sm text-red-400">Fehler beim Laden: {error.message}</p>}

      {!error && (!posts || posts.length === 0) && (
        <p className="text-mist text-sm">Noch keine Artikel. Lege oben rechts den ersten an.</p>
      )}

      {posts && posts.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-mist border-b border-white/10">
              <th className="py-2 pr-4 font-medium">Titel</th>
              <th className="py-2 pr-4 font-medium">Kategorie</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="py-2.5 pr-4 text-white">{p.title}</td>
                <td className="py-2.5 pr-4 text-mist">{p.category}</td>
                <td className="py-2.5 pr-4">
                  {p.published ? (
                    <span className="text-signal">● veröffentlicht</span>
                  ) : (
                    <span className="text-white/40">○ Entwurf</span>
                  )}
                </td>
                <td className="py-2.5 pr-4">
                  <Link href={`/admin/blog/${p.id}`} className="text-mist hover:text-signal">
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
