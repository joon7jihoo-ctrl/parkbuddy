# ParkBuddy Round / Schedule / Scorecard Flow Plan

## Purpose

This document defines the next major ParkBuddy product direction after the v0.10.0 production release.

The goal is to clarify the difference between schedule and round management, then design a complete operating flow:

1. Create a rounding notice.
2. Share the notice to a KakaoTalk group chat.
3. Let members confirm attendance.
4. Create a confirmed round from attendees.
5. Create groups based on confirmed participants.
6. Send scorecard input links to scorecard keepers.
7. Enter scores by group and course.
8. Review the final scoreboard.

This document is intentionally a planning document only. It does not change app code.

---

## Current Confusion

The current product has both schedule and round management flows.

From an operator perspective, both may look like "rounding" work, so the difference can feel unclear.

The intended difference should be:

- Schedule = pre-rounding announcement and attendance collection.
- Round = confirmed operation unit for participants, groups, score input, and results.

In user-facing language, the word "schedule" may be too generic. It should be reframed as "라운딩 공지" or "참석 모집".

---

## Recommended Product Terms

### Current Internal Data Flow

| Concept | Current Data | Recommended User-facing Name |
|---|---|---|
| Schedule | `events` | 라운딩 공지 / 참석 모집 |
| Attendance vote | `event_votes` | 참석 확인 |
| Round | `rounds` | 확정 라운드 |
| Round participants | `round_participants` | 확정 참가자 |
| Groups | `round_groups`, `round_group_members` | 조편성 |
| Final scores | `round_scores` | 최종 스코어 |
| Hole-level scores | TBD / existing `hole_scores` review needed | 홀별 스코어 |

### Recommended Screen Terms

| Existing Wording | Recommended Wording |
|---|---|
| 일정 | 라운딩 공지 |
| 참석 투표 | 참석 확인 |
| 라운드 관리 | 확정 라운드 관리 |
| 참석자 기준 라운드 생성 | 참석자 기준 확정 라운드 생성 |
| 스코어 입력 | 조별 스코어카드 입력 |
| 결과 | 최종 스코어보드 |

---

## Why the Schedule Logic Exists

The schedule logic exists to answer this question before creating a confirmed round:

> Who will attend this rounding?

A round should not be finalized until attendance is known.

The current data direction is valid:

```text
events
event_votes
↓
admin_create_round_from_event
↓
rounds
round_participants
```

This should be preserved.

The product issue is not necessarily the database structure. The issue is that the user-facing naming and flow should make the purpose clearer.

---

## Attendance Confirmation Rule

Member attendance confirmation should use only two explicit choices:

- 참석
- 불참

`미응답` should not be shown as a member-selectable option.

However, the operator dashboard may still internally calculate members who have not responded yet by comparing all eligible members or invited members against `event_votes`.

Recommended operator summary:

```text
참석 12명 · 불참 3명 · 미응답 5명
```

Recommended member UI:

```text
[참석] [불참]
```

---

## Recommended Final Operating Flow

### 1. Create Rounding Notice

The operator creates a rounding notice.

Required fields:

- Rounding title
- Rounding date
- Park golf course name
- Course set: A / B / C / D
- Attendance deadline
- Memo
- Optional meeting time
- Optional fee / preparation note

Internal data:

```text
events
```

Recommended URL:

```text
/admin/events/new
```

Recommended user-facing title:

```text
라운딩 공지 만들기
```

---

### 2. Share to KakaoTalk Group Chat

After creating the rounding notice, the operator shares it to a KakaoTalk group chat.

Initial implementation should not require Kakao API integration.

Recommended first version:

- Copy share message button
- Copy attendance link button

Example share message:

```text
[ParkBuddy 라운딩 공지]

일자: 2026.06.20
장소: ○○ 파크골프장

참석 여부를 아래 링크에서 선택해주세요.
https://parkbuddy-five.vercel.app/schedule
```

Later enhancement:

- Kakao Share API integration
- Deep link to the specific event detail page

---

### 3. Members Confirm Attendance

Members select only one of:

- 참석
- 불참

Internal data:

```text
event_votes
```

Recommended UX:

- Mobile-first dense card layout
- Two clear attendance buttons only
- Clear current response status
- Attendance count summary for operator view
- Deadline display

---

### 4. Create Confirmed Round from Attendees

The operator reviews attendance and creates a confirmed round.

Recommended action label:

```text
참석자 기준 확정 라운드 생성
```

Internal data transition:

```text
events → rounds
event_votes where status = attending → round_participants
```

Important requirements:

- Prevent duplicate round creation from the same event.
- Preserve linked event context in the round detail.
- Show attendance counts before creating the round.
- Allow operator review before final creation.

---

### 5. Create Groups

The operator creates groups based on confirmed participants.

Internal data:

```text
round_groups
round_group_members
round_participants
```

Requirements:

- Group members must come from `round_participants`.
- Avoid using stale or duplicate participant sources.
- Support manual adjustment after auto-pairing.
- Preserve the current safety rule that `round_participants` is the official participant source.

---

### 6. Send Scorecard Input Link

After groups are created, the operator sends scorecard input links to score keepers.

