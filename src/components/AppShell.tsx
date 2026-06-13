import { MobileBottomNav } from '@/components/MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-50 pb-24 md:pb-28">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">{children}</div>
      <MobileBottomNav />
    </div>
  );
}
