import AdminPanelProviders from "@/components/admin/AdminPanelProviders";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelProviders>{children}</AdminPanelProviders>;
}
