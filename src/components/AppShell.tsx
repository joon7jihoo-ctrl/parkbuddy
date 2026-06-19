import { MobileBottomNav } from '@/components/MobileBottomNav';
import { PageQuickActions } from '@/components/PageQuickActions';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-app-shell min-h-dvh bg-slate-50 pb-32 md:pb-32">
      <div className="pb-app-content pb-page-motion mx-auto max-w-7xl px-3 py-3 md:px-5 md:py-6">{children}</div>
      <PageQuickActions />
      <MobileBottomNav />
    </div>
  );
}