Recommended first version:

- Copy group scorecard link button
- Copy KakaoTalk message text button

Example message:

```text
[ParkBuddy 1조 스코어 입력]

1조 스코어 입력 담당자는 아래 링크에서 스코어를 입력해주세요.

https://parkbuddy-five.vercel.app/scores/{roundId}/scorecard?group={groupId}
```

Security recommendation:

- First version: login-based score input.
- Later version: expiring signed token link for a designated score keeper.
- Never allow anonymous unrestricted score editing.

---

## Scorecard UI Requirement

The scorecard input screen should follow the attached physical scorecard style.

Recommended URL:

```text
/scores/[roundId]/scorecard
```

Recommended operator review URL:

```text
/admin/rounds/[roundId]/scorecards
```

---

## Scorecard Header

The scorecard screen should show:

- Rounding date
- Park golf course name
- The logged-in member's assigned group from round pairing/group assignment
- Save status
- Last saved time
- Optional score keeper name

The logged-in member's group should be resolved from:

```text
logged-in user → member → round_group_members → round_groups
```

Recommended top layout:

```text
2026.  .  .    (파크골프장)
내 조: 1조
```

Operator view may additionally allow a group selector:

```text
조회 조: [1조 ▼]
```

Member/scorekeeper view should default to the logged-in member's assigned group.

---

## Scorecard Tabs

The screen should use tabs in this order:

```text
집계표 | A코스 | B코스 | C코스 | D코스
```

Mobile UX principles:

- Keep tabs sticky if useful.
- Keep save CTA sticky at the bottom for input screens.
- Maintain at least practical 44px touch targets.
- Avoid excessive vertical spacing.
- Support fast input with numeric keypad.
- Show validation clearly.

---

## Summary Tab: 집계표

The summary tab is the source for the displayed member column order used by all course tabs.

The summary tab should display:

- Date
- Park golf course name
- Logged-in member's assigned group, such as `내 조: 1조`
- Operator-only group selector when reviewing another group
- Four member dropdown cells beside the course area
- Front section:
  - A course
  - B course
  - subtotal
- Back section:
  - C course
  - D course
  - subtotal
- Total
- Signature area

Recommended structure:

```text
집계표

2026.  .  .    (파크골프장)
내 조: 1조

코스 | [회원1 ▼] | [회원2 ▼] | [회원3 ▼] | [회원4 ▼]
전   | A        |          |          |          |
     | B        |          |          |          |
     | 소계     |          |          |          |
후   | C        |          |          |          |
     | D        |          |          |          |
     | 소계     |          |          |          |
계   |          |          |          |          |
서명 |          |          |          |          |
```

Important rule:

```text
The four dropdown cells are on the 집계표 tab, next to the course area.
They are not separate dropdowns inside each A/B/C/D course tab.
```

Dropdown behavior:

- The four dropdowns should be filled from the selected group's members.
- Default values should be automatically populated from the current group assignment in `round_group_members`.
- The dropdown order defines the member column order for all course tabs.
- If the operator changes the order in the summary tab, A/B/C/D tabs must reflect the same order.
- The available options should be limited to members in the selected group by default.
- Optional operator override can be considered later, but should not be part of the first implementation.

This gives the scorekeeper one place to confirm or adjust the display/input order for the group.

---

## Course Tabs: A / B / C / D

Each course tab should contain 9 holes.

The member columns should follow the member dropdown order selected in the 집계표 tab.

Recommended columns:

```text
홀 | M | 파 | 회원1 | 회원2 | 회원3 | 회원4
```

Rows:

```text
1
2
3
4
5
6
7
8
9
소계
```

Input requirements:

- `M` means distance in meters.
- `파` means par.
- Member columns are not independently selected in the course tabs.
- Member columns are inherited from the 집계표 dropdown order.
- Score cells should accept strokes.
- Subtotals should auto-calculate per member.
- Save should persist hole-level scores.
- Final totals should update official round score records.

Example inheritance rule:

```text
집계표 dropdown order:
[김회원] [이회원] [박회원] [최회원]

A/B/C/D course tabs columns:
홀 | M | 파 | 김회원 | 이회원 | 박회원 | 최회원
```

---

## Operator Full Scorecard Review

Operators must be able to review all scorecards within a round.

Recommended URL:

```text
/admin/rounds/[roundId]/scorecards
```

Operator capabilities:

- Select any group.
- View each group's summary tab.
- View A / B / C / D course entries.
- Identify incomplete groups.
- Jump to edit/input screen if permitted.
- View final scoreboard for the full round.

Recommended dashboard indicators:

- Total groups
- Completed groups
- Incomplete groups
- Missing score cells
- Last updated time

---

## Data Model Direction

The current project has several score-related tables:

```text
round_scores
hole_scores
round_groups
round_group_members
round_participants
round_players
```

The current stability rule should remain:

```text
Official participants = round_participants
Official group source = round_groups / round_group_members
Official final score source = round_scores
```

For hole-level scorecard input, a decision is required.

### Option A: Reuse existing `hole_scores`

Use this only if the current `hole_scores` table can safely align with:

