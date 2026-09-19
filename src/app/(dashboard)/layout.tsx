import { DashboardShell } from "@/components/layouts/dashboard/dashboard-shell";
import { SessionIdleProvider } from "@/components/providers/session-idle-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionIdleProvider>
      <DashboardShell>{children}</DashboardShell>;
    </SessionIdleProvider>
  );
}
