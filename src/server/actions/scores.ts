'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { formDataToObject, roundFormSchema, scoreSchema } from '@/lib/security/validation';
import { requireAdmin, requireCurrentMember } from '@/server/auth';

export async function createRound(formData: FormData) {
  const { supabase, member } = await requireAdmin();
  const raw = formDataToObject(formData);
  const normalized = {
    ...raw,
    event_id: raw.event_id === '' ? undefined : raw.event_id,
  };
  const parsed = roundFormSchema.safeParse(normalized);

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const { data: round, error } = await supabase
    .from('rounds')
    .insert({
      club_id: member.club_id,
      event_id: parsed.data.event_id,
      title: parsed.data.title,
      played_on: parsed.data.played_on,
      course_name: parsed.data.course_name,
      holes: parsed.data.holes,
      memo: parsed.data.memo,
      created_by: member.id,
    })
    .select('id')
    .single();

  if (error || !round) throw new Error(error?.message ?? '라운딩 등록 실패');
  revalidatePath('/scores');
  redirect(`/scores/${round.id}`);
}

export async function saveScore(formData: FormData) {
  const { supabase, member: me } = await requireCurrentMember();

  const rawScores = z.string().parse(formData.get('scores'));
  const parsedJson = JSON.parse(rawScores) as unknown;
  const parsed = scoreSchema.safeParse({
    roundId: formData.get('roundId'),
    memberId: formData.get('memberId'),
    scores: parsedJson,
  });

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '스코어 데이터가 올바르지 않습니다.');

  if (me.role !== 'admin' && parsed.data.memberId !== me.id) {
    throw new Error('본인 스코어만 저장할 수 있습니다.');
  }

  const { data: targetMember, error: targetMemberError } = await supabase
    .from('members')
    .select('id, club_id')
    .eq('id', parsed.data.memberId)
    .eq('club_id', me.club_id)
    .eq('status', 'active')
    .maybeSingle();

  if (targetMemberError || !targetMember) throw new Error('대상 회원을 찾을 수 없습니다.');

  const { data: round, error: roundError } = await supabase
    .from('rounds')
    .select('id, club_id, holes')
    .eq('id', parsed.data.roundId)
    .eq('club_id', me.club_id)
    .maybeSingle();

  if (roundError || !round) throw new Error('라운딩을 찾을 수 없습니다.');
  if (parsed.data.scores.length !== round.holes) throw new Error('홀 수와 스코어 개수가 일치하지 않습니다.');

  const { data: roundPlayer, error: playerError } = await supabase
    .from('round_players')
    .upsert({ round_id: parsed.data.roundId, member_id: parsed.data.memberId }, { onConflict: 'round_id,member_id' })
    .select('id')
    .single();

  if (playerError || !roundPlayer) throw new Error(playerError?.message ?? '라운딩 참가자 저장 실패');

  const payload = parsed.data.scores.map((score) => ({
    round_player_id: roundPlayer.id,
    hole_no: score.hole_no,
    par: score.par,
    strokes: score.strokes,
  }));

  const { error: scoreError } = await supabase.from('hole_scores').upsert(payload, { onConflict: 'round_player_id,hole_no' });
  if (scoreError) throw new Error(scoreError.message);

  revalidatePath('/scores');
  revalidatePath(`/scores/${parsed.data.roundId}`);
}
