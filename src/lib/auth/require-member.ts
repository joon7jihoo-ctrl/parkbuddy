import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type CurrentMember = {
  id: string;
  club_id: string;
  name: string;
  role: 'admin' | 'member';
};

export async function requireMember(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  member: CurrentMember;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: member, error } = await supabase
    .from('members')
    .select('id, club_id, name, role')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('failed to load current member', error);
    redirect('/member-link?error=unknown');
  }

  if (!member) {
    redirect('/member-link');
  }

  return {
    supabase,
    member: member as CurrentMember,
  };
}

export async function requireAdmin(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  member: CurrentMember;
}> {
  const result = await requireMember();

  if (result.member.role !== 'admin') {
    redirect('/?error=admin_required');
  }

  return result;
}