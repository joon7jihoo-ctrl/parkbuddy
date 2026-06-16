# ParkBuddy 운영자용 개발 현황 및 점검 문서

작성일: 2026-06-13  
정리 기준: 첨부된 `dev.zip` 내 개발 보고서 108개와 현재 Git 상태  
현재 안정 기준 브랜치: `main`  
현재 안정 기준 커밋: `b25a36d Merge results UX improvements`

---

## 1. 문서 목적

이 문서는 지금까지 ParkBuddy에 구현된 운영자 기능, 검증 상태, 주의해야 할 이슈, 다음 개발 흐름을 한 파일로 정리하기 위한 기준 문서다.

앞으로 `dev` 폴더는 이 문서를 중심으로 관리한다. 작은 작업 보고서가 계속 누적되면 흐름을 파악하기 어려우므로, 세부 작업 보고서는 필요 시 외부 백업으로 보관하고 이 문서만 최신 상태로 갱신하는 방식을 권장한다.

---

## 2. dev.zip 점검 결과

첨부된 `dev.zip`에는 총 108개의 개발/점검 문서가 들어 있었다.

확인된 특징은 다음과 같다.

- 회원 관리, 관리자 로그, 라운드 관리, 참가자 선택, 조 편성, 스코어 입력, 결과 화면, 인쇄 화면 관련 보고서가 단계별로 누적되어 있다.
- 동일 기능의 수정/복구/재시도 보고서가 많아져 전체 흐름을 한눈에 보기 어려운 상태다.
- 일부 문서는 인코딩 문제로 한글이 깨진 상태였으나, Git 로그와 주변 보고서의 맥락으로 핵심 내용은 확인 가능했다.
- 최종 안정 상태는 `feature/results-ux-improvements` 브랜치의 결과 UX 개선 작업이 `main`에 병합되고 `origin/main`에 push된 상태다.

따라서 앞으로는 `dev` 폴더에 날짜별 조각 문서를 계속 쌓기보다, 이 문서를 최신 운영 현황 문서로 유지하는 방식이 적합하다.

---

## 3. 현재 개발 운영 원칙

### 3.1 대화/작업 방식

- 코드와 스크립트 본문은 대화창에 길게 펼치지 않는다.
- 변경 작업은 가능한 `.ps1` 실행 파일 하나로 제공한다.
- 실행 전에는 무엇을 바꾸는지, 어떤 파일이 영향을 받는지, 어떻게 검증할지 먼저 정리한다.
- 사용자가 초보자임을 기준으로 실행 순서와 확인 항목을 짧고 명확하게 안내한다.
- 큰 기능은 작은 단계로 나누고, 각 단계마다 `npm run verify`를 통과한 뒤 진행한다.

### 3.2 코드 변경 원칙

- 앱 코드를 변경하기 전에는 현재 브랜치와 Git 상태를 먼저 확인한다.
- Supabase 컬럼명, 함수명, RPC 인자 수는 추측하지 않는다.
- 실제 스키마 또는 점검 CSV를 기준으로 작업한다.
- 대시보드처럼 이미 복구 이력이 있는 화면은 전체 덮어쓰기보다 작은 패치로만 수정한다.
- `.dev-temp` 같은 임시 폴더는 반드시 검증 전에 제거한다.
- 앱 코드 변경 후에는 `npm run verify`가 통과해야 한다.

### 3.3 PowerShell 스크립트 원칙

과거 PowerShell 문자열 파싱 오류와 인코딩 문제가 반복되었으므로, 다음 원칙을 유지한다.

- 긴 TSX/SQL/한글 문자열을 PowerShell에 직접 넣지 않는다.
- 보고서 본문은 가능하면 Base64로 넣고 UTF-8로 복원한다.
- 복잡한 파일 수정은 임시 Node 스크립트를 사용하되, 실행 후 임시 파일을 삭제한다.
- `.dev-temp` 폴더를 프로젝트 안에 남기지 않는다.
- 콘솔 출력은 단순한 ASCII 중심으로 유지한다.

---

## 4. 현재 안정 지점

현재 결과 UX 개선 브랜치는 `main`에 병합되었다.

최신 확인 상태:

```text
main
b25a36d (HEAD -> main, origin/main) Merge results UX improvements
```

최근 주요 커밋:

```text
b25a36d Merge results UX improvements
6b33501 Add results UX final check reports
d18e5d9 Improve printable round result readability
e292aaf Improve result ranking readability
4bc7679 Improve results missing score guidance
99ae7b8 Improve round results summary cards
```

이 상태는 다음 개발을 시작하기 좋은 안정 지점이다.

---

## 5. 완료된 주요 기능

### 5.1 인증 및 회원 연결

- Kakao OAuth 기반 로그인 흐름
- Supabase Auth 연동
- 로그인 후 미연결 사용자의 회원 연결 흐름
- claim code 기반 회원 연결
- 운영자 권한 확인 흐름
- 첫 운영자/회원 연결 관련 수동 Supabase 처리 가이드 정리

### 5.2 운영자 회원 관리

- 회원 목록
- 회원 검색
- 회원 신규 등록
- claim code 재발급
- claim code 복사 버튼
- 회원 정보 수정
- 회원 비활성화
- 회원 복원
- 회원 관련 관리자 작업 로그 기록

### 5.3 관리자 작업 로그

- 관리자 작업 로그 테이블/RPC 연동
- 회원 생성/수정/비활성화/복원 기록
- 라운드 생성/참가자/조 편성/스코어/상태 변경 기록
- 작업 로그 페이지
- 작업 로그 한글 표시
- 대시보드 최근 관리자 작업 로그 한글 표시

### 5.4 운영자 대시보드

- 관리자 홈 화면
- 회원/라운드 주요 이동 카드
- 최근 관리자 작업 로그
- 운영 체크 포인트
- 월별 라운드 보기 이동
- 상태별 라운드 보기 이동

주의: 대시보드는 과거 UI 복구 이력이 있으므로 다음 수정 전 화면 캡처를 먼저 남긴다.

### 5.5 라운드 기본 관리

- 라운드 목록
- 라운드 생성
- 라운드 수정
- 라운드 상태 관리
  - 예정
  - 완료
  - 취소
- 라운드 복제
- 라운드 월별 일정 페이지
- 라운드 상태별 보기 페이지
- 라운드 목록에서 주요 작업 버튼 제공
  - 참가자 선택
  - 조 편성
  - 스코어 입력
  - 결과 보기
  - 수정
  - 복제

