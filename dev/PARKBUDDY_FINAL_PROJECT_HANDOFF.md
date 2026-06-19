# ParkBuddy 최종 프로젝트 인수인계 문서

작성일: 2026-06-18

## 1. 현재 프로젝트 상태

현재 프로젝트는 ParkBuddy 운영 테스트용 완성본이다. 다음 흐름이 포함되어 있다.

- 카카오 로그인
- 초대 코드 기반 백업 첫 접속
- 회원 관리
- 게시판/공지/비공개 게시글
- 일정 투표
- 참석자 기준 라운딩 생성
- 라운딩 목록/상세 관리
- 참가자 관리
- 자동/수동 조 편성
- 스코어 입력
- 결과/공유/출력
- 마이페이지 기록/다가오는 일정
- 모바일 Dense UX 정리

## 2. 실행 전 필수 확인

```powershell
cd C:\parkbuddy
npm install
npm run verify
npm run dev
```

운영 배포 전에는 반드시 다음을 확인한다.

```text
Supabase URL Configuration
- Site URL: https://parkbuddy-five.vercel.app
- Redirect URLs: /auth/callback 포함

Kakao Developers
- Redirect URI: https://jefbokflyuywzjotwmhn.supabase.co/auth/v1/callback

Supabase Auth
- Anonymous sign-ins 활성화

Supabase SQL
- 최신 migrations 적용
- board security check SQL 통과
```

## 3. 운영 QA 우선순위

1. 로그인: 카카오/초대 코드.
2. 회원 관리: 초대 코드 발급/공유/재발급.
3. 일정: 참석/불참 투표.
4. 일정 → 라운딩 생성.
5. 라운딩 목록: 경기 방식/상태/일정 연결 정보.
6. 참가자 관리.
7. 조 편성: 경기 형태 변경, 자동 편성, 수동 변경, 저장.
8. 스코어 입력: 누락 필터, 저장, 완료 카드.
9. 결과: 순위/계산 기준/공유/출력.
10. 권한: 일반 회원과 운영자 차이.

## 4. 다음 개발 원칙

- 새 기능보다 QA 안정화를 우선한다.
- 안정화된 회원 검색/스코어 입력/게시판 보안 로직은 불필요하게 건드리지 않는다.
- 스코어/통계/최근 기록은 `round_scores` 기준을 유지한다.
- 화면 문구는 짧게 유지한다.
- 설명은 사용자가 헷갈리는 지점에만 둔다.
- 모바일 터치 영역은 최소 44px 기준을 유지한다.

## 5. 다음 추천 작업

1. 운영 QA 결과 정리.
2. 팀/소속 데이터 설계.
3. 조 편성 알고리즘 실제 데이터 튜닝.
4. 패스키 도입 재검토.
5. dev 문서 archive 정리.
