'use server';

import { revalidatePath } from 'next/cache';
import { formDataToObject, profileFormSchema } from '@/lib/security/validation';
import { normalizePhone } from '@/lib/utils';
import { requireCurrentMember } from '@/server/auth';

export async function updateMyProfile(formData: FormData) {
  const { supabase, member } = await requireCurrentMember();
  const parsed = profileFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const { error } = await supabase
    .from('members')
    .update({
      name: parsed.data.name,
      phone: parsed.data.phone ? normalizePhone(parsed.data.phone) : null,
      handicap: parsed.data.handicap,
      updated_at: new Date().toISOString(),
    })
    .eq('id', member.id)
    .eq('club_id', member.club_id);

  if (error) throw new Error(error.message);
  revalidatePath('/mypage');
}