### 5.6 라운드 참가자 관리

- 라운드별 참가자 선택
- 선택 인원 수 표시
- 선택 저장 후 조 편성 화면으로 이동
- 회원 수 증가를 고려한 참가자 검색 UX 개선
- 검색/필터 관련 React Hook 및 lint 안정화
- 참가자 저장 후 조 편성 인원 수 불일치 문제 수정

### 5.7 조 편성

- 경기 방식 문서 기준 조 편성 흐름
- 경기 형태 선택
  - 개인전
  - 포섬
  - 포볼
  - 스크램블
  - 청백전
- 점수 계산 방식 선택
  - 스트로크
  - 신페리오
  - 매치 플레이
  - 스테이블포드
- 경기 형태별 가능한 점수 계산 방식 제한
- 참가 인원에 따른 권장 경기 방식 기본값 적용
- 3~4인 조 편성 기준
- 5명 참가 시 조 편성 불가 안내
- 조 편성 저장 시 assignments JSON 처리
- 조 편성 저장 후 스코어 입력 화면으로 이동
- 라운드 목록에서 경기 형태/점수 계산 방식 표시

### 5.8 스코어 입력

- 라운드별 스코어 입력
- 총 타수 입력
- 스테이블포드 포인트 입력
- 메모 입력
- 스코어 저장 후 결과 화면으로 이동
- 미입력자 보완을 위한 결과 화면 CTA 추가

### 5.9 결과 화면

- 결과 보기 화면
- 결과 순위 표시
- 핸디캡 보정 순위 표시
- 결과 요약 카드 개선
- 입력 완료/미입력 인원 요약
- 미입력 스코어 안내 박스
- “스코어 입력하러 가기” 버튼
- 미입력 회원 순위 표시를 “미입력”으로 정리
- 미입력 회원 점수 표시를 “스코어 미입력”으로 정리
- “스코어 미입력 회원은 순위에서 제외됩니다” 안내
- 결과 링크 복사 버튼

### 5.10 인쇄용 결과표

- 결과표 인쇄용 페이지
- 인쇄 페이지에서 하단 앱 네비게이션 숨김
- 인쇄용 결과표의 순위/미입력 표시 기준을 결과 화면과 통일
- 입력 완료/미입력 인원 요약 표시
- Ctrl + P 인쇄 흐름 고려

---

## 6. Supabase 및 DB 관련 확인된 사실

스키마 점검 CSV와 오류 수정 기록 기준으로 확인된 주요 사항은 다음과 같다.

- `members.user_id` 컬럼은 존재한다.
- `members.auth_user_id` 컬럼은 사용하지 않는다.
- `rounds.deleted_at` 컬럼은 존재하지 않는다.
- `admin_action_logs`에는 `target_member_id`가 있다.
- `admin_action_logs`에는 `target_round_id`가 없었다.
- `admin_log_action` 함수는 실제 함수 시그니처에 맞춰 호출해야 한다.
- 라운드 복제 RPC는 실제 스키마 기준으로 작성해야 한다.

Supabase SQL Editor 실행이 필요한 기능은 로컬 코드 수정만으로 완료되지 않는다. SQL/RPC 변경이 있는 작업은 반드시 Supabase 적용 여부를 별도로 확인한다.

---

## 7. 최근 해결한 주요 이슈

### 7.1 PowerShell 파싱 오류

긴 문자열, 한글, TSX 코드가 PowerShell 안에서 깨지며 여러 번 오류가 발생했다.

현재 기준:

- 긴 본문은 Base64로 넣는다.
- 임시 파일은 실행 후 삭제한다.
- 검증 전 `.dev-temp`를 정리한다.

### 7.2 `.dev-temp` lint 오류

임시 Node 파일이 `.dev-temp`에 남아 `eslint .`에 걸린 적이 있었다.

현재 기준:

- 검증 전 `.dev-temp`를 삭제한다.
- 임시 실행 파일은 가능하면 프로젝트 밖 또는 실행 후 삭제되는 경로를 사용한다.

### 7.3 대시보드 UI 복구 이슈

대시보드 한글화 중 전체 UI가 의도보다 많이 바뀐 적이 있었다.

현재 기준:

- 대시보드 수정 전 스크린샷 저장
- 전체 파일 교체보다 작은 패치 적용
- 변경 후 `/admin` 화면 직접 확인

### 7.4 라운드 복제 이슈

실제 스키마와 다른 컬럼/함수명을 참조하면서 오류가 발생했다.

해결 방향:

- `rounds.deleted_at` 참조 제거
- `members.user_id` 기준 사용
- `admin_log_action` 실제 시그니처 기준 호출
- 복제 시 날짜/시간 기본값 보정

### 7.5 조 편성 저장 이슈

조 편성 폼이 hidden `assignments` JSON을 보내는데 저장 액션이 `memberId` 목록을 기대해 참가자가 0명으로 처리되는 문제가 있었다.

해결 방향:

- 저장 액션에서 `assignments` JSON을 파싱하도록 수정
- 조 편성 저장 후 스코어 입력 화면으로 이동

### 7.6 경기 방식/점수 방식 값 불일치

`match_play`와 `match` 등 값이 혼재해 라운드 목록 표시가 “미지정”으로 보이는 문제가 있었다.

현재 기준:

- 경기 형태: `individual`, `foursome`, `fourball`, `scramble`, `team_match`
- 점수 방식: `stroke`, `new_peoria`, `match`, `stableford`

---

## 8. 검증 기준

다음 명령은 주요 작업 후 반드시 통과해야 한다.

```powershell
npm run verify
```

`npm run verify` 구성:

```text
npm run security:scan
npm run lint
npm run typecheck
```

최근 결과 UX 병합 과정에서는 feature 브랜치와 main 브랜치에서 검증이 통과한 뒤 main push까지 완료되었다.

---

## 9. 수동 화면 점검 체크리스트

다음 개발 전 또는 큰 병합 후에는 아래 흐름을 직접 확인한다.

```text
라운드 목록 → 참가자 선택 → 조 편성 → 스코어 입력 → 결과 보기 → 인쇄용 결과표
```

세부 확인:

