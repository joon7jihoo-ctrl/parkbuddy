# ParkBuddy 다음 개발 흐름 체크리스트

## 1. 새 대화창 첫 확인 명령어

```powershell
cd C:\parkbuddy
git status
git log --oneline -5
npm run verify
```

## 2. 확인해야 할 최근 커밋

아래 커밋 또는 유사 메시지가 있는지 확인합니다.

```text
feat: unify sticky submit cta on form screens
chore: document dense ux form exceptions
```

두 번째 커밋이 없으면 performance UX 예외 정책 패치가 아직 미적용일 수 있습니다.

## 3. verify 결과 판단

### 통과 기준

```text
Security smoke test passed.
RLS/RPC migration audit passed.
Architecture boundary audit passed.
Performance/Dense UX audit passed.
eslint 통과
tsc --noEmit 통과
```

### performance:ux 경고 판단 기준

수정 대상:

```text
단일 저장/등록/수정 form 화면
```

예외 처리 대상:

```text
검색 form
필터 form
투표 form
로그인 form
조 편성/참가자처럼 다중 액션 화면
복원/관리 액션이 섞인 화면
```

## 4. 운영 QA 우선순위

1. 로그인/초대 코드
2. 회원 관리
3. 일정 투표
4. 일정 → 라운딩 생성
5. 참가자 관리
6. 조 편성 자동/수동
7. 스코어 입력
8. 결과 확인
9. 게시판 권한
10. 모바일 실기기 화면

## 5. 운영 배포 확인

```text
Vercel production branch
Supabase Site URL
Supabase Redirect URLs
Kakao Developers Redirect URI
환경변수
마이그레이션 적용 상태
RLS 정책 상태
```

## 6. 지켜야 할 개발 원칙

- 새 기능보다 안정성 우선
- 앱 코드 대규모 변경 금지
- 작은 패치 단위 유지
- dev 문서 동시 갱신
- 모바일 Dense UX 유지
- sticky CTA 중복 방지
- 보안/RLS/RPC 흐름 임의 변경 금지
