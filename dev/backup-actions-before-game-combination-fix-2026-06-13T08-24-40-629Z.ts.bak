'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-member';

function getPairingRpcErrorCode(message?: string) {
  if (!message) {
    return 'unknown';
  }

  if (message.includes('AUTH_REQUIRED')) {
    return 'auth_required';
  }

  if (message.includes('ADMIN_REQUIRED')) {
    return 'admin_required';
  }

  if (message.includes('ROUND_NOT_FOUND')) {
    return 'round_not_found';
  }

  if (message.includes('INVALID_GAME_COMBINATION')) {
    return 'invalid_game_combination';
  }

  if (message.includes('INVALID_ASSIGNMENTS')) {
    return 'invalid_assignments';
  }

  if (message.includes('NOT_ENOUGH_PARTICIPANTS')) {
    return 'not_enough_participants';
  }

  if (message.includes('INVALID_GROUP_SIZE')) {
    return 'invalid_group_size';
  }

  if (message.includes('INVALID_PARTICIPANT')) {
    return 'invalid_participant';
  }

  if (message.includes('DUPLICATE_PARTICIPANT')) {
    return 'duplicate_participant';
  }

  if (message.includes('Could not find the function')) {
    return 'rpc_missing';
  }

  if (message.includes('permission denied')) {
    return 'permission_denied';
  }

  return 'unknown';
}

export async function saveRoundPairingsAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const roundId = String(formData.get('roundId') ?? '').trim();
  const gameType = String(formData.get('gameType') ?? '').trim();
  const scoringType = String(formData.get('scoringType') ?? '').trim();
  const memberIds = formData.getAll('memberId').map((value) => String(value));

  if (!roundId) {
    redirect('/admin/rounds?error=round_not_found');
  }

  const assignments = memberIds.map((memberId, index) => ({
    member_id: memberId,
    group_no: Number(formData.get(`groupNo:${memberId}`) ?? 0),
    position: index + 1,
  }));

  const { error } = await supabase.rpc('admin_save_round_pairings', {
    p_round_id: roundId,
    p_game_type: gameType,
    p_scoring_type: scoringType,
    p_assignments: assignments,
  });

  if (error) {
    console.error('admin_save_round_pairings failed', {
      roundId,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    redirect(
      `/admin/rounds/${roundId}/pairings?error=${getPairingRpcErrorCode(
        error.message,
      )}`,
    );
  }

  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/pairings`);
  revalidatePath('/admin/logs');

  redirect(`/admin/rounds/${roundId}/pairings?saved=1`);
}
