"use client";

import AdminStaffMfaGate from "@/components/admin/AdminStaffMfaGate";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import { AdminPermissionsProvider } from "@/contexts/AdminPermissionsContext";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function AdminPanelProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminStaffMfaGate>
      <AdminPermissionsProvider>
        <AdminPanelChrome>{children}</AdminPanelChrome>
      </AdminPermissionsProvider>
    </AdminStaffMfaGate>
  );
}

function AdminPanelChrome({ children }: { children: React.ReactNode }) {
  const [identity, setIdentity] = useState<{
    email?: string | null;
    full_name?: string | null;
    roleLabel?: string;
  }>({});

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, email")
          .eq("id", user.id)
          .single();

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        const roleList =
          roles && roles.length > 0
            ? roles.map((r) => r.role).join(", ")
            : profile?.role;

        setIdentity({
          email: profile?.email ?? user.email,
          full_name: profile?.full_name,
          roleLabel: roleList ?? undefined,
        });
      } catch {
        /* Sidebar bleibt ohne Meta */
      }
    }
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-abyss-deep text-white flex">
      <aside className="w-60 shrink-0 border-r border-white/10 p-5 flex flex-col">
        <p className="text-signal text-xs font-bold uppercase tracking-[0.15em] mb-6">
          Fenyx Backend
        </p>
        <AdminNav />
        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-mist text-xs mb-2 truncate">
            {identity.full_name || identity.email}
            {identity.roleLabel ? (
              <span className="block text-white/40">
                Rollen: {identity.roleLabel}
              </span>
            ) : null}
          </p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 max-w-5xl">{children}</main>
    </div>
  );
}
