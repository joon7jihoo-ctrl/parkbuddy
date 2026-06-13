'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-member';

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function getOptionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function updateRoundAction(formData: FormData) {
  const { supabase, member } = await requireAdmin();

  const roundId = getRequiredText(formData, 'roundId');
  const title = getRequiredText(formData, 'title');
  const courseName = getOptionalText(formData, 'courseName');
  const playDate = getRequiredText(formData, 'playDate');
  const memo = getOptionalText(formData, 'memo');

  const { error } = await supabase
    .from('rounds')
    .update({
      title,
      course_name: courseName,
      play_date: playDate,
      memo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', roundId)
    .eq('club_id', member.club_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/edit`);
  redirect('/admin/rounds');
}
