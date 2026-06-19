"use client";

// Seitennavigation des Backends. Hebt den aktiven Tab hervor.
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/referenzen", label: "Referenzen" },
  { href: "/admin/blog", label: "Blog (Ratgeber)" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/kundenstimmen", label: "Kundenstimmen" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/medien", label: "Medien / Upload" },
  { href: "/admin/benutzer", label: "Benutzer" },
  { href: "/admin/sicherheit", label: "Sicherheit" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {ITEMS.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-signal text-black font-semibold"
                : "text-mist hover:text-white hover:bg-white/5"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
