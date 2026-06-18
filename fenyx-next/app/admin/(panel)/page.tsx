// Backend-Startseite (/admin) – Übersicht über die Bereiche.
import Link from "next/link";

const SECTIONS = [
  { href: "/admin/referenzen", title: "Referenzen", desc: "Case Studies anlegen und bearbeiten" },
  { href: "/admin/blog", title: "Blog (Ratgeber)", desc: "Artikel schreiben und veröffentlichen" },
  { href: "/admin/medien", title: "Medien / Upload", desc: "Bilder hochladen und verwalten" },
  { href: "/admin/benutzer", title: "Benutzer", desc: "Konten und Rollen verwalten" },
  { href: "/admin/sicherheit", title: "Sicherheit", desc: "Passwort & 2-Faktor-Authentifizierung" },
  { href: "/admin/analytics", title: "Analytics", desc: "Besucher-Statistiken (folgt)" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-2">Willkommen im Fenyx-Backend</h1>
      <p className="text-mist text-sm mb-8">
        Wähle einen Bereich. Die Inhalte werden nach und nach an Supabase angebunden.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block border border-white/10 p-5 hover:border-signal transition-colors"
          >
            <span className="block text-white font-semibold mb-1">{s.title}</span>
            <span className="block text-mist text-sm">{s.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
