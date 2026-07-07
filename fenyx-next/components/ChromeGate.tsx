"use client";

// Blendet den öffentlichen Header/Footer auf /admin-Seiten aus.
// Öffentliche Seiten behalten Header + Footer wie gehabt.
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

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
  const isConceptJ = pathname === "/j";

  useEffect(() => {
    document.body.classList.toggle("page-j", isConceptJ);
    return () => {
      document.body.classList.remove("page-j");
    };
  }, [isConceptJ]);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {header}
      <main className="relative z-0">{children}</main>
      {footer}
    </>
  );
}
