import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { CurrentMember } from '@/types/domain';

export async function getUserOrNull() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function requireUser() {
  const { supabase, user } = await getUserOrNull();
  if (!user) redirect('/login');
  return { supabase, user };
}

export async function getCurrentMember(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  member: CurrentMember | null;
}> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from('members')
    .select('id, club_id, name, role, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return { supabase, member: data as CurrentMember | null };
}

export async function requireCurrentMember() {
  const { supabase, member } = await getCurrentMember();
  if (!member) redirect('/mypage/link');
  return { supabase, member };
}

export async function requireAdmin() {
  const { supabase, member } = await requireCurrentMember();
  if (member.role !== 'admin') redirect('/');
  return { supabase, member };
}
