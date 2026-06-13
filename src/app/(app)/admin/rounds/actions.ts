'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-member';

function getRoundRpcErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ADMIN_REQUIRED')) {
    return 'admin_required';
  }

  if (message.includes('INVALID_TITLE')) {
    return 'invalid_title';
  }

  if (message.includes('INVALID_COURSE_NAME')) {
    return 'invalid_course_name';
  }

  if (message.includes('INVALID_PLAY_DATE')) {
    return 'invalid_play_date';
  }

  if (message.includes('INVALID_ROUND_STATUS')) {
    return 'invalid_round_status';
  }

  if (message.includes('ROUND_NOT_FOUND')) {
    return 'round_not_found';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

export async function createRoundAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = String(formData.get('title') ?? '').trim();
  const courseName = String(formData.get('courseName') ?? '').trim();
  const playDate = String(formData.get('playDate') ?? '').trim();
  const startTimeValue = String(formData.get('startTime') ?? '').trim();
  const memo = String(formData.get('memo') ?? '').trim();

  if (title.length < 2) {
    redirect('/admin/rounds/new?error=invalid_title');
  }

  if (courseName.length < 2) {
    redirect('/admin/rounds/new?error=invalid_course_name');
  }

  if (!playDate) {
    redirect('/admin/rounds/new?error=invalid_play_date');
  }

  const { error } = await supabase.rpc('admin_create_round', {
    p_title: title,
    p_course_name: courseName,
    p_play_date: playDate,
    p_start_time: startTimeValue || null,
    p_memo: memo || null,
  });

  if (error) {
    console.error('admin_create_round failed', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/rounds/new?error=${getRoundRpcErrorCode(error.message)}`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath('/admin/logs');

  redirect('/admin/rounds?created=1');
}

export async function updateRoundStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const roundId = String(formData.get('roundId') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();

  if (!roundId) {
    redirect('/admin/rounds?error=round_not_found');
  }

  if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
    redirect('/admin/rounds?error=invalid_round_status');
  }

  const { error } = await supabase.rpc('admin_update_round_status', {
    p_round_id: roundId,
    p_status: status,
  });

  if (error) {
    console.error('admin_update_round_status failed', {
      roundId,
      status,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/rounds?error=${getRoundRpcErrorCode(error.message)}`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath('/admin/logs');

  redirect('/admin/rounds?statusUpdated=1');
}

export async function duplicateRoundAction(formData: FormData) {
  const roundId = String(formData.get('roundId') ?? '');

  if (!roundId) {
    throw new Error('라운드 ID가 없습니다.');
  }

  const { supabase } = await requireAdmin();

  const { data: newRoundId, error } = await supabase.rpc('admin_duplicate_round', {
    p_round_id: roundId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/rounds');
  redirect('/admin/rounds/' + newRoundId + '/participants');
}
