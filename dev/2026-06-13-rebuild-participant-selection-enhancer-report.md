# 라운드 참가자 검색 기능 안정 재구현

## 작업 목적

복구된 참가자 선택 화면을 기준으로, 회원 검색/선택 보조 UI를 다시 연결했다.

## 변경 파일

- src/components/admin/participant-selection-enhancer.tsx
- src/app/(app)/admin/rounds/[id]/participants/page.tsx
- dev/2026-06-13-rebuild-participant-selection-enhancer-report.md

## 구현 내용

- 참가자 선택 화면 상단에 회원 검색 카드 추가
- 검색어 기준으로 현재 회원 목록 필터링
- 선택된 회원만 보기 토글 추가
- 전체 선택 / 전체 선택 해제 토글 추가
- 전체/표시/선택 회원 수 표시
- 활성 회원 영역의 현재 선택 인원 문구 즉시 갱신

## 주의사항

앱 데이터베이스 구조는 변경하지 않았다.
참가자 저장 로직은 기존 서버 액션을 그대로 사용한다.
