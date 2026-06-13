# ParkBuddy 개발보고서

작성일: 2026-06-12  
대상: ParkBuddy Secure 소스 패키지 v0.10.0  
작성 기준: 1~9단계 완료 후 10단계(통계 View + 그래프) 이후 기능 확장 및 Git 연동 가능한 전체 소스 구성

## 1. 작업 범위

본 패키지는 파크골프 동호회 관리 웹 앱의 MVP를 GitHub 저장소에 바로 올릴 수 있는 형태로 구성했다. 포함 범위는 다음과 같다.

- Next.js App Router 기반 반응형 웹 앱 구조
- Supabase Auth, PostgreSQL, Storage 연동 코드
- 회원 관리 CRUD
- 일정 등록 및 참석/불참/미정 투표
- 라운딩 생성 및 홀별 스코어 저장
- 개인별 평균, 베스트, 최근 스코어 추이 그래프
- 공지사항/자유게시판 및 이미지 업로드
- 마이페이지 수정
- Supabase RLS 기반 보안 SQL
- GitHub Actions CI
- 보안 스모크 테스트 스크립트

## 2. 현재 소스 구조 평가

### 2.1 긍정 평가

1. **모바일 우선 구조**  
   핵심 메뉴를 하단 탭으로 배치하여 90% 이상 모바일 접속 시나리오에 적합하다. 카드형 목록, 큰 버튼, 1열 입력 폼을 기본으로 구성했다.

2. **권한 분리**  
   회원 기능과 운영진 기능을 분리했다. 운영진 전용 화면은 서버 레벨에서 `requireAdmin()`을 통해 접근을 제한한다.

3. **DB 레벨 보안 적용**  
   Supabase RLS를 모든 주요 테이블에 적용했다. `current_club_id()`, `current_member_id()`, `is_club_admin()` 헬퍼 함수로 동호회 단위 멀티테넌트 접근 제어를 구현했다.

4. **입력값 검증**  
   Server Action에서 Zod 기반 검증을 수행한다. 클라이언트 입력값을 신뢰하지 않고 서버에서 재검증한다.

5. **파일 업로드 방어**  
   게시글 이미지는 MIME type과 크기를 검증하며, 사용자 파일명을 저장 경로에 직접 사용하지 않고 UUID 기반 경로를 사용한다.

6. **권한 상승 방어**  
   일반 회원이 직접 API를 호출해 `role`, `status`, `post_type`, `is_pinned` 같은 보호 필드를 변경하지 못하도록 RLS 정책과 DB Trigger를 함께 적용했다.

7. **통계 성능 고려**  
   스코어 통계는 DB View로 분리했다. 자주 조회하는 컬럼에는 인덱스를 추가했다.

8. **Git 연동 준비**  
   `.gitignore`, `.gitattributes`, GitHub Actions CI, README, 환경변수 예시 파일을 포함했다.

### 2.2 보완 필요 사항

1. **초기 회원 계정 연결 UX**  
   현재는 운영진이 `members.user_id`를 연결해야 한다. 운영 편의성을 위해 추후 초대 링크 기반 자동 연결 플로우가 필요하다.

2. **댓글 기능 미포함**  
   자유게시판은 게시글/이미지 중심이며 댓글은 다음 단계 확장 항목으로 남겨두었다.

3. **이미지 압축 미적용**  
   서버에서 5MB 제한은 적용했지만, 모바일 업로드 전 클라이언트 이미지 리사이징은 아직 없다.

4. **CSP 강제 미적용**  
   보안 헤더는 적용했으나 Content-Security-Policy는 OAuth, Supabase, Next.js runtime과의 충돌 가능성 때문에 별도 검증 후 단계적으로 적용하는 것이 좋다.

5. **자동화 테스트 부족**  
   현재는 정적 보안 스모크 테스트와 타입/린트/빌드 CI 중심이다. Playwright 기반 E2E 테스트와 Supabase local test가 추가되면 안정성이 좋아진다.

## 3. 시큐어코딩 적용 내역

| 영역 | 적용 내용 |
|---|---|
| 인증 | Supabase Auth 기반 세션 확인, 미로그인 사용자는 `/login` 이동 |
| 권한 | `requireCurrentMember`, `requireAdmin` 서버 가드 적용 |
| DB 접근 | 클럽 단위 RLS 정책 적용 |
| 권한 상승 방어 | 보호 필드 변경 차단 Trigger 적용 |
| 입력 검증 | Zod schema로 Server Action 입력값 검증 |
| XSS 방어 | React 기본 escaping 사용, `dangerouslySetInnerHTML` 금지 |
| 파일 업로드 | MIME type, 크기 제한, UUID 파일명 적용 |
| 환경변수 | `.env.example`만 제공, `.env*`는 git ignore |
| 보안 헤더 | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| CI | lint, typecheck, build, dependency audit, security smoke test |

