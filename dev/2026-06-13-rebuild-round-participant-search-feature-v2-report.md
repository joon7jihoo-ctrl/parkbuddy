# 라운드 참가자 검색 기능 재구현 v2

## 작업 내용

- 회원 검색 컴포넌트를 다시 안정화했습니다.
- 참가자 선택 페이지에 검색 컴포넌트를 실제로 삽입했습니다.
- 검색, 선택된 회원만 보기, 전체 선택/해제 토글, 선택 인원 즉시 반영을 다시 연결했습니다.

## 변경 파일

- src/components/admin/member-search-filter.tsx
- src/app/(app)/admin/rounds/[id]/participants/page.tsx

## 주의 사항

- DB 변경은 없습니다.
- npm run verify 통과 후 화면에서 실제 동작을 확인해야 합니다.
