# ParkBuddy Git 업로드 가이드

작성일: 2026-06-13
목적: 현재까지 작업한 ParkBuddy 프로젝트를 Git/GitHub에 안전하게 올리기 위한 절차

---

## 1. 현재 상황

최근 실행 결과에서 `C:\parkbuddy`는 Git 저장소가 아닌 것으로 확인됐다.

따라서 아래 순서로 진행한다.

1. `.gitignore` 확인/생성
2. Git 저장소 초기화
3. 민감 정보 제외 확인
4. 첫 커밋 생성
5. GitHub 원격 저장소 생성
6. 원격 저장소 연결
7. Push
8. GitHub에서 파일 확인

---

## 2. 먼저 확인할 것

PowerShell에서 프로젝트 폴더로 이동한다.

```powershell
cd C:\parkbuddy
```

현재 파일 위치 확인:

```powershell
dir
```

아래 파일/폴더가 보여야 한다.

```txt
package.json
src
supabase
dev
```

---

## 3. Git 설치 확인

```powershell
git --version
```

버전이 나오면 설치되어 있는 것이다.

예:

```txt
git version 2.xx.x
```

설치되어 있지 않다면 Git for Windows를 설치한 뒤 PowerShell을 다시 열어야 한다.

---

## 4. .gitignore 생성 또는 보강

가장 중요한 것은 비밀 정보가 GitHub에 올라가지 않게 하는 것이다.

PowerShell에서 아래 명령으로 `.gitignore`를 열어본다.

```powershell
notepad .gitignore
```

파일이 없으면 새로 만들라는 창이 뜰 수 있다. 아래 항목들이 포함되어 있는지 확인한다.

```gitignore
node_modules
.next
out
dist
build

.env
.env.local
.env.development.local
.env.test.local
.env.production.local

*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

.DS_Store
Thumbs.db

dev/*.bak
```

저장 후 닫는다.

중요:
- `.env.local`은 절대 GitHub에 올리면 안 된다.
- Supabase URL 자체보다 더 중요한 것은 service role key, anon key 등 키 값이다.
- 이미 실수로 올렸다면 Supabase에서 키를 재발급해야 한다.

---

## 5. Git 저장소 초기화

```powershell
git init
```

정상이라면 `.git` 폴더가 생긴다.

확인:

```powershell
git status
```

---

## 6. Git 사용자 정보 설정

처음 사용하는 PC라면 아래 설정이 필요할 수 있다.

```powershell
git config --global user.name "사용자이름"
git config --global user.email "이메일@example.com"
```

예:

```powershell
git config --global user.name "Y-Family"
git config --global user.email "your-email@example.com"
```

---

## 7. 커밋 전 민감 정보 확인

아래 명령으로 Git이 추적할 파일 목록을 먼저 확인한다.

```powershell
git status --short
```

절대 올라가면 안 되는 항목:

```txt
.env
.env.local
node_modules
.next
```

혹시 보이면 `.gitignore`를 수정한 뒤 다시 확인한다.

---

## 8. 파일 추가

```powershell
git add .
```

추가 후 다시 확인:

```powershell
git status --short
```

여기서 `.env.local`, `node_modules`, `.next`가 보이면 중단하고 `.gitignore`를 다시 수정해야 한다.

---

## 9. 첫 커밋 생성

```powershell
git commit -m "Initial ParkBuddy admin and round management features"
```

한글 커밋 메시지를 원하면 아래처럼 해도 된다.

```powershell
git commit -m "ParkBuddy 운영자 및 라운드 관리 기능 초기 정리"
```

---

## 10. GitHub 원격 저장소 만들기

GitHub 웹사이트에서 새 저장소를 만든다.

추천 설정:

```txt
Repository name: parkbuddy
Visibility: Private
README: 생성하지 않음
.gitignore: 생성하지 않음
License: 선택하지 않음
```

이미 로컬에 파일이 있으므로 GitHub에서 README를 만들지 않는 것이 충돌을 줄인다.

---

## 11. 원격 저장소 연결

GitHub가 안내하는 주소를 복사한다.

HTTPS 예:

```txt
https://github.com/사용자명/parkbuddy.git
```

PowerShell에서 실행:

```powershell
git remote add origin https://github.com/사용자명/parkbuddy.git
```

연결 확인:

```powershell
git remote -v
```

---

## 12. 브랜치 이름 main으로 변경

```powershell
git branch -M main
```

---

## 13. GitHub에 Push

```powershell
git push -u origin main
```

로그인 창이 뜨면 GitHub 계정으로 로그인한다.

---

## 14. Push 후 확인

GitHub 저장소 페이지를 열어 아래 폴더가 올라갔는지 확인한다.

```txt
src
supabase
dev
package.json
```

올라가면 안 되는 것:

```txt
.env
.env.local
node_modules
.next
```

---

## 15. 다음부터 작업할 때 기본 흐름

새 작업 전:

```powershell
cd C:\parkbuddy
git status
npm run verify
```

작업 후:

```powershell
npm run verify
git status
git add .
git commit -m "작업 내용 요약"
git push
```

예:

```powershell
git commit -m "라운드 복제 날짜 시간 처리 개선"
```

---

## 16. 문제가 생겼을 때 복구 기본 명령

현재 변경사항 확인:

```powershell
git status
```

특정 파일의 변경 내용 확인:

```powershell
git diff -- "src/app/(app)/admin/page.tsx"
```

마지막 커밋 상태로 특정 파일 되돌리기:

```powershell
git restore -- "src/app/(app)/admin/page.tsx"
```

아직 커밋하지 않은 전체 변경 취소는 매우 위험하므로 신중히 사용한다.

```powershell
git restore .
```

---

## 17. 이번에 꼭 커밋해야 하는 이유

현재 ParkBuddy에는 아래 기능들이 많이 쌓였다.

- 인증
- 회원 연결
- 운영자 회원 관리
- 라운드 관리
- 라운드 복제
- 참가자 선택
- 조 편성
- 스코어 입력
- 결과 보기
- 인쇄용 결과표
- 관리자 로그
- 월별 일정
- 상태별 보기
- 개발 보고서

이 시점에 GitHub에 올려두면 이후 문제가 생겨도 안정적으로 이전 상태로 되돌릴 수 있다.

---

## 18. 추천 커밋 메시지

첫 커밋 추천:

```powershell
git commit -m "ParkBuddy 운영자 기능과 라운드 관리 기능 정리"
```

영문 추천:

```powershell
git commit -m "Add ParkBuddy admin, round, scoring, and reporting features"
```

---

## 19. 다음 개발 전 최종 체크

GitHub에 Push한 뒤 다음을 확인한다.

- GitHub에 코드가 정상 업로드됨
- `.env.local`이 올라가지 않음
- `npm run verify` 통과
- `/admin` 대시보드 확인
- `/admin/rounds` 라운드 관리 확인
- Supabase 최신 SQL 반영 여부 확인

이 확인이 끝난 뒤 다음 개발을 시작한다.
