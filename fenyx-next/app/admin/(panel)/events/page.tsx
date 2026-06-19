import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminEvents() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("id, slug, title, event_date, location, published")
    .order("event_date", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading">Events</h1>
        <Link
          href="/admin/events/neu"
          className="px-4 py-2.5 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.12em] hover:brightness-95 transition"
        >
          + Neues Event
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-400">Fehler beim Laden: {error.message}</p>
      )}

      {!error && (!events || events.length === 0) && (
        <p className="text-mist text-sm">Noch keine Events.</p>
      )}

      {events && events.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-mist border-b border-white/10">
              <th className="py-2 pr-4 font-medium">Titel</th>
              <th className="py-2 pr-4 font-medium">Datum</th>
              <th className="py-2 pr-4 font-medium">Ort</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-b border-white/5">
                <td className="py-2.5 pr-4 text-white">{ev.title}</td>
                <td className="py-2.5 pr-4 text-mist">
                  {ev.event_date
                    ? new Date(ev.event_date).toLocaleDateString("de-DE")
                    : "—"}
                </td>
                <td className="py-2.5 pr-4 text-mist">{ev.location}</td>
                <td className="py-2.5 pr-4">
                  {ev.published ? (
                    <span className="text-signal">● veröffentlicht</span>
                  ) : (
                    <span className="text-white/40">○ Entwurf</span>
                  )}
                </td>
                <td className="py-2.5 pr-4">
                  <Link href={`/admin/events/${ev.id}`} className="text-mist hover:text-signal">
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
