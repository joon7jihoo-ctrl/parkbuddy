# ParkBuddy 개발보고서 - 확인 버튼 제출 중단 문제 수정

## 작성일

2026-06-13

## 문제 상황

비활성 회원 복구 버튼 클릭 후 확인창에서 확인을 누르면 버튼 문구가 `처리 중...`으로 바뀐 뒤 더 이상 진행되지 않았다.

## 원인

`ConfirmSubmitButton`에서 확인 직후 React 상태를 변경해 버튼을 `disabled` 처리했다.

Server Action form 제출과 같은 순간에 submit 버튼이 disabled 상태로 바뀌면서 일부 환경에서 form submit이 정상적으로 이어지지 않을 수 있다.

## 조치 내용

확인 버튼 컴포넌트에서 제출 중 상태 변경을 제거했다.

취소를 누른 경우에만 `event.preventDefault()`로 제출을 막고, 확인을 누른 경우에는 브라우저의 기본 form submit 흐름을 그대로 유지한다.

## 변경 파일

```txt
src/components/confirm-submit-button.tsx
dev/2026-06-13-fix-confirm-submit-button-report.md
```

## 완료 기준

```txt
1. npm run verify 통과
2. 비활성 회원 탭에서 복구 버튼 클릭
3. 확인창에서 취소 시 아무 작업도 진행되지 않음
4. 확인창에서 확인 시 복구 Server Action 실행
5. 복구 후 /admin/members?status=inactive&restored=1 로 이동
```

## 보안 평가

이 수정은 UX 제출 흐름만 수정한다.

복구 권한 검증, 같은 동호회 검증, 연락처 중복 검증은 기존 Supabase RPC `admin_restore_member`에서 계속 수행한다.
