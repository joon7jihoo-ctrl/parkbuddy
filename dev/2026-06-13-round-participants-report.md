# ParkBuddy 개발보고서 - 라운드 참가자 선택 기능 추가

## 작성일

2026-06-13

## 진행 내용

라운드별 참가자 선택 기능을 추가했다.

## 변경 파일

```txt
supabase/migrations/0012_round_participants.sql
src/app/(app)/admin/rounds/page.tsx
src/app/(app)/admin/rounds/[id]/participants/page.tsx
src/app/(app)/admin/rounds/[id]/participants/actions.ts
dev/2026-06-13-round-participants-report.md
```

## 구현 기능

운영진은 라운드 목록에서 특정 라운드의 참가자를 선택할 수 있다.

참가자 선택 화면에서는 활성 회원 목록을 체크박스로 보여주며, 저장 시 해당 라운드의 참가자 목록이 갱신된다.

## DB 보안 함수

다음 RPC를 추가했다.

```txt
public.admin_set_round_participants(...)
```

이 함수는 DB 내부에서 다음을 검증한다.

```txt
1. 로그인 여부
2. 운영진 권한 여부
3. 라운드가 현재 운영진의 동호회 소속인지 여부
4. 선택된 회원들이 모두 같은 동호회의 active 회원인지 여부
```

## 보안 평가

클라이언트에서 member_id를 조작해도 DB RPC에서 같은 동호회 active 회원인지 다시 검증한다.

따라서 다른 동호회 회원이나 비활성 회원을 참가자로 넣기 어렵다.

## 완료 기준

```txt
1. Supabase SQL Editor에서 0012_round_participants.sql 실행
2. npm run verify 통과
3. /admin/rounds에서 참가자 선택 버튼 표시
4. 참가자 선택 페이지 접속 가능
5. 체크박스 선택 후 저장 가능
6. 라운드 목록에 참가자 수 표시
7. 관리자 로그에 round.participants.update 기록
```

## 다음 단계

다음 단계에서는 선택된 참가자를 기반으로 조 편성 기능을 추가한다.
