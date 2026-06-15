# ParkBuddy 스코어 입력 미입력자 필터 개선

작성일: 2026-06-15

## 1. 작업 목적

운영자가 현장에서 모바일로 스코어를 입력할 때 이미 입력 완료된 참가자 카드가 계속 보여 스크롤이 길어지는 문제를 줄인다.

이번 단계에서는 스코어 입력 화면에 `미입력만 보기` 토글을 추가해 아직 스코어가 비어 있는 참가자만 빠르게 확인하고 입력할 수 있게 했다.

## 2. 변경 파일

```text
src/components/admin/round-score-input-form.tsx
dev/PARKBUDDY_SCORE_INPUT_MISSING_ONLY_FILTER.md
dev/PARKBUDDY_OPERATOR_DEV_STATUS.md
```

## 3. 주요 변경 내용

- 스코어 입력 화면 상단에 `미입력만 보기` 토글 추가
- 토글 ON 상태에서는 총 타수 또는 스테이블포드 포인트가 비어 있는 참가자만 표시
- 모든 참가자 입력이 완료되면 `모든 참가자의 스코어가 입력되었습니다.` 안내 표시
- 토글 ON 상태에서도 숨겨진 완료 참가자의 기존 입력값을 hidden input으로 함께 제출해 저장 시 값이 유실되지 않도록 처리
- 완료/미입력 카운트와 진행률은 기존처럼 실시간 반영

## 4. 변경하지 않은 범위

- Supabase SQL/RPC 변경 없음
- 스코어 저장 액션 구조 변경 없음
- 게시판 보안 정책 변경 없음
- 회원 검색/필터 기능 변경 없음

## 5. 검증 결과

```text
npm run verify
```

결과:

```text
Security smoke test passed.
eslint 통과
tsc --noEmit 통과
```

## 6. 화면 확인 체크리스트

로컬 실행:

```powershell
cd C:\parkbuddy
npm run verify
npm run dev
```

확인 경로:

```text
/admin/rounds → 스코어
```

확인 항목:

1. 스코어 입력 화면 상단에 `미입력만 보기` 버튼이 보이는가
2. 일부 참가자만 점수를 입력하면 완료/미입력 카운트가 즉시 바뀌는가
3. `미입력만 보기`를 누르면 미입력 참가자만 남는가
4. 전체 보기를 누르면 모든 참가자가 다시 보이는가
5. 미입력만 보기 상태에서 저장해도 기존 입력 완료자의 값이 사라지지 않는가
6. 모든 참가자 입력 완료 후 미입력만 보기에서 완료 안내가 보이는가
7. 모바일에서 sticky 저장 버튼과 토글 버튼이 겹치지 않는가

## 7. 권장 캡처 파일명

```text
D:\Development\Capture\score-input-missing-filter-01-all.png
D:\Development\Capture\score-input-missing-filter-02-missing-only.png
D:\Development\Capture\score-input-missing-filter-03-all-complete.png
D:\Development\Capture\score-input-missing-filter-04-results-after-save.png
```

## 8. 커밋 메시지 제안

```text
feat: add missing-only filter to score input
```
