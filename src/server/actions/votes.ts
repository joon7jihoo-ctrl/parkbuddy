'use server';

import { revalidatePath } from 'next/cache';
import { voteSchema } from '@/lib/security/validation';
import { requireCurrentMember } from '@/server/auth';

export async function voteEvent(input: { eventId: string; status: 'attend' | 'absent' | 'maybe' }) {
  const { supabase, member } = await requireCurrentMember();
  const parsed = voteSchema.parse(input);

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, club_id')
    .eq('id', parsed.eventId)
    .eq('club_id', member.club_id)
    .maybeSingle();

  if (eventError || !event) throw new Error('일정을 찾을 수 없습니다.');

  const { error } = await supabase.from('event_votes').upsert(
    {
      event_id: parsed.eventId,
      member_id: member.id,
      status: parsed.status,
      voted_at: new Date().toISOString(),
    },
    { onConflict: 'event_id,member_id' }
  );

  if (error) throw new Error(error.message);
  revalidatePath('/schedule');
}
