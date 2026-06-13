'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-member';

function getScoreRpcErrorCode(message?: string) {
  if (!message) return 'unknown';
  if (message.includes('AUTH_REQUIRED')) return 'auth_required';
  if (message.includes('ADMIN_REQUIRED')) return 'admin_required';
  if (message.includes('ROUND_NOT_FOUND')) return 'round_not_found';
  if (message.includes('INVALID_SCORES')) return 'invalid_scores';
  if (message.includes('INVALID_MEMBER')) return 'invalid_member';
  if (message.includes('INVALID_STROKES')) return 'invalid_strokes';
  if (message.includes('INVALID_STABLEFORD_POINTS')) return 'invalid_points';
  if (message.includes('MEMBER_NOT_IN_ROUND')) return 'member_not_in_round';
  if (message.includes('Could not find the function')) return 'rpc_missing';
  if (message.includes('permission denied')) return 'permission_denied';
  return 'unknown';
}

export async function saveRoundScoresAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const roundId = String(formData.get('roundId') ?? '').trim();

  if (!roundId) {
    redirect('/admin/rounds?error=round_not_found');
  }

  const memberIds = formData.getAll('memberId').map((value) => String(value));
  const scores = memberIds.map((memberId) => ({
    memberId,
    strokes: String(formData.get(`strokes:${memberId}`) ?? '').trim(),
    stablefordPoints: String(formData.get(`stablefordPoints:${memberId}`) ?? '').trim(),
    memo: String(formData.get(`memo:${memberId}`) ?? '').trim(),
  }));

  const { error } = await supabase.rpc('admin_upsert_round_scores', {
    p_round_id: roundId,
    p_scores: scores,
  });

  if (error) {
    console.error('admin_upsert_round_scores failed', {
      roundId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(`/admin/rounds/${roundId}/scores?error=${getScoreRpcErrorCode(error.message)}`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/scores`);
  revalidatePath('/admin/logs');

  redirect(`/admin/rounds/${roundId}/scores?saved=1`);
}
