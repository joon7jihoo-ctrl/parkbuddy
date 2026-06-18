import type { SupabaseClient } from '@supabase/supabase-js';

export type LinkedEventContext = {
  id: string;
  title: string;
  eventType: string | null;
  startsAt: string | null;
  courseName: string | null;
  attendCount: number;
  absentCount: number;
  totalVoteCount: number;
};

type EventRow = {
  id: string;
  title: string | null;
  event_type: string | null;
  starts_at: string | null;
  course_name: string | null;
};

type EventVoteRow = {
  event_id: string;
  status: string | null;
};

function uniqueNonEmpty(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function isMissingTableError(error: { code?: string } | null | undefined) {
  return error?.code === '42P01' || error?.code === '42703';
}

export async function getRoundLinkedEventContexts(
  supabase: SupabaseClient,
  clubId: string,
  eventIds: Array<string | null | undefined>,
) {
  const normalizedEventIds = uniqueNonEmpty(eventIds);

  if (!normalizedEventIds.length) {
    return new Map<string, LinkedEventContext>();
  }

  try {
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, event_type, starts_at, course_name')
      .eq('club_id', clubId)
      .in('id', normalizedEventIds);

    if (eventsError) {
      if (isMissingTableError(eventsError)) {
        return new Map<string, LinkedEventContext>();
      }

      console.error('[ParkBuddy] linked event context query failed:', eventsError.message);
      return new Map<string, LinkedEventContext>();
    }

    const eventRows = (events ?? []) as EventRow[];

    if (!eventRows.length) {
      return new Map<string, LinkedEventContext>();
    }

    const foundEventIds = eventRows.map((event) => event.id);
    const { data: votes, error: votesError } = await supabase
      .from('event_votes')
      .select('event_id, status')
      .in('event_id', foundEventIds);

    if (votesError) {
      if (isMissingTableError(votesError)) {
        return buildContextMap(eventRows, []);
      }

      console.error('[ParkBuddy] linked event vote query failed:', votesError.message);
      return buildContextMap(eventRows, []);
    }

    return buildContextMap(eventRows, (votes ?? []) as EventVoteRow[]);
  } catch (error) {
    console.error('[ParkBuddy] linked event context failed:', error);
    return new Map<string, LinkedEventContext>();
  }
}

function buildContextMap(eventRows: EventRow[], votes: EventVoteRow[]) {
  const voteSummaryByEventId = votes.reduce<
    Record<string, { attendCount: number; absentCount: number; totalVoteCount: number }>
  >((summary, vote) => {
    const current = summary[vote.event_id] ?? { attendCount: 0, absentCount: 0, totalVoteCount: 0 };
    current.totalVoteCount += 1;

    if (vote.status === 'attend' || vote.status === 'accepted' || vote.status === 'yes') {
      current.attendCount += 1;
    }

    if (vote.status === 'absent' || vote.status === 'decline' || vote.status === 'declined' || vote.status === 'no') {
      current.absentCount += 1;
    }

    summary[vote.event_id] = current;
    return summary;
  }, {});

  return new Map(
    eventRows.map((event) => {
      const summary = voteSummaryByEventId[event.id] ?? {
        attendCount: 0,
        absentCount: 0,
        totalVoteCount: 0,
      };

      return [
        event.id,
        {
          id: event.id,
          title: event.title?.trim() || '제목 없는 일정',
          eventType: event.event_type,
          startsAt: event.starts_at,
          courseName: event.course_name,
          ...summary,
        },
      ];
    }),
  );
}
