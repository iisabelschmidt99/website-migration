"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ohne Supabase-Konfiguration trotzdem zur Login-Seite.
    }
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-mist text-sm hover:text-signal transition-colors"
    >
      Abmelden
    </button>
  );
}
