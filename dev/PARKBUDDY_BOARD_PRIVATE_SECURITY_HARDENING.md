# ParkBuddy Board Private Security Hardening

## 목표
게시판 기능에서 UI 개선보다 보안을 우선한다. 특히 비밀글은 프론트엔드 숨김이 아니라 DB/RLS/Storage/서버 조회 단계에서 권한을 검증한다.

## 변경 내용
1. XSS 방지
   - 게시글 제목/본문 입력값에서 꺾쇠 괄호(`<`, `>`)를 차단한다.
   - 게시글 본문은 React 텍스트 렌더링만 사용하고 `dangerouslySetInnerHTML`을 사용하지 않는다.
2. SQL Injection 방지
   - 게시판 조회/상세/등록은 Supabase Query Builder를 사용한다.
   - 문자열을 SQL에 직접 결합하지 않는다.
3. 파일 업로드 취약점 방지
   - 이미지 MIME 타입과 최대 5MB 크기를 서버에서 검증한다.
   - JPEG/PNG/WEBP 파일 시그니처를 서버에서 추가 검증한다.
   - Storage 업로드 경로는 `club_id/post_id/random_uuid.ext` 구조를 유지한다.
4. 비밀글 서버 권한 검증
   - `posts.is_private` 컬럼을 추가한다.
   - 비밀글은 작성자 또는 클럽 운영진만 SELECT 가능하도록 RLS를 수정한다.
   - 첨부파일 테이블과 Storage 이미지도 게시글 접근 권한을 상속하도록 정책을 수정한다.
   - 상세 화면에서도 작성자/운영진이 아니면 `notFound()` 처리한다.

## 적용 순서
1. 패치 적용
2. Supabase SQL Editor에서 `supabase/parkbuddy_board_private_security.sql` 실행
3. `npm run verify`
4. 게시판에서 일반글/비밀글/첨부 이미지 권한 확인

## 확인 포인트
- 일반글은 같은 클럽 회원에게 보인다.
- 비밀글은 작성자와 운영진에게만 보인다.
- 다른 일반 회원은 비밀글 목록/상세/첨부 이미지에 접근할 수 없다.
- 첨부 이미지는 허용 MIME/크기/파일 시그니처를 통과해야 업로드된다.
