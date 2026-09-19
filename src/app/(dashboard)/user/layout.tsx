import { UserGuard } from "@/features/auth/components/user-guard";
import { DashboardShell } from "@/components/layouts/dashboard/dashboard-shell";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserGuard>
      <DashboardShell role="user">{children}</DashboardShell>
    </UserGuard>
  );
}
