"use client";

import { usePathname } from "next/navigation";
import {
  ADMIN_FEATURE,
  NAV_HREF_TO_PERMISSION,
} from "@/lib/admin/adminPermissionKeys";
import { useAdminPermissions } from "@/contexts/AdminPermissionsContext";

function permissionForPath(pathname: string): string {
  if (pathname === "/admin") {
    return NAV_HREF_TO_PERMISSION["/admin"] ?? ADMIN_FEATURE.overview;
  }

  const prefixes = Object.keys(NAV_HREF_TO_PERMISSION)
    .filter((href) => href !== "/admin")
    .sort((a, b) => b.length - a.length);

  for (const href of prefixes) {
    if (pathname.startsWith(href)) {
      return NAV_HREF_TO_PERMISSION[href] ?? ADMIN_FEATURE.overview;
    }
  }

  return ADMIN_FEATURE.overview;
}

export default function AdminPageGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { can, loading } = useAdminPermissions();
  const required = permissionForPath(pathname);

  if (loading) {
    return (
      <p className="text-mist text-sm">Berechtigungen werden geladen …</p>
    );
  }

  if (!can(required)) {
    return (
      <div>
        <h1 className="text-2xl font-heading mb-2">Kein Zugriff</h1>
        <p className="text-mist text-sm">
          Für diesen Bereich fehlt die erforderliche Berechtigung.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
