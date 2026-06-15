import { MobileBottomNav } from '@/components/MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-50 pb-28 md:pb-28">
      <div className="pb-page-motion mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">{children}</div>
      <MobileBottomNav />
    </div>
  );
}
