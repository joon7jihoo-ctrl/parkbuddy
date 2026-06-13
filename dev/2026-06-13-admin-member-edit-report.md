# ParkBuddy 개발보고서 - 회원 수정 화면 추가

## 작성일

2026-06-13

## 진행 내용

운영진 회원 관리 화면에 회원 수정 기능을 추가했다.

## 변경 파일

```txt
supabase/migrations/0007_admin_update_member.sql
src/app/(app)/admin/members/actions.ts
src/app/(app)/admin/members/page.tsx
src/app/(app)/admin/members/[memberId]/edit/page.tsx
dev/2026-06-13-admin-member-edit-report.md
```

## 구현 기능

운영진은 회원 관리 화면에서 회원별 `수정` 버튼을 통해 아래 정보를 수정할 수 있다.

```txt
이름
연락처
핸디캡
역할
```

## DB 보안 함수

다음 RPC를 추가했다.

```txt
public.admin_update_member(...)
```

이 함수는 DB 내부에서 다음을 검증한다.

```txt
1. 로그인 여부
2. 운영진 권한 여부
3. 같은 동호회 회원인지 여부
4. 이름/전화번호/핸디캡/역할 유효성
5. 같은 동호회 내 연락처 중복 여부
6. 자기 자신의 운영진 권한 해제 차단
7. 마지막 운영진 권한 해제 차단
```

## 보안 평가

회원 수정은 클라이언트 화면에서도 검증하지만, 최종 권한과 데이터 무결성은 Supabase RPC에서 다시 검증한다.

클라이언트에서 `club_id`를 받지 않으며, RPC 내부에서 현재 로그인한 운영진의 `club_id`를 기준으로 수정 대상을 제한한다.

따라서 다른 동호회 회원을 임의로 수정하기 어렵다.

## 완료 기준

```txt
1. Supabase SQL Editor에서 0007_admin_update_member.sql 실행
2. npm run verify 통과
3. /admin/members 화면에서 수정 버튼 표시
4. /admin/members/[memberId]/edit 화면 접속 가능
5. 회원 정보 수정 후 /admin/members로 이동
6. 자기 자신의 운영진 권한 해제 시도 시 오류 표시
```

## 다음 단계

다음 단계에서는 회원 비활성화 기능을 추가한다.

```txt
1. 회원 비활성화 RPC
2. 관리자 화면 비활성화 버튼
3. 비활성화 확인 UI
4. 마지막 운영진 비활성화 방지
```
