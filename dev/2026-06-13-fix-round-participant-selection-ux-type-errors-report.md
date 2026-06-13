# 라운드 참가자 선택 UX 타입 오류 수정 보고서

## 작성일

2026-06-13

## 수정 배경

라운드 참가자 선택 UX 개선 후 `npm run verify`에서 다음 문제가 확인되었다.

- `MemberSearchFilter`가 `children`을 필수로 요구하지만 참가자 선택 페이지에서는 단독 컴포넌트로 사용 중이었다.
- DOM 검색 기준점이 `null`일 수 있는데 타입 처리가 부족했다.

## 수정 내용

- `MemberSearchFilter`를 단독 사용 가능한 클라이언트 컴포넌트로 정리했다.
- 참가자 선택 페이지는 수정하지 않았다.
- 검색, 선택된 회원만 보기, 전체 선택 해제 기능은 유지했다.
- DOM 기준점이 없을 때도 안전하게 동작하도록 보정했다.

## 변경 파일

- `src/components/admin/member-search-filter.tsx`
- `dev/2026-06-13-fix-round-participant-selection-ux-type-errors-report.md`

## 확인 항목

- `npm run verify` 통과
- 참가자 선택 화면 접속 가능
- 회원 검색 동작
- 선택 인원 수 표시
- 선택된 회원만 보기 동작
- 전체 선택 해제 동작