- `/admin` 대시보드가 정상 표시되는가
- `/admin/logs` 작업 로그가 정상 표시되는가
- `/admin/rounds` 라운드 목록이 정상 표시되는가
- 라운드 생성이 정상 동작하는가
- 라운드 수정이 정상 동작하는가
- 라운드 복제가 정상 동작하는가
- 참가자 선택 저장 후 조 편성 화면으로 이동하는가
- 조 편성 저장 후 스코어 입력 화면으로 이동하는가
- 스코어 저장 후 결과 화면으로 이동하는가
- 결과 화면에서 미입력 안내와 순위 표시가 정상인가
- 인쇄용 결과표에서 미입력/순위 표시가 결과 화면과 일치하는가

---

## 10. 다음 개발 흐름 제안

### 10.1 1순위: 현재 main 안정성 최종 확인

목표:

- main 기준 앱 실행
- 주요 운영자 흐름 수동 확인
- Git 상태 확인

권장 명령:

```powershell
cd C:\parkbuddy
git status
git branch --show-current
npm run verify
npm run dev
```

### 10.2 2순위: 운영자 화면 안정화

목표:

- 운영자가 실제로 쓰는 화면의 흐름을 더 안정적으로 정리한다.

후보 작업:

- 대시보드 문구/카드 최종 정리
- 라운드 목록 버튼 배치 점검
- 로그 화면 한글 문구 점검
- 모바일 화면 간격 점검

주의:

- 대시보드는 전체 덮어쓰기 금지
- 변경 전 스크린샷 저장

### 10.3 3순위: 라운드 삭제/복구 관리 기능

목표:

- 잘못 만든 라운드를 안전하게 관리한다.

권장 방향:

- 실제 삭제보다 상태 기반 취소/숨김 우선
- 복구 가능한 구조 우선
- 삭제/복구는 관리자 작업 로그에 기록
- Supabase 스키마 변경 필요 여부를 먼저 점검

### 10.4 4순위: 스코어 입력 UX 세부 개선

목표:

- 현장 모바일 입력 편의성을 높인다.

후보 작업:

- 입력 완료자 강조
- 미입력자만 보기
- 저장 전 누락 확인
- 결과 화면에서 미입력자 바로 이동
- 모바일 숫자 입력 편의성 개선

### 10.5 5순위: 홀별 스코어 입력 기반 설계

목표:

- 신페리오, 매치 플레이, 스테이블포드 자동 계산을 위한 기반을 만든다.

권장 순서:

1. 홀별 스코어 데이터 구조 설계
2. Supabase 테이블/RPC 설계
3. 18홀 입력 UI 설계
4. 스트로크 합산 자동 계산
5. 스테이블포드 자동 계산
6. 매치 플레이 승점 계산
7. 신페리오 숨김홀 계산

주의:

- 이 단계는 DB 변경이 크므로 바로 구현하지 말고 설계 문서부터 작성한다.

### 10.6 6순위: 배포 전 운영 안정화

목표:

- 실제 동호회 운영에 올리기 전 위험을 줄인다.

후보 작업:

- Supabase RLS 실환경 테스트
- Kakao OAuth Redirect URL 점검
- Vercel 환경변수 점검
- GitHub Actions 또는 배포 전 검증 자동화
- 개인정보 처리/비활성 회원 정책 정리

---

## 11. 다음 작업 시작 전 공통 체크리스트

모든 새 작업은 아래 순서로 시작한다.

```text
1. git status 확인
2. 현재 브랜치 확인
3. main 기준 최신 상태 확인
4. 새 feature 브랜치 생성
5. 변경 대상 파일 최소화
6. 앱 코드 변경
7. npm run verify
8. 화면 수동 확인
9. dev 문서 갱신
10. commit/push
11. 필요 시 main 병합
```

권장 브랜치 예시:

```text
feature/admin-ui-stabilization
feature/round-delete-restore
feature/score-input-ux
feature/hole-score-design
```

---

## 12. dev 폴더 정리 기준

현재처럼 날짜별 조각 보고서가 계속 쌓이면 다음 개발자가 흐름을 읽기 어렵다.

앞으로는 다음 방식으로 관리한다.

- `dev/PARKBUDDY_OPERATOR_DEV_STATUS.md`를 유일한 최신 운영 개발 문서로 둔다.
- 과거 `dev/*.md` 조각 보고서는 외부 백업 ZIP으로 보관한다.
- 새 작업이 끝나면 별도 보고서를 계속 만들기보다 이 문서의 “최근 변경 이력”과 “다음 개발 흐름”을 갱신한다.
- 큰 기능 단위가 끝났을 때만 별도 상세 설계 문서를 만든다.

권장 백업 위치:

```text
C:\parkbuddy_dev_archive
```

이 위치는 프로젝트 밖이므로 앱 코드와 Git 작업에 영향을 주지 않는다.

---

## 13. 다음 작업에서 피해야 할 것

- Supabase 컬럼명 추측
- 대시보드 전체 덮어쓰기
- 긴 한글/TSX/SQL 문자열을 PowerShell에 직접 삽입
- `.dev-temp`를 남긴 채 `npm run verify` 실행
- 검증 실패 상태에서 다음 기능 진행
- Git에 `.env.local` 또는 비밀키 커밋
- 결과 화면/스코어 화면 흐름을 한 번에 크게 변경

---

## 14. 최근 변경 이력 요약

- 참가자 선택 검색 UX 안정화
- 참가자 저장 후 조 편성 이동 흐름 안정화
- 조 편성 저장 assignments JSON 처리 수정
- 경기 형태/점수 방식 저장값 정리
- 조 편성 저장 후 스코어 입력 이동
- 스코어 저장 후 결과 화면 이동
- 결과 화면 요약 카드 개선
- 미입력 스코어 안내 CTA 추가
- 결과 화면 순위/미입력 표시 개선
- 인쇄용 결과표 순위/미입력 표시 개선
- 결과 UX 개선 브랜치 main 병합 및 GitHub push 완료

---

## 15. 현재 결론

ParkBuddy는 현재 운영자 중심의 핵심 흐름이 꽤 많이 연결된 상태다.

현재 안정 기준은 `main` 브랜치의 `b25a36d Merge results UX improvements` 커밋이다. 다음 개발은 새 기능을 바로 추가하기보다, main 기준 앱 실행과 수동 화면 확인을 먼저 수행한 뒤 작은 feature 브랜치로 진행하는 것이 가장 안전하다.

특히 다음 큰 갈림길은 두 가지다.

1. 운영자 화면 안정화와 라운드 삭제/복구 같은 운영 편의 기능
2. 홀별 스코어 입력 기반의 경기 계산 고도화

초기 운영 안정성을 생각하면 1번을 먼저 진행하고, 이후 별도 설계 문서를 만든 뒤 2번으로 넘어가는 흐름을 권장한다.

