import { SessionIdleProvider } from "@/components/providers/session-idle-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionIdleProvider>{children}</SessionIdleProvider>;
}
