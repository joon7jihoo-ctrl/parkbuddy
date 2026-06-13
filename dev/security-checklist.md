# ParkBuddy 보안 체크리스트

## 배포 전 필수

- [ ] Supabase RLS가 모든 public 테이블에 활성화되어 있다.
- [ ] `service_role` key가 코드와 Vercel 환경변수에 없다.
- [ ] `.env.local`이 Git에 커밋되지 않았다.
- [ ] Kakao OAuth Redirect URL이 운영 도메인과 로컬 주소에만 제한되어 있다.
- [ ] 첫 운영진 계정의 `members.user_id`가 실제 auth user와 연결되어 있다.
- [ ] Storage `post-images` bucket이 private 상태다.
- [ ] 게시글 이미지 업로드 크기 제한이 실제 동작한다.
- [ ] GitHub Actions CI가 통과한다.
- [ ] `npm audit --audit-level=high` 결과를 확인했다.

## 운영 중 권장

- [ ] 관리자 작업 로그 테이블 추가
- [ ] CSP report-only 적용
- [ ] Supabase 백업 주기 확인
- [ ] 개인정보 보관/파기 정책 문서화
- [ ] 탈퇴/비활성 회원의 연락처 마스킹 정책 추가
