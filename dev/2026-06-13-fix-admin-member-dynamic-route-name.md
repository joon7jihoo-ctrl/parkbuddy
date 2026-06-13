# ParkBuddy 개발보고서 - 관리자 회원 수정 동적 라우트명 통일

## 작성일

2026-06-13

## 문제 상황

`npm run dev` 실행 후 다음 오류가 발생했다.

```txt
Error: You cannot use different slug names for the same dynamic path ('id' !== 'memberId').
```

## 원인

Next.js App Router에서는 같은 경로 깊이에 있는 동적 라우트 폴더명이 서로 달라지면 충돌한다.

예를 들어 아래처럼 같은 위치에서 `[id]`와 `[memberId]`를 섞어 쓰면 안 된다.

```txt
src/app/(app)/admin/members/[id]/...
src/app/(app)/admin/members/[memberId]/...
```

두 폴더는 URL상 모두 같은 동적 경로로 해석되기 때문이다.

## 조치 내용

관리자 회원 동적 라우트명을 `[id]`로 통일했다.

```txt
유지:
src/app/(app)/admin/members/[id]/edit/page.tsx

삭제:
src/app/(app)/admin/members/[memberId]
```

수정 페이지 내부 `params`도 `memberId` 대신 `id`를 사용하도록 변경했다.

## 완료 기준

```txt
1. src/app/(app)/admin/members/[memberId] 폴더가 없음
2. src/app/(app)/admin/members/[id]/edit/page.tsx 존재
3. npm run verify 통과
4. npm run dev 실행 시 동적 slug 충돌 없음
5. /admin/members/[id]/edit 접속 가능
```
