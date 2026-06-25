// Backend-Startseite (/admin) – Übersicht über die Bereiche.
import AdminDashboardSections from "@/components/admin/AdminDashboardSections";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-2">Willkommen im Fenyx-Backend</h1>
      <p className="text-mist text-sm mb-8">
        Wähle einen Bereich. Die Inhalte werden nach und nach an Supabase angebunden.
      </p>
      <AdminDashboardSections />
    </div>
  );
}
