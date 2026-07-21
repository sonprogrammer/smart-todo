# Backend Report

작성일: 2026-07-18

## BE-01 완료

- Todo 서버 저장소 경계를 `features/todos/repository.ts`에 추가했다.
- Route Handler가 붙을 수 있는 서비스 경계를 `features/todos/service.ts`에 추가했다.
- 서버용 Supabase 클라이언트 생성 경계를 `lib/supabase/server.ts`에 추가했다.
- API/서비스 계층 공통 오류 타입과 유틸을 `lib/errors.ts`에 추가했다.
- `CreateTodoInput`이 완료 상태, source trace id, 하위 작업 입력을 표현할 수 있게 확장했다.
- Supabase SDK는 프로젝트 Node.js 기준과 맞추기 위해 `@supabase/supabase-js@2.50.0`으로 추가했다.
- `tasks/TASKS.md`의 BE-01 상태를 완료로 갱신했다.

## 검증 결과

- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && node -v`: 통과, `v20.11.1`
- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && npm install`: 통과
- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && npm test`: 통과, 6 files / 9 tests
- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && npm run lint`: 통과
- `source ~/.nvm/nvm.sh && nvm use 20.11.1 && npm run build`: 통과

## 범위 준수

- Front UI는 수정하지 않았다.
- FE-02 localStorage 임시 저장소는 제거하지 않았다.
- `/api/todos*` Route Handler는 구현하지 않았다.
- Todo 수정, 완료, 삭제 API는 구현하지 않았다.
- AI draft, ai_requests, agent_logs, 로그인, 권한, 외부 연동은 구현하지 않았다.
- 아키텍처 문서는 변경하지 않았다.

## CI/check 설정 결과

작성일: 2026-07-21

- PR #2 `backend/be-01-todo-storage-model`의 최신 커밋 `dfefa7a68b21772f72d993362df706e993cea3a5` 기준으로 GitHub check가 보고되지 않는 상태를 확인했다.
- `gh pr checks 2` 결과: `no checks reported on the 'backend/be-01-todo-storage-model' branch`
- 공통 GitHub Actions workflow를 `.github/workflows/ci.yml`에 추가했다.
- CI는 `pull_request` to `main`과 `push` to `main`, `backend/**`, `front/**`에서 실행된다.
- CI Node.js 버전은 프로젝트 기준과 동일한 `20.11.1`로 고정했다.
- CI 최소 검증 항목은 `npm install`, `npm test`, `npm run lint`, `npm run build` 순서로 구성했다.
- 기능 코드는 변경하지 않았다.
- CI 설정 커밋 후 PR #2 head는 `52fb36b21c4de41d8a308efe2986ee8d9ceaefe3`로 갱신되었다. 요청 기준 커밋 `dfefa7a68b21772f72d993362df706e993cea3a5`의 기능 변경 위에 CI 설정만 추가한 커밋이다.
- `gh pr checks 2 --watch --interval 10` 결과 `npm verify` check 2건이 모두 통과했다.
- push 이벤트 check: `npm verify`, pass, 38s, https://github.com/sonprogrammer/smart-todo/actions/runs/29814674016/job/88583144929
- pull_request 이벤트 check: `npm verify`, pass, 41s, https://github.com/sonprogrammer/smart-todo/actions/runs/29814675958/job/88583151166
