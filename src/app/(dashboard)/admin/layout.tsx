import { AdminGuard } from "@/features/auth/components/admin-guard";
import { DashboardShell } from "@/components/layouts/dashboard/dashboard-shell";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <DashboardShell role="admin">{children}</DashboardShell>
    </AdminGuard>
  );
}
