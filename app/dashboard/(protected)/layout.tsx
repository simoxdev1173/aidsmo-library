import DashboardShell from '@/app/dashboard/_components/DashboardShell';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return <DashboardShell admin={admin}>{children}</DashboardShell>;
}