- `rounds`
- `round_participants`
- `round_groups`
- `round_group_members`
- `members`

Risk:

- Existing `hole_scores` may be tied to older `round_players` structure.
- Reusing it without review could reintroduce conflicting score sources.

### Option B: Add new `round_hole_scores`

Recommended safer direction if existing `hole_scores` does not align cleanly.

Suggested table:

```text
round_hole_scores
- id
- round_id
- round_group_id
- member_id
- course_code: A / B / C / D
- hole_no: 1~9
- distance_m
- par
- strokes
- updated_by
- updated_at
- created_at
```

Suggested constraints:

- Unique: `(round_id, round_group_id, member_id, course_code, hole_no)`
- `course_code` check: A/B/C/D
- `hole_no` check: 1~9
- `strokes` positive integer or nullable while draft
- RLS enabled
- Authenticated users only
- Operator can review all
- Score keeper can edit only assigned group if scorekeeper flow is introduced

### Optional Member Column Order Storage

Because the 집계표 tab controls the member column order, the app may eventually need to store a per-group display/input order.

Possible table or JSON field:

```text
round_scorecard_group_orders
- id
- round_id
- round_group_id
- member_ids_ordered: uuid[] or jsonb
- updated_by
- updated_at
```

For the first implementation, the default order can come from `round_group_members` without adding a new table.

Add persistence for changed order only if operators need to reorder members frequently.

Aggregation rule:

```text
round_hole_scores → calculated totals → round_scores
```

This preserves `round_scores` as the official final score source.

---

## Required Development Phases

### Phase 1: Planning Document

Status: this document.

No app code changes.

### Phase 2: User-facing Terminology Cleanup

Goal:

- Make the schedule/round distinction clearer.
- Avoid changing database structure.
- Avoid large behavior changes.

Possible files:

```text
src/app/(app)/schedule/page.tsx
src/app/(app)/admin/events/new/page.tsx
src/app/(app)/admin/rounds/page.tsx
home navigation cards
```

Potential wording:

- 일정 → 라운딩 공지
- 참석 투표 → 참석 확인
- 라운드 관리 → 확정 라운드 관리

### Phase 3: KakaoTalk Share Text Copy

Goal:

- Add copy button for attendance notice text.
- Add copy button for event attendance link.
- Do not integrate Kakao API yet.

Reason:

- Copy-to-Kakao is safer and faster than API integration.
- Operators can paste into existing group chats.

### Phase 4: Event-to-Round Flow Hardening

Goal:

- Make attendance-based round creation clearer.
- Prevent duplicate creation.
- Show linked event context.
- Confirm exact attendees before creating round.

### Phase 5: Scorecard Data Model Review

Goal:

- Inspect existing `hole_scores`, `round_players`, `round_scores`.
- Decide whether to reuse `hole_scores` or create `round_hole_scores`.
- Decide whether member column order needs persistence.
- Write migration plan before code changes.

### Phase 6: Scorecard Input UI

Goal:

- Build `/scores/[roundId]/scorecard`.
- Add logged-in user's assigned group display.
- Add summary / A / B / C / D tabs.
- Add four member dropdowns only in the 집계표 tab.
- Inherit the 집계표 member order in all course tabs.
- Add hole-level score inputs.
- Add sticky save CTA.
- Add automatic subtotal/total calculations.

### Phase 7: Operator Scorecard Review UI

Goal:

- Build `/admin/rounds/[roundId]/scorecards`.
- Show all groups.
- Show completion status.
- Allow operator review.
- Link to final scoreboard.

### Phase 8: Final Scoreboard Integration

Goal:

- Ensure final scoreboard uses official `round_scores`.
- Ensure My Page, score detail, averages, and best score continue to use official score source.
- Avoid diverging score sources.

---

## Non-goals for the First Implementation

Do not start with:

- Full Kakao API integration
- Anonymous public score editing links
- Complex token permission system
- PDF export
- Print layout
- Full offline mode
- Real-time multi-user editing

These can be added after the core scorecard flow is stable.

---

## Recommended Immediate Next Step

After this document is committed, start with Phase 2:

```text
User-facing terminology cleanup
```

Why:

- It resolves the current confusion quickly.
- It requires no database migration.
- It lowers the risk before the larger scorecard work.
- It keeps v0.10.0 production baseline safe.

Recommended branch:

```powershell
git checkout main
git pull origin main
git checkout -b feature/round-schedule-scorecard-flow
```

Recommended first patch after this document:

- Change visible text only.
- Do not change data model.
- Do not change search/filter behavior.
- Keep mobile Dense UX and sticky CTA rules.

---

## Final Decision

The schedule and round structures should both remain.

However, the user-facing product flow should be reframed:

```text
라운딩 공지 / 참석 모집
→ 참석 확인
→ 확정 라운드 생성
→ 조편성
→ 조별 스코어카드 입력
→ 최종 스코어보드
```

Scorecard member order should be selected once in the 집계표 tab through four member dropdowns next to the course summary area.

A/B/C/D course tabs should not have separate member dropdowns. They should display members in the same order selected in the 집계표 tab.

This matches the operator's intended real-world workflow while preserving the safer current data architecture.
