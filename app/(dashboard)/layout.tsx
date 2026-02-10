import { DashboardShell } from "@/components/layout/dashboard-shell";

/**
 * Dashboard layout - wraps all authenticated pages in the dashboard shell
 * with sidebar navigation and header.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
