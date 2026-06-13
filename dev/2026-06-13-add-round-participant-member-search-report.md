# 라운드 참가자 선택 화면 회원 검색 기능 추가

## 작성일

2026-06-13

## 작업 내용

- 라운드 참가자 선택 화면에 회원 검색창을 추가했다.
- 검색어 입력 시 현재 화면의 회원 후보 항목을 즉시 필터링한다.
- 서버 컴포넌트에 이벤트 핸들러를 직접 넣지 않기 위해 검색 UI는 클라이언트 컴포넌트로 분리했다.
- 기존 참가자 저장 로직과 Supabase SQL은 변경하지 않았다.

## 변경 파일

- src/components/admin/member-search-filter.tsx
- src/app/(app)/admin/rounds/[id]/participants/page.tsx
- dev/2026-06-13-add-round-participant-member-search-report.md

## 백업 파일

- dev/backup-round-participants-page-before-member-search-2026-06-13T07-27-59-500Z.tsx.bak

## 확인 항목

- 참가자 선택 화면에 회원 검색창이 보이는지 확인한다.
- 검색어 입력 시 회원 목록이 좁혀지는지 확인한다.
- 검색 후에도 참가자 선택 저장이 정상 동작하는지 확인한다.
- npm run verify 통과 여부를 확인한다.
