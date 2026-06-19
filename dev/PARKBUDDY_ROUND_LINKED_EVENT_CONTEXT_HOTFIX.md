# ParkBuddy Round Linked Event Context Hotfix

## 목적

라운딩 관리 화면의 연결 일정 컨텍스트 조회가 런타임에서 실패하더라도 전체 라운딩 관리 화면이 깨지지 않도록 방어 코드를 추가한다.

## 변경 사항

- 연결 일정 조회 실패 시 throw 대신 빈 Map 반환
- events/event_votes 테이블 또는 컬럼이 아직 배포되지 않은 환경에서도 안전하게 동작
- 날짜 표시 로직을 dateStyle/timeStyle 대신 더 호환성이 높은 toLocaleDateString/toLocaleTimeString 조합으로 변경
- event_votes status 값의 과거/현재 표현을 폭넓게 처리

## 확인 화면

- /admin/rounds
- /admin/rounds/[id]/participants
- /admin/rounds/[id]/pairings
- /admin/rounds/[id]/scores
