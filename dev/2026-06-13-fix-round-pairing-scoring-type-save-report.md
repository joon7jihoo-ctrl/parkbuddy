# 조 편성 저장 후 점수 계산 방식 미지정 표시 수정 보고서

## 작성일

2026-06-13

## 문제

조 편성 화면에서 청백전, 매치 플레이 또는 스트로크 플레이를 저장하면 저장 성공 메시지는 표시되지만, 라운드 목록에서는 점수 계산 방식이 미지정으로 표시되었다.

## 원인

조 편성 저장은 성공했지만 라운드 목록에서 사용하는 `rounds.scoring_type` 값이 안정적으로 갱신되지 않는 흐름이 있었다.

## 수정 방향

조 편성 저장 성공 후 별도 RPC로 라운드의 경기 형태와 점수 계산 방식을 다시 저장하도록 보정했다.

## 변경 파일

- supabase/migrations/0020_fix_round_pairing_scoring_type_save.sql
- src/app/(app)/admin/rounds/[id]/pairings/actions.ts
- dev/2026-06-13-fix-round-pairing-scoring-type-save-report.md

## Supabase SQL 실행 필요

`supabase/migrations/0020_fix_round_pairing_scoring_type_save.sql` 파일 내용을 Supabase SQL Editor에서 실행해야 한다.

## 확인 방법

1. SQL 실행
2. 조 편성 화면에서 경기 형태와 점수 계산 방식 저장
3. 라운드 목록으로 이동
4. 점수 계산 방식이 미지정이 아니라 선택한 값으로 표시되는지 확인
