# ParkBuddy Performance/Dense UX Exception Policy

작성일: 2026-06-19

## 목적

`npm run performance:ux` 점검에서 실제 저장/등록 화면은 공통 sticky SubmitButton 사용을 권장한다. 다만 모든 `<form>`이 저장 폼은 아니기 때문에 검색, 필터, 로그인, 투표, 다중 액션 화면은 예외로 관리한다.

## 이번 변경

다음 화면은 의도된 예외로 등록했다.

- `/admin/rounds/deleted`: 삭제된 라운드 복원/관리 성격의 다중 액션 화면
- `/admin/rounds/[id]/pairings`: 조 편성 전용 sticky 저장 흐름 보유
- `/admin/rounds/[id]/participants`: 참가자 선택 전용 sticky 저장 흐름 보유
- `/board`: 게시판 검색/필터 form
- `/schedule`: 투표, 일정 확인, 라운딩 생성 등 다중 액션 화면
- `/login`: 카카오 로그인, 초대 코드 등 여러 인증 흐름 보유

## 운영 기준

새로운 화면을 추가할 때 기준은 아래와 같다.

1. 단일 저장/등록/수정 화면이면 `SubmitButton`을 사용한다.
2. 검색/필터 form이면 sticky SubmitButton을 강제하지 않는다.
3. 투표/로그인/복원/조 편성처럼 액션이 여러 개인 화면은 전용 CTA를 유지한다.
4. 예외 화면을 추가할 때는 `scripts/performance-dense-ux-audit.mjs`의 `INTENTIONAL_FORM_PAGE_EXCEPTIONS`에 사유와 함께 등록한다.

## 검증 명령어

```powershell
npm run performance:ux
npm run verify
```

## 기대 결과

저장/등록 화면은 공통 sticky CTA 기준으로 관리하고, 의도된 예외 화면은 반복 경고 없이 통과한다.