---

## 다음 개발 설계: 라운드 삭제/복구 안전 관리

### 목적

운영자가 잘못 만든 라운드나 더 이상 사용하지 않는 라운드를 관리할 수 있도록 한다. 단, 참가자, 조 편성, 스코어, 결과 데이터가 함께 연결되어 있으므로 실제 DB 삭제는 하지 않고 복구 가능한 방식으로 처리한다.

### 기본 원칙

- 라운드는 실제 삭제하지 않는다.
- `rounds.deleted_at` 컬럼을 추가해 soft delete 방식으로 처리한다.
- 삭제 시 `deleted_at`에 현재 시간을 기록한다.
- 복구 시 `deleted_at`을 `null`로 되돌린다.
- 기본 라운드 목록에서는 삭제된 라운드를 숨긴다.
- 삭제된 라운드는 별도 필터 또는 관리 화면에서만 확인한다.
- 삭제/복구 작업은 운영자 로그에 남긴다.
- 참가자, 조 편성, 스코어, 결과 데이터는 삭제하지 않는다.

### 예상 DB 변경

- `rounds.deleted_at timestamptz null` 컬럼 추가
- 라운드 목록 조회 시 기본 조건에 `deleted_at is null` 적용
- 삭제된 라운드 조회용 필터 또는 별도 화면에서 `deleted_at is not null` 조회

### 예상 UI 변경

- 라운드 목록에 삭제 버튼 추가
- 삭제 전 확인 단계 추가
- 삭제된 라운드 보기 필터 추가
- 삭제된 라운드에는 복구 버튼 표시
- 삭제된 라운드는 일반 운영 흐름에서 참가자 선택, 조 편성, 스코어 입력, 결과 보기로 쉽게 진입하지 않도록 제한

### 운영 로그

라운드 삭제/복구 시 다음 내용을 기록한다.

- 작업자
- 작업 종류: 라운드 삭제 또는 라운드 복구
- 대상 라운드
- 작업 시간
- 주요 메모

### 구현 순서

1. Supabase 현재 스키마 확인
2. `rounds.deleted_at` 컬럼 추가 SQL 작성
3. 라운드 목록 조회 조건 정리
4. 삭제/복구 서버 액션 추가
5. 라운드 목록 UI에 삭제/복구 버튼 추가
6. 삭제 전 확인 UI 추가
7. 운영 로그 기록 연결
8. `npm run verify` 실행
9. 실제 화면에서 라운드 삭제/복구 수동 테스트
10. dev 문서 갱신 후 커밋/push

### 주의사항

- 이 기능은 운영 데이터 보호가 핵심이므로 실제 delete 쿼리는 사용하지 않는다.
- 삭제된 라운드의 참가자, 조 편성, 스코어 데이터는 그대로 보존한다.
- 결과 화면이나 인쇄용 결과표는 삭제된 라운드 접근 정책을 별도로 확인한 뒤 제한 여부를 결정한다.
- Supabase RLS나 RPC 함수가 이미 라운드 목록 조회에 영향을 주고 있을 수 있으므로, 코드 변경 전 현재 조회 구조를 먼저 확인한다.

### 다음 실제 개발 단계

다음 단계에서는 앱 코드를 바로 수정하지 않고 먼저 Supabase 기준으로 현재 `rounds` 테이블과 관련 함수 상태를 점검한다. 점검 후 `deleted_at` 컬럼 추가 여부와 라운드 목록 조회 수정 범위를 확정한다.
---

## 라운드 삭제/복구 앱 적용 범위 점검

### 현재 기준

- 브랜치: feature/operator-stability-and-round-safety
- 기준 커밋: 4b9d219
- 목적: Supabase soft-delete SQL 파일을 저장하고, 앱 코드 수정 전 영향 범위를 확인한다.
- 앱 코드 변경 여부: 없음

### Supabase SQL 파일 보관 상태

- OK: supabase/parkbuddy_add_round_soft_delete_schema.sql
- OK: supabase/parkbuddy_round_soft_delete_schema_check.sql
- OK: supabase/parkbuddy_verify_round_soft_delete_schema.sql

### 앱 적용 후보 파일

- OK: src/app/(app)/admin/rounds/page.tsx
- OK: src/app/(app)/admin/rounds/actions.ts
- OK: src/app/(app)/admin/rounds/[id]/participants/page.tsx
- OK: src/app/(app)/admin/rounds/[id]/pairings/page.tsx
- OK: src/app/(app)/admin/rounds/[id]/scores/page.tsx
- OK: src/app/(app)/admin/rounds/[id]/results/page.tsx
- OK: src/app/(app)/admin/rounds/[id]/results/print/page.tsx

### 다음 구현 순서

1. 라운드 목록 조회에서 기본적으로 삭제된 라운드를 숨긴다.
2. 삭제된 라운드를 확인할 수 있는 필터 또는 별도 화면을 정한다.
3. 운영자 액션에서 admin_soft_delete_round, admin_restore_round RPC를 호출한다.
4. 삭제/복구 버튼에는 확인 단계를 둔다.
5. 참가자, 조 편성, 스코어, 결과 데이터는 삭제하지 않는다.
6. 구현 후 npm run verify와 실제 화면 테스트를 통과한 뒤 커밋한다.

---

## 라운드 삭제/복구 서버 액션 추가 기록

### 작업 목적

라운드 삭제/복구 UI를 붙이기 전에 서버 액션을 먼저 추가했다. 실제 삭제가 아니라 Supabase RPC 기반 soft delete/restore 흐름을 사용한다.

### 변경 파일

- src/app/(app)/admin/rounds/actions.ts

### 추가된 서버 액션

- adminSoftDeleteRoundAction(formData)
- adminRestoreRoundAction(formData)

### 동작 방식

- formData에서 roundId를 읽는다.
- 삭제 시 admin_soft_delete_round RPC를 호출한다.
- 복구 시 admin_restore_round RPC를 호출한다.
- 처리 후 /admin/rounds 경로를 revalidate한다.

### 다음 단계

1. 라운드 목록 UI에서 삭제/복구 진입 버튼을 추가한다.
2. 삭제 전 확인 화면 또는 확인 버튼을 둔다.
3. 삭제된 라운드 보기 필터를 추가한다.
4. 화면 테스트와 npm run verify 통과 후 커밋한다.

---

## 라운드 삭제/복구 UI 1단계

