"use client";

// Seitennavigation des Backends. Hebt den aktiven Tab hervor.
// „Benutzer" nur für Admins (Prop vom Panel-Layout oder clientseitig nachladen).
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ITEMS = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/referenzen", label: "Referenzen" },
  { href: "/admin/blog", label: "Blog (Ratgeber)" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/kundenstimmen", label: "Kundenstimmen" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/medien", label: "Medien / Upload" },
  { href: "/admin/benutzer", label: "Benutzer", adminOnly: true },
  { href: "/admin/sicherheit", label: "Sicherheit" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminNav({ isAdmin: isAdminProp }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(isAdminProp ?? false);

  // Fallback: Rolle clientseitig laden, wenn das Layout keine Prop übergibt
  useEffect(() => {
    if (isAdminProp !== undefined) {
      setIsAdmin(isAdminProp);
      return;
    }

    let cancelled = false;

    async function loadRole() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!cancelled) setIsAdmin(data?.role === "admin");
      } catch {
        // Nav bleibt ohne Benutzer-Tab
      }
    }

    loadRole();
    return () => {
      cancelled = true;
    };
  }, [isAdminProp]);

  const visibleItems = ITEMS.filter((item) => !item.adminOnly || isAdmin);

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
