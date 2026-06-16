# ParkBuddy Vercel Production Deployment Guide

작성일: 2026-06-16  
목적: ParkBuddy를 Vercel 운영 URL에서 모바일/데스크탑 실기기 테스트 및 운영 배포 기준으로 관리하기 위한 절차를 고정한다.

---

## 1. 현재 운영 배포 기준

현재 ParkBuddy 운영 배포는 GitHub Pages가 아니라 Vercel 기준으로 진행한다.

- 운영 도메인: `https://parkbuddy-five.vercel.app`
- GitHub 저장소: `joon7jihoo-ctrl/parkbuddy`
- 운영 배포 브랜치: `feature/operator-stability-and-round-safety`
- 최신 확인 커밋: `dc3b99c chore: trigger vercel production deployment`

Vercel Production 환경의 Branch Tracking은 다음 브랜치를 바라봐야 한다.

```text
feature/operator-stability-and-round-safety
```

이 설정이 맞으면, 앞으로 이 브랜치에 push되는 커밋은 Vercel Production 배포를 생성해야 한다.

---

## 2. GitHub Pages를 사용하지 않는 이유

ParkBuddy는 Next.js App Router 기반이며 동적 라우트, 인증, Middleware/Proxy, Supabase 연동 화면을 사용한다.

GitHub Pages는 정적 파일 호스팅이므로 다음 기능을 운영 수준으로 처리하기 어렵다.

- Middleware/Proxy
- 동적 서버 렌더링 라우트
- 인증 보호 흐름
- 서버 기반 라우팅/리다이렉트
- Next.js 서버 런타임이 필요한 화면

따라서 운영 배포는 Vercel을 기준으로 진행한다.

GitHub Pages 테스트 과정에서 만든 다음 파일은 운영 배포 기준에 포함하지 않는다.

```text
.github/workflows/deploy-github-pages.yml
next.config.ts
```

현재 프로젝트의 실제 Next 설정 파일은 `next.config.mjs` 기준으로 유지한다.

---

## 3. 일반 개발 후 배포 순서

소스코드 변경 후에는 아래 순서로 진행한다.

```powershell
cd C:\parkbuddy

npm run verify

git status

git add .

git commit -m "작업 내용에 맞는 커밋 메시지"

git push
```

정상이라면 `git push` 후 Vercel Deployments 화면에 새 Production 배포가 생성된다.

Vercel에서 확인할 위치:

```text
Vercel → parkbuddy → Deployments
```

정상 배포 기준:

```text
Status: Ready
Environment: Production
Source Branch: feature/operator-stability-and-round-safety
Commit: 방금 push한 커밋
```

---

## 4. 자동 배포 확인 절차

`git push` 후 Vercel에 새 배포가 보이지 않으면 다음 순서로 확인한다.

### 4.1 브랜치 확인

PowerShell:

```powershell
cd C:\parkbuddy

git branch --show-current

git log --oneline -3
```

현재 브랜치가 아래와 같아야 한다.

```text
feature/operator-stability-and-round-safety
```

### 4.2 Vercel Branch Tracking 확인

Vercel에서:

```text
Project Settings → Environments → Production → Branch Tracking
```

값이 아래와 같아야 한다.

```text
feature/operator-stability-and-round-safety
```

### 4.3 Deployment 상세 Source 확인

Vercel Deployments에서 최신 배포를 클릭하고 Source를 확인한다.

정상 예시:

```text
Source Branch: feature/operator-stability-and-round-safety
Source Commit: dc3b99c 또는 이후 최신 커밋
```

---

## 5. 수동 배포가 필요한 경우

원칙적으로 매번 수동 배포할 필요는 없다.

다만 다음 경우에는 수동 배포를 한 번 실행할 수 있다.

- Production Branch를 막 변경한 직후
- 기존 배포가 main 기준으로 남아 있는 경우
- Vercel Git 이벤트가 새 push를 감지하지 못한 경우
- 환경변수 변경 후 캐시 없는 재배포가 필요한 경우

수동 배포는 Vercel Deployments 화면 또는 Vercel CLI로 진행할 수 있다.

### 5.1 Vercel Dashboard 수동 배포

```text
Vercel → parkbuddy → Deployments → New Deployment 또는 Redeploy
```

브랜치는 반드시 다음으로 선택한다.

```text
feature/operator-stability-and-round-safety
```

가능하면 캐시 없이 재배포한다.

```text
Redeploy without Build Cache
```

### 5.2 Vercel CLI 수동 배포

Dashboard에서 수동 배포가 어렵다면 CLI를 사용할 수 있다.

```powershell
cd C:\parkbuddy

npm i -g vercel

vercel login

vercel link

vercel --prod
```

단, CLI 배포는 로컬 파일 기준이므로 실행 전 반드시 `git status`와 `npm run verify`를 확인한다.

---

## 6. Vercel 환경변수 기준

Vercel Production 환경에는 다음 값이 필요하다.

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

로컬 `.env.local`과 같은 Supabase 프로젝트를 바라보는지 확인한다.

로컬 확인:

```powershell
cd C:\parkbuddy
notepad .env.local
```

Vercel 확인:

```text
Project Settings → Environments → Production → Environment Variables
```

Vercel에는 다음 값이 없어야 한다.

```text
GITHUB_PAGES
```

`GITHUB_PAGES=true`는 GitHub Pages 정적 export 시도용 값이며, Vercel 운영 배포에는 사용하지 않는다.

---

## 7. Supabase Redirect URL 기준

Vercel 도메인에서 로그인을 테스트하려면 Supabase Authentication URL 설정에 운영 도메인을 등록한다.

Supabase Dashboard:

```text
Authentication → URL Configuration
```

필수 설정:

```text
Site URL:
https://parkbuddy-five.vercel.app

Redirect URLs:
https://parkbuddy-five.vercel.app/**
```

Preview 배포까지 테스트할 경우 선택적으로 다음도 추가할 수 있다.

```text
https://*.vercel.app/**
```

---

## 8. 배포 후 화면 확인 체크리스트

배포 완료 후 시크릿 창 또는 강력 새로고침으로 확인한다.

```text
Ctrl + F5
```

운영 URL:

```text
https://parkbuddy-five.vercel.app
```

확인 순서:

1. 로그인 가능 여부
2. 홈 화면이 localhost 최신 화면과 같은지 확인
3. 회원 목록 진입
4. 라운딩 관리 진입
5. 스코어 입력 화면 진입
6. 모바일 sticky 요약 영역 확인
7. 완료자 자동 접힘 확인
8. 완료자 펼침 후 입력창 외 선택 시 다시 접힘 확인
9. 미입력만 보기 필터 확인
10. 게시판 목록/상세 진입
11. 비밀글 권한 차단 확인

모바일/데스크탑 비교 캡처는 다음 폴더에 저장한다.

```text
D:\Development\Capture
```

---

## 9. 다음 개발 시 주의 사항

- Vercel 운영 URL에서 확인하기 전에는 반드시 로컬 `npm run verify`를 먼저 통과한다.
- 화면 수정은 모바일 Dense Layout 원칙을 우선한다.
- 터치 가능한 버튼/카드는 최소 44px 이상 터치 영역을 확보한다.
- 새 모션은 전체 화면을 출렁이게 하지 말고, 필요한 컴포넌트에만 작게 적용한다.
- 운영 배포에서 화면이 다르면 가장 먼저 Vercel Deployment의 Source Branch/Commit을 확인한다.
