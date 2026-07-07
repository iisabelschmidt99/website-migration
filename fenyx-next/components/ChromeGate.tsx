"use client";

// Blendet den öffentlichen Header/Footer auf /admin-Seiten aus.
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function ChromeGate({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {header}
      <main className="relative z-0">{children}</main>
      {footer}
    </>
  );
}
