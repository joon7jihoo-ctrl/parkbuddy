import { notFound } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { requireCurrentMember } from '@/server/auth';
import { ScoreInput } from './ScoreInput';

export default async function RoundScorePage({ params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params;
  const { supabase, member } = await requireCurrentMember();

  const { data: round } = await supabase
    .from('rounds')
    .select('id, title, course_name, holes, club_id, deleted_at')
    .eq('id', roundId)
    .eq('club_id', member.club_id)
    .is('deleted_at', null)
    .maybeSingle();

  if (!round) notFound();

  const { data: members } = await supabase
    .from('members')
    .select('id, name')
    .eq('club_id', member.club_id)
    .eq('status', 'active')
    .order('name', { ascending: true });

  return (
    <main className="space-y-5">
      <TopBar title={round.title} description={`${round.course_name} · ${round.holes}홀`} />
      <ScoreInput roundId={round.id} members={members ?? []} holes={round.holes} canSelectMember={member.role === 'admin'} defaultMemberId={member.id} />
    </main>
  );
}
