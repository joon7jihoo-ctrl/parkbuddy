import { AppShell } from '@/components/AppShell';
import { requireUser } from '@/server/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <AppShell>{children}</AppShell>;
}
