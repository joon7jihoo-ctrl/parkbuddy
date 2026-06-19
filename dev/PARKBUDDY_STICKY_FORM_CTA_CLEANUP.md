# ParkBuddy Sticky Form CTA Cleanup

## 목적

운영 전 성능/Dense UX 점검에서 경고로 표시된 입력/수정 화면 중 실제 저장 액션이 명확한 화면을 공통 sticky SubmitButton 기준으로 정리한다.

이번 작업은 화면 기능이나 Server Action 동작을 변경하지 않고, 저장/등록 버튼의 UX 일관성만 보강한다.

## 변경 범위

- `src/app/(app)/admin/members/new/page.tsx`
- `src/app/(app)/admin/members/[id]/edit/page.tsx`
- `src/app/(app)/admin/rounds/new/page.tsx`
- `src/app/(app)/admin/rounds/[id]/edit/page.tsx`
- `src/app/(app)/member-link/page.tsx`

## 반영 내용

1. 회원 등록 화면
   - 기존 개별 sticky submit 영역을 공통 `SubmitButton`으로 교체
   - 버튼 문구: `회원 등록하고 연결 코드 발급`

2. 회원 수정 화면
   - 저장 버튼을 공통 `SubmitButton`으로 교체
   - 목록 이동 버튼을 상단 헤더에 배치해 하단 CTA는 저장 액션에 집중

3. 라운드 생성 화면
   - 등록 버튼을 공통 `SubmitButton`으로 교체
   - 모바일 하단 CTA와 컨텐츠가 겹치지 않도록 하단 여백 보강

4. 라운드 수정 화면
   - 저장 버튼을 공통 `SubmitButton`으로 교체
   - 기존 목록 링크는 상단에 유지
   - 모바일 하단 여백 보강

5. 회원 정보 연결 화면
   - 연결 버튼을 공통 `SubmitButton`으로 교체
   - 모바일 하단 여백 보강

## 점검 결과

`node scripts/performance-dense-ux-audit.mjs` 기준, 이번 5개 화면의 경고는 제거되었다.

남은 경고는 다음 화면이다.

- 조 편성
- 참가자 관리
- 삭제된 라운드
- 게시판 목록
- 일정
- 로그인

이 화면들은 자체 액션이 많거나 검색/필터/투표 성격의 form을 포함하므로, 이번 패치에서는 안전하게 제외했다.

## 확인 포인트

- 모바일에서 저장/등록 버튼이 하단 sticky로 보이는지
- 하단 홈 버튼과 저장 버튼이 겹치지 않는지
- 데스크톱에서 화면이 과하게 바뀌지 않는지
- 회원 등록/수정, 라운드 생성/수정, 회원 연결 Server Action이 기존처럼 동작하는지
