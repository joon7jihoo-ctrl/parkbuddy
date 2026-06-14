import { MobileBottomNav } from '@/components/MobileBottomNav';
import { createClient } from '@/lib/supabase/server';

async function getIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: member } = await supabase
    .from('members')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  return member?.role === 'admin';
}

export async function AppShell({ children }: { children: React.ReactNode }) {
  const isAdmin = await getIsAdmin();

  return (
    <div className="min-h-dvh bg-slate-50 pb-24 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">{children}</div>
      <MobileBottomNav isAdmin={isAdmin} />
    </div>
  );
}
