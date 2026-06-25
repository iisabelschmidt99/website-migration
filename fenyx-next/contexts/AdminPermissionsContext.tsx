"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { legacyPermissionsForProfileRole } from "@/lib/admin/accessControlModel";

type AdminPermissionsContextValue = {
  permissions: string[] | null;
  loading: boolean;
  rbacActive: boolean;
  refresh: () => Promise<void>;
  can: (permissionKey: string) => boolean;
};

const AdminPermissionsContext =
  createContext<AdminPermissionsContextValue | null>(null);

export function AdminPermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [permissions, setPermissions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [rbacActive, setRbacActive] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_my_admin_permissions");

      if (!error && Array.isArray(data)) {
        setPermissions(data);
        setRbacActive(true);
        return;
      }

      // Fallback: profiles.role (vor SQL-Migration)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setPermissions([]);
        setRbacActive(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role as
        | "super_admin"
        | "admin"
        | "editor"
        | "viewer"
        | undefined;
      if (role) {
        setPermissions(legacyPermissionsForProfileRole(role));
      } else {
        setPermissions([]);
      }
      setRbacActive(false);
    } catch {
      setPermissions([]);
      setRbacActive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const can = useCallback(
    (permissionKey: string) => permissions?.includes(permissionKey) ?? false,
    [permissions],
  );

  const value = useMemo(
    () => ({ permissions, loading, rbacActive, refresh, can }),
    [permissions, loading, rbacActive, refresh, can],
  );

  return (
    <AdminPermissionsContext.Provider value={value}>
      {children}
    </AdminPermissionsContext.Provider>
  );
}

export function useAdminPermissions() {
  const ctx = useContext(AdminPermissionsContext);
  if (!ctx) {
    throw new Error(
      "useAdminPermissions muss innerhalb AdminPermissionsProvider stehen.",
    );
  }
  return ctx;
}
