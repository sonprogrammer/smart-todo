# Front Issues

작성일: 2026-07-18

## 현재 상태

백엔드 작업 완료 후 전체 검증을 다시 실행했고, `FE-02-FIX-01` 관련 Frontend 변경에 대해 현재 Planner 판단이 필요한 차단 이슈는 없다.

## 참고

- FE-02/FE-02-FIX-01은 BE/Supabase 미완성 기간 동안 localStorage 임시 저장 경계를 사용한다.
- UI는 localStorage에 직접 접근하지 않고 `features/todos/api.ts` 및 `features/todos/queries.ts` 경계를 통해서만 접근한다.
- 이후 BE API 연결 시 `features/todos/api.ts` 내부 구현을 `/api/todos` 호출로 교체하면 된다.
