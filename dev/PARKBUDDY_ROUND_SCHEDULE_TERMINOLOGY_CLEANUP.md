# ParkBuddy Round / Schedule Terminology Cleanup

## Purpose

This patch is the first implementation step after `PARKBUDDY_ROUND_SCHEDULE_SCORECARD_FLOW_PLAN.md`.

The goal is to reduce operator and member confusion by clarifying the visible difference between:

- `events` / `event_votes`: 라운딩 공지 and 참석 확인
- `rounds` / `round_participants`: 확정 라운드 and 운영 관리

This patch intentionally changes visible wording only. It does not change database schema, route structure, Supabase policies, score logic, search logic, or round creation logic.

## User-facing Decision

The schedule flow should be presented as:

```text
라운딩 공지 → 참석/불참 확인 → 참석자 기준 확정 라운드 생성
```

The round management flow should be presented as:

```text
확정 라운드 관리 → 참가자 → 조 편성 → 스코어 → 결과
```

## Attendance Choices

Member attendance choices are limited to two user-facing options:

- 참석
- 불참

`미응답` is not a selectable user option. It is only a derived operational state for members who have not answered yet.

## Files Updated

- `src/app/(app)/schedule/page.tsx`
- `src/app/(app)/schedule/VoteButtons.tsx`
- `src/app/(app)/admin/events/new/page.tsx`
- `src/app/(app)/admin/rounds/page.tsx`
- `src/app/(app)/page.tsx`
- `src/app/(app)/mypage/page.tsx`
- `src/components/PageQuickActions.tsx`
- `src/components/admin/linked-event-context-card.tsx`

## Safety Notes

- No DB migration is included.
- No route changes are included.
- No Supabase query shape is intentionally changed.
- Search/filter behavior is not changed.
- Existing mobile Dense UX and sticky CTA patterns are preserved.

## Next Recommended Step

After this wording cleanup passes `npm run verify`, the next safe implementation step is:

```text
KakaoTalk share text copy for 라운딩 공지 / 참석 확인 link
```

That next step should still avoid Kakao API integration initially and should start with simple copy-to-clipboard text generation.
