# ParkBuddy 개발보고서 - 인쇄 페이지 Client Event 오류 수정

## 작성일

2026-06-13

## 수정 내용

Next.js Server Component에 직접 전달된 onClick 이벤트 핸들러를 제거했다.

인쇄 버튼을 별도 Client Component로 분리했다.

## 변경 파일

- src/components/print-button.tsx
- src/app/(app)/admin/rounds/[id]/results/print/page.tsx
- dev/2026-06-13-fix-print-page-client-event-report.md

## 확인 기준

- npm run verify 통과
- 인쇄용 결과 페이지 접속 가능
- 인쇄 / PDF 저장 버튼 클릭 가능