- 브랜치: feature/operator-stability-and-round-safety
- 목적: 라운드 목록에서 삭제되지 않은 라운드만 기본 표시하고, soft-delete 서버 액션으로 연결되는 삭제 진입 UI를 추가한다.
- 변경 범위: src/app/(app)/admin/rounds/page.tsx
- 서버 액션: adminSoftDeleteRoundAction
- 삭제 방식: 실제 삭제가 아니라 Supabase RPC admin_soft_delete_round 호출 기반 soft delete
- 다음 단계: 삭제된 라운드 보기와 복구 버튼을 별도 UI로 추가한다.

---

## 라운드 삭제/복구 UI 2단계: 삭제된 라운드 복구 화면

### 적용 내용

- 삭제된 라운드만 확인할 수 있는 `/admin/rounds/deleted` 화면을 추가했다.
- 기존 라운드 목록에서 삭제된 라운드 보기 화면으로 이동할 수 있는 진입 버튼을 추가했다.
- 삭제된 라운드 화면은 `deleted_at is not null` 기준으로 조회한다.
- 복구 버튼은 `adminRestoreRoundAction` 서버 액션을 사용한다.
- 앱 데이터 보호 원칙에 따라 참가자, 조 편성, 스코어, 결과 데이터는 삭제하지 않는다.

### 다음 단계

1. 브라우저에서 `/admin/rounds` 접속 후 삭제된 라운드 보기 버튼을 확인한다.
2. 삭제된 라운드 화면에서 복구 버튼 노출을 확인한다.
3. 실제 라운드 삭제/복구 수동 테스트를 진행한다.
4. 문제가 없으면 라운드 삭제/복구 흐름을 main에 병합한다.

---

## 라운드 삭제/복구 복구 화면 import 수정 기록

- 작업 브랜치: feature/operator-stability-and-round-safety
- 대상 화면: /admin/rounds/deleted
- 수정 내용: 삭제된 라운드 복구 화면의 server action import 경로를 ../actions로 정리했다.
- 이유: deleted/page.tsx는 rounds/deleted 하위 경로이므로 같은 폴더의 ./actions가 아니라 상위 rounds/actions.ts를 참조해야 한다.
- 검증 기준: npm run verify 통과 후 커밋/push한다.

---

## 라운드 삭제/복구 복구 화면 import 보정

- 기록 키: round-restore-page-missing-actions-import-fix-v4
- 대상 브랜치: feature/operator-stability-and-round-safety
- 내용: 삭제된 라운드 복구 화면이 한 단계 깊은 경로에 있으므로 액션 import를 ../actions 기준으로 보정했다.
- 포함 액션: updateRoundStatusAction, duplicateRoundAction, adminRestoreRoundAction
- 목적: typecheck 오류를 제거하고 이전 복구 화면 추가 작업을 이어서 마무리한다.
- 앱 동작 확인 기준: npm run verify 통과 후 삭제된 라운드 화면에서 복구 버튼을 확인한다.

---

## 라운드 삭제 UI 운영자 화면 정리

### 작업 내용

- 라운드 목록 하단에 라운드 ID만 나열되던 임시 삭제 관리 UI를 제거했다.
- 삭제 기능은 각 라운드 카드 안에서 확인 단계를 거친 뒤 실행하도록 정리했다.
- 삭제는 실제 삭제가 아니라 Supabase RPC `admin_soft_delete_round`를 호출하는 soft delete 방식이다.
- 삭제된 라운드는 `/admin/rounds/deleted` 화면에서 복구할 수 있다.

### 확인 결과

- 임시 삭제 관리 섹션 제거: 완료
- 라운드 카드 내부 삭제 UI 배치: 이미 있음 또는 수동 확인 필요
- `npm run verify`를 통과한 뒤 커밋한다.


---

## 라운드 삭제 UI 운영자 화면 정리 v2

- 하단에 별도로 노출되던 라운드 ID 나열형 삭제 박스를 제거했다.
- 삭제 기능은 각 라운드 카드 내부의 접이식 확인 UI로 이동하는 방향으로 정리했다.
- 삭제는 실제 삭제가 아니라 adminSoftDeleteRoundAction을 통한 soft delete 흐름을 유지한다.
- 화면 확인 기준: /admin/rounds에서 하단 빨간 안전 관리 박스가 사라지고, 각 라운드 카드 안에 라운드 삭제 접이식 항목이 보여야 한다.
---

## 라운드 삭제 UI 중복 import 및 안전 관리 박스 정리

- 라운드 목록 화면에서 adminSoftDeleteRoundAction import가 중복되어 typecheck가 실패한 문제를 수정했다.
- 하단에 라운드 ID만 나열되던 라운드 안전 관리 박스를 제거 대상으로 정리했다.
- 삭제 UI는 각 라운드 카드 안에서 확인 후 삭제 확정 버튼을 누르는 흐름으로 유지한다.
- 삭제는 실제 삭제가 아니라 Supabase RPC 기반 soft delete로 처리한다.
- 화면 확인 기준: 하단 빨간 안전 관리 박스 제거, 카드 내부 라운드 삭제 항목 표시, 삭제 후 기본 목록에서 숨김, 삭제된 라운드 화면에서 복구 가능 여부 확인.

---

## 라운드 삭제 UI 정리

- 하단 라운드 ID 나열형 삭제 영역을 제거했다.
- 라운드 삭제는 각 라운드 카드 안의 접이식 확인 UI에서만 진행하도록 정리했다.
- 삭제는 soft delete 서버 액션을 사용하며 실제 라운드 데이터는 삭제하지 않는다.
- 화면 확인 기준: 라운드 목록 하단에 빨간 라운드 안전 관리 박스가 없어야 한다.

---

## 라운드 삭제 UI 정리 추가 기록

- 작업 시각: 2026-06-13T14:25:12.290Z
- 작업 브랜치: feature/operator-stability-and-round-safety
- 내용: 라운드 목록 하단에 남아 있던 라운드 ID 나열형 삭제 UI를 제거했다.
- 유지: 각 라운드 카드 내부의 라운드 삭제 접이식 UI는 유지했다.
- 확인 기준: /admin/rounds 화면 하단에 라운드 ID와 삭제 버튼만 반복되는 영역이 없어야 한다.


## 라운드 운영 상세 화면 레이아웃 개선 기록

