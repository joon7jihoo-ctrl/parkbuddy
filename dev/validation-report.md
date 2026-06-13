# ParkBuddy 검증 결과

검증일: 2026-06-12

## 실행한 검증

| 항목 | 명령 | 결과 |
|---|---|---|
| 보안 스모크 테스트 | `npm run security:smoke` | 통과 |
| ESLint | `npm run lint` | 통과 |
| TypeScript | `npm run typecheck` | 통과 |
| Production build | `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-placeholder-anon-key npm run build` | 통과 |
| 의존성 취약점 점검 | `npm audit --omit=dev` | 0 vulnerabilities |

## 확인한 핵심 보안 포인트

- public table 전체 RLS 활성화 SQL 포함
- 통계 View에 `security_invoker = true` 적용
- 일반 회원의 권한 상승을 막는 DB Trigger 포함
- 게시글 공지 전환/고정 전환 보호 정책 포함
- Storage private bucket 접근 정책 포함
- Server Action 입력값 Zod 검증 적용
- 이미지 업로드 MIME type/용량 제한 적용
- `service_role` key를 앱 소스에서 사용하지 않음
- `dangerouslySetInnerHTML` 미사용

## 남은 실환경 검증

아래 항목은 실제 Supabase 프로젝트와 Kakao OAuth 앱이 필요하므로 로컬 정적 검증만으로는 완료할 수 없다.

- 실제 카카오 로그인 및 callback 정상 동작
- 실제 운영진 user_id 연결
- 실제 Supabase RLS 차단 테스트
- 실제 Storage signed URL 표시
- 실제 Vercel 배포 환경변수 연결
