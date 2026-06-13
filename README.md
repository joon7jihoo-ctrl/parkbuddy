# ParkBuddy Secure

파크버디(ParkBuddy)는 파크골프 동호회 운영을 위한 반응형 웹 앱입니다. 모바일 접속을 우선으로 설계했고, Supabase Auth/RLS/Storage를 기반으로 회원 정보, 일정, 스코어, 공지/게시판을 안전하게 관리합니다.

## 포함 기능

- 카카오 OAuth 기반 로그인 준비
- 회원 CRUD 및 운영진 권한 체크
- 일정 등록, 조회, 참석/불참/미정 투표
- 라운딩 생성, 홀별 스코어 입력, 평균/베스트/최근 추이 통계
- 공지사항/자유게시판 및 이미지 업로드 보안 검증
- 마이페이지 정보 수정
- Supabase RLS 마이그레이션 SQL
- GitHub Actions CI 워크플로우
- 보안 스모크 테스트 스크립트
- `dev/development-report.md` 개발보고서

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`에는 Supabase 프로젝트 URL과 anon/publishable key만 입력합니다. `service_role` key는 절대 프론트엔드/Next.js 환경변수에 넣지 마세요.

## Supabase 적용 순서

1. Supabase 프로젝트 생성
2. `supabase/migrations/0001_secure_schema.sql` 내용을 SQL Editor에서 실행
3. Storage bucket 생성 여부 확인: `avatars`, `post-images`
4. Authentication > Providers > Kakao 설정
5. Site URL과 Redirect URL에 배포 도메인 및 로컬 주소 등록
6. 첫 운영진 회원 데이터를 SQL 또는 Supabase Table Editor로 생성

## Git 연동

```bash
git init
git add .
git commit -m "chore: bootstrap parkbuddy secure web app"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

GitHub에 올린 뒤 Repository Settings > Secrets and variables > Actions에 필요한 값을 등록하고, Vercel 프로젝트와 연결하면 됩니다.

## 품질 점검

```bash
npm run security:smoke
npm run lint
npm run typecheck
npm run build
```

`package-lock.json`을 포함했으므로 CI와 배포 환경에서는 `npm ci`를 사용하세요.