- 작업명: Polish round operation detail screens
- 목적: 라운드 운영 상세 화면에도 모바일 우선 카드/그리드 레이아웃을 일관 적용한다.
- 대상: 참가자 선택, 조 편성, 스코어 입력, 결과 보기, 라운드 수정 화면.
- 핵심 방향:
  - 모바일에서 스크롤을 줄이기 위해 요약 카드와 2열 배치를 적극 사용한다.
  - 데스크탑에서 정보가 왼쪽에 좁게 눌리지 않도록 max width를 확장한다.
  - 버튼 위치와 크기를 화면 폭에 맞게 재배치한다.
  - 저장/결과/목록 이동 같은 핵심 CTA를 찾기 쉽게 유지한다.
- 검증:
  - npm run verify
  - /admin/rounds/[id]/participants
  - /admin/rounds/[id]/pairings
  - /admin/rounds/[id]/scores
  - /admin/rounds/[id]/results
  - /admin/rounds/[id]/edit


## 2026-06-14 - Live score progress and sticky save actions

- 스코어 입력 폼을 클라이언트 상태 기반으로 보강해 입력 완료율과 저장 버튼의 완료 인원 표시가 실시간 갱신되도록 계획했다.
- 참가자 저장, 조 편성 저장 버튼도 모바일 하단 고정 CTA 패턴으로 통일했다.
- 관련 계획 문서: `dev/PARKBUDDY_LIVE_SCORE_AND_STICKY_SAVE_PLAN.md`


## 2026-06-14 - 스코어 인쇄/공유 UX 개선 계획

- 작업명: `Polish score print and sharing experience`
- 결과 화면에 카카오톡 공유용 요약 문구와 요약 복사 버튼을 추가한다.
- 인쇄용 결과표에 현재 1위, Top 3, 입력 완료율 요약을 추가한다.
- 결과 링크 복사와 결과 요약 복사를 분리하여 운영자가 상황에 맞게 사용할 수 있게 한다.
- 검증 기준은 `npm run verify`와 결과/인쇄 화면 직접 확인이다.

## 2026-06-14 - Compact result summary UX

- 결과 화면에서 중복된 공유/입력 현황 카드를 제거했다.
- 카카오톡 공유용 요약은 결과 요약 카드 내부의 접기/펼치기 영역으로 이동했다.
- 요약 복사와 인쇄용 결과표 버튼은 펼친 카드 내부에서만 보이도록 정리했다.
- 라운드 목록과 스코어 입력은 모바일 스크롤 중에도 접근 가능한 하단 고정 CTA로 정리했다.
- 검증 기준: npm run verify, /admin/rounds/[id]/results 모바일/데스크탑 확인.

## 2026-06-14 - Polish member management mobile layout

- 회원 관리 화면에 라운드 관리 화면과 동일한 모바일 우선 카드 레이아웃을 확장 적용했다.
- 회원 검색/상태 필터/연결 현황을 상단 압축 카드로 정리했다.
- 모바일 회원 카드에서는 관리 작업을 접기/펼치기로 숨겨 초기 스크롤을 줄였다.
- 회원 등록/수정 화면의 저장 버튼을 모바일 하단 고정 CTA로 정리했다.
- 검증 기준: npm run verify, /admin/members, /admin/members/new, /admin/members/[id]/edit 화면 확인.

## 2026-06-14 - Fix member management search and CTA

- 회원 관리 검색 form에 GET method를 명시하고 검색 정규화를 보강했다.
- 회원 카드 정보 그리드를 모든 화면 크기에서 2열 2줄로 유지하도록 정리했다.
- 회원 관리 화면의 최근 관리자 작업 카드를 제거했다.
- 회원 등록 버튼을 하단 고정 CTA로 통일했다.
- 검증 기준: npm run verify, /admin/members 검색/필터/회원 등록 CTA 확인.


---

## PARKBUDDY_MEMBER_ROUND_FILTER_CTA_2026_06_14

- 작업명: Fix member search, public directory, and round status filters
- 회원 관리 검색을 GET 쿼리 기반으로 정리하고 연락처 검색 정규화를 유지했다.
- 회원 관리 상단 연결 상태 카드를 실제 필터로 동작하게 했다.
- 회원 관리에서 일반 회원 목록 이동 버튼과 최근 관리자 작업 카드를 제거했다.
- 회원 관리 하단 고정 CTA를 대시보드/회원 등록으로 맞췄다.
- 일반 회원 목록에서 운영자 전용 관리/등록/연결 상태 정보를 제거했다.
- 라운드 목록에서 상태별 보기 버튼을 제거하고 상태 카드 필터를 같은 화면에 적용했다.
- 라운드 목록 하단 고정 CTA를 대시보드/라운드 생성으로 맞췄다.
- 검증 기준: npm run verify, /admin/members, /members, /admin/rounds 화면 확인.
## 2026-06-14 Member search, role navigation, and dashboard cleanup

- 한글 초성/자소/부분 일치/전화번호 키패드 검색을 지원하도록 회원 검색 유틸을 추가했다.
- 회원 관리의 연결 상태 카드 필터를 검색어와 분리해 카드 선택 시 조건별 전체 목록이 보이도록 정리했다.
- 회원 목록에서 운영자 전용 메뉴와 연결 코드/상태 정보를 제거하고, 이름/연락처 중심 조회 화면으로 단순화했다.
- 하단 네비게이션에서 운영자는 회원 버튼이 회원 관리로 이동하고, 운영자 대시보드 메뉴가 추가되도록 정리했다.
- 운영자 대시보드에서 통계 카드 아래 중복 메뉴/최근 작업/체크 포인트 카드를 제거했다.
- 라운드 목록은 상태별 보기 메뉴를 제거하고 전체/예정/완료/취소 카드 필터와 하단 고정 CTA로 정리했다.
## 2026-06-14 Dashboard top operation menu restore

- 운영자 대시보드 상단의 핵심 메뉴인 회원 관리, 라운딩 관리, 작업 관리를 유지하도록 복구했다.
- 대시보드는 상단 핵심 메뉴와 주요 통계 카드만 남기고, 비활성 회원 아래의 중복 메뉴 카드는 제거된 상태를 유지한다.
- 모바일에서는 메뉴 카드가 3열로 짧게 보이고, 데스크탑에서는 넓은 화면에서도 자연스럽게 정렬되도록 구성했다.
## 2026-06-14 Restore top action button UI

