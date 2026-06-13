# ParkBuddy 개발보고서 - 회원 계정 연결 단계

## 작성일

2026-06-13

## 진행 단계

카카오 로그인 완료 후, Supabase Auth 사용자와 ParkBuddy `members` 테이블의 실제 회원 정보를 연결하는 기능을 추가했다.

이번 단계의 핵심 목표는 로그인한 사용자가 실제 동호회 회원인지 확인한 뒤, 해당 회원에게만 동호회 데이터 접근 권한을 부여하는 것이다.

## 변경/추가 파일

```txt
supabase/migrations/0002_member_account_claim.sql
src/app/(app)/member-link/page.tsx
src/app/auth/callback/route.ts
src/app/(app)/page.tsx
src/app/(app)/mypage/page.tsx
dev/2026-06-13-member-link-report.md