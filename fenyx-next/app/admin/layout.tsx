// Admin-Bereich nie statisch vorrendern – braucht Supabase-Env zur Laufzeit.
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
