# ParkBuddy 개발보고서 - 라운드 조 편성 기능 추가

## 작성일

2026-06-13

## 진행 내용

라운드 참가자 기반 조 편성 기능을 추가했다.

## 변경 파일

```txt
supabase/migrations/0013_round_pairings.sql
src/components/admin/round-pairing-form.tsx
src/app/(app)/admin/rounds/page.tsx
src/app/(app)/admin/rounds/[id]/pairings/page.tsx
src/app/(app)/admin/rounds/[id]/pairings/actions.ts
dev/2026-06-13-round-pairings-report.md
```

## 구현 기능

라운드별 참가자를 기준으로 조 편성을 저장할 수 있다.

총 참가 인원에 따라 추천 경기 조합을 표시한다.

운영진은 수동으로 경기 형태와 점수 계산 방식을 선택할 수 있다.

## 지원 경기 형태

```txt
개인전
포섬
포볼
스크램블
청백전
```

## 지원 점수 계산 방식

경기 형태별로 허용된 점수 계산 방식만 선택 가능하다.

```txt
개인전: 스트로크, 신페리오, 매치, 스테이블포드
포섬: 스트로크, 매치
포볼: 스트로크, 매치, 스테이블포드
스크램블: 스트로크, 매치
청백전: 스트로크, 신페리오, 매치
```

## 조 편성 규칙

```txt
1개 조 기본 4명
각 조 최소 3명
각 조 최대 4명
5명은 3~4명 조 편성 조건을 만족할 수 없으므로 저장 차단
```

## 보안 평가

클라이언트에서 참가자 ID나 조 번호를 조작하더라도 DB RPC에서 다시 검증한다.

```txt
운영진 권한 검증
같은 동호회 라운드 검증
라운드 참가자 여부 검증
활성 회원 여부 검증
조별 3~4명 조건 검증
경기 형태/점수 방식 조합 검증
```

## 완료 기준

```txt
1. Supabase SQL Editor에서 0013_round_pairings.sql 실행
2. npm run verify 통과
3. /admin/rounds에서 조 편성 버튼 표시
4. /admin/rounds/[id]/pairings 접속 가능
5. 추천 경기 조합 표시
6. 경기 형태 선택 시 가능한 점수 계산 방식만 표시
7. 조 편성 저장 가능
8. 관리자 로그에 round.pairings.update 기록
```
