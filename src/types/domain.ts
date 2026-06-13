export type MemberRole = 'admin' | 'member';
export type MemberStatus = 'active' | 'inactive';
export type EventType = 'regular' | 'tournament' | 'casual';
export type VoteStatus = 'attend' | 'absent' | 'maybe';
export type PostType = 'notice' | 'free';

export type CurrentMember = {
  id: string;
  club_id: string;
  name: string;
  role: MemberRole;
  status: MemberStatus;
};

export type ActionResult = {
  ok: boolean;
  message?: string;
};

export type HoleScoreInput = {
  hole_no: number;
  par: number;
  strokes: number;
};
