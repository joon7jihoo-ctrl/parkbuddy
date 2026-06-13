# 참가자 선택 화면 검색/선택 필터 오류 수정 보고서

## 작성일

2026-06-13

## 수정 배경

참가자 선택 UX 개선 후 `useEffect` 내부에서 즉시 상태를 갱신하는 구조가 React hooks lint 규칙에 걸렸다.

## 수정 내용

- `MemberSearchFilter` 컴포넌트의 상태 갱신 흐름을 정리했다.
- 검색어 변경, 선택된 회원만 보기, 전체 선택/해제 동작은 이벤트 핸들러에서 처리하도록 변경했다.
- 초기 DOM 반영은 예약 콜백으로 처리하여 lint 오류를 피했다.
- 검색창 위아래 여백과 입력창 높이는 유지했다.
- 선택된 회원만 보기 상태에서 체크 해제 시 목록이 즉시 갱신되도록 정리했다.

## 변경 파일

- src/components/admin/member-search-filter.tsx
- dev/2026-06-13-fix-member-search-filter-react-hooks-lint-report.md

## 확인 항목

- npm run verify 통과
- 참가자 선택 화면 검색 정상 동작
- 선택된 회원만 보기 정상 동작
- 전체 선택/전체 선택 해제 정상 동작