- 대시보드, 회원 관리, 라운드 관리 상단 버튼을 큰 카드형이 아닌 이전의 간결한 버튼형 UI로 되돌렸다.
- 회원 검색/필터, 라운드 상태 필터, 하단 고정 CTA 등 최근 기능 개선은 유지했다.
- 상단 버튼 영역이 모바일 첫 화면을 과하게 차지하지 않도록 압축했다.
## 2026-06-14 Member live search and filter card fix

- 회원 관리 검색을 실시간 URL 쿼리 기반으로 보정했다.
- 한글 초성, 자소 분리, 부분 일치, 스마트 다이얼, 전화번호 숫자 한 자리 검색을 지원하도록 검색 유틸과 입력 컴포넌트를 정리했다.
- 회원 관리 상단 필터 카드는 라운드 관리 카드처럼 클릭 시 검색어를 무시하고 조건별 전체 목록을 보여주도록 유지했다.
- 회원 목록과 회원 관리에서 연락처 번호 직접 전화 연결, 이름 직접 상세/수정 이동 흐름을 통일했다.
- 운영자/일반 회원에 따라 하단 회원 네비게이션 목적지를 분기하고 운영자 대시보드 메뉴를 유지했다.
## 2026-06-14 Member live search and compact filter cards v2

- 회원 관리 검색을 클라이언트 실시간 필터링 방식으로 보강했다.
- 한글 입력 중간 상태(ㅎ, ㅎㅗ), 부분 일치, 전화번호 숫자 한 자리 검색이 즉시 반영되도록 했다.
- 회원 관리 상단 필터 카드를 라운드 관리처럼 모바일에서도 한 줄 4개 카드로 압축했다.
- 필터 카드를 누르면 검색어를 비우고 해당 조건 전체 리스트가 보이도록 정리했다.

## 2026-06-14 - Fix member live search verify issues

- 회원 검색 컨트롤의 React lint 오류를 수정했다.
- 검색 결과 표시를 위해 effect 안에서 동기 setState를 호출하지 않도록 정리했다.
- 라운드 목록의 미사용 함수 경고를 제거했다.
- 검증 기준: npm run verify 통과.
## 2026-06-14 Strict member search matching

- 회원 관리 검색이 느슨한 문자 포함 방식으로 동작해 홍길 검색 시 고길동/김길동이 함께 보이던 문제를 수정했다.
- 이름 검색은 연속 부분 문자열, 초성, 자소 분리 입력을 기준으로 매칭한다.
- 숫자 한 글자 검색은 연락처 숫자에 해당 숫자가 포함된 회원만 보이도록 정리했다.
- 회원 필터 카드는 라운드 관리처럼 모바일 한 줄 4개 카드 구조를 유지한다.
## 2026-06-14 Member search IME input fix

- 회원 관리 검색창을 controlled input에서 uncontrolled input 방식으로 변경해 한글 IME 조합 중 자모가 중복 누적되는 문제를 수정했다.
- 검색 필터는 입력값을 덧붙이지 않고 브라우저가 관리하는 실제 input value를 기준으로 즉시 적용한다.
- 초성/자소/부분 이름/연락처 숫자 검색과 한 줄 4개 필터 카드 동작은 유지한다.
## 2026-06-14 - 홈/네비게이션 허브 정리

- `/admin` 대시보드 화면을 별도 목적 화면으로 유지하지 않고 `/` 홈으로 이동하도록 정리했다.
- 하단 네비게이션은 홈 버튼 하나만 중앙에 표시하도록 단순화했다.
- 홈 화면을 주요 기능 허브로 재구성했다.
- 회원 목록 카드는 운영자에게는 `/admin/members`, 일반 회원에게는 `/members`로 이동한다.
- 운영자 홈에는 라운딩 관리와 작업 관리 카드를 추가했다.
- 변경 계획 문서: `dev/PARKBUDDY_HOME_NAVIGATION_HUB_PLAN.md`

## 2026-06-14 - home-only bottom navigation verify fix

- Fixed MobileBottomNav prop compatibility after simplifying bottom navigation to a single home action.
- Removed stale member search helper that caused lint warnings.
- Removed remaining dashboard CTA links from operational screens where navigation now routes through the home hub.
- Verification target: npm run verify.
## 2026-06-14 - 하단 CTA 중앙 정렬 및 홈 카드 클릭 UX 정리

- 모든 화면의 하단 고정 CTA가 화면 전체 폭을 차지하지 않고 하단 중앙 플로팅 버튼 그룹처럼 보이도록 정리했다.
- 홈 화면의 최근 라운딩/최근 공지 카드를 카드 전체 클릭 방식으로 변경했다.
- 홈 화면 최근 카드 내부의 중복 이동 문구를 제거했다.
- 하단 네비게이션은 홈 버튼 하나만 유지한다.
- 변경 계획 문서: `dev/PARKBUDDY_CENTERED_CTA_AND_HOME_CARDS.md`

## 2026-06-14 - Centered CTA sizing and home recent cards

- 하단 고정 CTA가 중앙 정렬은 유지하되 너무 작아지지 않도록 최대 폭과 터치 영역을 보강했다.
- 홈 화면의 최근 라운딩/최근 공지 카드를 주요 메뉴 카드와 같은 전체 클릭 카드 스타일로 맞췄다.
- 최근 카드 내부의 중복 문구(일정 보기, 게시판)는 제거하고 카드 전체 클릭 흐름으로 정리했다.
## 2026-06-14 - 하단 CTA 크기 및 홈 최근 카드 재정리

- 하단 고정 CTA를 중앙 정렬은 유지하되 버튼 폭과 터치 영역이 충분히 크게 보이도록 보정했다.
- 홈 화면의 최근 라운딩/최근 공지 카드를 주요 메뉴 카드와 동일한 테두리, 화살표 위치, 전체 클릭 카드 구조로 통일했다.
- 최근 카드 내부의 보조 버튼/중복 문구를 제거하고 카드 전체 클릭 흐름으로 정리했다.

## Responsive sticky CTA width polish

- 하단 고정 CTA 버튼을 화면 중앙에 유지하되 모바일/태블릿/데스크탑 폭에 맞춰 더 넓게 보이도록 보정했습니다.
- 고정 CTA 내부 버튼 높이를 최소 48px 기준으로 정리해 모바일 터치 영역을 확보했습니다.
- 참가자 저장, 조 편성 저장, 스코어 저장, 결과 화면 CTA 등 기존 하단 고정 액션의 반응형 폭을 통일했습니다.

## Responsive sticky CTA v2