## 4. 성능 및 최적화 평가

- 목록 화면은 서버 컴포넌트에서 직접 데이터를 조회해 초기 렌더링 비용을 줄였다.
- 통계 계산은 View로 분리하여 클라이언트 계산량을 줄였다.
- 주요 조회 패턴에 인덱스를 추가했다.
- 모바일 입력 폼은 네이티브 키패드가 뜨도록 `inputMode`, `type="number"`, `type="tel"`을 활용했다.
- 이미지는 private bucket + signed URL 방식으로 접근한다.

### 추가 최적화 권장

- 게시판 목록 pagination 또는 infinite scroll 적용
- 이미지 업로드 전 브라우저 리사이징 적용
- Supabase query에 필요한 컬럼만 선택하는 원칙 유지
- 스코어 통계 View를 사용량 증가 시 materialized view 또는 캐시 테이블로 전환
- 운영진 대시보드에 느린 쿼리 모니터링 추가

## 5. Git 운영 제안

권장 브랜치 전략은 다음과 같다.

- `main`: 운영 배포 브랜치
- `develop`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 운영 긴급 수정 브랜치

커밋 예시는 다음과 같다.

```bash
git init
git add .
git commit -m "chore: bootstrap parkbuddy secure app"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

`package-lock.json`을 반드시 커밋한다. 운영 배포 전에는 GitHub Actions CI가 통과해야 한다.

## 6. 추후 확장 방향성

### 6.1 기능 확장

1. **초대 링크 기반 회원 연결**  
   운영진이 회원별 초대 링크를 발급하고, 회원이 카카오 로그인 후 자동으로 `user_id`를 연결하는 구조로 개선한다.

2. **대회 모드**  
   라운딩 스코어를 기반으로 순위표, 조 편성, 동타 처리 규칙을 제공한다.

3. **댓글/좋아요/알림**  
   게시판 댓글, 공지 읽음 확인, 일정 전 알림을 추가한다.

4. **PWA**  
   홈 화면 설치, 오프라인 안내 페이지, 앱 아이콘을 추가한다.

5. **Open Graph 공유 최적화**  
   카카오톡 링크 공유 시 동호회명, 일정명, 대표 이미지가 표시되도록 OG 메타를 동적으로 생성한다.

### 6.2 보안 확장

1. **초대 토큰 만료 및 1회성 사용**
2. **관리자 작업 감사 로그**
3. **Rate limiting**
4. **CSP report-only 도입 후 enforce 전환**
5. **Supabase local RLS 테스트 자동화**
6. **이미지 악성 파일 검사 또는 외부 스캔 연계**

### 6.3 운영 확장

1. **Vercel Preview 배포**  
   PR마다 preview URL을 생성하여 운영진이 검수한다.

2. **에러 모니터링**  
   Sentry 등으로 런타임 에러를 수집한다.

3. **DB 백업 정책**  
   Supabase 백업 및 restore 훈련을 정기화한다.

4. **개인정보 파기 정책**  
   탈퇴/비활성 회원의 개인정보 처리 기준을 명확히 한다.

## 7. 현재 상태 결론

현재 소스는 MVP 개발을 이어가기 위한 기반으로 적합하다. 특히 RLS, 서버 입력 검증, 운영진 권한 체크, 파일 업로드 제한, CI 점검이 포함되어 있어 단순 프로토타입보다 안전한 출발점이다.

다만 실서비스 전에는 실제 Supabase 프로젝트에 마이그레이션을 적용한 뒤 다음 항목을 반드시 확인해야 한다.

- 운영진 계정 연결 정상 여부
- RLS 정책이 비회원/타 동호회 데이터 접근을 차단하는지 여부
- Kakao OAuth Redirect URL 정상 동작 여부
- Storage private image signed URL 표시 여부
- GitHub Actions와 Vercel 배포 환경변수 설정 여부
- 모바일 브라우저에서 스코어 입력 UX 정상 동작 여부

## 8. 검증 결과 요약

본 패키지 작성 후 다음 검증을 수행했다.

- `npm run security:smoke`: 통과
- `npm run lint`: 통과
- `npm run typecheck`: 통과
- `npm run build`: 통과
- `npm audit --omit=dev`: 0 vulnerabilities

세부 검증 결과는 `dev/validation-report.md`에 별도로 정리했다. 실제 Kakao OAuth, Supabase RLS 차단, Storage signed URL은 실 프로젝트 환경변수와 운영진 계정 연결 후 추가 검증이 필요하다.
