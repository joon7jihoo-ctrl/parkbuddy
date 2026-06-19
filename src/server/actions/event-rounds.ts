'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/server/auth';

function getEventRoundErrorCode(message?: string) {
  if (!message) return 'unknown';
  if (message.includes('AUTH_REQUIRED')) return 'auth_required';
  if (message.includes('ADMIN_REQUIRED')) return 'admin_required';
  if (message.includes('EVENT_NOT_FOUND')) return 'event_not_found';
  if (message.includes('NO_ATTENDEES')) return 'no_attendees';
  if (message.includes('INVALID_EVENT')) return 'event_not_found';
  if (message.includes('Could not find the function')) return 'rpc_missing';
  if (message.includes('permission denied')) return 'permission_denied';
  return 'unknown';
}

export async function createRoundFromEventAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const eventId = String(formData.get('eventId') ?? '').trim();

  if (!eventId) {
    redirect('/schedule?eventRoundError=event_not_found');
  }

  const { data: roundId, error } = await supabase.rpc('admin_create_round_from_event', {
    p_event_id: eventId,
  });

  if (error || !roundId) {
    console.error('admin_create_round_from_event failed', {
      eventId,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
    });

    redirect(`/schedule?eventRoundError=${getEventRoundErrorCode(error?.message)}`);
  }

  revalidatePath('/schedule');
  revalidatePath('/admin');
  revalidatePath('/admin/rounds');
  revalidatePath(`/admin/rounds/${roundId}/participants`);

  redirect(`/admin/rounds/${roundId}/participants?createdFromEvent=1`);
}
