"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_FEATURE,
  NAV_HREF_TO_PERMISSION,
} from "@/lib/admin/adminPermissionKeys";
import { useAdminPermissions } from "@/contexts/AdminPermissionsContext";

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
  const { can, loading } = useAdminPermissions();

  const visibleItems = ITEMS.filter((item) => {
    const perm =
      NAV_HREF_TO_PERMISSION[item.href] ?? ADMIN_FEATURE.overview;
    if (loading) return item.href === "/admin";
    return can(perm);
  });

  return (
    <nav className="space-y-1">
      {visibleItems.map((item) => {
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