- 하단 고정 CTA를 화면 중앙에 유지하되 모바일에서는 충분히 넓게 보이도록 공통 data attribute와 CSS override를 추가했다.
- 여러 화면의 CTA wrapper가 너무 작아지는 문제를 줄이기 위해 max width와 child button width를 공통 규칙으로 보정했다.

### 2026-06-14: 하단 고정 CTA 반응형 폭 보정 v3

- 하단 고정 CTA가 데스크탑에서 지나치게 작게 보이는 문제를 공통 CSS 규칙으로 보정했다.
- 모바일은 약 92vw, 태블릿/데스크탑은 중앙 정렬과 최대 폭 제한을 함께 적용한다.
- 각 화면의 CTA 개별 Tailwind 폭에 의존하지 않고 `parkbuddy-sticky-cta`, `parkbuddy-sticky-cta__inner` 공통 클래스로 관리한다.
- 검증 기준: `npm run verify`, 주요 운영 화면에서 CTA가 화면 중앙에 충분한 폭으로 표시되는지 확인.

### 2026-06-14: 하단 고정 CTA 버튼 컨테이너 채움 보정

- 하단 고정 CTA 내부 버튼이 컨테이너 폭을 충분히 채우지 못하는 문제를 공통 CSS로 보정했다.
- CTA 내부 직접 자식은 width: 100%, max-width: none으로 강제해 버튼이 컨테이너 안을 가득 채우도록 했다.
- CTA가 1개만 있는 화면에서는 해당 버튼이 2열 전체를 차지하도록 :only-child 규칙을 추가했다.
- 검증 기준: npm run verify, 주요 화면의 하단 CTA가 컨테이너 안에서 작은 배지처럼 보이지 않고 충분히 넓게 표시되는지 확인.

## 2026-06-14 Public Member Popup Layout
- 일반 회원 목록(`/members`) 상단 요약 카드 높이를 줄여 모바일 정보 밀도를 개선했다.
- 회원 상세는 별도 페이지 대신 팝업으로 전환해 목록 흐름을 유지하도록 정리했다.
- 회원 카드 우측 원형 이니셜 UI를 제거하고, 연락처/핸디캡/가입일 중심의 간결한 카드 레이아웃으로 맞췄다.

## 2026-06-14 Schedule Attendance Mobile Flow
- `/schedule` 일정 카드를 모바일 우선 카드 구조로 정리했다.
- 일정별 내 참석 선택 상태를 배지와 버튼 강조로 표시하도록 개선했다.
- 참석/미정/불참 집계와 투표 버튼을 더 명확하게 배치했다.

## 2026-06-14 Board Notice Mobile Flow
- 게시판(`/board`)에 전체/공지/고정 요약 카드를 추가하고 게시글 카드를 모바일 중심으로 정리했다.
- 게시글 상세(`/board/[id]`) 본문 가독성을 개선하고 게시판 복귀 버튼을 추가했다.
- 글쓰기(`/board/new`) 등록/취소 버튼을 모바일에서도 명확하게 보이도록 2열로 정리했다.

## 2026-06-14 Board Private Security Hardening
- 게시판 XSS 방지를 위해 게시글 제목/본문의 꺾쇠 괄호 입력을 서버 검증에서 차단한다.
- 게시판 파일 업로드는 MIME/용량 검증에 더해 JPEG/PNG/WEBP 파일 시그니처를 서버에서 검증한다.
- `posts.is_private` 기반 비밀글을 추가하고, 작성자/운영진만 조회 가능하도록 posts RLS, post_attachments RLS, storage.objects 정책을 강화한다.
- 비밀글 상세 화면은 프론트 숨김에 의존하지 않고 서버 조회/RLS 및 서버 컴포넌트 권한 검증을 함께 수행한다.

## 2026-06-16 Schedule Kakao-like Poll UI

- `/schedule` 일정 카드를 사용자가 익숙한 투표 리스트 구조로 정리했다.
- `카카오톡 투표형` 같은 설명성 배지를 제거하고, 일정 유형 배지와 참석 선택만 남겼다.
- 일정 유형 내부값은 `정기 라운딩`, `대회`, `번개` 배지로 표시한다.
- 참석 여부는 `참석`, `불참` 2개만 유지하고, 각 항목 오른쪽에 인원수를 표시한다.
- 선택된 항목은 체크 표시와 연한 노란색 배경으로 강조한다.
- 변경 문서: `dev/PARKBUDDY_SCHEDULE_KAKAO_LIKE_POLL_UI.md`

## 2026-06-16 - 일정 투표 상세 명단 UX 개선

### 완료
- `/schedule` 일정 투표 UI를 라디오 버튼 기반 참석/불참 선택 구조로 정리
- 선택 색상을 프로젝트 기본 색상 계열로 변경
- 참석/불참 선택 시 해당 투표 명단 팝업 표시
- 일정 유형 배지 아래 전체 투표 인원수와 비율 표시
- 전체 투표 인원 버튼 선택 시 참석/불참 전체 명단 팝업 표시
- 참석/불참 항목에 전체 활성 회원 대비 비율 가로 막대 표시
- `참석 여부`, `내 선택` 텍스트 삭제

### 검증
- `npm run verify` 통과

### 후속 확인
- 로컬 `/schedule` 화면 확인
- Vercel Production 자동 배포 확인
- 모바일/데스크탑에서 팝업과 투표 반영 동작 확인

## 2026-06-16 - Schedule poll modal center alignment

- 일정 투표 명단 팝업 위치를 모바일/태블릿/데스크탑 모두 화면 중앙 정렬로 통일했다.
- 하단 시트처럼 보이던 모바일 전용 손잡이 UI를 제거했다.
- 변경 파일: `src/app/(app)/schedule/VoteButtons.tsx`, `dev/PARKBUDDY_SCHEDULE_POLL_MODAL_CENTER_FIX.md`


## 2026-06-16 - MyPage upcoming schedule summary

- `/mypage`에 `다가오는 내 일정` 섹션을 추가했다.
- 예정 일정 최대 3건의 유형, 일시, 장소, 내 참석 상태를 compact 카드로 표시한다.
- 참석 수/투표 수와 참석 비율 미니 막대를 추가해 `/schedule` 투표 현황을 빠르게 확인할 수 있게 했다.
- 카드와 `일정 보기` 버튼은 `/schedule`로 연결한다.
- 변경 파일: `src/app/(app)/mypage/page.tsx`, `dev/PARKBUDDY_MYPAGE_UPCOMING_SCHEDULE_SUMMARY.md`
- 검증: `npm run verify` 통과.
