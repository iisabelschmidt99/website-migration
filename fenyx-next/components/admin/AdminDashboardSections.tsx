"use client";

import Link from "next/link";
import { NAV_HREF_TO_PERMISSION } from "@/lib/admin/adminPermissionKeys";
import { useAdminPermissions } from "@/contexts/AdminPermissionsContext";

const SECTIONS = [
  { href: "/admin/referenzen", title: "Referenzen", desc: "Case Studies anlegen und bearbeiten" },
  { href: "/admin/blog", title: "Blog (Ratgeber)", desc: "Artikel schreiben und veröffentlichen" },
  { href: "/admin/medien", title: "Medien / Upload", desc: "Bilder hochladen und verwalten" },
  { href: "/admin/benutzer", title: "Benutzer", desc: "Konten und Rollen verwalten" },
  { href: "/admin/sicherheit", title: "Sicherheit", desc: "Passwort & 2-Faktor-Authentifizierung" },
  { href: "/admin/analytics", title: "Analytics", desc: "Besucher-Statistiken (folgt)" },
];

export default function AdminDashboardSections() {
  const { can, loading } = useAdminPermissions();

  const visible = SECTIONS.filter((s) => {
    const perm = NAV_HREF_TO_PERMISSION[s.href];
    if (!perm) return true;
    if (loading) return false;
    return can(perm);
  });

  if (loading) {
    return <p className="text-mist text-sm">Bereiche werden geladen …</p>;
  }

  if (visible.length === 0) {
    return (
      <p className="text-mist text-sm">
        Keine Backend-Bereiche freigeschaltet. Wende dich an einen Administrator.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {visible.map((s) => (
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
  );
}
