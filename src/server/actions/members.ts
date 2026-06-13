'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { formDataToObject, memberFormSchema } from '@/lib/security/validation';
import { normalizePhone } from '@/lib/utils';
import { requireAdmin } from '@/server/auth';

export async function createMember(formData: FormData) {
  const { supabase, member: me } = await requireAdmin();
  const parsed = memberFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const payload = parsed.data;
  const { error } = await supabase.from('members').insert({
    club_id: me.club_id,
    name: payload.name,
    phone: payload.phone ? normalizePhone(payload.phone) : null,
    handicap: payload.handicap,
    joined_on: payload.joined_on || new Date().toISOString().slice(0, 10),
    role: payload.role,
    status: 'active',
  });

  if (error) throw new Error(error.message);
  revalidatePath('/members');
  redirect('/members');
}

export async function updateMember(formData: FormData) {
  const { supabase, member: me } = await requireAdmin();
  const id = z.string().uuid().parse(formData.get('id'));
  const parsed = memberFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const payload = parsed.data;
  const { error } = await supabase
    .from('members')
    .update({
      name: payload.name,
      phone: payload.phone ? normalizePhone(payload.phone) : null,
      handicap: payload.handicap,
      joined_on: payload.joined_on || undefined,
      role: payload.role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('club_id', me.club_id);

  if (error) throw new Error(error.message);
  revalidatePath('/members');
  redirect('/members');
}

export async function deleteMember(formData: FormData) {
  const { supabase, member: me } = await requireAdmin();
  const id = z.string().uuid().parse(formData.get('id'));

  if (id === me.id) throw new Error('본인 계정은 비활성화할 수 없습니다.');

  const { error } = await supabase
    .from('members')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('club_id', me.club_id);

  if (error) throw new Error(error.message);
  revalidatePath('/members');
}
