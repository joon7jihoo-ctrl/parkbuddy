# ParkBuddy 개발보고서 - rounds.notes 컬럼 오류 수정

## 작성일

2026-06-13

## 문제 상황

라운드 목록 페이지에서 아래 런타임 오류가 발생했다.

```txt
column rounds.notes does not exist
```

## 원인

DB migration에서는 라운드 메모 컬럼명을 `memo`로 사용했지만, 라운드 페이지 일부 코드가 이전 이름인 `notes`를 조회하고 있었다.

## 조치 내용

라운드 관련 화면과 Server Action에서 메모 컬럼명을 `memo`로 통일했다.

## 변경 파일

```txt
src/app/(app)/admin/rounds/actions.ts
src/app/(app)/admin/rounds/page.tsx
src/app/(app)/admin/rounds/new/page.tsx
dev/2026-06-13-fix-rounds-notes-column-report.md
```

## 완료 기준

```txt
1. npm run verify 통과
2. /admin/rounds 접속 시 notes 컬럼 오류 없음
3. /admin/rounds/new에서 메모 입력 가능
4. 생성된 라운드 목록에서 memo 표시 가능
```
