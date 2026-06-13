# ParkBuddy 개발보고서 - 라운드 관리 1단계 추가

## 작성일

2026-06-13

## 진행 내용

라운드 관리의 기반 기능을 추가했다.

## 변경 파일

```txt
supabase/migrations/0011_rounds_base.sql
src/app/(app)/admin/rounds/actions.ts
src/app/(app)/admin/rounds/page.tsx
src/app/(app)/admin/rounds/new/page.tsx
dev/2026-06-13-admin-rounds-base-report.md
```

## 구현 기능

운영진은 라운드 목록을 보고 새 라운드를 생성할 수 있다.

```txt
라운드명
골프장
날짜
시작 시간
메모
```

## DB 보안 함수

다음 RPC를 추가했다.

```txt
public.admin_create_round(...)
```

이 함수는 DB 내부에서 다음을 검증한다.

```txt
1. 로그인 여부
2. 운영진 권한 여부
3. 라운드명 유효성
4. 골프장 이름 유효성
5. 라운드 날짜 유효성
6. 현재 운영진의 club_id 기준으로만 라운드 생성
```

## 보안 평가

클라이언트에서 club_id를 받지 않는다.

라운드는 현재 로그인한 운영진의 club_id로만 생성된다.

라운드 생성 작업은 관리자 액션 로그에 기록된다.

## 완료 기준

```txt
1. Supabase SQL Editor에서 0011_rounds_base.sql 실행
2. npm run verify 통과
3. /admin/rounds 접속 가능
4. /admin/rounds/new 접속 가능
5. 라운드 생성 후 목록에 표시
6. 최근 관리자 작업 로그에 round.create 기록
```

## 다음 단계

다음 단계에서는 라운드 참가자 선택 기능을 추가한다.

```txt
1. round_participants 테이블
2. 라운드별 참가자 추가/제거
3. 활성 회원 검색/선택
4. 참가자 중복 추가 방지
```
