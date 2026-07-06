// Landingpages-Übersicht im Backend: zeigt alle SEO-Collections
// (Standort-LPs, Themen-LPs, Standort-Verzeichnisse) mit Status + Live-Link.
// Read-only Übersicht (Bearbeiten folgt separat).
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Row = { slug: string; title?: string | null; published: boolean; href: string };

function labelFor(collection: string): string {
  const map: Record<string, string> = {
    "einrichtung-standorte": "Einrichtung-Standorte",
    ankauf: "Ankauf",
    bueroaufloesung: "Büroauflösungen",
    bueroeinrichtung: "Büroeinrichtungen",
    kauf: "Büromöbel kaufen",
    bueroplanung: "Büroplanung",
    "an-und-verkauf": "Standorte: An-/Verkauf",
    standorte: "Standorte: Miete",
  };
  return map[collection] ?? collection;
}

function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="text-signal text-xs font-semibold">● Live</span>
  ) : (
    <span className="text-mist text-xs">○ Entwurf</span>
  );
}

function CollectionBlock({
  title,
  rows,
}: {
  title: string;
  rows: Row[];
}) {
  const liveCount = rows.filter((r) => r.published).length;
  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-heading text-white">{title}</h2>
        <span className="text-mist text-xs">
          {rows.length} Seiten · {liveCount} live
        </span>
      </div>
      <div className="border border-white/10">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {rows.map((r) => (
              <tr key={r.href} className="border-b border-white/5 last:border-0">
                <td className="py-2.5 px-4 text-white">{r.title || r.slug}</td>
                <td className="py-2.5 px-4 text-mist font-mono text-xs">{r.href}</td>
                <td className="py-2.5 px-4">
                  <StatusBadge published={r.published} />
                </td>
                <td className="py-2.5 px-4 text-right">
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal text-xs font-semibold hover:underline"
                  >
                    Live ansehen ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function AdminLandingpages() {
  const supabase = await createClient();

  const [locations, topics, directories] = await Promise.all([
    supabase
      .from("landing_locations")
      .select("collection, slug, title, published")
      .order("collection")
      .order("slug"),
    supabase
      .from("landing_topics")
      .select("collection, slug, title, published")
      .order("collection")
      .order("slug"),
    supabase
      .from("locations")
      .select("collection, slug, name, page_link, published")
      .order("collection")
      .order("slug"),
  ]);

  // Nach Collection gruppieren
  const groups = new Map<string, Row[]>();
  const add = (key: string, row: Row) => {
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  };

  for (const r of locations.data ?? []) {
    add(r.collection as string, {
      slug: r.slug as string,
      title: r.title as string | null,
      published: Boolean(r.published),
      href: `/${r.collection}/${r.slug}`,
    });
  }
  for (const r of topics.data ?? []) {
    add(r.collection as string, {
      slug: r.slug as string,
      title: r.title as string | null,
      published: Boolean(r.published),
      href: `/${r.collection}/${r.slug}`,
    });
  }
  for (const r of directories.data ?? []) {
    add(`dir:${r.collection}`, {
      slug: r.slug as string,
      title: (r.name as string) ?? (r.slug as string),
      published: Boolean(r.published),
      href: (r.page_link as string) || `/${r.collection}/${r.slug}`,
    });
  }

  const errors = [locations.error, topics.error, directories.error].filter(Boolean);
  const orderedKeys = [
    "einrichtung-standorte",
    "ankauf",
    "bueroaufloesung",
    "bueroeinrichtung",
    "kauf",
    "bueroplanung",
    "dir:an-und-verkauf",
    "dir:bueroeinrichtung",
    "dir:standorte",
  ].filter((k) => groups.has(k));

  return (
    <div>
      <h1 className="text-2xl font-heading mb-2">Landingpages</h1>
      <p className="text-mist text-sm mb-8">
        Übersicht aller SEO-Landingpages mit Status und Link zur Live-Seite.
      </p>

      {errors.length > 0 && (
        <p className="text-sm text-yellow-400 mb-6">
          Hinweis: Eine oder mehrere Tabellen konnten nicht geladen werden
          (evtl. SQL noch nicht ausgeführt): {errors.map((e) => e?.message).join("; ")}
        </p>
      )}

      {orderedKeys.length === 0 && errors.length === 0 && (
        <p className="text-mist text-sm">Noch keine Landingpages importiert.</p>
      )}

      {orderedKeys.map((key) => (
        <CollectionBlock
          key={key}
          title={labelFor(key.replace(/^dir:/, ""))}
          rows={groups.get(key)!}
        />
      ))}
    </div>
  );
}
