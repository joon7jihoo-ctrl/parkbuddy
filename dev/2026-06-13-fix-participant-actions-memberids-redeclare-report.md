# 참가자 저장 액션 memberIds 중복 선언 오류 수정

## 작업 일자

2026-06-13

## 수정 내용

- 참가자 저장 액션에서 memberIds 변수가 중복 선언되던 문제를 정리했다.
- 기존 formData 직접 파싱 선언을 제거하고 getParticipantMemberIdsFromForm(formData) 기준 선언만 남겼다.
- 조 편성 액션의 사용하지 않는 import 경고를 정리했다.
- 참가자 선택 보조 컴포넌트의 useEffect 의존성 경고를 정리했다.

## 변경 파일

- src/app/(app)/admin/rounds/[id]/participants/actions.ts
- src/app/(app)/admin/rounds/[id]/pairings/actions.ts
- src/components/admin/participant-selection-enhancer.tsx

## 확인 항목

- npm run verify 통과
- 참가자 8명 저장 후 조 편성 페이지에서 실제 참가자 수가 유지되는지 확인
- 청백전 + 스트로크 플레이 저장 확인
