'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eventFormSchema, formDataToObject } from '@/lib/security/validation';
import { requireAdmin } from '@/server/auth';

export async function createEvent(formData: FormData) {
  const { supabase, member } = await requireAdmin();
  const raw = formDataToObject(formData);
  const normalized = {
    ...raw,
    max_participants: raw.max_participants === '' ? undefined : raw.max_participants,
  };
  const parsed = eventFormSchema.safeParse(normalized);

  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.');

  const { error } = await supabase.from('events').insert({
    club_id: member.club_id,
    title: parsed.data.title,
    event_type: parsed.data.event_type,
    starts_at: new Date(parsed.data.starts_at).toISOString(),
    course_name: parsed.data.course_name,
    holes: parsed.data.holes,
    max_participants: parsed.data.max_participants,
    memo: parsed.data.memo,
    created_by: member.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/schedule');
  redirect('/schedule');
}
