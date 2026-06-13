# ParkBuddy 개발보고서 - 라운드 목록 참가자 수 표시 수정

## 작성일

2026-06-13

## 문제 상황

라운드 참가자 선택 기능은 동작하지만, `/admin/rounds` 라운드 목록에서 참가자 수가 표시되지 않았다.

## 원인

조 편성 기능을 추가하면서 라운드 목록 페이지가 교체되었고, 참가자 수 집계 로직이 누락되었다.

## 조치 내용

라운드 목록 페이지에서 `round_participants`를 별도로 조회해 라운드별 confirmed 참가자 수를 집계하도록 보정했다.

## 변경 파일

```txt
src/app/(app)/admin/rounds/page.tsx
dev/2026-06-13-fix-round-participant-count-report.md
```

## 완료 기준

```txt
1. npm run verify 통과
2. /admin/rounds 접속 가능
3. 각 라운드 카드에 참가자 N명 표시
4. 참가자 선택 후 저장하면 목록의 참가자 수 반영
5. 조 편성 버튼 유지
```
